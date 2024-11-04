<template>
	<view class="taskScan-page">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<!-- #ifdef H5 -->
				<view class="right-item" @click="getList">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<!-- #endif -->
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<!-- <view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view> -->
		<view class="page-container">
			<view class="page-content">
				<view v-if="barcode" class="filter-container stick"
					:class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<!-- <uni-data-select class="select-cap" v-model="filterInfo.state" :localdata="stateList" :clear="false"
						@change="() => getList()"></uni-data-select>
					<u-search class="select-search" placeholder="制造单号" v-model="search_word" margin="0 0 0 20rpx"
						input-align="center" :show-action="false" @change="searchChange(true)"></u-search> -->
					<view class="header-content">
						<view class="title">
							{{barcode}}
							<!-- <view style="display: flex; align-items: center; font-size: 32rpx;font-weight: 400;">
								<span class="sign" :class="stateFilter(equipmentInfo.active)"></span>
								{{equipmentInfo.active ? '正常' : '设备故障'}}
							</view> -->
						</view>
					</view>
					<!-- <view v-else style="text-align: center;">请扫描设备二维码</view> -->
				</view>
				<view class="content">
					<view v-if="!barcode" class="not-empty">请扫码获取工单列表</view>
					<template v-else>
						<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
						<view class="list-container" v-else>
							<card-list ref="cardListRef" :loading="listLoading" :table-data="searchList" :page-size="9"
								fixed-pagination columnKey="dataReport" @itemClick="toDetail">
								<template v-slot:listItem="{item, columns}">
									<view class="card-item">
										<view class="card-content">
											<view class="card-title">
												<!-- <span class="card-sign" :class="stateFilter(item.state).type"></span> -->
												<text style="margin-left: 0;">{{item.mo_name || ''}}</text>
												<!-- <u-tag :text="stateFilter(item.state).text || ''"
													:type="stateFilter(item.state).type" /> -->
											</view>
											<view class="card-cell">
												<view class="cell-value">{{columns[1].title}}:
													<span>{{ item.name || '' }}</span>
												</view>
											</view>
											<view class="card-cell">
												<view class="cell-value">{{columns[2].title}}:
													<span>{{ item.product || '' }}</span>
												</view>
											</view>
											<view class="card-cell">
												<view class="cell-value">{{columns[3].title}}:
													{{ item.serial_num || '' }}
												</view>
											</view>
										</view>
									</view>
								</template>
							</card-list>
						</view>
					</template>
				</view>
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
	import {
		getEquipmentInfoAPI
	} from '@/api/inventory.js';
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
					navTitle: '生产记录',
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
				search_word: '',
				filterInfo: {
					state: ''
				},
				e_type: '',
				barcode: '',
				equipmentInfo: {},
				isSupport: false,
				stateList: [{
					text: '全部',
					value: ''
				}, {
					text: '待处理',
					value: 'assigned'
				}, {
					text: '已完成',
					value: 'done'
				}]
			}
		},
		computed: {
			...mapGetters(['auths', 'uid'])
		},
		watch: {
			barcode(val) {
				if (val) this.isSupport = true
				else this.isSupport = false
				this.initPullDownRefresh()
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			refresh() {
				if (this.$refs.cardListRef)
					this.$refs.cardListRef.isReset = true;
				this.getList();
			},
			async getList() {
				try {
					this.listLoading = true;
					const res = await api.web.dataset.call_kw({
						model: 'mrp.workcenter',
						method: 'get_workorders',
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
						}
						if (this.filterInfo.state) {
							this.stateChange(this.filterInfo.state, true);
						} else this.searchList = [...this.list];
					}
					this.listLoading = false;
				} catch (e) {
					console.log(e)
					uni.stopPullDownRefresh();
					this.listLoading = false;
				}
			},
			async getEquipmentInfo(barcode) {
				let barcodes = barcode.split(':');
				let type = barcodes[barcodes.length - 1];
				this.e_type = type;
				if (this.e_type === 'start' || this.e_type === 'end' || this.e_type === 'stop') {
					uni.showLoading({
						title: '加载中'
					});
					try {
						let model = barcodes[0];
						let workcenter_id = barcodes[1];
						const Model = api.env.model(model);
						const res = await Model.search_read({
							domain: [
								['id', '=', workcenter_id]
							]
						});
						if (res && res.length > 0) {
							this.equipmentInfo = {
								...res[0],
								barcode
							};
						}
						uni.hideLoading();
					} catch (e) {
						uni.hideLoading();
					}
				} else {
					uni.showToast({
						title: '无效的条码：' + barcode,
						icon: 'none',
						duration: 3000
					})
				}
			},
			initPullDownRefresh() {
				// #ifdef APP
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.setStyle({
					pullToRefresh: {
						support: this.isSupport,
						style: plus.os.name === 'Android' ? 'circle' : 'default'
					}
				});
				// #endif
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
			stateChange(e, isReset) {
				if (isReset && this.$refs.cardListRef)
					this.$refs.cardListRef.isReset = isReset;
				this.$u.debounce(() => {
					this.searchList = this.filterInfo.state ?
						this.list.filter(item =>
							item.state &&
							item.state.includes(this.filterInfo.state)) :
						this.list
				}, 300)
			},
			toDetail(item) {
				let url = item && item.id ?
					`/pages/tqgf/application/dataReport/params_list?id=${item.id}&barcode=${this.barcode}` :
					'/pages/tqgf/application/dataReport/params_list'
				uni.navigateTo({
					url
				})
			},
			stateFilter(value) {
				let stateInfo = {
					type: 'primary',
					text: '待处理'
				}
				switch (value) {
					case 'done':
						stateInfo.type = 'info';
						stateInfo.text = '已完成'
						break;
				}
				return stateInfo;
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							this.barcode = scanCode;
							// await this.getEquipmentInfo(scanCode);
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
				// await this.getEquipmentInfo('mrp.workcenter:17:23:start');
				this.barcode = 'mrp.workcenter:1269:18:start';
				this.getList()
			}
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onLoad() {
			// uni.hideTabBar();
			this.initPullDownRefresh();
			// this.getList();
		},
		onUnload() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onPullDownRefresh() {
			this.refresh();
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
		.global_empty {
			position: fixed;
		}

		.page-container {
			.not-empty {
				padding-top: 60rpx;
				text-align: center;
				color: $primary-color;
			}

			.content-title {
				padding: 24rpx 20rpx 0;
			}

			.page-content {
				.content {
					// height: calc(100vh - 184rpx);
					padding-top: 102rpx;
					padding-bottom: 80rpx;

					.not-empty {
						padding-top: 60rpx;
						text-align: center;
						color: $primary-color;
					}
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
					z-index: 9;

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

					.header-content {
						flex: 1;
					}

					&.primary {
						background-color: #e5eaff;
					}

					&.success {
						background-color: #dbf1e1;
					}

					&.error {
						background-color: #fef0f0;
					}

					&.warning {
						background-color: #fdf6ec;
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