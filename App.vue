<script>
	/* eslint-disable */
	import Vue from 'vue';
	import mqtt from 'mqtt'
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import indexConfig from '@/config/index.config';
	import {
		authCodeArr,
		authCodes
	} from '@/common/const.js';
	import {
		authPageTo
	} from '@/pages/tqgf/application/handler.js';
	export default {
		async onLaunch() {
			// #ifndef H5
			// 非H5平台
			// 设置横屏方向
			// plus.screen.lockOrientation('landscape-primary');
			// #endif
			await this.initData();
			this.globalData.goEasy = this.goEasy;
		},
		onHide() {},
		globalData: {
			imService: null
		},
		data() {
			return {
				mediaSwitch: true
			}
		},
		computed: {
			...mapGetters(['hasLogin', 'uid', 'errorNoticeList', 'auths', 'isPad'])
		},
		created() {
			// console.log(uni.getLocale())
			// 创建mqtt连接
			// this.$store.dispatch('connect','ws://172.21.3.59:8083/mqtt')
			// this.goEasy.connect({
			// 	onSuccess: function() { //连接成功
			// 		console.log("GoEasy connect successfully.") //连接成功
			// 	},
			// 	onFailed: function(error) { //连接失败
			// 		console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
			// 	},
			// 	onProgress: function(attempts) { //连接或自动重连中
			// 		console.log("GoEasy is connecting", attempts);
			// 	}
			// });
			this.getMsgCount();
			this.$ws_abnormal.getMessage(res => {
				try {
					let msg = JSON.parse(res.data) || {};
					if (this.uid === msg.responsible_user_id) {
						let messageConfig = {
							...msg,
							id: msg.abnormal_id,
							title: msg.title,
							body: msg.note,
						}
						this.$mStore.dispatch('setErrorNotice', [...this.errorNoticeList, messageConfig])
						if (window?.myElectronAPI) {
							window.myElectronAPI.sendErrorPush({
								...messageConfig,
								count: this.errorNoticeList.length || 0
							})
						} else {
							if (this.mediaSwitch) {
								this.noticeMedia();
								this.getMsgCount();
								this.mediaSwitch = false;
								setTimeout(() => {
									this.mediaSwitch = true;
								}, 3000)
							}
						}
					}
				} catch (e) {
					console.log(e)
					//TODO handle the exception
				}
			})
			if (window?.myElectronAPI) {
				window.myElectronAPI.winMessageRead((event, data) => {
					console.log('收到主进程数据：', data)
					if (data.id) {
						uni.navigateTo({
							url: `/pages/tqgf/message_notification/detail?id=${data.id}`
						})
					} else {
						uni.switchTab({
							url: `/pages/tqgf/message_notification/index`
						})
					}
					// let pages = getCurrentPages();
					// let currentPage = pages[pages.length - 1];
					// if (data?.id) {
					// 	this.$mStore.dispatch('setErrorNotice', this.errorNoticeList.filter(e => e.id !== data.id))
					// } else {
					// 	this.$mStore.dispatch('setErrorNotice', [])
					// }
					// if (currentPage.route.includes('pages/tqgf/application/errorAccept/index')) {
					// 	if (data?.id) {
					// 		typeof currentPage.toDetail === 'function' && currentPage.toDetail({
					// 			id: data.id
					// 		})
					// 	}
					// } else {
					// 	let url = data?.id ? `/pages/tqgf/application/errorAccept/detail?id=${data.id}` :
					// 		'/pages/tqgf/application/errorAccept/index'
					// 	uni.navigateTo({
					// 		url
					// 	})
					// }
				})
				// 发现可用新版本
				// this.winUpdateCheck()
				window.myElectronAPI.upAvailable((event, data) => {
					console.log('发现新版本--', data)
					this.winUpdateCheck();
				})
			}
		},
		beforeDestroy() {
			// this.$store.dispatch('disconnect')
		},
		methods: {
			...mapMutations(['SET_SYS_INFO', 'SET_DEVICE_INFO', 'theme/updateTheme']),
			// 数据初始化
			async initData() {
				// 获取系统信息
				this.SET_SYS_INFO();
				// 获取设备信息
				this.SET_DEVICE_INFO();
				// #ifdef APP-PLUS
				// 非H5平台
				// 设置屏幕方向
				const screenWidth = this.$mStore.state.sysInfo.screenWidth;
				const screenHeight = this.$mStore.state.sysInfo.screenHeight;
				const orientation = this.$mStore.state.deviceInfo.deviceType == 'pad' || screenWidth > screenHeight ?
					'landscape-primary' : 'portrait-primary';
				plus.screen.lockOrientation(orientation);
				// #endif
				// 设置主题
				this['theme/updateTheme']('light');
				const _this = this;
				const token = uni.getStorageSync('accessToken');
				//缓存的账号
				const HCuname = uni.getStorageSync('HCuname');
				//缓存的密码
				const HCpassw = uni.getStorageSync('HCpassw');
				if (this.hasLogin) {
					// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen();
					// #endif
					// let theme = uni.getStorageSync('userAuth')?.code === authCodes.WL ? 'dark' : 'light';
					// this['theme/updateTheme'](theme);
					this.$store.dispatch('user/toRoutePage');
					this.checkUp();
					// else {
					// 	let userAuth = uni.getStorageSync('userAuth');
					// 	console.log(userAuth)
					// 	if (authCodeArr.indexOf(userAuth?.code) > -1) {
					// 		let url = authPageTo(userAuth?.code);
					// 		if (url) {
					// 			uni.reLaunch({
					// 				url,
					// 				success: () => {
					// 					this.checkUp();
					// 				}
					// 			})
					// 		}
					// 	} else {
					// 		uni.reLaunch({
					// 			url: '/pages/tqgf/application/index',
					// 			success: () => {
					// 				this.checkUp();
					// 			}
					// 		})
					// 	}
					// }
				} else {
					uni.reLaunch({
						url: '/pages/public/login',
						success: () => {
							this.checkUp();
						}
					})
				}
			},
			checkUp() {
				// 检测更新
				// #ifdef APP || APP-PLUS
				plus.navigator.closeSplashscreen();
				let custom = true;
				if (custom) {
					this.$mStore.dispatch('getVersionInfo');
				} else {
					checkUpdate();
				}
				// #endif
			},
			// 安卓机消息通知声音、震动提示
			noticeMedia() {
				// #ifdef APP-PLUS

				if (uni.getSystemInfoSync().platform == "ios") {
					plus.device.vibrate();
					plus.device.beep();

				} else if (uni.getSystemInfoSync().platform == "android") {
					// 震动
					plus.device.vibrate(2000);
					//声音
					let main = plus.android.runtimeMainActivity();
					let RingtoneManager = plus.android.importClass("android.media.RingtoneManager");
					let uri = RingtoneManager.getActualDefaultRingtoneUri(main, RingtoneManager.TYPE_NOTIFICATION);
					let MediaPlayer = plus.android.importClass("android.media.MediaPlayer");
					let player = MediaPlayer.create(main, uri);
					player.setLooping(false);
					player.prepare();
					player.start();
				}
				// #endif
				// #ifdef H5 || MP-WEIXIN
				uni.vibrateLong({
					success: function() {
						console.log('success');
					}
				});
				// #endif
			},
			getMsgCount() {
				this.$mStore.dispatch('notification/getMsgCount', {
					is_read: false
				})
			},
			winUpdateCheck() {
				this.$mStore.dispatch('getVersionInfoWin');
			}
		}
	};
</script>
<style lang="scss">
	@import "uview-ui/index.scss";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	// 导入colorUI
	@import '/static/css/colorui/main.css';
	@import '/static/css/colorui/icon.css';
	@import '/static/css/colorui/animation.css';
	// 导入ue-virtual-scroller样式
	@import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
	// 导入阿里巴巴矢量图标库
	@import '/static/iconfont/iconfont.css';
	/*#ifndef MP*/
	@import url('https://at.alicdn.com/t/font_1823374_98c45zxwb3c.css');
	/*#endif*/
	@import './static/css/reset.scss';
	@import './static/css/uni.scss';
</style>