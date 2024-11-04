import api from '@/odooapi';
import {
	authCodes,
	groupSigns
} from '@/common/const.js';
export default {
	namespaced: true,
	state: {
		// 系统应用权限
		auths: uni.getStorageSync('auths') || [],
		userAuth: uni.getStorageSync('userAuth') || null,
		userList: [],
		employeeList: [],
		group_info: {
			[groupSigns.JISHU]: false
		}
	},
	mutations: {
		SET_AUTH: (state, payload) => {
			state.auths = payload;
			uni.setStorageSync('auths', payload);
		},
		SET_USER_AUTH: (state, payload) => {
			state.userAuth = payload;
			uni.setStorageSync('userAuth', payload);
		},
		SET_USER_LIST: (state, payload) => {
			state.userList = payload;
		},
		SET_EMPLOYEE_LIST: (state, payload) => {
			state.employeeList = payload;
		},
		SET_GROUP_INFO: (state, payload) => {
			state.group_info[payload.key] = payload.value
		},

	},
	actions: {
		// 登录
		login: (ctx, {
			account,
			password,
			rememberPsw
		}) => {
			return new Promise((resolve, reject) => {
				api.web.login({
					db: ctx.rootState.service.db,
					login: account,
					password: password
				}).then(async (res) => {
					//缓存账号和密码
					if (res?.session?.uid) {
						uni.setStorageSync('HCuname', account);
						uni.setStorageSync('HCpassw', password);
						uni.setStorageSync('currentUser', {
							uuid: res.session.uid,
							name: res.session.name,
							avatar: "/static/images/ima.png"
						});
						uni.setStorageSync('userName', res.session.name);
						uni.setStorageSync('rememberPsw', rememberPsw);
						// uni.setStorageSync('company_id', res.session.company_id);
						uni.setStorageSync('company_id', res.session.user_companies
							?.current_company);
						uni.setStorageSync('session_id', res.session.session_id);
						await ctx.dispatch('setUserAuth', res.session.uid);
						ctx.dispatch('notification/getMsgCount', {
							is_read: false
						}, {
							root: true
						})
						resolve(true)
					} else {
						// uni.showModal({
						// 	content: '登陆失败：无法获取用户ID',
						// 	showCancel: false
						// })
						resolve(false)
					}
				}).catch((error) => {
					reject(error)
				})
			})

		},
		// 设置用户权限
		setUserAuth: async ({
			commit,
			rootState
		}, id) => {
			commit('SET_UID', id, {
				root: true
			})
			const Model = api.env.model('res.users');
			const company_id = uni.getStorageSync('company_id');
			const res = await Model.search_read({
				domain: [
					['id', '=', id],
					// ['company_id', '=', company_id]
				],
				fields: ["route_category_ids"]
			})
			if (res.length > 0) {
				let ids = res[0].route_category_ids;
				const CategoryModel = api.env.model('route.category');
				const auths = await CategoryModel.search_read({
					domain: [
						['id', 'in', ids],
					],
				});
				// let notice_auth = [{
				// 	code: 'NOTICE',
				// 	name: '消息通知',
				// }];
				if (auths?.length > 0) {
					let new_auths = auths;
					// 针对手机端去除质量检验、装炉出炉功能
					// if (!rootState.isPad) {
					// 	new_auths = auths.filter((auth) => auth.code !== 'QI')
					// }
					uni.setStorageSync('initAuths', [...auths]);
					commit('SET_AUTH', [...new_auths]);
				}
			}
		},
		// 获取员工列表
		getEmployeeList: async ({
			commit
		}) => {
			const Model = api.env.model('hr.employee')
			const res = await Model.search_read({
				domain: [],
				fields: ["id", "name", "user_id"]
			})
			if (res?.length > 0) {
				commit('SET_EMPLOYEE_LIST', res);
			}
		},
		// 获取用户列表
		getUserList: async ({
			commit
		}) => {
			const Model = api.env.model('res.users')
			const company_id = uni.getStorageSync('company_id')
			const user = uni.getStorageSync('HCuname');
			const res = await Model.search_read({
				domain: [
					['company_id', '=', company_id],
				],
				fields: ["id", "login", "name"]
			})
			if (res?.length > 0) {
				commit('SET_USER_LIST', res);
			}
		},
		hasGroup: async ({
			commit
		}, groupSign = '') => {
			const groupResult = await api.web._has_group([groupSign])
			commit('SET_GROUP_INFO', {
				key: groupSign,
				value: groupResult
			})
		},
		toRoutePage({
			commit,
			state,
			rootState,
			dispatch
		}) {
			let userAuths = state.auths;
			if (userAuths.findIndex(u => u.code == authCodes.PR) > -1) {
				uni.reLaunch({
					url: '/pages/tqgf/application/production/index',
					success: (res) => {
						dispatch('setTabbar');
					}
				})
			} else if (userAuths.findIndex(u => u.code == authCodes.QI) > -1) {
				if (rootState.isPad) {
					uni.reLaunch({
						url: '/pages/tqgf/application/quality_check/mrp_production',
						success: () => {
							dispatch('setTabbar');
						}
					})
				} else {
					uni.reLaunch({
						url: '/pages/tqgf/workcenter/index',
						success: (res) => {
							dispatch('setTabbar');
						}
					})
				}
			} else {
				uni.reLaunch({
					url: '/pages/tqgf/workcenter/index',
					success: (res) => {
						dispatch('setTabbar');
					}
				})
			}
			// // 如果多权限跳转到应用入口页进入
			// if (state.auths.length > 1) {
			// 	uni.reLaunch({
			// 		url: '/pages/tqgf/workcenter/index'
			// 	})
			// } else {
			// 	//根据权限动态获取菜单
			// 	this['user/SET_USER_AUTH'](this.auths.length ? this.auths[0] : null);
			// 	this.$store.dispatch('tabbar/setUserTabbar');
			// 	if (this.userAuth?.code && authCodeArr.indexOf(this
			// 			.userAuth?.code) > -1) {
			// 		let url = authPageTo(this.userAuth.code);
			// 		if (url) {
			// 			uni.reLaunch({
			// 				url
			// 			})
			// 		}
			// 	} else {
			// 		uni.reLaunch({
			// 			url: '/pages/tqgf/application/index'
			// 		})
			// 	}
			// }
		},
		setTabbar({
			dispatch
		}) {
			// #ifdef H5
			setTimeout(() => {
				dispatch('tabbar/setUserTabbar', null, {
					root: true
				});
			}, 100)
			// #endif
			// #ifndef H5
			dispatch('tabbar/setUserTabbar', null, {
				root: true
			});
			// #endif
		}
	}
}