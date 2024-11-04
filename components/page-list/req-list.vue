<template>
	<view class="page-list">
		<view class="uni-container" style="min-height: calc(100vh - 418rpx);"
			:style="{...styles, paddingBottom: fixedPagination ? '84rpx' : ''}">
			<uni-table style="overflow-x: visible;" v-if="isTable && isPad" ref="table" :loading="tableLoading" border
				stripe type="" :emptyText="emptyText">
				<uni-tr>
					<uni-th v-if="columnKey" v-for="(item, index) in columns" :key="index" :width="item.width"
						:align="item.align || 'center'">
						{{item.title}}
					</uni-th>
					<slot v-else name="columns"></slot>
				</uni-tr>
				<uni-tr class="uni-tr-item" v-for="(item, index) in tableData" :key="index"
					@click.native="itemClick(item)">
					<slot name="listItem" :item="item"></slot>
					<uni-td v-if="options">
						<view class="uni-group">
							<slot name="options" :item="item"></slot>
							<view class="other-menu-btn" style="width: auto; padding-left: 0;">
								<u-button class="option-btn" size="mini" type="primary"
									@click.stop="(event) => otherBtnClickPad(index)">更多</u-button>
								<template v-if="otherMenuShow && currentIndex === index">
									<view class="mask" @click.stop="otherMenuShow = false"></view>
									<view class="menu-box" :class="menuPlacement">
										<view class="menu-content">
											<view class="menu-item" v-for="(menu, m_index) in otherList" :key="m_index"
												@click.stop="menuItemClick(menu, item)">
												<text>{{menu.title}}</text>
											</view>
										</view>
									</view>
								</template>
							</view>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
			<view v-else-if="tableData.length > 0">
				<view class="loading-mask" v-if="tableLoading" @touchmove.stop.prevent>
					<u-loading class="list-loading" size="50" mode="circle"
						:color="$mStore.state.themeColor.color"></u-loading>
				</view>
				<view class="list-item" v-for="(item, index) in tableData" :key="index" @click="itemClick(item)">
					<slot name="listItem" :item="item" :index="index"></slot>
					<view class="uni-group" style="width: 100%; justify-content: flex-end;">
						<slot name="options" :item="item" :index="index"></slot>
						<view v-if="otherMenu" class="other-menu-btn" @click.stop="(event) => otherBtnClick(index)">
							<span>更多</span>
							<u-icon name="more-dot-fill" size="32"></u-icon>
							<template v-if="otherMenuShow && currentIndex === index">
								<view class="mask" @click.stop="otherMenuShow = false"></view>
								<view class="menu-box" :class="menuPlacement">
									<view class="menu-content">
										<view class="menu-item" v-for="(menu, m_index) in otherList" :key="m_index"
											@click.stop="menuItemClick(menu, item)">
											<text>{{menu.title}}</text>
										</view>
									</view>
								</view>
							</template>
						</view>
					</view>
				</view>
			</view>

			<empty v-else mode="list" :text="emptyText"></empty>
			<view v-if="pagination" class="uni-pagination-box" :class="fixedPagination ? 'fixed' : ''">
				<uni-pagination prev-text="上一页" next-text="下一页" :page-size="pageSize" :current="pageNo" :total="total"
					@change="change" />
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
			emptyText: {
				type: String,
				default: '暂无数据'
			},
			tableData: {
				type: Array,
				default: () => []
			},
			otherList: {
				type: Array,
				default: () => []
			},
			isTable: {
				type: Boolean,
				default: false
			},
			otherMenu: {
				type: Boolean,
				default: false
			},
			total: {
				type: Number,
				default: 0
			},
			options: {
				type: Boolean,
				default: false
			},
			loading: {
				type: Boolean,
				default: false
			},
			pageNo: {
				type: Number,
				default: 1
			},
			pageSize: {
				type: Number,
				default: 10
			},
			fixedPagination: {
				type: Boolean,
				default: false
			},
			pagination: {
				type: Boolean,
				default: true
			},
			styles: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				data: [],
				tableLoading: false,
				otherMenuShow: false,
				currentIndex: null,
				otherMenuObject: {
					x: 200,
					y: 200
				},
				menuPlacement: 'bottom'
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
			total: {
				handler(val) {
					let pageNum = Math.ceil(val / this.pageSize);
					if (pageNum > 0 && this.pageNo > pageNum) {
						this.$emit('pageChange', pageNum)
					}
				},
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
				this.getData(e.current)
			},
			// 获取数据
			getData(pageCurrent, refresh) {
				this.$emit('pageChange', pageCurrent)
			},
			itemClick(item) {
				this.$emit('itemClick', item)
			},
			otherBtnClick(index) {
				this.currentIndex = index;
				// this.otherMenuShow = true;
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.list-item').boundingClientRect(data => {
					const ref = data[index];
					const height = uni.getSystemInfoSync().screenHeight //屏幕高度
					let flag = ref.height + ref.top + (this.otherList.length * 30 + 60) > height;
					if (flag) {
						this.menuPlacement = 'top';
					} else {
						this.menuPlacement = 'bottom';
					}
					// this.otherMenuObject.x = ref.left + ref.width - 30
					// this.otherMenuObject.y = ref.top + ref.height
					// const boxHeight = 212 + this.otherMenuObject.y //模态框高度+距离顶部高度
					// // if(boxHeight > height) {
					// //  this.styleObject.top = ref.top - 212
					// // }
					// console.log(this.otherMenuObject.x, this.otherMenuObject.y, height)
					this.otherMenuShow = true;
				}).exec();
			},
			otherBtnClickPad(index) {
				this.currentIndex = index;
				// this.otherMenuShow = true;
				const query = uni.createSelectorQuery().in(this);
				query.selectAll('.uni-tr-item').boundingClientRect(data => {
					const ref = data[index];
					const height = uni.getSystemInfoSync().screenHeight //屏幕高度
					let flag = ref.height + ref.top + (this.otherList.length * 30 + 60) > height;
					if (flag) {
						this.menuPlacement = 'top';
					} else {
						this.menuPlacement = 'bottom';
					}
					this.otherMenuShow = true;
				}).exec();
			},
			menuItemClick(menu, row) {
				this.otherMenuShow = false;
				this.$emit('menuItemChange', menu, row);
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
		.loading-mask {
			background-color: rgba(255, 255, 255, .4);
			position: absolute;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 9;

			.list-loading {
				// height: calc(100vh - 40vh);
				// width: 100%;
				// display: flex;
				// align-items: center;
				// justify-content: center;
				position: fixed;
				top: 45%;
				left: 48%;
				transform: translate(-50%, -50%);
				z-index: 99;
			}
		}

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
				bottom: 100rpx;
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
				width: 100%;
				flex: auto;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				word-break: break-all;

				&>view {
					flex: auto;
					width: 50%;

					&:not(:last-child) {
						margin-bottom: 20rpx;
					}
				}

				.list-item-row {
					display: flex;
					flex-wrap: wrap;

					.list-item-cell-text {
						&:not(:last-child) {
							margin-right: 40rpx;
						}
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
							font-size: 30rpx;
							color: #333;
						}
					}
				}

				&:not(:last-child) {
					&>view {
						margin-bottom: 20rpx;
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
					word-break: break-all;

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
						// flex: 0 0 100%;
						flex: auto;
						width: 100%;
					}

					.list-item-cell-text {
						font-size: 30rpx;

						&.title {
							font-weight: 600;
							font-size: 28rpx;
						}
					}
				}
			}
		}

		.other-menu-btn {
			height: 100%;
			min-width: 65rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-left: 30rpx;
			position: relative;

			/deep/ .u-icon {
				transform: rotate(90deg);
			}

			.mask {
				position: fixed;
				top: 0;
				bottom: 0;
				right: 0;
				left: 0;
				background-color: rgba(0, 0, 0, .2);
				z-index: 999;
			}

			.menu-box {
				box-sizing: border-box;
				position: absolute;
				left: 0;
				width: 100%;
				background-color: #fff;
				border: 1px solid #ebeef5;
				border-radius: 6px;
				box-shadow: 0 5rpx 25rpx 0 rgba(0, 0, 0, .1);
				z-index: 1000;
				padding: 10rpx 0;
				width: 200rpx;
				left: auto;
				right: 0;
				top: 62rpx;

				&.top {
					top: auto;
					bottom: 62rpx;
				}

				.menu-content {
					.menu-item {
						display: flex;
						cursor: pointer;
						line-height: 70rpx;
						font-size: 30rpx;
						text-align: center;
						padding: 0 20rpx;
					}
				}
			}
		}
	}
</style>