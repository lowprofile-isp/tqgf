import baseConfig from '@/config/index.config.js';

export default {
	namespaced: true,
	state: {
		http_url: baseConfig.baseUrl,
		db: baseConfig.db
	},
	getters: {

	},
	mutations: {
		SET_SERVICE(state, payload) {
			let {
				http_url,
				db
			} = payload;
			state.http_url = http_url;
			state.db = db;
		},
		RESET_SERVICE(state) {
			state.http_url = baseConfig.baseUrl;
			state.db = baseConfig.db;
		}
	},
	actions: {

	},
}