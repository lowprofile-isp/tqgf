<template>
	<view class="taskScan-page">
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
		<view class="suspend-scan" @tap="toDetail">
			<u-icon size="48" name="plus"></u-icon>
		</view>
		<view class="page-container">
			<view class="page-content">
				<!-- <view class="filter-container stick" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<uni-data-select class="select-cap" v-model="filterInfo.state" :localdata="stateList" :clear="false"
						@change="stateChange"></uni-data-select>
					<u-search class="select-search" placeholder="巡检单号" v-model="search_word" margin="0 0 0 20rpx"
						input-align="center" :show-action="false" @change="searchChange(true)"></u-search>
				</view> -->
				<view class="content" style="padding-top: 0;">
					<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
					<view class="list-container" v-else>
						<card-list ref="cardListRef" :loading="listLoading" :table-data="searchList" :page-size="8"
							fixed-pagination columnKey="error-push" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item">
									<view class="card-content">
										<view class="card-title">
											<view>
												<!-- <span class="card-sign" :class="stateFilter(item.state)"></span> -->
												<text>{{item.name || ''}}</text>
											</view>
											<u-tag :text="stateFilter(item.state) || ''"
												:type="stateFilter(item.state)" />
										</view>
										<view class="card-cell">
											<view class="cell-value">{{columns[1].title}}: {{ item.name || '' }}</view>
										</view>
										<view class="card-cell">
											<view class="cell-value">{{columns[2].title}}:
												{{ item.department_ids || '' }}
											</view>
										</view>
										<!-- <view class="card-cell">
											<view class="cell-value">{{columns[2].title}}: {{ item.lot || '' }}</view>
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
					navTitle: '异常上报',
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
			...mapGetters(['auths', 'uid'])
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			refresh() {
				this.$refs.cardListRef.isReset = true;
				this.getList();
			},
			async getList() {
				try {
					this.listLoading = true;
					const res = await api.web.dataset.call_kw({
						model: 'mrp.abnormal',
						method: 'get_abnormals',
						args: [
							[]
						],
						kwargs: {
							create_uid: this.uid
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
					this.listLoading = false;
					uni.stopPullDownRefresh();
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
				let url = item && item.id ? `/pages/tqgf/application/errorPush/detail?id=${item.id}` :
					'/pages/tqgf/application/errorPush/detail'
				uni.navigateTo({
					url
				})
			},
			stateFilter(value) {
				let type = '';
				switch (value) {
					case '待处理':
						type = 'primary';
						break;
					case '进行中':
						type = 'warning';
						break;
					case '已完成':
						type = 'info';
						break;
				}
				return type;
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
		onLoad() {
			// uni.hideTabBar();
			this.getList();
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