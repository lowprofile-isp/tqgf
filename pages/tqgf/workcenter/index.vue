<template>
	<view class="workcenter-page">
		<view class="workcenter-head">
			<view class="user-info">
				<view class="text"><span>{{dateTime || ''}}</span><span style="margin-left: 20rpx;">{{day || ''}}</span>
				</view>
				<view class="text">Hello! {{userName || ''}} 你好!</view>
			</view>
		</view>
		<scroll-view scroll-y class="auth-choose">
			<view class="app-menu">
				<uni-row v-if="sysList && sysList.length > 0" :gutter="20">
					<uni-col :xs="6" :sm="6" :md="4" :lg="3" :xl="3" v-for="(sys, index) in sysList" :key="index">
						<view class="menu-box" @click="goSys(sys)">
							<image class="menu-img" :src="sys.image" mode=""></image>
							<text class="menu-text">{{sys.name}}</text>
							<u-badge v-if="sys.count" class="menu-number" type="error" :count="sys.count"
								:offset="[-8, -8]"></u-badge>
						</view>
					</uni-col>
				</uni-row>
				<u-empty v-else text="暂无相关菜单权限" mode="permission"></u-empty>
			</view>
			<!-- <u-mask :show="loading" :mask-click-able="false" :custom-style="maskStyle">
				<view class="choose-loading">
					<view class="choose-container">
						<u-loading color="#6190e8"></u-loading>
						<view style="color: #6190e8;">正在进入系统...</view>
					</view>
				</view>
			</u-mask> -->
		</scroll-view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import dayjs from 'dayjs';
	import {
		authCodeArr,
		authCodes
	} from '@/common/const.js';
	import {
		authPageTo
	} from '@/pages/tqgf/application/handler.js';
	import userNameSign from '@/components/user-name/index.vue';
	import zjLogo from '@/static/images/zj-logo.png';
	import scLogo from '@/static/images/sc-logo.png';
	import kcLogo from '@/static/images/kc-logo.png';
	import zyLogo from '@/static/images/zy-logo.png';
	import sbLogo from '@/static/images/sb-logo.png';
	import fjLogo from '@/static/images/fj-logo.png';
	import ahxjLogo from '@/static/images/ahxj-logo.png';
	import ycLogo from '@/static/images/yc-logo.png';
	import rwLogo from '@/static/images/rw-logo.png';
	import cpLogo from '@/static/images/cp-logo.png';
	import kfpdLogo from '@/static/images/kfpd-logo.png';
	import cprkLogo from '@/static/images/cprk-logo.png';
	import cpckLogo from '@/static/images/cpck-logo.png';
	import scllLogo from '@/static/images/scll-logo.png';
	import cgrkLogo from '@/static/images/cgrk-logo.png';
	import ycclLogo from '@/static/images/yccl-logo.png';
	import noticeLogo from '@/static/images/notice-logo.png';
	export default {
		components: {
			userNameSign,
		},
		data() {
			return {
				loading: false,
				maskStyle: {
					backgroundColor: 'rgba(0, 0, 0, .4)',
					textAlign: 'center',
					lineHeight: '100vh'
				},
				navStyles: {
					navTitle: '',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				userName: uni.getStorageSync('userName') || '',
				dateTime: '',
				day: ''
			}
		},
		computed: {
			...mapGetters(['auths', 'isPad', 'msgCount']),
			sysList() {
				return this.auths.map((auth) => {
					return this.renderSysInfo(auth)
				})
			}
		},
		methods: {
			...mapMutations(['user/SET_USER_AUTH']),
			renderSysInfo(auth) {
				let info = {
					...auth
				}
				switch (auth.code) {
					case authCodes.QI:
						info.image = zjLogo;
						break;
					case authCodes.PR:
						info.image = scLogo;
						break;
					case authCodes.WL:
						info.image = kcLogo;
						break;
					case authCodes.KG:
						info.image = sbLogo;
						break;
					case authCodes.ZY:
						info.image = zyLogo;
						break;
					case authCodes.ST:
						info.image = fjLogo;
						break;
					case authCodes.EPA:
						info.image = ahxjLogo;
						break;
					case authCodes.ER:
						info.image = ycLogo;
						break;
					case authCodes.TASK:
						info.image = rwLogo;
						break;
					case authCodes.ER:
						info.image = '';
					case authCodes.PS:
						info.image = cpLogo;
						break;
					case authCodes.TAKE:
						info.image = kfpdLogo;
						break;
					case authCodes.CPRK:
						info.image = cprkLogo;
						break;
					case authCodes.CPCK:
						info.image = cpckLogo;
						break;
					case authCodes.CGRK:
						info.image = cgrkLogo;
						break;
					case authCodes.SCLL:
						info.image = scllLogo;
						break;
					case authCodes.SJSB:
						info.image = cpckLogo;
						break;
					case authCodes.YCCL:
						info.image = ycclLogo;
						break;
					case authCodes.NOTICE:
						info.image = noticeLogo;
						info.count = this.msgCount;
						break;
					default:
						info.image = '';
				}
				return info;
			},
			goSys(sys) {
				// this.loading = true;
				//根据权限动态获取菜单
				if (sys.code === authCodes.QI) {
					if (!this.isPad) {
						uni.showToast({
							title: '手机端暂不兼容此功能，请使用PAD终端',
							icon: 'none',
							duration: 2500
						})
						this.loading = false;
					} else {
						uni.switchTab({
							url: '/pages/tqgf/application/quality_check/mrp_production'
						})
					}
					return
				}
				if (sys.code === authCodes.PR) {
					uni.switchTab({
						url: '/pages/tqgf/application/production/index'
					})
					return
				}
				// let userAuth = this.auths.find((auth) => auth.code === sys.code);
				// this['user/SET_USER_AUTH'](userAuth || null);
				// this.$store.dispatch('tabbar/setUserTabbar');
				// setTimeout(() => {
				this.loading = false;
				if (authCodeArr.indexOf(sys.code) > -1) {
					let url = authPageTo(sys.code);
					if (url) {
						uni.navigateTo({
							url
						})
					}
				} else {}
				// }, 1000)
			}
		},
		onLoad() {
			this.dateTime = this.$mHelper.getDateUTC('YYYY-MM-DD');
			this.day = this.$mHelper.getDateWeek();
		},
		onUnload() {
			this.$mStore.dispatch('tabbar/clear_timer')
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light;
	}
</style>
<style lang="scss" scoped>
	$primary-color: #6190e8;

	.workcenter-page {
		.workcenter-head {
			background-color: $uni-color-primary;
			padding: 60rpx 60rpx 80rpx;

			.user-info {
				.text {
					font-size: 32rpx;
					font-weight: bold;
					color: #fff;

					&:not(:last-child) {
						margin-bottom: 20rpx;
					}
				}
			}
		}

		.auth-choose {
			// height: calc(100vh - 388rpx);
			// background-image: linear-gradient(to bottom, #6190e8, #5f6269);
			// padding: 80rpx 30rpx 30rpx;
			padding: 30rpx 30rpx;
			border-radius: 60rpx;
			background-color: #fff;
			margin-top: -60rpx;

			.choose-loading {
				height: 100vh;
				width: 100%;
				position: relative;

				.choose-container {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					width: 200rpx;
					height: 200rpx;
					line-height: 200rpx;
					text-align: center;
					display: flex;
					flex-direction: column;
					align-items: center;

					&>view {
						margin-top: 20rpx;
					}
				}
			}

			.app-menu {
				.menu-item {
					width: 80%;
					margin-top: 24rpx;
				}

				.menu-box {
					width: 140rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					margin: 0 auto;
					margin-top: 24rpx;
					position: relative;
				}

				.menu-number {
					font-size: 30rpx !important;
					padding: 5rpx 10rpx;
				}

				.menu-img {
					width: 140rpx;
					height: 140rpx;
					padding: 10px;
					margin-bottom: 10rpx;
					border-radius: 50rpx;
					background-color: #f7f7f7;
					transform-origin: center bottom;
					transition: box-shadow ease-in 0.1s, transform ease-in 0.1s;
					box-shadow: 0 0 6rpx 0px rgba(0, 0, 0, 0.2), 0 0px 2rpx rgba(0, 0, 0, 0.02)
				}
			}

			.close-btn {
				position: fixed;
				bottom: 40rpx;
				left: 50%;
				transform: translateX(-50%);
				color: $primary-color;
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
		}
	}
</style>