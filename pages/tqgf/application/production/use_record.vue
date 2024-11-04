<template>
	<view class="production-detail-page">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
			</view>
		</u-navbar>
		<page-loading style="height: 100%;" :loadmore="loadmore" @refresh="refresh">
			<scroll-view scroll-y="true">
				<view class="list-container">
					<view class="head-info">
						<view>{{currentInfo.name || ''}}</view>
						<view>{{currentInfo.serial || ''}}</view>
					</view>
					<uni-table style="overflow-x: visible;" :loading="listLoading" border>
						<uni-tr style="background-color: aliceblue;">
							<uni-th align="center" style="padding: 15rpx 20rpx; color: #444;">录入层数</uni-th>
							<uni-th align="center" style="padding: 15rpx 20rpx; color: #444;">实际层数</uni-th>
							<uni-th align="center" style="padding: 15rpx 20rpx; color: #444;">备注</uni-th>
						</uni-tr>
						<uni-tr class="uni-tr-item" v-for="(item, index) in currentInfo.data || []" :key="index">
							<uni-td align="center" class="list-item-cell-text">{{ item.name }}</uni-td>
							<uni-td align="center" class="list-item-cell-text">{{ item.value }}</uni-td>
							<uni-td class="list-item-cell-text">{{ item.remark }}</uni-td>
						</uni-tr>
					</uni-table>
					<view class="uni-pagination-box" :class="'phone'">
						<uni-pagination prev-text="上一页" next-text="下一页" :page-size="pageSize" :current="pageNo"
							:total="total" @change="pageChange" />
					</view>
				</view>
			</scroll-view>
		</page-loading>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import pageLoading from '@/components/pageLoading/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	export default {
		data() {
			return {
				navStyles: {
					navTitle: '层数使用记录',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				listLoading: false,
				id: null,
				tableList: [],
				loadmore: 'loadmore',
				pageNo: 1,
				pageSize: 1,
				total: 0
			}
		},
		components: {
			pageLoading,
			cardInfo,
		},
		computed: {
			currentInfo() {
				return this.tableList[this.pageNo - 1] ? this.tableList[this.pageNo - 1] : {}
			},
		},
		methods: {
			async refresh() {
				this.initData();
			},
			async initData() {
				await this.getData();
			},
			async getData() {
				this.loadmore = 'loadmore';
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_layer_data',
					args: [],
					kwargs: {
						workorder_id: this.id
					}
				});
				if (!res) {
					this.loadmore = 'error';
					return
				}
				if (res?.length > 0) {
					this.paginationReset();
					this.tableList = res;
					this.total = this.tableList.length;
					this.loadmore = 'more';
				} else {
					this.loadmore = 'nomore';
				}
				uni.stopPullDownRefresh();
			},
			paginationReset() {
				this.pageNo = 1;
				this.pageSize = 1;
			},
			// 分页触发
			pageChange(e) {
				this.pageNo = e.current;
			},
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onLoad(options) {
			if (options?.id) {
				this.id = Number(options.id);
				this.initData();
			}
		},
	}
</script>
<style lang="scss" scoped>
	.production-detail-page {
		padding-bottom: 100rpx;

		.list-container {
			padding: 20rpx;
			// padding-top: 200rpx;
			// max-height: 100%;
		}

		.head-info {
			padding: 0 20rpx 20rpx;
			font-weight: 600;

			uni-view {
				text-align: center;
			}
		}

		/deep/.uni-table {
			min-width: auto !important;
		}

		/deep/ .uni-pagination-box {
			margin-top: 20rpx;

			&.phone {
				padding: 20rpx;
				position: fixed;
				left: 0;
				bottom: 0;
				z-index: 999;
				background-color: $page-color-light;
				width: 100%;
				margin: auto;
			}

			.uni-pagination__btn {
				// background-color: $page-color-light;
			}

			.uni-pagination__num-tag {
				min-width: 60rpx;
			}
		}

		.cell-item {
			padding: 40rpx 20rpx;
		}

		.cell-content {
			// padding: 20rpx;
			// background-color: #f5f5f5;
			display: flex;
			flex-wrap: wrap;

			.group {
				flex: 0 0 100%;
			}

			@media (min-width: 481px) {
				& {
					flex-wrap: nowrap;

					.group {
						flex: 0 0 50%;
					}
				}
			}
		}

		.title {
			font-weight: bold;
			font-size: 32rpx;
			margin: 20rpx 0;
		}

		.group {
			.row-title {
				display: flex;
				align-items: center;
				margin: 20rpx 0;
				font-weight: bold;
			}
		}

		.product-btn-box {
			display: flex;
			justify-content: flex-end;
			padding: 20rpx;
			position: fixed;
			width: 100%;
			bottom: 0;
			left: 0;
			z-index: 99;
			border-top: 2rpx solid $border-color-base;
			background-color: #fff;

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
		}

		/deep/ .slot-right-wrap {
			display: flex;
			align-items: center;

			.right-item {
				padding-right: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
				color: #fff;
			}
		}
	}
</style>