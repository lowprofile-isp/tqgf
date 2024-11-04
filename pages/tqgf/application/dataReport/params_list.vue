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
				<view style="line-height: 1;" class="right-item" @tap="() => toDetail()">
					创建记录
				</view>
				<!-- <user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<!-- <view class="suspend-scan" @tap="() => toDetail()">
			<u-icon size="48" name="plus"></u-icon>
		</view> -->
		<view class="page-container">
			<view class="page-content">
				<view class="content">
					<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
					<view class="list-container" v-else>
						<card-list ref="cardListRef" :loading="listLoading" :table-data="searchList" :page-size="9"
							fixed-pagination columnKey="dataReport" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item">
									<view class="card-content">
										<view class="card-title">
											<!-- <span class="card-sign" :class="stateFilter(item.state).type"></span> -->
											<text style="margin-left: 0;">{{item.name || ''}}</text>
											<!-- <u-tag :text="stateFilter(item.state).text || ''"
													:type="stateFilter(item.state).type" /> -->
										</view>
										<view class="card-cell">
											<view class="cell-value">创建人:
												<span>{{ item.create_user || '' }}</span>
											</view>
										</view>
										<view class="card-cell">
											<view class="cell-value">创建时间:
												<span>{{ $mHelper.dateToUTC(item.create_date) || '' }}</span>
											</view>
										</view>
									</view>
								</view>
							</template>
						</card-list>
					</view>
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
					navTitle: '上报记录',
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
				parent_obj: {},
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
						model: 'mrp.params.group',
						method: 'get_writed_params',
						args: [
							[]
						],
						kwargs: {
							res_model: this.parent_obj.res_model,
							res_id: this.parent_obj.res_id
						}
					})
					uni.stopPullDownRefresh();
					if (res?.length) {
						this.list = [...res];
						// if (this.search_word) {
						// 	this.searchChange();
						// }
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
				let detail = item ? encodeURIComponent(JSON.stringify(item)) : null;
				let param = this.parent_obj ? encodeURIComponent(JSON.stringify(this.parent_obj)) : null;
				let url =
					`/pages/tqgf/application/dataReport/detail?detail=${detail}&param=${param}`;
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
							// this.getList();
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
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onLoad(options) {
			let param = options.param ? JSON.parse(options.param) : {};
			this.parent_obj = {
				...param
			}
			this.getList();
			// uni.hideTabBar();
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
		background-color: $page-color-light;
		height: 100%;
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
				color: #fff;
			}
		}
	}
</style>