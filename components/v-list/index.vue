<template>
	<view class="virtual-page">
		<view v-if="loading" class="list-loading">
			<u-loading :color="$mStore.getters.themeColor.color" size="60" />
		</view>
		<view class="virtual-list" v-if="!isVirtual">
			<view class="list-item" v-for="(item, index) in data" :key="dataKey ? item[dataKey] : index"
				@tap="itemClick(item)">
				<slot name="listItem" :item='item'></slot>
				<view v-if="showMenu && optionType === 'custom'" class="list-options custom">
					<slot name="options" :item='item'></slot>
				</view>
				<view v-else-if="showMenu" class="list-options" @click.stop="toggleMenu">
					<u-icon name="more-dot-fill" size="28"></u-icon>
				</view>
			</view>
		</view>
		<view v-else>
			<!-- #ifndef APP-PLUS -->
			<!-- <recycle-scroller class="virtual-list" :buffer="buffer" :item-size="itemHeight" :key-field="dataKey"
				:items="listData">
				<template v-slot="{ item, index }">
					<view class="list-item" :style="{height: (itemHeight - 10) + 'px'}"
						:key="dataKey ? item[dataKey] : index" @tap="itemClick(item)">
						<slot name="listItem" :item='item'></slot>
						<view v-if="showMenu && optionType === 'custom'" class="list-options custom">
							<slot name="options" :item='item'></slot>
						</view>
						<view v-else-if="showMenu" class="list-options" @click.stop="toggleMenu">
							<u-icon name="more-dot-fill" size="28"></u-icon>
						</view>
					</view>
				</template>
			</recycle-scroller> -->
			<view class="virtual-list">
				<view class="list-item" v-for="(item, index) in data" :key="dataKey ? item[dataKey] : index"
					@tap="itemClick(item)">
					<slot name="listItem" :item='item'></slot>
					<view v-if="showMenu && optionType === 'custom'" class="list-options custom">
						<slot name="options" :item='item'></slot>
					</view>
					<view v-else-if="showMenu" class="list-options" @click.stop="toggleMenu">
						<u-icon name="more-dot-fill" size="28"></u-icon>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<list class="virtual-list">
				<view class="list-item" v-for="(item, index) in data" :key="dataKey ? item[dataKey] : index"
					@tap="itemClick(item)">
					<slot name="listItem" :item='item'></slot>
					<view v-if="showMenu && optionType === 'custom'" class="list-options custom">
						<slot name="options" :item='item'></slot>
					</view>
					<view v-else-if="showMenu" class="list-options" @click.stop="toggleMenu">
						<u-icon name="more-dot-fill" size="28"></u-icon>
					</view>
				</view>
			</list>
			<!-- #endif -->
			<u-select v-model="isMenuShow" :list="menuList"></u-select>
		</view>
		<!-- 加载组件 -->
		<u-loadmore :status="loadmore" :load-text="loadText" @loadmore="$emit('loadmore')" />
	</view>
</template>

<script>
	export default {
		props: {
			isVirtual: {
				type: Boolean,
				default: true
			},
			loading: {
				type: Boolean,
				default: false,
			},
			// 默认标识每行用的标识字段，默认是 id
			dataKey: {
				type: String
			},
			listData: {
				type: Array,
				default: () => []
			},
			// 元素高度
			itemHeight: {
				type: Number,
				default: 100
			},
			// 加到可视区域上下的像素高度，可以适当调大，避免滚动出现的空白
			buffer: {
				type: Number,
				default: 2000
			},
			optionType: {
				type: String,
			},
			showMenu: {
				type: Boolean,
				default: false
			},
			// 操作菜单列表
			menuList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				menuIndex: -1,
				isMenuShow: false,
				menuX: 0,
				menuY: 0,
				timer: null,
				data: [],
				pageCurrent: 1,
				pageSize: 10,
				total: 0,
				loadmore: 'loading',
				finished: false,
				loadText: {
					loadmore: '上拉加载更多',
					loading: '正在加载',
					nomore: '暂无更多'
				}
			}
		},
		watch: {
			listData: {
				handler(val) {
					this.getData(true)
				},
				immediate: true,
				deep: true
			},
		},
		methods: {
			toggleMenu() {
				this.isMenuShow = !this.isMenuShow;
			},
			itemClick(item) {
				this.$emit('itemClick', item)
			},
			menuClick(menu, item) {
				this.$emit('menuChange', menu, item)
			},
			// 获取数据
			getData(refresh) {
				if (refresh) {
					this.pageCurrent = 1;
					this.data = []
					this.finished = false
					if(this.listData.length <= 0) {
						this.finished = true
						return
					}
				}
				if (this.finished) {
					return;
				}
				if (!refresh) {
					this.loadmore = 'loading'
				}
				this.request({
					pageSize: this.pageSize,
					pageCurrent: this.pageCurrent,
					success: res => {
						this.total = res.total
						if (res.data?.length) {
							this.data = refresh ? [...res.data] : this.data.concat(res.data)
							this.pageCurrent++
						}
						if (this.data.length >= this.total) {
							this.finished = true
							this.loadmore = 'nomore'
						} else {
							this.loadmore = 'loadmore'
							this.finished = false
						}
					}
				})
			},
			request(options) {
				const {
					pageSize,
					pageCurrent,
					success
				} = options
				let total = this.listData.length
				let data = this.listData.filter((item, index) => {
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
		}
	}
</script>

<style lang="scss" scoped>
	// .menu-box {
	// 	position: fixed;
	// 	// right: 17px;
	// 	// top: 35px;
	// 	padding: 10rpx 0;
	// 	background: #fff;
	// 	box-shadow: 0px 0px 7px rgba(0, 0, 0, .3);
	// 	list-style: none;
	// 	transition: all .2s;

	// 	.menu-cell {
	// 		padding: 10rpx 20rpx;
	// 		min-width: 70px;
	// 		text-align: center;
	// 	}
	// }
	.virtual-page {
		position: relative;

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

		.virtual-list {
			max-height: 100%;

			.vue-recycle-scroller__item-view:not(:last-child) {
				.list-item {
					margin-bottom: 20rpx;
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

			@media (min-width: 375px) and (max-width: 480px) {
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
	}
</style>