import Vue from 'vue';
import App from './App';
// 引入全局存储
import store from '@/store';

// uview注册
import uView from "uview-ui";
Vue.use(uView);

// 引入全局配置
import $mAssetsPath from '@/config/assets.config.js';
import $mConfig from '@/config/index.config.js';
import $mRoutesConfig from '@/config/routes.config.js';
import $mFormRule from '@/config/formRule.config.js';
import $mConstDataConfig from '@/config/constData.config.js';
// import $mWebsocketConfig from '@/config/websocket.config.js';
import $mSettingConfig from '@/config/setting.config.js';
import request from '@/utils/request/request.js'
import GoEasySign from '@/common/goEasy.js';
import wsRequest from '@/utils/websocket.js';
//初始化GoEasy
// const goEasy = new GoEasySign();
// goEasy.connect();
// Vue.prototype.goEasy = goEasy;
// 初始化webSocket
const ws_abnormal = new wsRequest("ws://10.10.14.20:1880/ws/abnormal", 60000)
// const ws_abnormal = new wsRequest("ws://test.smartscf.cn:8000/ws/abnormal", 60000)
Vue.prototype.$ws_abnormal = ws_abnormal

// 虚拟滚动列表
// #ifndef APP-PLUS
import VueVirtualScroller from "vue-virtual-scroller";
Vue.use(VueVirtualScroller);
// #endif
// 引入全局方法
// import { http } from '@/utils/request';
import $mGraceChecker from '@/utils/graceChecker';
import $mHelper from '@/utils/helper';
import $mRouter from '@/utils/router';
// import $mWebsocket from '@/utils/websocket';
// 全局组件
import rfImage from '@/components/oa-image/oa-image';
import rfEmpty from '@/components/oa-empty';
import rfLoading from '@/components/oa-loading';
import rfLoadProgress from '@/components/oa-load-progress/oa-load-progress';
import rfParser from '@/components/oa-parser';
import rfBackTop from '@/components/oa-back-top';
import rfTag from '@/components/oa-tag';
import rfNavDetail from '@/components/oa-nav-detail';
import cuCustom from '@/components/cu-custom';
import Empty from '@/components/empty';
import zxzUniDataSelect from '@/uni_modules/zxz-uni-data-select/components/zxz-uni-data-select/zxz-uni-data-select.vue';
import axios from 'axios'
// 挂载全局自定义方法
Vue.prototype.$bus = new Vue();
Vue.prototype.$request = request;
// Vue.prototype.$http = http;
Vue.prototype.$mStore = store;
Vue.prototype.$mConfig = $mConfig;
Vue.prototype.$mAssetsPath = $mAssetsPath;
Vue.prototype.$mFormRule = $mFormRule;
Vue.prototype.$mRoutesConfig = $mRoutesConfig;
Vue.prototype.$mConstDataConfig = $mConstDataConfig;
Vue.prototype.$mSettingConfig = $mSettingConfig;
Vue.prototype.$mGraceChecker = $mGraceChecker;
Vue.prototype.$mHelper = $mHelper;
Vue.prototype.$mRouter = $mRouter;

Vue.component('rfImage', rfImage);
Vue.component('rfEmpty', rfEmpty);
Vue.component('rfLoading', rfLoading);
Vue.component('rfLoadProgress', rfLoadProgress);
Vue.component('rfParser', rfParser);
Vue.component('rfBackTop', rfBackTop);
Vue.component('rfTag', rfTag);
Vue.component('rfNavDetail', rfNavDetail);
Vue.component('cuCustom', cuCustom);
Vue.component('empty', Empty);
Vue.component('zxz-uni-data-select', zxzUniDataSelect);
// 谷歌浏览器关于滚动事件警告去除
import "default-passive-events";
// pda扫描配置
uni._qs_scanlistener_action = 'com.android.server.scannerservice.broadcast';
uni._qs_scanlistener_label = 'scannerdata';

// 网络状态监听
uni.getNetworkType({
	success: res => {
		store.dispatch('networkStateChange', res.networkType);
	}
});
uni.onNetworkStatusChange(function(res) {
	store.dispatch('networkStateChange', res.networkType);
});

if (process.env.NODE_ENV === 'production') {
	Vue.config.productionTip = false;
}

// 全局混入变量
Vue.mixin({
	computed: {
		themeColor: {
			get() {
				return store.getters.themeColor;
			},
			set(val) {
				store.state.themeColor = val;
			}
		}
	}
});

// 全局过滤器
// 保留小数点后两位
Vue.filter('keepTwoDecimal', value => {
	return (Math.floor((value || 0) * 100) / 100).toFixed(2);
});
// 映射value
Vue.filter('mapValue', value => {
	return value?.length > 1 ? value[1] : null;
})

App.mpType = 'app';
const app = new Vue({
	...App,
	store: store
});
app.$mount();