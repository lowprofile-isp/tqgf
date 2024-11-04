<template>
	<u-card class="card-info" :border="true" :head-border-bottom="headBorderBottom" :show-foot="showFoot"
		:foot-border-top="false" full margin="0 0 20rpx" :body-style="bodyStyle"
		:foot-style="{paddingTop: '0rpx', paddingBottom: '30rpx'}" @click="$emit('itemClick')">
		<view class="card-info-head" slot="head">
			<view class="title" :style="title.length > 20 ? {fontSize: '28rpx'} : {}">
				<span v-if="checked" class="check" @click.stop>
					<slot name="checked"></slot>
				</span>
				<span class="line" v-else-if="lineIcon"></span>
				{{title}}
				<span style="margin-left: 10rpx;">{{subTitle}}</span>
			</view>
			<view class="head-right">
				<slot name="head-right"></slot>
			</view>
		</view>
		<view class="card-info-content" slot="body">
			<slot></slot>
		</view>
		<view class="card-info-foot" slot="foot">
			<slot name="foot"></slot>
		</view>
	</u-card>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			subTitle: {
				type: String,
				default: ''
			},
			headBorderBottom: {
				type: Boolean,
				default: true
			},
			lineIcon: {
				type: Boolean,
				default: true
			},
			checked: {
				type: Boolean,
				default: false
			},
			bodyStyle: {
				type: Object,
				default: () => ({})
			},
			showFoot: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			}
		}
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light;
	}
</style>
<style lang="scss" scoped>
	.card-info {
		@keyframes flicker {
			0% {
				background-color: #cdffff;
			}

			50% {
				background-color: #fff;
			}

			100% {
				background-color: #cdffff;
			}
		}

		&.active {
			background-color: #cdffff;
			animation: flicker 1s;
			animation-iteration-count: 2;
			animation-fill-mode: forwards;
		}

		.card-info-head {
			display: flex;
			justify-content: space-between;

			.line {
				display: inline-block;
				width: 18rpx;
				height: 30rpx;
				margin-right: 10rpx;
				background-color: $uni-color-primary;
			}

			.title {
				display: flex;
				align-items: center;
				line-height: 1;
				font-weight: 600;
				font-size: 32rpx;
				color: #333;
				word-break: break-all;
			}

			.head-right {
				text-align: right;

				/deep/.u-tag {
					font-size: 24rpx;
				}
			}

			/deep/.u-checkbox {
				vertical-align: bottom;
			}
		}

		.card-info-foot {
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}

		.card-info-content {
			/deep/.content-form {
				.content-item {
					padding: 0;

					&:not(:last-child) {
						.uni-forms-item__inner {
							padding-bottom: 22rpx;
						}
					}

					.value {
						color: #7f7f7f;
						display: flex;
						align-items: center;
						word-break: break-all;
					}

					&.not-width-form-item {
						.uni-forms-item__label {
							width: 0 !important;
						}
					}

					.uni-combox__selector-item {
						font-size: 28rpx;
					}

					.uni-forms-item__label .label-text {
						color: #333;
						font-size: 30rpx;
					}

					.uni-forms-item__inner {
						align-items: center;
						padding-bottom: 0;
					}

					.uni-forms-item__content {
						min-height: auto;
						display: flex;
						align-items: center;
					}

					.uni-combox__selector {
						z-index: 9;
					}
				}
			}
		}

		/deep/.cell-header {
			.u-cell {
				margin-bottom: 20rpx;
			}
		}

		/deep/.row-group {
			display: flex;
			align-items: center;
			flex-wrap: wrap;

			&:not(:last-child) {
				margin-bottom: 30rpx;
			}

			.content-item {
				margin-right: 30rpx;
				margin-bottom: 0 !important;

				.uni-forms-item__inner {
					padding-bottom: 0 !important;
				}
			}
		}

		/deep/.uni-table {
			min-width: auto !important;

			.uni-table-text.empty-border {
				height: 106rpx;
				line-height: 106rpx;
			}
		}

		/deep/.uni-select {
			border-color: #a7a7a7;
		}
	}
</style>