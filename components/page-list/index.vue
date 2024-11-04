<template>
	<view class="page-list">
		<view class="uni-container" :style="{paddingBottom: fixedPagination ? '84rpx' : ''}">
			<uni-table v-if="isPad" ref="table" :loading="tableLoading" border stripe type="" emptyText="暂无更多数据">
				<uni-tr>
					<uni-th v-for="(item, index) in columns" :key="index" :width="item.width"
						:align="item.align || 'center'">
						{{item.title}}
					</uni-th>
				</uni-tr>
				<uni-tr v-for="(item, index) in data" :key="index" @click.native="itemClick(item)">
					<slot name="listItem" :item="item"></slot>
					<uni-td v-if="options">
						<view class="uni-group">
							<slot name="options" :item="item"></slot>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view v-else class="list-item" v-for="(item, index) in tableData" :key="index"
				@click.native="itemClick(item)">
				<slot name="listItem" :item="item"></slot>
				<view class="uni-group" style="width: 100%; justify-content: flex-end;">
					<slot name="options" :item="item"></slot>
				</view>
			</view>
			<view class="uni-pagination-box" :class="fixedPagination ? 'fixed' : ''">
				<uni-pagination prev-text="上一页" next-text="下一页" :page-size="pageSize" :current="pageCurrent"
					:total="total" @change="change" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	import {
		columns
	} from './data.json';
	export default {
		props: {
			columnKey: {
				type: String,
				default: ''
			},
			tableData: {
				type: Array,
				default: () => []
			},
			options: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: false
			},
			fixedPagination: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				timer: null,
				isReset: false,
				data: [],
				pageCurrent: 1,
				// #ifdef H5
				pageSize: 15,
				// #endif
				// #ifndef H5
				pageSize: 10,
				// #endif
				total: 0,
				tableLoading: false,
			}
		},
		computed: {
			...mapGetters(['isPad']),
			columns() {
				let colums_arr = columns
				return this.columnKey ? this.options ? [...colums_arr[this.columnKey], {
					title: '操作',
					width: '160'
				}] : colums_arr[this.columnKey] : []
			}
		},
		watch: {
			tableData: {
				handler(val) {
					this.getData(this.isReset ? 1 : this.pageCurrent, true)
				},
				immediate: true,
				deep: true
			},
			loading: {
				handler(val) {
					this.tableLoading = val
				},
				immediate: true
			}
		},
		methods: {
			// 分页触发
			change(e) {
				this.isReset = false
				this.getData(e.current)
			},
			// 获取数据
			getData(pageCurrent, refresh) {
				if (!refresh) {
					this.tableLoading = true
				}
				this.pageCurrent = pageCurrent
				this.request({
					pageSize: this.pageSize,
					pageCurrent: pageCurrent,
					success: res => {
						this.data = res.data
						this.total = res.total
						if (!refresh) {
							this.tableLoading = false
						}
					}
				})
			},
			request(options) {
				let {
					pageSize,
					pageCurrent,
					success
				} = options
				let total = this.tableData.length
				if (total > 0 && pageCurrent > Math.ceil(total / pageSize)) {
					pageCurrent = Math.ceil(total / pageSize)
					this.pageCurrent = pageCurrent
				}
				let data = this.tableData.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (this.timer) {
					this.timer = null;
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					typeof success === 'function' &&
						success({
							data: data,
							total: total
						})
				}, 500)
			},
			itemClick(item) {
				this.$emit('itemClick', item)
			},
		}
	}
</script>


<style lang="scss" scoped>
	.uni-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.page-list {
		/deep/ .uni-table {
			min-width: 100% !important;

			.list-item-cell-text {
				&.primary {
					color: $uni-color-primary;
				}

				&.success {
					color: $uni-color-success;
				}

				&.error {
					color: $uni-color-error;
				}

				&.warning {
					color: $uni-color-warning;
				}
			}

			.uni-table-th {
				font-weight: 600;
				color: #212B36;
			}

			.uni-table-td {
				font-weight: 500;
				color: #637381;
			}
		}

		.uni-pagination-box {
			&.fixed {
				position: fixed;
				// #ifdef H5
				bottom: 0;
				// #endif
				// #ifndef H5
				bottom: 0;
				// #endif
				left: 0;
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				z-index: 99;
			}
			margin-top: 20rpx;

			/deep/ .uni-pagination__num-tag {
				min-width: 60rpx;
			}
		}

		/deep/ .uni-table-loading>.uni-table-text {
			line-height: 100rpx;
		}

		.list-loading {
			height: calc(100vh - 40vh);
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 99;
		}

		/deep/ .uni-table-mask {
			background-color: rgba(255, 255, 255, .4);
		}

		/deep/ .option-btn {
			border-radius: 4rpx;
			font-size: 28rpx;
			height: 54rpx;
			line-height: 54rpx;
			margin: 4rpx 0;

			&:not(:last-child) {
				margin-right: 16rpx;
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