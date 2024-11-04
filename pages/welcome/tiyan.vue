<template>
	<view>
		<view class="content" style="margin: 50upx 20upx; height: 180upx" @click="toExperience(0)">
			<view class="content-list">
				<u-icon name="level" size="46" color="DeepSkyBlue"></u-icon>
				<text style="margin-left: 2upx; fontSize: 36upx; color:DeepSkyBlue">基础版</text>
				<u-line color="#1890FF" length="24%" margin="5rpx 10rpx"></u-line>
				<view class="description" style="display: flex; justify-content: center;">
					<view style="width: 80%; font-size: 30upx;">增强标准版,增加会员管理一物一码订单管理会计凭证资产负债等</view>
					<u-icon name="coupon-fill" size="80" color="DeepSkyBlue"></u-icon>
					<u-icon name="arrow-right" size="16" color="DeepSkyBlue"></u-icon>
				</view>
			</view>
		</view>
		<view class="content" style="margin: 50upx 20upx; height: 180upx" @click="toExperience(1)">
			<view class="content-list">
				<u-icon name="level" size="46" color="DeepSkyBlue"></u-icon>
				<text style="margin-left: 2upx; fontSize: 36upx; color: DeepSkyBlue;">标准版</text>
				<u-line color="#1890FF" length="24%" margin="5rpx 10rpx"></u-line>
				<view class="description" style="display: flex; justify-content: center;">
					<view style="width: 80%; font-size: 30upx;">增强标准版,增加会员管理一物一码订单管理会计凭证资产负债等</view>
					<u-icon name="coupon-fill" size="80" color="orange"></u-icon>
					<u-icon name="arrow-right" size="16" color="DeepSkyBlue"></u-icon>
				</view>
			</view>
		</view>
		<view class="content" style="margin: 50upx 20upx; height: 180upx" @click="toExperience(2)">
			<view class="content-list">
				<u-icon name="level" size="46" color="DeepSkyBlue"></u-icon>
				<text style="margin-left: 2upx; fontSize: 36upx; color: DeepSkyBlue">企业版</text>
				<u-line color="#1890FF" length="24%" margin="5rpx 10rpx"></u-line>
				<view class="description" style="display: flex; justify-content: center;">
					<view style="width: 80%; font-size: 30upx;">增强标准版,增加会员管理一物一码订单管理会计凭证资产负债等</view>
					<u-icon name="coupon-fill" size="80" color="DeepSkyBlue"></u-icon>
					<u-icon name="arrow-right" size="16" color="DeepSkyBlue"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.themeColor.color,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		methods: {
			toExperience(index) {
				this.$mRouter.reLaunch({
					route: `/pages/public/login?index=${index}`
				});
			},
		},
	}
</script>
<style scoped lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		background-color: #fff;

		.content-list {}
	}

	.description {
		margin-left: '10upx';
	}

	.charts-box {
		width: 100%;
		height: '100upx';
	}
</style>
