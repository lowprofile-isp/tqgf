import Vue from 'vue'
import api from '@/odooapi';
import tabBar from '@/utils/tabbar.js';
import {
	authCodes
} from '../../common/const';

let timer = null;
export default {
	namespaced: true,
	state: {
		tabBarList: uni.getStorageSync('tabbar') || [], // 动态tabbar
		repairCount: 0
	},
	getters: {

	},
	mutations: {
		SET_TABBAR: (state, payload) => {
			state.tabBarList = payload;
			uni.setStorageSync('tabbar', payload);
		},
		SET_REPAIR_COUNT: (state, payload) => {
			if (payload > 0) {
				uni.showTabBarRedDot({
					index: 0
				})
			} else {
				uni.hideTabBarRedDot({
					index: 0
				})
			}
			state.repairCount = payload
		},
	},
	actions: {
		async getRepairCount(ctx) {
			try {
				const Model = api.env.model('mrp.production');
				let domain = [
					['to_check_state', '=', 'final_check'],
					['repair_state', '=', 'to_be_repaired']
				];
				const res = await Model.search_read({
					order: "origin DESC",
					domain: [
						...domain,
					],
					fields: [
						"check_result", "repair_state", "tech_note"
					]
				})
				ctx.commit('SET_REPAIR_COUNT', res?.length || 0)
			} catch (e) {
				//TODO handle the exception
			}
		},
		clear_timer() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		},
		/**
		 * 权限设置不同tabbar
		 * @param {Object} ctx
		 * @param {String} code 权限对应code
		 */
		async setUserTabbar(ctx) {
			let tabbar = [];
			let auths = ctx.rootGetters.auths;
			let authCode = '';
			if (auths.findIndex(u => u.code == authCodes.PR) <= -1) {
				uni.setTabBarItem({
					index: 0,
					visible: false
				})
				ctx.dispatch('clear_timer')
			} else {
				uni.setTabBarItem({
					index: 0,
					visible: true
				})
				await ctx.dispatch('getRepairCount')
				timer = setInterval(() => {
					ctx.dispatch('getRepairCount')
				}, 180000);

			}
			if (auths.findIndex(u => u.code == authCodes.QI) <= -1 || !ctx.rootGetters.isPad) {
				uni.setTabBarItem({
					index: 1,
					visible: false
				})
			} else {
				uni.setTabBarItem({
					index: 1,
					visible: true
				})
			}

		}
	},
}