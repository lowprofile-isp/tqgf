<template>
	<view class="production-page">
		<u-mask :show="fullLoading">
			<view style="display: flex;justify-content: center;align-items: center;height: 100%;">
				<u-loading size="60" />
			</view>
		</u-mask>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" top="600" tips="顶部" :duration="200" :icon-style="iconStyle"
			:custom-style="{backgroundColor: $mStore.getters.themeColor.color, color: '#fff'}"></u-back-top>
		<view class="production-container">
			<view class="page-content">
				<view class="search-sticky">
					<!-- 搜索栏 -->
					<view class="search-container">
						<template v-if="$mStore.state.isPad">
							<u-search ref="search_sign" class="search-sign" placeholder="请扫描或输入批次/序列号"
								v-model="search_word" height="80"
								:bg-color="$mStore.state.themeColor.dark ? '#fff' : '#fff'"
								:border-color="$mStore.state.themeColor.dark ? 'transparent' : $mStore.getters.themeColor.color"
								action-text="查询" search-icon="" :show-action="false" @change="searchChange(true)">
							</u-search>
							<view class="search-scan" @tap="scanClick"><u-icon size="44" name="scan"
									margin-right="10rpx" label="扫码"></u-icon></view>
						</template>
						<template v-else>
							<u-search ref="search_sign" class="search-sign phone" placeholder="请扫描或输入批次/序列号"
								v-model="search_word" height="70"
								:bg-color="$mStore.state.themeColor.dark ? '#fff' : '#fff'"
								:border-color="$mStore.state.themeColor.dark ? 'transparent' : $mStore.getters.themeColor.color"
								action-text="查询" search-icon="" :show-action="false" @change="searchChange(true)">
							</u-search>
						</template>
					</view>
					<u-dropdown ref="uDropdown" class="filter-container"
						:class="[filterInfo.workcenter_id ? 'd-active-1' : '', filterInfo.loss_id ? 'd-active-2' : '', filterInfo.user_id ? 'd-active-3' : '']"
						inactive-color="#333">
						<u-dropdown-item :title="workcenterTitle || '工序'">
							<view class="slot-content" style="background-color: #FFFFFF;">
								<scroll-view scroll-y="true" style="max-height: 60vh">
									<u-cell-item v-for="(w, w_index) in workcenter_list" :key="w_index" :title="w.label"
										:arrow="false"
										:title-style="{color: w.value === filterInfo.workcenter_id ? $mStore.getters.themeColor.color : ''}"
										@click="stateSelect(w.value, 'workcenter_id')">
										<u-icon v-if="w.value === filterInfo.workcenter_id" slot="right-icon"
											:color="$mStore.getters.themeColor.color" size="32"
											name="checkbox-mark"></u-icon>
									</u-cell-item>
								</scroll-view>
							</view>
						</u-dropdown-item>
						<u-dropdown-item :title="lossTitle || '损失原因'">
							<view class="slot-content" style="background-color: #FFFFFF;">
								<scroll-view scroll-y="true" style="max-height: 60vh">
									<u-cell-item v-for="(l, l_index) in loss_list" :key="l_index" :title="l.label"
										:arrow="false"
										:title-style="{color: l.value === filterInfo.loss_id ? $mStore.getters.themeColor.color : ''}"
										@click="stateSelect(l.value, 'loss_id')">
										<u-icon v-if="l.value === filterInfo.loss_id" slot="right-icon"
											:color="$mStore.getters.themeColor.color" size="32"
											name="checkbox-mark"></u-icon>
									</u-cell-item>
								</scroll-view>
							</view>
						</u-dropdown-item>
						<user-dropdown :value="filterInfo.user_id" @confirm="userSelect"
							@close="userSelectClose"></user-dropdown>
					</u-dropdown>
				</view>
				<empty text="暂无数据" v-if="!listLoading && search_list.length <= 0"></empty>
				<view class="list-container" v-else>
					<!-- 列表 -->
					<page-list ref="pageListRef" v-if="$mStore.state.isPad" :loading="listLoading"
						:table-data="search_list" columnKey="reportedwork_record" @itemClick="toDetail">
						<template v-slot:listItem="{item}">
							<uni-td>{{ item.finished_lot_id | findValueDec }}</uni-td>
							<uni-td>{{ $mHelper.dateToUTC(item.date_start) || '--' }}</uni-td>
							<uni-td>{{ $mHelper.dateToUTC(item.date_end) || '--' }}</uni-td>
							<uni-td>{{ item.workcenter_id | findValueDec }}</uni-td>
							<uni-td>{{ findLossName(item.loss_id) }}</uni-td>
							<uni-td>{{ item.employee_id | findValueDec }}</uni-td>
							<uni-td>{{ item.duration.toFixed(2) }}</uni-td>
						</template>
					</page-list>
					<template v-else>
						<v-list ref="vListRef" :list-data="search_list" :loading="listLoading" :buffer="2000"
							:itemHeight="200" @loadmore="getList()" @itemClick="toDetail">
							<template v-slot:listItem="{item}">
								<view class="list-item-cell">
									<view class="cell-header">
										<span
											class="list-item-cell-text title">批次/序列号：{{item.finished_lot_id | findValueDec}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">开始时间：{{$mHelper.dateToUTC(item.date_start) || '--'}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">结束时间：{{$mHelper.dateToUTC(item.date_end) || '--'}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">工作中心：{{item.workcenter_id | findValueDec}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">损失原因：{{findLossName(item.loss_id)}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">用户：{{item.employee_id | findValueDec}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">时长（分钟）：{{item.duration.toFixed(2)}}</span>
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
				报工详情
			</view>
			<scroll-view scroll-y="true">
				<u-field v-model="detailInfo.production_name" label="制造订单" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.name" label="工单" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.workcenter_name" label="工作中心" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.date_start || ''" label="开始日期" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.date_finished || ''" label="结束日期" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.duration_expected" label="时长（分钟）" disabled label-width="230"></u-field>
				<u-field v-model="detailInfo.company_name" label="公司" disabled label-width="230"></u-field>
				<!-- <u-field v-model="detailInfo.d" label="时间跟踪" disabled label-width="200"></u-field> -->
			</scroll-view>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import {
		mrp_loss_list
	} from '@/config/map.data.js';
	import VList from '@/components/v-list/index.vue';
	import pageList from '@/components/page-list/index.vue';
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
				fullLoading: false,
				listLoading: false,
				showDetail: false,
				detailInfo: {},
				timer: null,
				search_word: '',
				productionList: [],
				searchList: [],
				filterInfo: {
					loss_id: null,
					workcenter_id: null,
					user_id: null,
				},
				workcenter_list: [{
					label: '全部',
					value: null
				}],
				loss_list: [{
					label: '全部',
					value: null,
					extra: null
				}, ...mrp_loss_list],
			}
		},
		computed: {
			workcenterTitle() {
				return this.workcenter_list.find(item => this.filterInfo.workcenter_id != null && item.value === this
					.filterInfo.workcenter_id)?.label ?? ''
			},
			lossTitle() {
				return this.loss_list.find(item => this.filterInfo.loss_id != null && item.value === this
					.filterInfo.loss_id)?.label ?? ''
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
						(!this.filterInfo.loss_id || item.loss_id[1] === this.filterInfo.loss_id) &&
						(!this.filterInfo.workcenter_id || item.workcenter_id[0] === this.filterInfo
							.workcenter_id)
						// &&(!this.filterInfo.user_id || item.user_id[0] === this.filterInfo.user_id)
					);
				});
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			stateInfoFilter(state, type, stateList) {
				let findItem = stateList.find(item => item.value === state);
				let state_info = {
					label: findItem?.label || '--',
					type: findItem?.type || '--'
				}
				return type === 'state' ? state_info.label : state_info.type;
			}
		},
		methods: {
			initData() {
				this.getWorkcenterList();
				this.getList();
			},
			refresh() {
				// this.filterInfo = {
				// 	loss_id: null,
				// 	workcenter_id: null,
				// 	user_id: null,
				// }
				this.getList();
			},
			// 刷新回调
			refCallBack() {
				uni.stopPullDownRefresh();
			},
			findLossName(loss_id) {
				if (loss_id?.length > 0)
					return mrp_loss_list.find(item => item.value === loss_id[1])?.label ?? ''
				return ''
			},
			findName(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			async getWorkcenterList() {
				const Model = api.env.model('mrp.workcenter')
				Model.search_read().then((res) => {
					if (res?.length > 0) {
						this.workcenter_list = this.workcenter_list.concat(res.map((item) => {
							return {
								label: item.name,
								value: item.id
							}
						}))
					}
				})
			},
			async getList() {
				let vListRef = this.$refs?.vListRef;
				if (vListRef) vListRef.loadmore = 'loading';
				this.listLoading = true;
				const Model = api.env.model('mrp.workcenter.productivity');
				let domain = [];
				if (this.filterInfo.user_id) {
					domain = [
						...domain,
						['employee_id', 'in', [this.filterInfo.user_id]]
					]
				}
				const res = await Model.search_read({
					order: "date_start DESC",
					domain,
					fields: []
				})
				if (res) {
					this.productionList = res.length ? [...res] : [];
					this.searchList = this.search_word ?
						this.productionList.filter(item =>
							item.finished_lot_id && typeof item.finished_lot_id[1] === 'string' &&
							item.finished_lot_id[1].toLowerCase().includes(this.search_word.toLowerCase())) : [...this
							.productionList
						]
				} else {
					if (vListRef) vListRef.loadmore = 'loadmore'
					if (vListRef) vListRef.loadText.loadmore = '加载失败，点击重试'
				}
				this.listLoading = false;
				this.refCallBack();
			},
			getDetail(id) {
				const Model = api.env.model('mrp.workorder');
				Model.search_read({
					domain: [
						['id', '=', id]
					]
				}).then((res) => {
					if (res?.length > 0) {
						let res_info = res[0] || {};
						this.detailInfo = {
							name: res_info.name,
							production_name: this.findName(res_info.production_id),
							workcenter_name: this.findName(res_info.workcenter_id),
							date_start: res_info.date_start,
							date_finished: res_info.date_finished,
							duration_expected: res_info.duration_expected,
							company_name: this.findName(res_info.company_id)
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
							item.finished_lot_id && typeof item.finished_lot_id[1] === 'string' &&
							item.finished_lot_id[1].toLowerCase().includes(this.search_word.toLowerCase())) :
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
			stateSelect(value, key) {
				this.filterInfo[key] = value;
				this.$refs.uDropdown.close();
				this.paginationReset();
				this.getList();
			},
			// 人员筛选
			userSelect(res) {
				this.paginationReset();
				this.filterInfo.user_id = res;
				this.getList();
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
		onReady() {
			// 设置导航条
			uni.setNavigationBarColor(this.$mStore.getters.theme.navBar);
			// 设置tabbar
			uni.setTabBarStyle(this.$mStore.getters.theme.tabBar);
		},
		onLoad() {
			this.initData();
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
	.production-page {
		min-height: 100vh;

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
					/deep/ .u-content {
						// padding-left: 240rpx;
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