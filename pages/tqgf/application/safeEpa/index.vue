<template>
	<view class="safeEpa-page" :style="{height: `calc(100vh - ${$mStore.state.navBarHeight}px)`}">
		<u-navbar :is-back="false" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign>
			</view>
		</u-navbar>
		<view class="suspend-scan" @tap="toDetail">
			<u-icon size="48" name="plus"></u-icon>
		</view>
		<view class="page-container">
			<view class="page-content">
				<scroll-view scroll-view class="content" style="padding-top: 0;" scroll-y>
					<view class="filter-container sticky" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
						<uni-data-select class="select-cap" v-model="filterInfo.state" :localdata="stateList"
							:clear="false" @change="stateChange"></uni-data-select>
						<u-search class="select-search" placeholder="巡检单号" v-model="search_word" margin="0 0 0 20rpx"
							input-align="center" :show-action="false" @change="searchChange(true)"></u-search>
					</view>
					<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
					<view class="list-container" v-else>
						<card-list ref="cardListRef" :class="" :loading="listLoading" :table-data="searchList"
							:page-size="8" fixed-pagination columnKey="safe-epa" @itemClick="toDetail">
							<template v-slot:listItem="{item, columns}">
								<view class="card-item" :class="stateFilter(item.state).type">
									<view class="card-content">
										<view class="card-title">
											<span class="card-sign" :class="stateFilter(item.state).type"></span>
											<text>{{item.name || ''}}</text>
											<u-tag :text="stateFilter(item.state).state"
												:type="stateFilter(item.state).type" />
										</view>
										<view class="card-cell">
											<view class="cell-label">{{columns[1].title}}: </view>
											<view class="cell-value">{{ item.inspection_task_id | findValueDec }}</view>
										</view>
										<view class="card-cell">
											<view class="cell-label">{{columns[2].title}}: </view>
											<view class="cell-value">{{ item.create_uid | findValueDec }}</view>
										</view>
										<view class="card-cell">
											<view class="cell-label">{{columns[3].title}}: </view>
											<view class="cell-value">{{ item.create_date || '' }}</view>
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
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
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
					navTitle: '安环巡检',
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
					state: 'confirm'
				},
				stateList: [{
					text: '全部',
					value: ''
				}, {
					text: '待办',
					value: 'confirm'
				}, {
					text: '已完成',
					value: 'done'
				}]
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			refresh() {
				if (this.$refs.cardListRef) this.$refs.cardListRef.isReset = true;
				this.getList();
			},
			async getList() {
				this.listLoading = true;
				try {
					const Model = api.env.model('safety.environmental.protection');
					let domain = [];
					if (this.filterInfo.state) {
						domain = [
							["state", "=", this.filterInfo.state]
						]
					}
					const res = await Model.search_read({
						domain
					});
					if (res?.length) {
						this.list = [...res];
						if (this.search_word) {
							this.searchChange();
						} else this.searchList = [...this.list];
					} else {
						this.list = [];
						this.searchList = [];
					}
				} catch (e) {}
				this.listLoading = false;
				uni.stopPullDownRefresh();
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
				this.getList();
			},
			toDetail(item) {
				let url = item && item.id ? `/pages/tqgf/application/safeEpa/detail?id=${item.id}` :
					'/pages/tqgf/application/safeEpa/detail';
				uni.navigateTo({
					url
				});
			},
			stateFilter(value) {
				let stateInfo = {
					type: '',
					state: ''
				};
				switch (value) {
					case 'done':
						stateInfo.type = 'success';
						stateInfo.state = '完成';
						break;
					case 'confirm':
						stateInfo.type = 'warning';
						stateInfo.state = '待办';
						break;
					case 'draft':
						stateInfo.type = 'info';
						stateInfo.state = '草稿';
						break;
				}
				return stateInfo;
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

	.safeEpa-page {
		height: 100%;

		.page-container {
			height: 100%;

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
					// background-color: #f5f5f5;
					padding: 20rpx;
					// padding-top: 200rpx;
					padding-top: 120rpx;
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