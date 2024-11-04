<template>
	<view class="check_record-page">
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" top="600" tips="顶部" :duration="200" :icon-style="iconStyle"
			:custom-style="{backgroundColor: $mStore.getters.themeColor.color, color: '#fff'}"></u-back-top>
		<view class="production-container">
			<view class="page-content">
				<view class="search-sticky">
					<!-- 搜索栏 -->
					<view class="search-container">
						<u-search ref="search_sign" class="search-sign" placeholder="请输入批次/序列号" v-model="search_word"
							height="80" bg-color="#fff" :border-color="$mStore.getters.themeColor.color"
							action-text="查询" search-icon="" :show-action="false" @change="searchChange(true)">
						</u-search>
						<!-- #ifdef APP-PLUS -->
						<view class="search-scan" @tap="scanClick"><u-icon size="44" name="scan" margin-right="10rpx"
								label="扫码"></u-icon></view>
							<!-- #endif -->
					</view>
					<u-dropdown ref="uDropdown" class="filter-container"
						:class="[filterInfo.user_id ? 'd-active-1' : '', filterInfo.state ? 'd-active-2' : '']"
						inactive-color="#333">
						<user-dropdown :title="'员工'" :value="filterInfo.user_id" value-key="user_id"
							@confirm="userSelect" @close="userSelectClose"></user-dropdown>
						<u-dropdown-item v-model="filterInfo.state" :title="stateActiveTitle || '状态'"
							:options="stateList" @change="stateSelect"></u-dropdown-item>
					</u-dropdown>
				</view>
				<empty text="暂无数据" v-if="!listLoading && search_list.length <= 0"></empty>
				<!-- 列表 -->
				<view class="list-container" v-else>
					<page-list ref="pageListRef" v-if="$mStore.state.isPad" :loading="listLoading"
						:table-data="search_list" columnKey="quality_check_record" @itemClick="toDetail">
						<template v-slot:listItem="{item}">
							<uni-td>{{ item.product_id | findValueDec }}</uni-td>
							<uni-td>{{ item.lot_id | findValueDec }}</uni-td>
							<uni-td>{{ item.production_id | findValueDec }}</uni-td>
							<uni-td>{{ item.title }}</uni-td>
							<uni-td>{{ item.measure }}</uni-td>
							<uni-td>{{ item.write_uid | findValueDec }}</uni-td>
							<uni-td>{{ $mHelper.dateToUTC(item.write_date) || '' }}</uni-td>
							<uni-td align="center">
								<u-tag :text="item.quality_state | stateInfoFilter('value', stateList)"
									:type="item.quality_state | stateInfoFilter('type', stateList)" size="mini" />
							</uni-td>
						</template>
					</page-list>
					<template v-else>
						<v-list ref="vListRef" :list-data="search_list" dataKey="id" :loading="listLoading"
							:buffer="2000" :itemHeight="200" @loadmore="getList()" @itemClick="toDetail">
							<template v-slot:listItem="{item}">
								<view class="list-item-cell">
									<view>
										<span class="list-item-cell-text">产品：{{item.product_id | findValueDec}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">批次/序列号：{{item.lot_id | findValueDec}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">生产订单：{{item.production_id | findValueDec}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">检验项：{{item.title}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">检验值：{{item.measure}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">检验人员：{{item.write_uid | findValueDec}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">检验日期：{{$mHelper.dateToUTC(item.write_date) || ''}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">状态：<u-tag
												:text="item.quality_state | stateInfoFilter('value', stateList)"
												:type="item.quality_state | stateInfoFilter('type', stateList)"
												size="mini" />
										</span>
									</view>
								</view>
							</template>
						</v-list>
					</template>
				</view>
			</view>
		</view>
		<u-popup v-model="showDetail" mode="bottom" height="70%" closeable>
			<view class="pop-head">
				检验详情
			</view>
			<scroll-view scroll-y="true">
				<u-field v-model="detailInfo.product_id" label="产品" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.lot_id" label="批次/序列号" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.production_id" label="生产订单" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.title" label="检验项" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.measure" label="检验值" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.measure_tool" label="检验工具" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.user_id" label="检验人员" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.write_date" label="检查日期" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.quality_state" label="状态" disabled label-width="230"></u-field>
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters,
	} from 'vuex';
	import VList from '@/components/v-list/index.vue';
	import pageList from '@/components/page-list/index.vue'
	import userDropdown from '@/namesearch/user-dropdown/index.vue';
	export default {
		components: {
			VList,
			pageList,
			userDropdown
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				scrollTop: 0,
				listLoading: false,
				showDetail: false,
				timer: null,
				detailInfo: {},
				productionList: [],
				searchList: [],
				search_word: '',
				filterInfo: {
					state: null,
					user_id: null,
				},
				stateList: [{
					label: '全部',
					value: null
				}, {
					label: '待处理',
					value: 'none'
				}, {
					label: '通过的',
					value: 'pass'
				}, {
					label: '失败的',
					value: 'fail'
				}, ],
			}
		},
		computed: {
			stateActiveTitle() {
				return this.stateList.find(item => this.filterInfo.state != null && item.value === this.filterInfo.state)
					?.label ?? ''
			},
			search_list() {
				this.listLoading = true;
				if (this.timer) {
					this.timer = null;
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					this.listLoading = false;
				}, 300)
				return this.searchList.filter(item => {
					return (
						(!this.filterInfo.user_id || item.write_uid[0] === this.filterInfo.user_id)
					);
				});
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			stateInfoFilter(state, type, stateList) {
				let info = {
					value: stateList.find(item => item.value === state)?.label,
					type: '',
				};
				switch (state) {
					case 'none':
						info.type = 'warning';
						break;
					case 'pass':
						info.type = 'success';
						break;
					case 'fail':
						info.type = 'error';
						break;
				}
				return type === 'type' ? info.type : info.value;
			}
		},
		methods: {
			initData() {
				this.getList();
			},
			refresh() {
				// this.filterInfo = {
				// 	state: null,
				// 	user_id: null,
				// }
				this.listLoading = true;
				this.getList();
			},
			// 刷新回调
			refCallBack() {
				uni.stopPullDownRefresh();
			},
			findStateName(state) {
				return this.stateList.find(item => item.value === state)?.label
			},
			findName(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			async getList() {
				let vListRef = this.$refs?.vListRef;
				if (vListRef) vListRef.loadmore = 'loading'
				this.listLoading = true;
				const Model = api.env.model('quality.check');
				let domain = [];
				if (this.filterInfo.state) {
					domain = [
						...domain,
						['quality_state', '=', this.filterInfo.state]
					]
				}
				const res = await Model.search_read({
					order: "name DESC",
					domain,
					fields: []
				})
				if (res) {
					this.productionList = res.length ? [...res] : [];
					this.searchList = this.search_word ?
						this.productionList.filter(item =>
							item.lot_id && typeof item.lot_id[1] === 'string' &&
							item.lot_id[1].toLowerCase().includes(this.search_word.toLowerCase())) : [...this
							.productionList
						];
				} else {
					if (vListRef) vListRef.loadmore = 'loadmore'
					if (vListRef) vListRef.loadText.loadmore = '加载失败，点击重试'
				}
				this.listLoading = false;
				this.refCallBack();
			},
			getDetail(id) {
				const Model = api.env.model('quality.check');
				Model.read(id).then((res) => {
					if (res?.length > 0) {
						let res_info = res[0] || {};
						this.detailInfo = {
							product_id: this.findName(res_info.product_id),
							lot_id: this.findName(res_info.lot_id),
							production_id: this.findName(res_info.production_id),
							user_id: this.findName(res_info.write_uid),
							write_date: res_info.write_date || '',
							quality_state: this.findStateName(res_info.quality_state),
							title: res_info.title,
							measure: res_info.measure,
							measure_tool: this.findName(res_info.measure_tool)
						};
					}
				})
			},
			paginationReset() {
				if (this.$refs.pageListRef)
					this.$refs.pageListRef.isReset = true;
			},
			// 搜索使用节流
			searchChange(isReset) {
				isReset && this.paginationReset();
				this.$u.throttle(() => {
					this.searchList = this.search_word ?
						this.productionList.filter(item =>
							item.lot_id && typeof item.lot_id[1] === 'string' &&
							item.lot_id[1].toLowerCase().includes(this.search_word.toLowerCase())) :
						this.productionList
				}, 500)
			},
			// 扫码
			scanClick() {
				uni.scanCode({
					success: (res) => {
						if (res.result) {
							this.search_word = res.result;
							this.searchChange(true);
						}
					},
					fail: (err) => {
						this.$refs.uToast.show({
							title: JSON.stringify(err),
							type: 'error',
						})
					}
				});
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			stateSelect(value) {
				this.paginationReset();
				this.getList();
			},
			// 人员筛选
			userSelect(res) {
				this.paginationReset();
				this.filterInfo.user_id = res?.length > 0 ? res[0] : '';
				// this.getList();
				this.closeDropdown();
			},
			// 人员选择取消
			userSelectClose() {
				this.closeDropdown();
			},
			toDetail(item) {
				this.getDetail(item.id);
				this.showDetail = true;
				// const params = encodeURIComponent(JSON.stringify(item));
				// uni.navigateTo({
				// 	url: ''
				// })
			},
		},
		onLoad() {
			this.initData()
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onReachBottom() {
			this.$refs.vListRef?.getData();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
	}
</script>

<style lang="scss" scoped>
	.check_record-page {

		.u-size-mini {
			font-size: 24rpx;
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

		.clog-container {
			padding: 40rpx;
			height: 800rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.production-container {
			// display: flex;
			// flex-wrap: wrap;

			.page-content {
				// flex: 1;

				.list-container {
					background-color: #f5f5f5;
					padding: 20rpx;
					padding-top: 200rpx;
					max-height: 100%;
				}
			}

			.search-sticky {
				width: 100%;
				background-color: #fff;
				padding-top: 20rpx;
				border-bottom: 1px solid rgba(0, 0, 0, .1);
				position: fixed;
				z-index: 99;

				.search-container {
					position: relative;
					height: 80rpx;
					margin: 0 30rpx;

					.search-scan {
						position: absolute;
						left: 0;
						top: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						width: 200rpx;
						height: 100%;
						text-align: center;
						border-right: 1px solid $uni-color-primary;
						font-size: 34rpx;
						color: $uni-color-primary;

						/deep/ .u-icon__label {
							font-size: 36rpx !important;
							color: $uni-color-primary !important;
						}
					}
				}

				.search-sign {

					// #ifdef APP-PLUS
					/deep/ .u-content {
						padding-left: 240rpx;
					}

					// #endif

					/deep/ .u-icon__icon {
						font-size: 40rpx !important;
						padding-right: 10rpx;
					}

					/deep/ .u-input {
						font-size: 32rpx;
					}
				}
			}

			.filter-container {
				background-color: #fff;

				.slot-content {
					background-color: #fff;
					padding: 16rpx;

					.item-box {
						margin-bottom: 36rpx;
						display: flex;
						flex-wrap: wrap;

						.item {
							border: 1px solid #ccc;
							color: #666;
							padding: 8rpx 28rpx;
							border-radius: 72rpx;
							margin: 20rpx 10rpx 0;

							&.active {
								color: #fff;
								background-color: $uni-color-primary;
								border-color: $uni-color-primary;
							}
						}
					}
				}

				.option-btn {
					display: flex;
					background-color: #fff;

					.btn {
						flex: 1;
						border-radius: 0;

						&::after {
							border-radius: 0;
							border: none;
							border-top: 1px solid $border-color-base;
						}

						&:last-child {
							&::after {
								border-left: 1px solid;
								border-color: $uni-color-primary;
							}
						}
					}
				}
			}
		}
	}
</style>