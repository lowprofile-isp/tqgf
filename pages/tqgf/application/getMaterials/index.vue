<template>
	<view class="taskScan-page">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<!-- #ifdef H5 -->
				<!-- <view class="right-item" @click="getList">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view> -->
				<!-- #endif -->
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<!-- <view class="suspend-scan" @tap="addClick">
			<u-icon size="48" name="plus"></u-icon>
		</view> -->
		<view class="page-container">
			<view class="page-content">
				<view class="filter-container stick" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<custom-search ref="customSearch" style="margin-bottom: 0;" v-model="search_word" placeholder="生产单号"
						@searchChange="() => searchChange(true)" @scanClick="scanClick"></custom-search>
					<v-tabs ref="vTabs" :value="activeTab" :tabs="tabList" paddingItem="0 30rpx" height="70rpx"
						active-color="#6190e8" line-color="#6190e8" :lineScale="0.7" lineRadius="0" lineHeight="0rpx"
						:zIndex="98" @change="changeTab"></v-tabs>
				</view>
				<view class="content">
					<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
					<view class="list-container" v-else>
						<card-list ref="cardListRef" :loading="listLoading" :table-data="searchList" :page-size="9"
							fixed-pagination columnKey="getMaterials" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item">
									<view class="card-content">
										<view class="card-title">
											<view>
												<!-- <span class="card-sign" :class="stateFilter(item.state).type"></span> -->
												<text>{{item.origin || ''}}</text>
											</view>
											<u-tag :text="stateFilter(item.state).text || ''"
												:type="stateFilter(item.state).type" />
										</view>
										<view class="card-cell">
											<view class="cell-value">{{columns[1].title}}:&nbsp;
												{{ item.product_name || '' }}
											</view>
										</view>
										<view class="card-cell" v-if="item.product_batch">
											<view class="cell-value">{{columns[2].title}}:&nbsp;
												<span>{{ item.product_batch || '' }}</span>
											</view>
										</view>
										<!-- <view class="card-cell">
											<view class="cell-value">{{columns[3].title}}:
												<span>{{ item.scheduled_date || '' }}</span>
											</view>
										</view>
										<view class="card-cell">
											<view class="cell-value">{{columns[4].title}}:
												<span>{{ item.date_deadline || '' }}</span>
											</view>
										</view> -->
										<!-- <view class="card-cell">
											<view class="cell-value">{{columns[5].title}}:
												<span :style="{color: item.is_complete === false ? 'red' : ''}">
													{{ item.is_complete === true ? '是' : item.is_complete === false ? '否' : '' }}
												</span>
											</view>
										</view> -->
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
	import customSearch from '@/components/custom-search/index.vue';
	import {
		columns
	} from '@/components/page-list/data.json';
	export default {
		components: {
			userNameSign,
			authChoose,
			cardList,
			customSearch
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '生产领料',
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
					state: 'assigned'
				},
				stateList: [{
					text: '全部',
					value: ''
				}, {
					text: '待处理',
					value: 'assigned'
				}, {
					text: '已完成',
					value: 'done'
				}],
				isBack: false
			}
		},
		computed: {
			...mapGetters(['auths', 'uid']),
			tabList() {
				return this.stateList.map(state => state.text)
			},
			activeTab() {
				return this.stateList.findIndex(state => state.value == this.filterInfo.state)
			},
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
				this.listLoading = true;
				try {
					const res = await api.web.dataset.call_kw({
						model: 'stock.picking',
						method: 'get_picking_list',
						args: [
							[]
						],
						kwargs: {
							wo_name: this.search_word
						}
					})
					uni.stopPullDownRefresh();
					if (res?.length) {
						this.list = res.map(item => {
							return {
								...item,
								// product_name: item.move_info?.length > 0 ? item.move_info.map(m =>
								// 	`[${m.default_code}] ${m.product_name}`).join(',') : '',
								product_name: item.move_info?.length > 0 ? item.move_info.map(m =>
									m.product_name).join(',') : '',
								product_batch: item.move_info?.length > 0 ? item.move_info[0]
									.product_batch : ''
							}
						});
						if (this.filterInfo.state) {
							// if (this.search_word) this.searchChange();
							if (this.filterInfo.state) this.stateChange(this.filterInfo.state, true);
						} else {
							this.searchList = [...this.list];
						}
					} else {
						this.searchList = this.list = []
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
					// this.searchList = this.search_word ?
					// 	this.list.filter(item =>
					// 		item.origin &&
					// 		item.origin.toLowerCase().includes(this.search_word.toLowerCase())) :
					// 	this.list
					this.getList();
				}, 300)
			},
			stateChange(e, isReset) {
				if (isReset && this.$refs.cardListRef)
					this.$refs.cardListRef.isReset = isReset;
				this.$u.debounce(() => {
					this.searchList = this.filterInfo.state ?
						this.list.filter(item =>
							item.state &&
							(this.filterInfo.state == 'done' ? item.state = 'done' : item.state != 'done')) :
						this.list
				}, 300)
			},
			toDetail(item) {
				let url = item && item.picking_id ? `/pages/tqgf/application/getMaterials/detail?id=${item.picking_id}` :
					'/pages/tqgf/application/getMaterials/detail'
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
						stateInfo.type = 'success';
						stateInfo.text = '已完成'
						break;
				}
				return stateInfo;
			},
			scanClick() {
				// #ifdef H5
				// this.search_word = 'B240812001'
				// this.fullLoading = true;
				// this.getList('scan');
				['A2409230006'].forEach((lot) => {
					this.hl_add(lot)
				})
				// #endif
				// #ifndef H5
				// 扫码跳转
				uni.scanCode({
					success: (res) => {
						// 携带参数跳转
						this.search_word = res.result || '';
						if (res.result) {
							this.getList();
						} else {
							uni.showToast({
								title: '未找到匹配项',
								icon: 'none',
								mask: true
							})
						}
					},
					fail: (err) => {
						uni.showToast({
							title: JSON.stringify(err),
							icon: 'none',
							mask: true
						})
					}
				});
				// #endif
			},
			changeTab(index) {
				this.filterInfo.state = this.stateList[index].value;
				this.getList();
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
		onLoad(options) {
			if (options.production_name) {
				this.isBack = true;
				let strs = options.production_name.split('-');
				this.search_word = strs[0];
			}
			this.getList();
			// uni.hideTabBar();
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
					padding-top: 170rpx;
					padding-bottom: 80rpx;
				}

				.filter-container {
					width: 100%;
					background-color: #fff;
					border-bottom: 1px solid rgba(181, 181, 181, .1);
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