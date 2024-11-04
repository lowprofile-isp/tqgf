<template>
	<view class="application-page" :style="{'padding-top': statusHeight+'px'}">
		<quality-check v-if="authCode === codes.QI" ref="childRef" :scrollTop="scrollTop" :refreshUp="refreshUp"
			:bottomUp="bottomUp" @refCallBack="refCallBack"></quality-check>
		<production v-else-if="authCode === codes.PR" ref="childRef" :scrollTop="scrollTop" :refreshUp='refreshUp'
			:bottomUp="bottomUp" @refCallBack="refCallBack">
		</production>
	</view>
</template>

<script>
	import {
		mapGetters,
	} from 'vuex';
	import {
		authCodes
	} from '@/common/const.js';
	import equipmentManagement from './equipment_management/index.vue';
	import inventory from './inventory/index.vue';
	import production from './production/index.vue';
	import qualityCheck from './quality_check/mrp_production.vue';
	export default {
		components: {
			equipmentManagement,
			inventory,
			production,
			qualityCheck
		},
		data() {
			return {
				isFirst: true,
				stickyEnable: true, //解决sticky组件切换页面报错问题
				scrollTop: 0,
				navBarHeight: 44,
				refreshUp: false,
				bottomUp: false,
				codes: authCodes,
				authCode: uni.getStorageSync('userAuth')?.code || ''
			}
		},
		onLoad() {
			// 如果没有权限页面跳转到公共路由个人中心页面
			if (!this.authCode) {
				let initAuths = uni.getStorageSync('initAuths');
				uni.switchTab({
					url: '/pages/tqgf/workcenter/index',
					complete: () => {
						if (initAuths?.length > 0) {
							// setTimeout(() => {
							// 	uni.showToast({
							// 		title: '手机端暂不兼容此功能，请使用PAD终端',
							// 		icon: 'none',
							// 		duration: 2500
							// 	})
							// }, 500)
						}
					}
				})
			} else {
				if (!(this.authCode in this.codes)) {
					uni.switchTab({
						url: '/pages/tqgf/workcenter/index',
						complete: () => {
							// setTimeout(() => {
							// 	uni.showToast({
							// 		title: '系统暂未开发!',
							// 		icon: 'none'
							// 	})
							// }, 500)
						}
					})
				}
			}
			// 根据设备给予顶部不同高度
			uni.getSystemInfo({
				success: (res) => {
					if (res.model.indexOf('iPhone') !== -1) {
						this.navBarHeight = 44 + 'px';
					} else {
						this.navBarHeight = 48 + 'px';
					}
				}
			});
			this.$nextTick(() => {
				typeof this.$refs.childRef?.initData === 'function' && this.$refs.childRef.initData();
				this.isFirst = false;
			});
		},
		onReady() {
			this.$nextTick(() => {
				typeof this.$refs.childRef?.pageReady === 'function' && this.$refs.childRef.pageReady();
			});
		},
		onUnload() {
			this.stickyEnable = false;
			this.$nextTick(() => {
				typeof this.$refs.childRef?.pageUnload === 'function' && this.$refs.childRef.pageUnload();
			});
			this.$mStore.dispatch('tabbar/clear_timer')
		},
		onShow() {
			this.stickyEnable = true;
			if (!this.isFirst) {
				this.$nextTick(() => {
					typeof this.$refs.childRef?.pageShow === 'function' && this.$refs.childRef.pageShow();
				})
			}
		},
		onHide() {
			this.stickyEnable = false;
			this.$nextTick(() => {
				typeof this.$refs.childRef?.pageHide === 'function' && this.$refs.childRef.pageHide();
			})
		},
		onPullDownRefresh() {
			this.refreshUp = !this.refreshUp;
		},
		onReachBottom() {
			this.bottomUp = !this.bottomUp;
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			// 刷新回调
			refCallBack() {
				uni.stopPullDownRefresh();
			},
		},
		computed: {
			//状态栏高度
			statusHeight() {
				//#ifdef H5
				return 0;
				//#endif
				// return uni.getSystemInfoSync().statusBarHeight || 0; //如果没有获取到高度，那么指定0px；
				return 0; //如果没有获取到高度，那么指定0px；
			}
		}
	}
</script>

<style scoped lang="scss">
	.application-page {
		overflow: hidden;

		/deep/ .suspend-scan {
			width: 80rpx;
			height: 80rpx;
			position: fixed;
			z-index: 9;
			display: flex;
			flex-direction: row;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: $uni-color-primary;
			color: #fff;
			bottom: 292rpx;
			right: 40rpx;
			border-radius: 50%;
		}
	}

	/deep/ .slot-right-wrap {
		display: flex;
		align-items: center;

		.right-item {
			padding-right: 20rpx;
			position: relative;
			display: flex;
			align-items: center;
		}
	}
</style>