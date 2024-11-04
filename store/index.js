import mqtt from 'mqtt'
import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/odooapi';
import user from './modules/user.js'
import service from './modules/service.js'
import tabbar from './modules/tabbar.js'
import theme from './modules/theme.js'
import notification from './modules/notification.js'
import getters from './getters.js'
import $mConstDataConfig from '@/config/constData.config';
Vue.use(Vuex);
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('user') || {};
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const CARTNUM = uni.getStorageSync('cartNum') || 0;
const IMHISTORY = uni.getStorageSync('imHistory') || [];
const THEMECOLOR = uni.getStorageSync('themeColor') || {
	title: '海蓝',
	name: 'blue',
	color: '#6190e8',
	dark: false,
};
const clientOptions = {
	// mqttVersion: 5,
	// host:"192.168.41.169",
	// port:1883,
	clean: true,
	connectTimeout: 4000,
	keepAlive: 60,
	clientId: 'mes/' + Number(new Date()).toString(),
	username: "yao",
	password: "1",
	qos: 0
}
const store = new Vuex.Store({
	state: {
		// **************************************************
		url: undefined,
		client: undefined,
		// 订阅主题的集合, key为topic, value为接收到该topic时需要执行的回调
		subscribeMembers: {},
		// ***************************************************
		// 用户token
		accessToken: ACCESSTOKEN,
		// 用户信息
		userInfo: USER.member,
		// 推荐人
		referrer: REFERRER,
		// 小程序openid
		openId: '',
		// 网络状态，用于下载提醒
		networkState: 'unknown',
		globalConfig: GLOBALCONFIG,
		refreshToken: REFRESHTOKEN,
		themeColor: THEMECOLOR,
		uid: uni.getStorageSync('currentUser')?.uuid || '',
		deviceInfo: {},
		sysInfo: {},
		versionInfo: {},
		versionInfoWin: {},
		industryCustomFields: [],
		padScreenWidth: 1180,
		isPad: true,
		navBarHeight: 0,
		errorNoticeList: []
	},
	getters: {
		// 全局配置
		themeColor: state => {
			return state.themeColor;
		},
		// 全局配置
		globalConfig: state => {
			return state.globalConfig;
		},
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
		// 判断用户是否登录
		hasLogin: state => {
			// return !!state.accessToken;
			return state.uid
		},
		...getters
	},
	mutations: {
		SET_SYS_INFO(state) {
			const systemInfo = uni.getSystemInfoSync();
			state.sysInfo = systemInfo;
			state.navBarHeight = state.sysInfo.platform === 'android' ? state.sysInfo.statusBarHeight + 44 :
				state.sysInfo.statusBarHeight + 44;
			state.isPad = state.sysInfo.windowWidth >= state.padScreenWidth ? true : false;
		},
		SET_DEVICE_INFO(state, param) {
			state.deviceInfo = uni.getDeviceInfo();
		},
		INIT_SERVER_URL(state, url) {
			state.url = url
		},
		INIT(state, client) {
			state.client = client
		},
		DESTROY(state) {
			state.clean = undefined
			state.subscribeMembers = {}
		},
		SUBSCRIBE(state, {
			topic,
			callback
		}) {
			state.subscribeMembers[topic] = callback
		},
		UNSUBSCRIBE(state, topic) {
			state.subscribeMembers[topic] = undefined
		},
		login(state, provider) {
			state.accessToken = provider.access_token;
			state.refreshToken = provider.refresh_token;
			state.userInfo = provider.member;
			state.user = provider;
			uni.setStorageSync('user', provider);
			uni.setStorageSync('accessToken', provider.access_token);
			uni.setStorageSync('refreshToken', provider.refresh_token);
			uni.setStorageSync('userInfo', provider.member);
		},
		logout(state) {
			state.accessToken = '';
			state.refreshToken = '';
			state.userInfo = {};
			uni.removeStorageSync('accessToken');
			uni.removeTabBarBadge({
				index: $mConstDataConfig.notifyIndex
			});
			uni.removeTabBarBadge({
				index: $mConstDataConfig.cartIndex
			});
			uni.removeStorageSync('refreshToken');
			uni.removeStorageSync('userInfo');
		},
		setNetworkState(state, provider) {
			state.networkState = provider;
		},
		setGlobalConfig(state, provider) {
			state.globalConfig = provider;
			uni.setStorageSync('globalConfig', provider);
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		},
		setVersionInfo(state, paylod) {
			state.versionInfo = paylod || {}
		},
		setVersionInfoWin(state, paylod) {
			state.versionInfoWin = paylod || {}
		},
		setIndustryCustomFields(state, payload) {
			state.industryCustomFields = payload;
		},
		SET_UID(state, payload) {
			state.uid = payload
		},
		SET_ERROR_NOTICE(state, payload) {
			state.errorNoticeList = payload
		}
	},
	actions: {
		connect({
			commit
		}, url) {
			let client = mqtt.connect(url, clientOptions)
			client.on("connect", onConnect)
			client.on("reconnect", onReconnect)
			client.on("error", onError)
			client.on("message", onMessage)
			commit('INIT', client)
			commit('INIT_SERVER_URL', url)
		},
		disconnect({
			commit,
			state
		}) {
			state.client.end()
			commit.DESTROY()
			console.log('连接断开')
		},
		/**
		 * 订阅
		 * @param commit
		 * @param dispatch
		 * @param topic 主题
		 * @param subscribeOption 订阅设置
		 * @param callback 接收消息的回调
		 */
		subscribe({
			commit,
			dispatch,
			state
		}, {
			topic,
			callback,
			subscribeOption
		}) {
			if (!state.client) {
				dispatch('connect')
			}
			state.client.subscribe(topic, subscribeOption || {
				qos: clientOptions.qos
			}, (error, granted, c) => {
				if (error) {
					console.log(`订阅主题: ${topic}失败: `, error)
				} else {
					console.log(`订阅主题: ${topic}成功: `)
				}
			})
			commit('SUBSCRIBE', {
				topic,
				callback
			})
		},
		/**
		 * 取消订阅
		 * @param commit
		 * @param topic 主题
		 */
		unsubscribe({
			commit
		}, topic) {
			if (!state.client) {
				return
			}
			state.client.unsubscribe(topic, {}, (error, granted) => {
				if (error) {
					console.log(`客户端: ${clientOptions.clientId},取消订阅主题: ${topic}失败:`, error)
				} else {
					console.log(`客户端: ${clientOptions.clientId},取消订阅主题: ${topic}成功:`)
				}
			})
			commit('UNSUBSCRIBE', topic)
		},
		publish({
			commit,
			dispatch
		}, {
			topic,
			message
		}) {
			if (!state.client || !state.client.connected) {
				dispatch('connect')
			}
			state.client.publish(topic, message, {
				qos: clientOptions.qos
			}, (e) => {
				if (e) {
					console.log(`客户端: ${clientOptions.clientId}, 发送的主题为: ${topic} 的消息, 发送失败: `, e)
				}
			})
		},
		globalConfigChange({
			commit
		}, info) {
			commit('setGlobalConfig', info);
		},
		networkStateChange({
			commit
		}, info) {
			commit('setNetworkState', info);
		},
		logout({
			commit
		}) {
			commit('logout');
		},
		// 自定义检测版本更新
		getVersionInfo({
			commit
		}) {
			const vm = new Vue();
			//接口获取最新版本号，版本号固定为整数
			uni.request({
				url: 'http://10.10.14.37:8006/release.json',
				success: (res) => {
					if (res?.data) {
						const {
							android: versionInfo
						} = res.data;
						commit('setVersionInfo', versionInfo);
						// const selfVersionCode = Number(uni.getSystemInfoSync()
						// .appVersionCode); //当前App版本号
						//线上版本号高于当前，进行在线升级
						plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
							let selfVersionCode = Number(wgtinfo.versionCode);
							console.log(selfVersionCode, versionInfo)
							if (selfVersionCode < versionInfo.versionCode) {
								let platform = uni.getSystemInfoSync().platform //手机平台
								//安卓手机弹窗升级
								if (platform === 'android') {
									uni.navigateTo({
										url: '/pages/public/upgrade'
									})
								}
								//IOS无法在线升级提示到商店下载
								else {
									uni.showModal({
										title: '发现新版本 ' + versionInfo.appVersion,
										content: '请到App store进行升级',
										showCancel: false
									})
								}
							}
						})

					}
				},
				fail: (error) => {
					uni.showModal({
						content: error.errMsg,
						showCancel: false
					})
				}
			})
		},
		// 自定义检测版本更新-win
		getVersionInfoWin({
			commit
		}) {
			//接口获取最新版本号，版本号固定为整数
			uni.request({
				url: 'http://10.10.14.37:8006/release_win.json',
				success: (res) => {
					if (res?.data) {
						const {
							win: versionInfo
						} = res.data;
						commit('setVersionInfoWin', versionInfo);
						uni.navigateTo({
							url: '/pages/public/upgrade-win'
						})
					}
				},
				fail: (error) => {
					uni.showModal({
						content: error.errMsg,
						showCancel: false
					})
				}
			})
		},
		// 自定义字段获取
		async getIndustryCustomFields({
			commit
		}) {
			const Model = api.env.model('industry.custom.fields');
			const res = await Model.search_read({
				domain: []
			});
			if (res?.length) {
				commit('setIndustryCustomFields', res)
			}
		},
		// 异常通知
		setErrorNotice({
			commit
		}, payload) {
			commit('SET_ERROR_NOTICE', payload)
		}
	},
	modules: {
		user,
		tabbar,
		theme,
		service,
		notification
	}
});

const onConnect = (e) => {
	console.log(`客户端: ${clientOptions.clientId}, 连接服务器成功: `, e)
}

const onReconnect = () => {
	console.log(`客户端: ${clientOptions.clientId}, 正在重连: `)
}

const onError = (error) => {
	console.log(`客户端: ${clientOptions.clientId}, 连接失败: `, error)
}

const onMessage = (topic, message) => {
	console.log(`客户端: ${clientOptions.clientId}, 接收到来自主题: ${topic} 的消息: `, message?.toString())
	let callback = store.state.subscribeMembers[topic]
	callback?.(topic, message?.toString())
}

export default store;