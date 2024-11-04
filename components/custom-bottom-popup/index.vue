<template>
	<u-popup class="custom-bottom-popup" v-model="show" mode="bottom" @close="close">
		<view class="head">
			<span class="link" @click="clear">{{clearText}}</span>
			<text class="title">{{title}}</text>
			<span class="link" @click="confirm">确定</span>
		</view>
		<view class="content">
			<slot></slot>
		</view>
		<!-- <view class="footer">
			<u-button :custom-style="cancelStyle" size="medium" hover-class="none" :hair-line="false"
				@click="show = false">取消</u-button>
			<u-button :custom-style="customStyle" size="medium" hover-class="none" :hair-line="false"
				@click="confirm">确定</u-button>
		</view> -->
	</u-popup>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			clearText: {
				type: String,
				default: '取消'
			}
		},
		data() {
			return {
				show: false
			}
		},
		methods: {
			confirm() {
				this.close();
				this.$emit('confirm');
			},
			clear() {
				this.close();
				this.$emit('clear');
			},
			close() {
				this.show = false;
				this.$emit('close');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-bottom-popup {
		.head {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 25rpx 40rpx 20rpx;
			font-size: 32rpx;
			background-color: #fff;
			text-align: center;
			border-bottom: 1px solid $border-color-light;

			.title {
				font-weight: bold;
			}
		}

		.content {
			// padding: 24rpx;
			text-align: center;
			background-color: $page-color-light;

			/deep/.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #fff;
				// margin-bottom: 20rpx;
				padding: 26rpx 40rpx;
				border-bottom: 1px solid $border-color-light;

				/deep/ .u-checkbox {
					flex-direction: row-reverse;
				}
			}
		}

		.footer {
			background-color: #fff;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>