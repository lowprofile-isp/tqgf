<template>
	<view class="page-loading" :style="{height: `calc(100vh - ${navHeight}px)`}">
		<u-loading class="loading-sign" v-if="loadmore === 'loadmore'" size="36" :color="$mStore.getters.themeColor.color"></u-loading>
		<empty mode="permission" v-else-if="loadmore === 'noauth'"></empty>
		<empty text="暂无数据" v-else-if="loadmore === 'nomore'"></empty>
		<empty text="加载失败, 点击重试" v-else-if="loadmore === 'error'" :src="loadingError" @click.native="refresh"></empty>
		<slot v-else-if="loadmore === 'more'"></slot>
	</view>
</template>

<script>
	import loadingError from '@/static/images/loading-error.png';
	export default {
		props: {
			loadmore: {
				type: String,
				default: 'nomore'
			}
		},
		data() {
			return {
				loadingError: loadingError,
				navHeight: 44
			}
		},
		mounted() {
			let sysInfo = uni.getSystemInfoSync();
			this.navHeight = sysInfo.windowTop;
		},
		methods: {
			refresh() {
				this.$emit('refresh');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-loading {
		height: 100vh;
		/deep/.sticky {
			width: 100%;
			background-color: #fff;
			// padding-top: 20rpx;
			border-bottom: 1px solid rgba(0, 0, 0, .1);
			position: fixed;
			z-index: 99;
		
			&.dark {
				background-color: $uni-bg-dark-light;
			}
		}
		.loading-sign {
			position: absolute;
			top: 36%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		/deep/ .cell-header {
			flex: auto;
			width: 100%;
			&.primary .u-cell .u-cell__value {
				color: $uni-color-primary;
			}
		
			&.success .u-cell .u-cell__value {
				color: $uni-color-success;
			}
		
			&.error .u-cell .u-cell__value {
				color: $uni-color-error;
			}
		
			&.warning .u-cell .u-cell__value {
				color: $uni-color-warning;
			}
		
			.u-cell {
				padding: 6rpx 20rpx;
		
				.u-cell_title,
				.u-cell__value {
					font-weight: bold;
					font-size: 32rpx;
					color: #333;
				}
			}
		}
	}
</style>