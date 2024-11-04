<template>
	<view class="card-tab" :style="styles">
		<uni-segmented-control :current="current" :values="values" :style-type="styleType" :active-color="'#6190e8'"
			@clickItem="onClickItem" />
	</view>
</template>

<script>
	export default {
		props: {
			values: {
				type: Array,
				default: () => []
			},
			styleType: {
				type: String,
				default: 'button'
			},
			current: {
				type: Number,
				default: 0
			},
			styles: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			onClickItem(e) {
				if (this.tabCurrent !== e.currentIndex) {
					this.$emit('clickItem', e.currentIndex)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.card-tab {
		padding: 20rpx 60rpx;
		background-color: #fff;
		box-shadow: 0px 2rpx 10rpx #eee;
		display: flex;
		align-items: center;
		justify-content: center;
		/deep/.segmented-control {
			width: 100%;
		}
	}
</style>