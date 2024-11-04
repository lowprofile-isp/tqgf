<template>
	<view class="container">
		<view class="wrapper">
			<view style="text-align: center; fontSize:40upx; font-weight: bold;">
				智 融 ERP
			</view>
			<view style="text-align: center; fontSize:25upx; font-weight: bold; color: #909399 ">
				安全 稳定 智能 可靠
			</view>
			<view style="text-align: center;">
				<image src="../../static/images/welcome.png" style="width: 800upx; height: 800upx;"></image>
			</view>
			<view class="input-content" style="text-align: center;">
				<u-button type="warning" class="confirm-btn" style="width: 600upx;" @click="Navto(1)">登录</u-button>
			</view>
			<view class="input-content" style="text-align: center;padding-top: 20upx;">
				<view style="width: 50%;float: left; color: orange;">
					<view @click="Navto(2)" style="margin: 10upx; font-weight: bold;">体验一下</view>
				</view>
				<view style="width: 50%;float: left; color: orange;">
					<view @click="Navto(3)" style="margin: 10upx; font-weight: bold;">立即注册</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				customStyle: {
					'position': 'absolute',
					'top': '900upx',
					'width': '500upx',
				},
				customStyle1: {
					'position': 'absolute',
					'top': '1000upx',
					'left': '130upx',
					'width': '210upx',
					'color': 'orange',
					'border': 'none'
				},
				customStyle2: {
					'position': 'absolute',
					'top': '1000upx',
					'left': '400upx',
					'width': '210upx',
					'color': 'orange',
					'border': 'none'
				},
				hairLine: false,
				plain: true
			};
		},
		onLoad() {

			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: '#ffffff',
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		methods: {
			Navto(index) {
				if (index == 1) {
					this.$mRouter.reLaunch({
						route: '/pages/public/login'
					});
				}
				if (index == 2) {
					uni.showModal({
						title: '提示',
						content: '您登录的是体验账号,仅供快速体验,数据会定期删除还原,如需保存数据并体验更多功能,请前往注册',
						cancelText:'继续体验',
						confirmText:'前往注册',
						confirmColor: 'orange',
						success: (res)=>{
							if (res.confirm) {
								console.log('前往注册页面');
							} else if (res.cancel) {
								this.$mRouter.reLaunch({
									route: '/pages/welcome/tiyan'
								});
							}
						}
					});
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		background: #fff;
	}

	.container {
		height: 100vh;
		background-color: #fff;
		padding-top: 55upx;
		position: relative;
		width: 100vw;
		overflow: hidden;

		.wrapper {
			position: relative;
			z-index: 90;
		}

		.welcome {
			position: relative;
			left: 50upx;
			top: -90upx;
			font-size: 46upx;
			color: #555;
			text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
		}






	}
</style>
