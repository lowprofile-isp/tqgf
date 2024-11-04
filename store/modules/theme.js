import themes from '@/common/theme.js';

export default {
	namespaced: true,
	state: {
		theme: themes[uni.getStorageSync('theme') || 'light']
	},
	getters: {

	},
	mutations: {
		updateTheme(state, mode = 'light') {
			let theme = themes[mode];
			state.theme = theme;
			console.log(theme)
		},
	},
	actions: {

	},
}