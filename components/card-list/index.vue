<template>
	<view class="card-list" :style="{paddingBottom: !isPad && false ? '60rpx' : ''}">
		<view class="uni-container">
			<slot name="headInfo"></slot>
			<uni-table style="overflow-x: visible;" v-if="isTable" ref="table" :loading="tableLoading" border stripe
				type="" :emptyText="emptyText">
				<uni-tr>
					<slot name="columns"></slot>
				</uni-tr>
				<uni-tr class="uni-tr-item" v-for="(item, index) in data" :key="index" @click.native="itemClick(item)">
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
			<u-row v-else :gutter="isPad ? 40 : 0" style="position: relative; min-height: 100rpx;">
				<view class="loading-mask" v-if="tableLoading" @touchmove.stop.prevent>
					<u-loading class="list-loading" size="50" mode="circle"
						:color="$mStore.state.themeColor.color"></u-loading>
				</view>
				<!-- <u-swipe-action class="swiper-action" v-if="showSwiperAction && actionOptions.length > 0" v-for="(item, index) in data"
					:key="index" :show="item.action_show" @click="actionClick" @open="actionChange"
					:options="actionOptions">
					<slot name="listItem" :item="item" :columns="columns"></slot>
				</u-swipe-action> -->
				<uni-swipe-action ref="swipeAction" class="swiper-action"
					v-if="showSwiperAction && actionOptions.length > 0">
					<uni-swipe-action-item v-for="(item, index) in data" :key="index"
						@click="(e) => actionClick(e, item)" :right-options="actionOptions">
						<view class="content-box" @click.stop="itemClick(item)">
							<slot name="listItem" :item="item" :columns="columns"></slot>
							<view class="uni-group" style="width: 100%; justify-content: flex-end;">
								<slot name="options" :item="item" :index="index"></slot>
								<view v-if="otherMenu" class="other-menu-btn"
									@click.stop="(event) => otherBtnClick(index)">
									<u-icon name="more-dot-fill" size="32"></u-icon>
									<template v-if="otherMenuShow && currentIndex === index">
										<view class="mask" @click.stop="otherMenuShow = false"></view>
										<view class="menu-box" :class="menuPlacement">
											<view class="menu-content">
												<view class="menu-item" v-for="(menu, m_index) in otherList"
													:key="m_index" @click.stop="menuItemClick(menu, item)">
													<text>{{menu.title}}</text>
												</view>
											</view>
										</view>
									</template>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
				<u-col v-else :span="!isPad ? 12 : 4" v-for="(item, index) in data" :key="index"
					:class="!isPad ? 'phone' : ''" @click.native="itemClick(item)">
					<slot name="listItem" :item="item" :columns="columns"></slot>
					<view class="uni-group" style="width: 100%; justify-content: flex-end;">
						<slot name="options" :item="item" :index="index"></slot>
						<view v-if="otherMenu" class="other-menu-btn" @click.stop="(event) => otherBtnClick(index)">
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
				</u-col>
			</u-row>
			<view class="uni-pagination-box" :class="[!isPad && fixedPagination? 'phone' : '', isTabbar ? 'is-tabbar' : '']">
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
	} from '@/components/page-list/data.json';
	export default {
		props: {
			columnKey: {
				type: String,
				default: ''
			},
			emptyText: {
				type: String,
				default: '没有更多数据'
			},
			tableData: {
				type: Array,
				default: () => []
			},
			isTable: {
				type: Boolean,
				default: false
			},
			options: {
				type: Boolean,
				default: false
			},
			otherList: {
				type: Array,
				default: () => []
			},
			loading: {
				type: Boolean,
				default: false
			},
			otherMenu: {
				type: Boolean,
				default: false
			},
			fixedPagination: {
				type: Boolean,
				default: false
			},
			fixedPaginationBottom: {
				type: Number,
				// #ifdef H5
				default: 0,
				// #endif
				// #ifndef H5
				default: 0,
				// #endif
			},
			pageNo: {
				type: Number,
				default: 1
			},
			pageSize: {
				type: Number,
				default: 10
			},
			pageTotal: {
				type: Number,
				default: 0
			},
			showSwiperAction: {
				type: Boolean,
				default: false
			},
			actionOptions: {
				type: Array,
				default: () => []
			},
			isOnLinePage: {
				type: Boolean,
				default: false
			},
			isTabbar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				timer: null,
				data: [],
				isReset: false,
				pageCurrent: 1,
				// pageSize: 10,
				total: 0,
				tableLoading: this.loading,
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
				return this.columnKey ? this.options ? [...columns[this.columnKey], {
					title: '操作',
					width: '160'
				}] : columns[this.columnKey] : []
			}
		},
		watch: {
			showSwiperAction(val) {
				console.log(val)
			},
			actionOptions(val) {
				console.log(val)
			},
			tableData: {
				handler(val) {
					if (this.isOnLinePage) {
						this.pageCurrent = this.pageNo;
						this.total = this.pageTotal;
						this.data = val;
					} else {
						this.getData(this.isReset ? 1 : this.pageCurrent, true)
					}

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
				this.isReset = false;
				if (this.isOnLinePage) {
					this.getDataRequest(e.current)
				} else {
					this.getData(e.current)
				}
			},
			getDataRequest(pageCurrent, refresh) {
				if (!refresh) {
					this.tableLoading = true
				}
				this.$emit('pageChange', pageCurrent, this.pageSize, (res) => {
					if (!refresh) {
						this.tableLoading = false
					}
					this.pageCurrent = res.pageNo;
					this.total = res.total;
					this.data = res.data;
				})
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
				let total = this.pageTotal || this.tableData.length
				if (total > 0 && pageCurrent > Math.ceil(total / pageSize)) {
					pageCurrent = Math.ceil(total / pageSize)
					this.pageCurrent = pageCurrent
				}
				// let data = this.tableData.filter((item, index) => {
				// 	const idx = index - (pageCurrent - 1) * pageSize
				// 	return idx < pageSize && idx >= 0
				// })
				let data = [];
				for (let index = 0; index < this.tableData.length; index++) {
					const idx = index - (pageCurrent - 1) * pageSize
					if (idx < pageSize && idx >= 0) {
						data.push({
							...this.tableData[index],
							action_show: false
						})
					}
				}
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
			actionClick(e, item) {
				this.$emit('actionClick', e, item);
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

	.auto-width {
		/deep/.uni-table {
			min-width: auto !important;
		}
	}

	.card-list {

		// margin-top: 20rpx;
		.head-info {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 20rpx 20rpx;
		}

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

		/deep/ .phone {
			.card-item {
				margin-bottom: 20rpx;
				padding: 20rpx 30rpx;

				.card-title {
					margin-bottom: 15rpx;
				}

				.card-options {
					min-height: 70rpx;
				}
			}
		}

		/deep/ .card-item {
			padding: 40rpx;
			padding-bottom: 20rpx;
			border-radius: 10rpx;
			box-shadow: rgba(199, 199, 199, .11) 0rpx 0rpx 6rpx 2rpx;
			background-color: #fff;
			position: relative;
			margin-bottom: 20rpx;

			.card-title {
				font-weight: 600;
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				uni-text {
					font-size: 38rpx;
					display: inline-block;
				}
			}

			.u-tag {
				font-size: 26rpx;
				font-weight: 400;
				margin-left: 20rpx;
			}

			.card-cell {
				display: flex;
				// align-items: center;
				margin-bottom: 5rpx;
				// color: #979797;
				color: $font-color-base;

				&:last-child {
					margin-bottom: 0;
				}

				.cell-label {
					margin-right: 10rpx;
				}

				.cell-value {
					flex: 1;
					word-break: break-all;
					overflow-wrap: break-word;

					span {
						display: inline-block;
						margin-left: 10rpx;
					}
				}
			}

			.card-options {
				min-height: 100rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.option-btn {
					border-radius: 16rpx;
					font-size: 32rpx;
					height: 100%;
					padding: 0 30rpx;
					margin: 4rpx 0;

					&:not(:last-child) {
						margin-right: 16rpx;
					}
				}
			}

			.card-sign {
				display: inline-block;
				width: 30rpx;
				height: 30rpx;
				margin-right: 20rpx;
				border-radius: 50%;

				&.primary {
					background-color: $uni-color-primary;
				}

				&.success {
					background-color: $uni-color-success;
				}

				&.error {
					background-color: $uni-color-error;
				}

				&.warning {
					background-color: $uni-color-warning;
				}

				&.info {
					background-color: #dcdcdc;
				}
			}
		}

		/deep/.swiper-action {
			flex: 1;
			width: 100%;

			.content-box {
				flex: 1;
				width: 100%;
				border-bottom: 1px solid $border-color-white;
			}

			.card-item {
				width: 100%;
				padding: 20rpx 30rpx;
				border-radius: 0;
			}
		}

		/deep/ .uni-pagination-box {
			margin-top: 20rpx;

			&.phone {
				padding: 20rpx;
				position: fixed;
				left: 0;
				bottom: 0;
				z-index: 990;
				background-color: $page-color-light;
				width: 100%;
				margin: auto;

				&.is-tabbar {
					// #ifdef H5
					bottom: 100rpx;
					// #endif
					// #ifndef H5
					bottom: 0;
					// #endif
				}
			}

			.uni-pagination__btn {
				// background-color: $page-color-light;
			}

			.uni-pagination__num-tag {
				min-width: 60rpx;
			}
		}

		.other-menu-btn {
			height: 100%;
			width: 65rpx;
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
				z-index: 2;
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
				z-index: 3;
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