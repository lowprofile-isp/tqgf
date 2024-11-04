<template>
	<view class="productSearchScan-page">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<!-- <view class="right-item" @click="() => refresh()">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<view class="right-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" count="7" :offset="[-8, 14]"></u-badge>
				</view> -->
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<!-- #ifdef H5 -->
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- #endif -->
		<view v-if="!barcode" class="not-empty">请扫描二维码</view>
		<page-loading v-else style="height: 100%;" :loadmore="loadmore" @refresh="refresh">
			<scroll-view scroll-y="true" style="height: 100%;">
				<u-sticky v-if="tabItems && tabItems.length" :offset-top="navbarHeight">
					<card-tab :current="tabCurrent" :values="tabItems" @clickItem="(e) => tabCurrent = e"></card-tab>
				</u-sticky>
				<view class="card-tab-content">
					<template v-if="tabCurrent === 0">
						<card-info v-if="productInfo.type === 'raw'" title="基本信息">
							<uni-forms class="content-form">
								<uni-forms-item label="物料" label-width="100" class="content-item">
									<span>{{productInfo.product || '--'}}</span>
								</uni-forms-item>
								<uni-forms-item label="批次" label-width="100" class="content-item">
									<span>{{productInfo.lot || '--'}}</span>
									<span v-if="productInfo.lot" class="copy-text link"
										@click="$mHelper.copyText(productInfo.lot)">
										<i class="iconfont icon-copy-template"></i>复制
									</span>
								</uni-forms-item>
								<uni-forms-item label="型号" label-width="100" class="content-item">
									<span>{{productInfo.model || '--'}}</span>
								</uni-forms-item>
								<uni-forms-item label="规格" label-width="100" class="content-item">
									<span>{{productInfo.specification || '--'}}</span>
								</uni-forms-item>
								<!-- <uni-forms-item label="采购日期" label-width="100" class="content-item">
									<span>{{$mHelper.dateToUTC(productInfo.date_order) || ''}}</span>
								</uni-forms-item>
								<uni-forms-item label="预计到货日期" label-width="100" class="content-item">
									<span>{{$mHelper.dateToUTC(productInfo.date_planned, 'YYYY-MM-DD') || ''}}</span>
								</uni-forms-item> -->
							</uni-forms>
						</card-info>
						<card-info v-else title="基本信息">
							<!-- <template v-slot:head-right>
								<u-tag :text="rowItem.state | stateInfoFilter('state', stateList)"
									:type="rowItem.state | stateInfoFilter('type', stateList)" />
							</template> -->
							<uni-forms class="content-form">
								<uni-forms-item class="content-item" label="生产单号" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value link" v-if="productInfo.production"
										@click="toProduction(productInfo.production)">
										{{productInfo.production}}
									</view>
									<view class="value" v-else>--</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="产品名称" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{productInfo.product || '--'}}
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="产品状态" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">
										<u-tag :text="productInfo.state | productStateFilter('text')"
											:type="productInfo.state | productStateFilter('type')"></u-tag>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="质检状态" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">
										<u-tag :text="productInfo.check_result || '--'"
											:type="productInfo.check_result | checkResultFilter" />
										<!-- <u-tag :text="productInfo.state | productStateFilter('text')"
											:type="productInfo.state | productStateFilter('type')"></u-tag> -->
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="位置" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{ productInfo.location || '--' }}
									</view>
								</uni-forms-item>
							</uni-forms>
						</card-info>
						<!-- <view class="cell-item" v-if="stepsList && stepsList.length">
							<view class="title">当前工序</view>
							<view class="steps">
								<u-steps mode="number" :list="stepsList" :current="stepCurrent"
									:active-color="$mStore.state.themeColor.color"></u-steps>
							</view>
						</view> -->
					</template>
					<template v-if="tabCurrent === 1">
						<scroll-view scroll-y="true">
							<view v-if="timelineList.length > 0" class="swiper-content">
								<uv-steps class="step-container" :current="step_active" direction="column"
									active-color="#6190e8">
									<uv-steps-item v-for="(track, index) in timelineList" :key="index">
										<template v-slot:icon>
											<view class="step-icon primary" v-if="track.type === 'done'">
												<u-icon name="checkmark"></u-icon>
											</view>
											<view class="step-icon success" v-else-if="track.type === 'current'">
												<u-icon name="pushpin-fill"></u-icon>
											</view>
											<view class="step-icon error" v-else-if="track.type === 'cancel'">
												<u-icon name="close"></u-icon>
											</view>
											<view class="step-icon" v-else>
											</view>
										</template>
										<template v-slot:title>
											<text class="step-title">{{track.title}}</text>
										</template>
										<template v-slot:desc>
											<view v-for="(data, d_index) in track.data || []" :key="d_index">
												<view class="step-desc">{{data.title}}</view>
												<view class="step-time">{{data.time}}</view>
											</view>
										</template>
									</uv-steps-item>
								</uv-steps>
							</view>
							<empty v-else text="暂无生产进度" mode="history"></empty>
						</scroll-view>
					</template>

				</view>
			</scroll-view>
		</page-loading>
		<!-- <view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y>
					<view v-if="!productInfo.lot" class="not-empty">请扫描产品</view>
					<view v-else class="product-container">
						<u-sticky :offset-top="navbarHeight">
							<card-tab :current="tabCurrent" :values="tabItems"
								@clickItem="(e) => tabCurrent = e"></card-tab>
						</u-sticky>
						<view v-if="listLoading" style="
							position: fixed;
							top: 0;
							left: 0;
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							z-index: 99;
							background-color: #f8f8f8;">
							<u-loading color="#6190e8" mode="circle"></u-loading>
						</view>
						<swiper :style="{
								height: swiperHeight + 'px'
							}" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
							<swiper-item class="swiper-item" v-for="(tab, index) in tabList" :key="index">
								<view v-if="timelineList.length > 0" class="swiper-content"
									:id="'swiper-content' + index">
									<uv-steps class="step-container" :current="step_active" direction="column"
										active-color="#6190e8">
										<uv-steps-item v-for="(track, index) in timelineList" :key="index">
											<template v-slot:icon>
												<view class="step-icon primary" v-if="track.type === 'done'">
													<u-icon name="checkmark"></u-icon>
												</view>
												<view class="step-icon success" v-else-if="track.type === 'current'">
													<u-icon name="pushpin-fill"></u-icon>
												</view>
												<view class="step-icon error" v-else-if="track.type === 'cancel'">
													<u-icon name="close"></u-icon>
												</view>
												<view class="step-icon" v-else>
												</view>
											</template>
											<template v-slot:title>
												<text class="step-title">{{track.title}}</text>
											</template>
											<template v-slot:desc>
												<view v-for="(data, d_index) in track.data || []" :key="d_index">
													<view class="step-desc">{{data.title}}</view>
													<view class="step-time">{{data.time}}</view>
												</view>
											</template>
										</uv-steps-item>
									</uv-steps>
								</view>
								<empty v-else text="暂无生产进度" mode="history"></empty>
							</swiper-item>
						</swiper>
					</view>
				</scroll-view>
			</view>
		</view> -->
		<!-- <view class="btn-group" v-if="material_list.length > 0">
			<u-button type="primary" :loading="btnLoading" hover-class="none">提交</u-button>
		</view> -->
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
	import {
		authCodes
	} from '@/common/const.js';
	import {
		authPageTo
	} from '@/pages/tqgf/application/handler.js';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import cardInfo from '@/components/card-info/index.vue';
	import pageLoading from '@/components/pageLoading/index.vue';
	import cardTab from '@/components/card-tab/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			cardInfo,
			cardTab,
			pageLoading
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '信息查询',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				authChoosePopupShow: false,
				workingShow: false,
				weightBtnLoading: false,
				currentScroll: 0,
				scrollTop: 0,
				listLoading: false,
				btnLoading: false,
				loading: true,
				loadmore: 'loadmore',
				barcode: '',
				productInfo: {},
				wg_list: [{
					text: '合格',
					value: 1
				}, {
					text: '不合格',
					value: 0
				}],
				activeTab: 0,
				tabList: ['产品进度'],
				swiperCurrent: 0,
				swiperHeight: '',
				timelineList: [],
				step_active: '',
				tabCurrent: 0,
				tabItems: ['基本信息', '生产进度'],
			}
		},
		computed: {
			...mapGetters(['auths', 'navBarHeight']),
			navbarHeight() {
				let topHeight = 0;
				// #ifdef APP-PLUS
				topHeight = this.$store.getters.navBarHeight;
				// #endif
				return topHeight * (Math.floor(750 / this.$store.state.sysInfo.windowWidth))
			},
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			productStateFilter(value, type) {
				let info = {
					type: 'info',
					text: value || '--'
				}
				switch (value) {
					case 'confirmed':
					case 'to_close':
						info.type = 'primary';
						info.text = '待生产';
						break;
					case 'progress':
						info.type = 'warning';
						info.text = '进行中';
						break;
					case 'done':
						info.type = 'success';
						info.text = '已完成';
						break;
					case 'cancel':
						info.type = 'error';
						info.text = '已取消';
						break;
				}
				return info[type];
			},
			checkResultFilter(value) {
				let type = '';
				switch (value) {
					case '合格':
					case '让步放行':
						type = 'success';
						break;
					case '隔离':
						type = 'error';
						break;
					case '待检验':
						type = 'primary';
						break;
					case '技术判定':
						type = 'warning';
						break;
					default:
						type = 'info';
				}
				return type;
			},
		},
		methods: {
			...mapMutations(['user/SET_USER_AUTH']),
			refresh() {
				this.getProductionInfo();
			},
			async getProductionInfo() {
				let barcode = this.barcode;
				try {
					this.listLoading = true;
					this.loadmore = 'loadmore';
					const res = await api.web.dataset.call_kw({
						model: 'stock.quant',
						method: 'do_barcode_quant',
						args: [
							[]
						],
						kwargs: {
							barcode
						}
					})
					if (!res) {
						this.loadmore = 'error';
						return
					}
					if (res) {
						this.productInfo = {
							...res
						};
						if (this.productInfo.type === 'raw') {
							this.tabItems = []
						}
						// let timelineList = this.productInfo.trackings.map;
						// for (let i = 0; i < this.productInfo.trackings.length; i++) {
						// 	let item = this.productInfo.trackings[i];
						// 	for (let j = 0; j < item.data.length; j++) {
						// 		let subItem = item.data[j];
						// 		timelineList.push({
						// 			title: j === 0 ? item.title : '',
						// 			type: j === 0 ? item.type : '',
						// 			time: subItem.time,
						// 			subTitle: subItem.title
						// 		})
						// 	}
						// }
						if (this.productInfo.type === 'production') {
							this.timelineList = [...this.productInfo.trackings];
						}
						this.loadmore = 'more';
					}
				} catch (e) {}
			},
			toProduction(production) {
				uni.switchTab({
					url: '/pages/tqgf/application/production/index',
					success: () => {
						uni.$emit('toProductionPage', {
							search_word: production
						})
					}
				})
			},
			toPage() {
				let {
					next_operate,
					lot
				} = this.productInfo;
				let url = '';
				switch (next_operate) {
					case '分拣':
						url = authPageTo(authCodes.ST) + '?barcode=' + lot;
						break;
					case '周转':
						url = authPageTo(authCodes.ZY) + '?barcode=' + lot;
						break;
					case '异常':
						url = authPageTo(authCodes.ER) + '?barcode=' + lot;
						break;
				}
				uni.redirectTo({
					url
				})
			},
			showPage() {
				this.$nextTick(() => {
					setTimeout(() => {
						this.listLoading = false;
						this.setSwiperHeight();
						this.$refs.vTabs.update();
					}, 500)
				});
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							this.barcode = scanCode;
							this.getProductionInfo();
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
			setSwiperHeight() {
				let element = "#swiper-content" + this.swiperCurrent;
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						this.swiperHeight = res[0].height;
					}
				});
			},
			changeTab(index) {
				// this.isTabClick = true;
				this.swiperCurrent = index;
				this.activeTab = index;
			},
			transition(e) {
				let dx = e.detail.dx;
				if (!this.isTabClick) this.activeTab = dx;
			},
			animationfinish(e) {
				// this.isTabClick = false;
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.activeTab = current;
			},
			async scanClick() {
				// this.barcode = 'T-1021-2/HQ320XBA-24-1022-058'
				this.barcode = 'C2410310001'
				this.getProductionInfo();
			}
		},
		async onLoad(options) {
			if (options.barcode) {
				this.barcode = options.barcode;
				await this.getProductionInfo();
			}
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300);
		},
		onUnload() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onPullDownRefresh() {
			if (this.barcode) {
				this.getProductionInfo();
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
		background-color: $page-color-light;
	}

	uni-view {
		font-size: 32rpx;
	}
</style>
<style lang="scss" scoped>
	@import './index.scss';

	.productSearchScan-page {
		height: 100%;

		.not-empty {
			padding-top: 60rpx;
			text-align: center;
			color: $primary-color;
		}

		.card-tab-content {
			position: relative;
			padding: 20rpx;

			.u-empty {
				position: fixed;
				height: max-content;
			}

			/deep/ .is-disabled {
				background-color: #f8f8f8;
				color: #6a6a6a;
			}
		}

		.swiper-content {
			padding: 30rpx 40rpx;

			.time-line-content {
				// padding: 20rpx;
				// box-shadow: 0px 0px 10rpx #ececec;
			}

			.step-container {
				/deep/ .uv-steps-item__wrapper {
					background-color: $page-color-light;
				}

				.step-icon {
					// min-width: 10rpx;
					// min-height: 10rpx;
					padding: 10rpx;
					border-radius: 100rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					border: 1px solid #969799;
					color: #fff;

					&.success {
						background-color: $uni-color-primary;
						border-color: $uni-color-primary;
						color: #fff;
					}

					&.primary {
						border-color: $uni-color-primary;
						color: $uni-color-primary;
					}

					&.error {
						border-color: $uni-color-error;
						color: $uni-color-error;
					}

					&.warning {
						border-color: $uni-color-warning;
						color: $uni-color-warning;
					}
				}

				.step-title {
					color: #333333;
					font-weight: bold;
					font-size: 32rpx;
				}

				.step-desc {
					color: rgb(150, 150, 150);
					font-size: 30rpx;
					margin-bottom: 6rpx;
				}

				.step-time {
					color: rgb(200, 200, 200);
					font-size: 30rpx;
				}
			}
		}

		.container {
			.header {
				padding: 0 40rpx;
				width: 100%;
				height: 60px;
				float: left;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 20rpx;
				box-shadow: rgba(150, 148, 148, .15) 0rpx 0rpx 6rpx 2rpx;
				background-color: #fff;

				.header-content {
					flex: 1;
				}

				.title {
					font-weight: 500;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				@keyframes breathing {
					0% {
						transform: scale(1);
						opacity: 1;
					}

					50% {
						transform: scale(1.2);
						opacity: 0.5;
					}

					100% {
						transform: scale(1);
						opacity: 1;
					}
				}

				.sign {
					display: inline-block;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-left: 20rpx;
					margin-right: 12rpx;

					&.primary {
						background-color: $uni-color-primary;
						// animation: breathing 2s infinite;
					}

					&.success {
						background-color: $uni-color-success;
						// animation: breathing 2s infinite;
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

			.content {
				height: 100%;

				.content-title {
					padding: 0 20rpx;
				}

				.product-container {



					.card-content {
						background-color: #fff;
						box-shadow: 0px 2rpx 5rpx #eee;

						.top {
							margin-bottom: 20rpx;
							padding: 20rpx 30rpx 0;

							.info {
								.card-title {
									font-weight: 600;
									font-size: 32rpx;
									margin-bottom: 12rpx;
									display: flex;
									align-items: center;

									uni-text {
										display: inline-block;
										margin: 0 20rpx;
									}
								}

								.u-tag {
									font-size: 26rpx;
								}

								.card-cell {
									display: flex;
									align-items: center;
									margin-bottom: 12rpx;
									color: #777;

									&:last-child {
										margin-bottom: 0;
									}

									&.row {
										display: flex;
										flex-wrap: wrap;
										font-size: 32rpx;

										.row-item {
											margin-right: 40rpx;
										}
									}

									.cell-label {
										margin-right: 20rpx;
										font-size: 32rpx;
									}

									.cell-value {
										font-size: 32rpx;
									}
								}
							}
						}
					}

					.item-cell {
						display: flex;
						align-items: center;
						margin: 10rpx 0;

						.label {
							display: inline-block;
							width: 100rpx;
						}
					}

					.material-item {
						margin: 40rpx 20rpx 20rpx;
						background-color: #fff;
						padding: 20rpx 40rpx 20rpx 20rpx;
						border-radius: 10rpx;
						box-shadow: 0px 0px 8rpx rgba(211, 211, 211, .5);
						position: relative;

						&:first-child {
							background-color: rgba(173, 216, 230, .4);
						}

						.item-close {
							position: absolute;
							right: 0rpx;
							top: 10rpx;
							line-height: 32rpx;
							text-align: center;
						}

						/deep/ .uni-forms-item__inner {
							padding-bottom: 10rpx;

							.uni-forms-item__label {
								height: auto;
							}

							.uni-forms-item__content {
								min-height: auto;
								display: inline-flex;
								align-items: center;
							}
						}

						/deep/ .uni-easyinput {
							.uni-easyinput__content {
								min-height: 60rpx;
								height: 60rpx;

								&.is-textarea {
									height: auto;
								}
							}

							// &.submit-icon {
							// 	.uni-icons {
							// 		color: $uni-color-success !important;
							// 	}
							// }
						}

						/deep/ .workingInput {
							.uni-easyinput__content {
								border-right: 0;
								border-top-right-radius: 0;
								border-bottom-right-radius: 0;
							}
						}

						.select-icon-style {
							display: inline-block;
							width: 60rpx;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							border: 2rpx solid #a7a7a7;
							box-sizing: border-box;
							border-left: 0;
							border-top-right-radius: 8rpx;
							border-bottom-right-radius: 8rpx;
						}

						.select-text-style {
							display: inline-block;
							width: 60rpx;
							height: 60rpx;
							line-height: 60rpx;
							margin-left: 14rpx;
							text-align: center;
							color: $primary-color;
							box-sizing: border-box;

							uni-text {
								display: inline-block;
								height: 100%;
								width: 100%;
							}
						}
					}

					/deep/ .uni-scroll-view::-webkit-scrollbar {
						display: block;
						width: 12rpx !important;
						height: 12rpx !important;
					}

					/deep/ .uni-scroll-view::-webkit-scrollbar-thumb {
						background-color: $uni-scroll-color;
						border-radius: 10rpx;
					}
				}
			}
		}

		.btn-group {
			width: 100%;
			height: 100rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.u-btn {
				flex: 1;
				font-size: 32rpx;
				background-color: $primary-color;
				border-color: $primary-color;

				&.u-btn--primary--disabled {
					background-color: #bcd2f3 !important;
					border-color: #bcd2f3 !important;
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