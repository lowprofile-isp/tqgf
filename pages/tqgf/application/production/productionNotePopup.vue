<template>
	<u-popup :style="{minWidth: isPad ? '910px' : ''}" class="note-popup" v-model="show" :mode="mode" width="90%"
		border-radius="10" closeable @open="getList" @close="close">
		<view class="popup-title">返修备注</view>
		<view class="popup-table">
			<uni-table v-if="isPad" border :loading="tableLoading" border stripe type="" emptyText="暂无数据">
				<uni-tr>
					<uni-th align="center">产品</uni-th>
					<uni-th align="center">批次号</uni-th>
					<uni-th align="center">返修备注</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in list" :key="index">
					<uni-td>{{item.product || ''}}</uni-td>
					<uni-td>{{item.serial_num || ''}}</uni-td>
					<uni-td>{{item.production_note || ''}}</uni-td>
				</uni-tr>
			</uni-table>
			<scroll-view v-else scroll-x scroll-y="true">
				<u-empty v-if="list.length <= 0"></u-empty>
				<view v-else class="list-item" v-for="(item, index) in list" :key="index">
					<view class="list-item-cell">
						<view>
							<span class="list-item-cell-text">产品：{{item.product || ''}}</span>
						</view>
						<view>
							<span class="list-item-cell-text">批次号：{{item.serial_num || ''}}</span>
						</view>
						<view>
							<span class="list-item-cell-text">返修备注：{{item.production_note || ''}}</span>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</u-popup>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			mode: {
				type: String,
				default: 'center'
			},
			rowItem: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				list: [],
				tableLoading: false
			}
		},
		computed: {
			...mapGetters(['isPad']),
			show: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
		methods: {
			getList() {
				this.tableLoading = true;
				const Model = api.env.model('mrp.production.note');
				Model.search_read({
					order: "create_date DESC",
					domain: [
						["production_id", "=", this.rowItem.id],
					],
				}).then((res) => {
					if (res && res?.length > 0) {
						this.list = res;
					}
				}).finally(() => {
					this.tableLoading = false;
				})
			},
			close() {
				this.list = []
			}
		}
	}
</script>

<style lang="scss" scoped>
	.note-popup {
		.u-mode-center-box {
			width: 90%;
			// max-width: 85%;

			.u-cell {
				color: #333;

				.u-icon--right {
					color: #666;
				}
			}
		}

		.popup-title {
			font-size: 40rpx;
			// font-weight: bold;
			padding: 20rpx;
			// padding-bottom: 0;
			text-align: center;
		}

		.popup-table {
			padding: 0 20rpx 50rpx;

			.uni-table {
				min-width: 100% !important;
			}

			.uni-table-th {
				font-weight: 600;
				color: #212B36;
			}

			.uni-table-tr,
			.uni-table-td {
				flex: 1;
				font-weight: 500;
				color: #637381;
			}
		}

		.list-item {
			margin-bottom: 20rpx;
		}

		.list-item {
			// height: 206rpx;
			padding: 20rpx 24rpx;
			background-color: #fff;
			border-radius: 5px;
			position: relative;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;



			.list-options {
				width: 80rpx;
				height: 100%;
				background-color: #fff;
				display: flex;
				justify-content: center;
				align-items: flex-end;
				padding: 16rpx 0;
				border: none;

				.u-icon {
					transform: rotate(90deg);
				}
			}

			.list-options.custom {
				width: 100%;
				height: auto;
				background-color: #fff;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 20rpx 4rpx 0;
				border-top: 2rpx solid $border-color-base;
			}

			/deep/ .option-btn {
				margin-right: 0;
				margin-left: 0;
				border-radius: 4rpx;
				font-size: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 32rpx;

				&:not(:first-child) {
					margin-left: 20rpx;
				}
			}

			/deep/ .list-item-cell {
				// margin-top: 6rpx;
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;

				&>view {
					flex: 0 0 50%;

					&:not(:last-child) {
						margin-bottom: 2rpx;
					}
				}

				&>.cell-header {
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
						padding: 0;

						.u-cell_title,
						.u-cell__value {
							font-weight: bold;
							font-size: 32rpx;
							color: #333;
						}
					}
				}

				&:not(:last-child) {
					&>view {
						margin-bottom: 6rpx;
					}
				}

				.cell-title {
					display: flex;

				}

				.list-item-cell-text {
					font-size: 30rpx;
					display: flex;
					align-items: center;
					flex-wrap: wrap;

					&>span {
						display: flex;
						align-items: center;
						justify-content: flex-start;
					}

					&.title {
						font-weight: 600;
						font-size: 32rpx;
					}
				}
			}
		}

		@media (max-width: 480px) {
			.list-item {
				// height: 292rpx;

				/deep/ .list-item-cell {
					&>view {
						flex: 0 0 100%;
					}

					.list-item-cell-text {
						font-size: 26rpx;

						&.title {
							font-weight: 600;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
</style>