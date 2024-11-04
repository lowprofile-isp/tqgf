<template>
	<scroll-view scroll-y class="auth-choose">
		<!-- :style="{paddingBottom: showCloseBtn ? '160rpx' : ''}" -->
		<u-navbar :is-back="false" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<view v-if="$mStore.state.user.auths.length > 1 && showCloseBtn" class="right-item"
					@click="$emit('close')">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign>
			</view>
		</u-navbar>
		<view class="app-menu">
			<uni-row :gutter="20">
				<uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="3" v-for="(sys, index) in sysList" :key="index">
					<view class="menu-box" @click="goSys(sys)">
						<image class="menu-img" :src="sys.image" mode=""></image>
						<text class="menu-text">{{sys.name}}</text>
						<u-badge v-if="sys.count" class="menu-number" type="error" :count="sys.count"
							:offset="[-8, -8]"></u-badge>
					</view>
				</uni-col>
			</uni-row>
		</view>
		<u-mask :show="loading" :mask-click-able="false" :custom-style="maskStyle">
			<view class="choose-loading">
				<view class="choose-container">
					<!-- <u-loading :color="$mStore.getters.themeColor.color"></u-loading> -->
					<u-loading color="#6190e8"></u-loading>
					<view style="color: #6190e8;">正在进入系统...</view>
				</view>
			</view>
		</u-mask>
		<!-- <u-icon v-if="showCloseBtn" class="close-btn" name="close-circle" size="100" @click="$emit('close')"></u-icon> -->
	</scroll-view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
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
		props: {
			showCloseBtn: {
				type: Boolean,
				default: false
			}
		},
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
				this.loading = true;
				//根据权限动态获取菜单
				let userAuth = this.auths.find((auth) => auth.code === sys.code);
				this['user/SET_USER_AUTH'](userAuth || null);
				this.$store.dispatch('tabbar/setUserTabbar');
				if (!this.isPad) {
					if (sys.code === authCodes.QI) {
						uni.showToast({
							title: '手机端暂不兼容此功能，请使用PAD终端',
							icon: 'none',
							duration: 2500
						})
						this.loading = false;
						return
					}
				}
				setTimeout(() => {
					this.loading = false;
					if (authCodeArr.indexOf(sys.code) > -1) {
						let url = authPageTo(sys.code);
						if (url) {
							uni.reLaunch({
								url
							})
						}
					} else {
						uni.reLaunch({
							url: '/pages/tqgf/application/index'
						})
					}
				}, 1000)
			}
		}
	}
</script>

<style lang="scss" scoped>
	$primary-color: #6190e8;

	.auth-choose {
		height: 100vh;
		background-image: linear-gradient(to bottom, #6190e8, #5f6269);
		// padding: 80rpx 30rpx 30rpx;
		padding: 30rpx 30rpx;

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

			.menu-text {
				color: #fff;
			}

			.menu-number {
				font-size: 30rpx !important;
				padding: 5rpx 10rpx;
			}

			.menu-img {
				width: 140rpx;
				height: 140rpx;
				padding: 10px;
				border-radius: 10rpx;
				background-color: #FFFFFF;
				transform-origin: center bottom;
				transition: box-shadow ease-in 0.1s, transform ease-in 0.1s;
				box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2), 0 4px 4px rgba(0, 0, 0, 0.02);
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
</style>