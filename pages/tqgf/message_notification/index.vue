<template>
	<view class="notifiction-page">
		<!-- <u-navbar :is-back="isBack" back-icon-color="#fff" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<user-name-sign></user-name-sign>
			</view>
		</u-navbar> -->
		<view class="page-container">
			<view class="page-content">
				<view class="filter-container stick" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<!-- <view class="filter-tag" v-for="(n, index) in notice_state_list" :key="index"
						@click="filterChange(n)">
						<u-tag :text="n.text != '未读' && n.count ? `${n.text} (${n.count})` : n.text"
							:mode="filterInfo.state == n.value ? 'dark' : 'plain'" type="primary">
						</u-tag>
						<u-badge v-if="n.text == '未读'" type="error" :count="msgCount" :offset="[-8, -8]"></u-badge>
					</view> -->
					<card-tab :current="tabCurrent" :values="tabItems" @clickItem="(e) => filterChange(e)"></card-tab>
				</view>
				<view class="content">
					<view class="list-container" v-if="msgList.length > 0">
						<card-list ref="cardListRef" :loading="listLoading" :table-data="msgList" :page-no="pageNo"
							:page-size="10" :page-total="msgSumCount" is-tabbar fixed-pagination show-swiper-action
							is-on-line-page :action-options="actionOptions" @pageChange="pageChange"
							@actionClick="actionClick" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item">
									<view class="card-content">
										<!-- <view class="card-title">
											<span v-if="!item.info_is_read" class="card-sign"
												:class="stateFilter(item.info_is_read).type"></span>
											<text style="margin-left: 0;">{{item.name || ''}}</text>
											<u-tag :text="stateFilter(item.state).text || ''"
												:type="stateFilter(item.state).type" />
										</view> -->
										<view class="card-cell" style="margin-bottom: 20rpx;">
											<view class="cell-label" style="width: 50rpx;">
												<u-icon name="bell" color="#a7a7a7"></u-icon>
											</view>
											<view class="cell-value ellipsis">
												{{ item.title || '' }}
												<span v-if="!item.is_read" class="card-sign"
													:class="stateFilter(item.info_is_read).type"></span>
											</view>
										</view>
										<!-- <view class="card-cell">
											<view class="cell-value ellipsis">
												{{ item.note || '' }}
											</view>
										</view> -->
										<view class="card-cell">
											<view class="cell-label" style="width: 50rpx;">
												<u-icon name="clock" color="#a7a7a7"></u-icon>
											</view>
											<view class="cell-value"
												style="display: flex;justify-content: space-between;">
												<span style="color: #a7a7a7; font-size: 28rpx; margin-left: 0;">
													创建时间: {{ item.create_date || '' }}
												</span>
												<!-- <span style="color: #a7a7a7; font-size: 28rpx; margin-left: 0;">
													创建人: {{ item.abnormal_create_user || '' }}
												</span> -->
											</view>
										</view>
									</view>
								</view>
							</template>
						</card-list>
					</view>
					<empty v-else mode="message">
					</empty>
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
	import cardTab from '@/components/card-tab/index.vue';
	import {
		columns
	} from '@/components/page-list/data.json';
	export default {
		components: {
			userNameSign,
			authChoose,
			cardList,
			cardTab
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '消息通知',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				isFirst: true,
				authChoosePopupShow: false,
				currentScroll: 0,
				scrollTop: 0,
				listLoading: false,
				filterInfo: {
					state: '未读'
				},
				tabCurrent: 0,
				tabItems: ['未读', '已读'],
				notice_state_list: [{
					text: '未读',
					value: '未读'
				}, {
					text: '已读',
					value: '已读'
				}],
				actionOptions: [{
						text: '标记为已读',
						style: {
							backgroundColor: '#FF9F43'
						}
					},
					// {
					// 	text: '删除',
					// 	style: {
					// 		backgroundColor: '#dd524d'
					// 	}
					// }
				],
				isBack: false,
				pageSize: 10,
				pageNo: 1,
				total: 0
			}
		},
		computed: {
			...mapGetters(['auths', 'uid', 'msgCount', 'msgList', 'msgSumCount'])
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
				this.paginationReset();
				this.getList();
			},
			async getList() {
				this.listLoading = true;
				try {
					await this.$mStore.dispatch('notification/getMsgList', {
						is_read: this.filterInfo.state == '已读',
						pageSize: this.pageSize || 10,
						pageNo: this.pageNo
					});
					this.listLoading = false;
					uni.stopPullDownRefresh();
				} catch (e) {
					console.log(e)
					this.listLoading = false;
					uni.stopPullDownRefresh();
				}
			},
			async setRead(item) {
				await this.$mStore.dispatch('notification/setRead', {
					id: item.id
				});
				this.getList();
			},
			toDetail(item) {
				let url = item && item.id ? `/pages/tqgf/message_notification/detail?id=${item.id}` :
					'/pages/tqgf/message_notification/detail'
				uni.navigateTo({
					url,
					success: () => {
						// this.setRead(item);
					}
				})
			},
			actionClick(e, rowItem) {
				if (e.index === 0) {
					this.setRead(rowItem);
				} else if (e.index === 1) {
					console.log(删除)
				}
			},
			filterChange(e) {
				this.paginationReset();
				this.tabCurrent = e;
				this.filterInfo.state = this.notice_state_list[e].value;
				this.getList();
			},
			paginationReset() {
				this.pageNo = 1;
				this.pageSize = 10;
			},
			stateFilter(value) {
				let stateInfo = {
					type: 'error',
					text: '未读'
				}
				switch (value) {
					case true:
						stateInfo.type = 'info';
						stateInfo.text = '已读'
						break;
				}
				return stateInfo;
			},
			async pageChange(pageNo, pageSize, callback) {
				this.pageNo = pageNo;
				this.pageSize = pageSize;
				await this.getList();
				callback({
					pageNo: this.pageNo,
					data: this.msgList,
					total: this.msgSumCount
				})
			},
		},
		onLoad(options) {
			if (options.from) {
				this.isBack = true;
			}
			this.isFirst = false;
			this.getList();
		},
		onShow() {
			if (!this.isFirst) {
				this.getList();
			}
		},
		onUnload() {
			this.$mStore.dispatch('tabbar/clear_timer')
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

	uni-view {
		font-size: 30rpx;
	}
</style>
<style lang="scss" scoped>
	$primary-color: #6190e8;

	.notifiction-page {
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
					padding-top: 116rpx;
					// #ifdef H5
					padding-bottom: 200rpx;
					// #endif
					// #ifndef H5
					padding-bottom: 100rpx;
					// #endif

					.card-item {
						margin-bottom: 0;

						.card-title {
							margin-bottom: 0;
							font-weight: 500;
							font-size: 32rpx;
						}

						.cell-value {
							font-size: 30rpx;
							position: relative;
							padding-right: 30rpx;
						}

						.card-sign {
							width: 20rpx;
							height: 20rpx;
							position: absolute;
							left: auto;
							right: -24rpx;
							top: 50%;
							transform: translate(-50%, -50%);
						}
					}
				}

				.filter-container {
					width: 100%;
					background-color: #fff;
					border-bottom: 1px solid rgba(181, 181, 181, .1);
					position: fixed;
					left: 0;
					z-index: 9;

					/deep/.segmented-control {
						width: 50%;
					}

					&.dark {
						background-color: $uni-bg-dark-light;
					}

					&.sticky {
						position: fixed;
						z-index: 99;
					}

					.filter-tag {
						position: relative;

						&:not(:last-child) {
							margin-right: 20rpx;
						}
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