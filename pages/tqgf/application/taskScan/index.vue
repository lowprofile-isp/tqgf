<template>
	<view class="taskScan-page" :style="{height: `calc(100vh - ${$mStore.state.navBarHeight}px)`}">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<!-- <view slot="right" class="slot-right-wrap">
				<view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign>
			</view> -->
		</u-navbar>
		<!-- #ifdef H5 -->
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- #endif -->
		<view class="page-container">
			<view v-if="!barcode" class="not-empty">请扫描二维码</view>
			<view class="page-content" v-else>
				<!-- <view class="filter-container stick" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<uni-data-select class="select-cap" v-model="filterInfo.state" :localdata="stateList" :clear="false"
						@change="stateChange"></uni-data-select>
					<u-search class="select-search" placeholder="巡检单号" v-model="search_word" margin="0 0 0 20rpx"
						input-align="center" :show-action="false" @change="searchChange(true)"></u-search>
				</view> -->
				<scroll-view class="content" style="padding-top: 0;" scroll-y>
					<view class="content-title">
						{{codeName}} 共: {{searchList.length}}件
					</view>
					<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
					<view class="list-container" v-else>
						<card-list ref="cardListRef" :class="" :loading="listLoading" :table-data="searchList"
							:page-size="8" fixed-pagination columnKey="task-scan" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item">
									<view class="card-content">
										<view class="card-title">
											<!-- <span class="card-sign" :class="stateFilter(item.state)"></span> -->
											<text style="margin: 0;">{{item.order_state || ''}}</text>
											<!-- <u-tag :text="item.state || ''" :type="stateFilter(item.state)" /> -->
										</view>
										<view class="card-cell">
											<!-- <view class="cell-label">{{columns[1].title}}: </view> -->
											<view class="cell-value">{{columns[1].title}}: {{ item.product || '' }}
											</view>
										</view>
										<view class="card-cell">
											<!-- <view class="cell-label">{{columns[2].title}}: </view> -->
											<view class="cell-value">{{columns[2].title}}: {{ item.lot || '' }}</view>
										</view>
									</view>
								</view>
							</template>
						</card-list>
					</view>
				</scroll-view>
			</view>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import cardList from '@/components/card-list/index.vue';
	import {
		columns
	} from '@/components/page-list/data.json';
	export default {
		components: {
			userNameSign,
			authChoose,
			cardList
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '任务待办',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				authChoosePopupShow: false,
				currentScroll: 0,
				scrollTop: 0,
				listLoading: false,
				list: [],
				searchList: [],
				barcode: '',
				codeName: '',
				search_word: '',
				filterInfo: {
					state: 0
				},
				stateList: [{
					text: '全部',
					value: 0
				}, {
					text: '进行中',
					value: 1
				}, {
					text: '异常',
					value: 2
				}]
			}
		},
		computed: {
			...mapGetters(['auths'])
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			async getList() {
				this.listLoading = true;
				try {
					const res = await api.web.dataset.call_kw({
						model: 'stock.quant',
						method: 'do_barcode_quants',
						args: [
							[]
						],
						kwargs: {
							barcode: this.barcode
						}
					})
					uni.stopPullDownRefresh();
					if (res?.length) {
						this.list = [...res];
						if (this.search_word) {
							this.searchChange();
						} else this.searchList = [...this.list];
					}
					this.listLoading = false;
				} catch (e) {
					uni.stopPullDownRefresh();
					this.listLoading = false;
				}
			},
			searchChange(isReset) {
				if (isReset && this.$refs.cardListRef)
					this.$refs.cardListRef.isReset = isReset;
				this.$u.debounce(() => {
					this.searchList = this.search_word ?
						this.list.filter(item =>
							item.name &&
							item.name.includes(this.search_word)) :
						this.list
				}, 300)
			},
			stateChange(e) {
				console.log(e)
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/tqgf/application/productSearchScan/index?barcode=${item.lot}`
				})
			},
			stateFilter(value) {
				let type = '';
				// switch (value) {
				// 	case 'done':
				// 		type = 'success';
				// 		break;
				// 		// case '待拆炉':
				// 		// 	type = 'success';
				// 		// 	break;
				// 		// case '待装炉':
				// 		// 	type = 'primary';
				// 		// 	break;
				// 		// case '已装炉':
				// 		// 	type = 'warning';
				// 		// 	break;
				// }
				return type;
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							// let scanCode = 'mrp.workcenter:10:1#厂房-3960-12#炉';
							this.barcode = scanCode;
							let barcodes = scanCode.split(':');
							this.codeName = barcodes[barcodes.length - 1];
							this.getList();
						} else {
							uni.showToast({
								title: '无效的条码：' + code,
								icon: 'none',
								duration: 3000
							})
						}
					})
				}
			},
			backToTop() {
				this.scrollTop = this.currentScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0;
				})
			},
			scrollTap(e) {
				this.currentScrollTop = e.detail.scrollTop;
			},
			async scanClick() {
				let scanCode = 'mrp.workcenter:10:1#厂房-3960-12#炉';
				this.barcode = scanCode;
				let barcodes = scanCode.split(':');
				this.codeName = barcodes[barcodes.length - 1];
				this.getList();
			}
		},
		onLoad() {
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onUnload() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onPullDownRefresh() {
			if (this.barcode) {
				this.getList();
			} else {
				setTimeout(() => {
					uni.stopPullDownRefresh();
				}, 100)
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light !important;
		height: 100%;
	}

	uni-view {
		font-size: 32rpx;
	}
</style>
<style lang="scss" scoped>
	@import './index.scss';

	.taskScan-page {
		height: 100%;

		.page-container {
			height: 100%;

			.not-empty {
				padding-top: 60rpx;
				text-align: center;
				color: $primary-color;
			}

			.content-title {
				padding: 24rpx 20rpx 0;
			}

			.page-content {
				height: 100%;

				.content {
					height: calc(100% - 0rpx);
					padding-top: 102rpx;
					padding-bottom: 80rpx;
				}

				.filter-container {
					width: 100%;
					background-color: #fff;
					padding: 20rpx;
					border-bottom: 1px solid rgba(181, 181, 181, .1);
					display: flex;
					justify-content: space-between;
					align-items: center;
					position: fixed;
					left: 0;

					&.dark {
						background-color: $uni-bg-dark-light;
					}

					&.sticky {
						position: fixed;
						z-index: 99;
					}

					/deep/ .select-cap {
						flex: none;
						width: fit-content;
						background-color: $primary-color;
						border-radius: 50px;

						.uni-select {
							border: none;
							padding: 0 28rpx;
							height: 66rpx;

							.uni-select__input-box {
								justify-content: center;

								.uni-select__input-text {
									color: #fff;
								}
							}
						}

						.uni-icons {
							color: #fff !important;
							margin-left: 10rpx;
						}

						.uni-select__input-text {
							width: auto;
						}

						.uni-select__input-placeholder {
							font-size: 32rpx;
							color: #f5f5f5;
						}
					}

					.search-sign {
						/deep/ .u-content {
							padding-left: 240rpx;
						}

						/deep/ .u-icon__icon {
							font-size: 40rpx !important;
							padding-right: 10rpx;
						}

						/deep/ .u-input {
							font-size: 32rpx;
						}
					}
				}

				// flex: 1;
				.list-container {
					padding: 20rpx;
					// padding-top: 200rpx;
					// max-height: 100%;
				}
			}
		}

		.suspend-scan {
			width: 80rpx;
			height: 80rpx;
			position: fixed;
			z-index: 9;
			display: flex;
			flex-direction: row;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			background-color: $uni-color-primary;
			color: #fff;
			bottom: 292rpx;
			right: 40rpx;
			border-radius: 50%;
		}

		/deep/ .slot-right-wrap {
			display: flex;
			align-items: center;

			.right-item {
				padding-right: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
			}
		}
	}
</style>