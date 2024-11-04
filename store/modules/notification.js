import Vue from 'vue'
import api from '@/odooapi';

let timer = null;
export default {
	namespaced: true,
	state: {
		msgList: [],
		count: 0,
		sumCount: 0
	},
	getters: {

	},
	mutations: {
		SET_LIST: (state, payload) => {
			state.msgList = payload;
		},
		SET_COUNT: (state, payload) => {
			state.count = payload;
		},
		SET_SUMCOUNT: (state, payload) => {
			state.sumCount = payload;
		}
	},
	actions: {
		async getMsgCount(ctx, params = {}) {
			try {
				let kw = {
					user_id: ctx.rootState.uid,
					...params
				}
				const res = await api.web.dataset.call_kw({
					model: 'mail.activity',
					method: 'get_info_activity_list',
					args: [
						[]
					],
					kwargs: {
						...kw,
					}
				});
				let msgCount = res?.not_read_num ?? 0;
				if (msgCount > 0) {
					uni.setTabBarBadge({
						index: 3,
						text: msgCount + ''
					})
				} else {
					uni.removeTabBarBadge({
						index: 3
					});
				}
				ctx.commit('SET_COUNT', msgCount);
			} catch (e) {
				//TODO handle the exception
			}
		},
		async getMsgList(ctx, params = {}) {
			try {
				const {
					pageSize,
					pageNo
				} = params;
				let kw = {
					user_id: ctx.rootState.uid,
					...params
				}
				if (pageSize && pageNo) {
					kw.limit = pageSize;
					kw.offset = (pageNo - 1 > 0 ? pageNo - 1 : 0) * pageSize;
				}
				const res = await api.web.dataset.call_kw({
					model: 'mail.activity',
					method: 'get_info_activity_list',
					args: [
						[]
					],
					kwargs: {
						...kw,
					}
				});
				let msgCount = res?.not_read_num ?? 0;
				if (msgCount > 0) {
					uni.setTabBarBadge({
						index: 3,
						text: msgCount + ''
					})
				} else {
					uni.removeTabBarBadge({
						index: 3
					});
				}
				ctx.commit('SET_SUMCOUNT', res?.total_num ?? 0);
				ctx.commit('SET_COUNT', msgCount);
				ctx.commit('SET_LIST', res?.activity_list ?? []);
			} catch (e) {
				//TODO handle the exception
			}
		},
		async setRead(ctx, params) {
			try {
				const {
					id
				} = params;
				let kw = {
					activity_id: id
				}
				await api.web.dataset.call_kw({
					model: 'mail.activity',
					method: 'set_read',
					args: [
						[]
					],
					kwargs: {
						...kw,
					}
				});
			} catch (e) {
				//TODO handle the exception
			}
		}
	},
}