<template>
	<view class="production-page">
		<u-top-tips ref="uTips" :navbar-height="navBarHeight"></u-top-tips>
		<u-mask :show="false">
			<view style="display: flex;justify-content: center;align-items: center;height: 100%;">
				<u-loading size="40" :color="$mStore.state.themeColor.color" /><text
					:style="{marginLeft: '20rpx', color: $mStore.state.themeColor.color}">加载中...</text>
			</view>
		</u-mask>
		<u-navbar :is-back="true" back-icon-color="#fff" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<!-- <view slot="right" class="slot-right-wrap">
				<user-name-sign></user-name-sign>
			</view> -->
		</u-navbar>
		<!-- 返回顶部 -->
		<!-- <u-back-top :scroll-top="scrollTop" top="600" tips="顶部" :duration="200" :icon-style="iconStyle"
			:custom-style="{backgroundColor: $mStore.getters.themeColor.color, color: '#fff'}"></u-back-top> -->
		<!-- <empty text="尚未开放" mode="permission" :margin-top="300"></empty> -->
		<view class="production-container">
			<view class="page-content">
				<view class="search-sticky" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<custom-search ref="customSearch" style="margin-bottom: 0;" v-model="search_word" is-filter
						:filter-acitve="filterAcitve" placeholder="生产单号/批号" @searchChange="() => searchChange(true)"
						@scanClick="scanClick" @filterConfirm="filterConfirm" @filterReset="filterReset">
						<template v-slot:filter>
							<view class="filter-item">
								<view class="head">质检结果</view>
								<view class="content">
									<u-button v-for="(c, c_index) in checkResultList" :key="c_index"
										:type="c.value === filterInfo.check_result ? 'primary' : ''" size="mini"
										@click="stateSelect(c.value, 'check_result')">{{c.label}}</u-button>
								</view>
							</view>
						</template>
					</custom-search>
					<v-tabs ref="vTabs" :value="activeTab" :tabs="tabList" paddingItem="0 30rpx" height="80rpx"
						active-color="#6190e8" line-color="#6190e8" :lineScale="0.7" lineRadius="0" lineHeight="0rpx"
						:zIndex="98" @change="changeTab"></v-tabs>
				</view>
				<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
				<view class="list-container" v-else>
					<!-- 列表 -->
					<page-list ref="pageListRef" v-if="isPad" :loading="listLoading" fixed-pagination options :table-data="searchList"
						columnKey="repair" @itemClick="toDetail">
						<template v-slot:listItem="{item}">
							<uni-td>{{ (item.product_id.length > 1 ? item.product_id[1] : item.product_name) || '--' }}</uni-td>
							<uni-td>{{ item.complete_lot_num || '--' }}</uni-td>
							<uni-td>{{ item.size || '--' }}</uni-td>
							<uni-td>{{ item.tech_note || '' }}</uni-td>
							<uni-td align="center">
								<u-button size="mini" type="primary" plain @click.stop="noteClick(item)">
									<u-icon name="eye"></u-icon>查看
								</u-button>
							</uni-td>
							<uni-td align="center" class="list-item-cell-text"
								:class="item.repair_state | repairStateFilter('type')">
								<view>
									{{item.repair_state | repairStateFilter('state')}}
								</view>
							</uni-td>
							<uni-td align="center"><u-tag :text="item.check_result || ''"
									:type="item.check_result | checkResultFilter" /></uni-td>
						</template>
						<template v-slot:options="{item}">
							<u-button class="option-btn" v-for="(menu, index) in renderOptionMenu(item, menu_list)"
								:key="menu.value" size="mini" :type="menu.type"
								:loading="rowItem.id === item.id && optionBtnIndex === index && btnLoading"
								:disabled="menu.disabled"
								@click.stop="menuChange(menu, item, index)">{{menu.label}}</u-button>
						</template>
					</page-list>
					<page-list v-else ref="pageListRef" :loading="listLoading" fixed-pagination options :table-data="searchList"
						columnKey="repair" @itemClick="toDetail">
						<template v-slot:listItem="{item}">
							<view class="list-item-cell">
								<view>
									<span
										class="list-item-cell-text">产品：{{(item.product_id.length > 1 ? item.product_id[1] : item.product_name) || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">批次/序列号：{{item.complete_lot_num || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">产品规格：{{item.size || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">返修原因/说明：{{item.tech_note || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">返修备注：<u-button style="margin-left: 0;" size="mini"
											type="primary" plain @click.stop="noteClick(item)">
											<u-icon name="eye"></u-icon>查看
										</u-button>
									</span>
								</view>
								<view>
									<span class="list-item-cell-text">返修状态：<u-tag :text="item.repair_state || ''"
											style="padding: 10rpx 12rpx; font-size: 24rpx;"
											:type="item.repair_state | repairStateFilter" mode="dark"
											size="mini" /></span>
								</view>
								<view>
									<span class="list-item-cell-text">质检结果：<u-tag :text="item.check_result || ''"
											style="padding: 10rpx 12rpx; font-size: 24rpx;"
											:type="item.check_result | checkResultFilter" mode="dark"
											size="mini" /></span>
								</view>
							</view>
						</template>
						<template v-slot:options="{item}">
							<u-button class="option-btn" v-for="(menu, index) in renderOptionMenu(item, menu_list)"
								:key="menu.value" size="mini" :type="menu.type"
								:loading="rowItem.id === item.id && optionBtnIndex === index && btnLoading"
								:disabled="menu.disabled"
								@click.stop="menuChange(menu, item, index)">{{menu.label}}</u-button>
						</template>
					</page-list>
					<clog-popup v-model="clogShow" :rowItem="rowItem" @confirm="clogConfirm"></clog-popup>
					<repair-popup v-model="repairShow" :rowItem="rowItem" @confirm="repairConfirm"></repair-popup>
					<production-note-popup v-model="productionNoteShow" :rowItem="rowItem"></production-note-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import VList from '@/components/v-list/index.vue';
	import userDropdown from '@/namesearch/user-dropdown/index.vue';
	import userNameSign from '@/components/user-name/index.vue';
	import customUpload from '@/components/custom-upload/index.vue';
	import pageList from '@/components/page-list/index.vue';
	import customSearch from '@/components/custom-search/index.vue';
	import clogPopup from './clogPopup.vue';
	import repairPopup from './repairPopup.vue';
	import productionNotePopup from './productionNotePopup.vue';
	import {
		repair_menu_list
	} from './data.js';
	import {
		renderOptionMenu
	} from './utils.js';
	import {
		check_state_list,
		repair_state_list
	} from '../data.js';
	export default {
		components: {
			VList,
			pageList,
			userDropdown,
			userNameSign,
			customUpload,
			clogPopup,
			repairPopup,
			productionNotePopup,
			customSearch
		},
		data() {
			return {
				scrollTop: 0,
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '返修工单',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: this.$mStore.getters.theme.navBar.backgroundColor,
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				fullLoading: false,
				listLoading: false,
				btnLoading: false,
				optionBtnIndex: null,
				search_word: '',
				productionList: [],
				filterInfo: {
					state: null,
					check_result: null,
					repair_state: 'to_be_repaired',
				},
				clogShow: false,
				repairShow: false,
				productionNoteShow: false,
				rowItem: {},
				menu_list: repair_menu_list,
				stateList: [{
						label: '全部',
						value: null
					},
					{
						label: '准备就绪',
						value: 'ready',
						type: 'primary'
					},
					{
						label: '进行中',
						value: 'progress',
						type: 'warning'
					},
					{
						label: '已完成',
						value: 'done',
						type: 'success'
					},
					// {
					// 	label: '待定',
					// 	value: 'pending',
					// 	type: 'error'
					// },
				],
				checkResultList: check_state_list,
				repairStateList: repair_state_list.filter(r => r.value != 'none'),
				searchList: [],
				repairCount: 0
			}
		},
		computed: {
			...mapGetters(['isPad', 'navBarHeight']),
			stateActiveTitle() {
				let result = this.stateList.find(item => item.value === this.filterInfo.state)
				return !result?.value ? '' : result?.label
			},
			checkStateActiveTitle() {
				let result = this.checkResultList.find(item => item.value === this.filterInfo.check_result)
				return !result?.value ? '' : result?.label
			},
			repairStateActiveTitle() {
				let result = this.repairStateList.find(item => item.value === this.filterInfo.repair_state)
				return !result?.value ? '' : result?.label
			},
			tabList() {
				return this.repairStateList.map(state => state.label)
			},
			activeTab() {
				return this.repairStateList.findIndex(state => state.value == this.filterInfo.repair_state)
			},
			filterAcitve() {
				return !!this.filterInfo.check_result
			}
		},
		filters: {
			checkResultFilter(value) {
				let type = '';
				switch (value) {
					case '合格':
						type = 'success';
						break;
					case '隔离':
						type = 'error';
						break;
					case '待检验':
					case '让步放行':
						type = 'primary';
						break;
					case '技术判定':
						type = 'warning';
						break;
					case '返修中':
						type = 'info';
						break;
					default:
						type = 'info';
				}
				return type;
			},
			repairStateFilter(value, type) {
				let state_info = {
					state: '',
					type: ''
				}
				switch (value) {
					case 'none':
					case '正常':
						state_info.type = '';
						state_info.state = '正常';
						break;
					case 'to_be_repaired':
					case '待修理':
						state_info.type = 'warning';
						state_info.state = '待修理';
						break;
					case 'repaired':
					case '已修理':
						state_info.type = 'primary';
						state_info.state = '已修理';
						break;
				}
				return type === 'state' ? state_info.state : state_info.type;
			},
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			findEmployeeName(val, store) {
				return val?.length > 0 ? store.state.user.employeeList.find(em => em.id === val[0])?.name || '--' : '--'
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
			async pageShow() {
				// await this.$mStore.dispatch('user/getEmployeeList');
				this.getList();
			},
			async initData() {
				this.listLoading = true;
				await this.$mStore.dispatch('user/getEmployeeList');
				this.getList();
			},
			refresh(id, type) {
				// this.filterInfo = {
				// 	user: null,
				// 	state: 'ready',
				// }
				this.getList(id, type);
			},
			async getList(id, type) {
				let vListRef = this.$refs?.vListRef;
				if (vListRef) vListRef.loadmore = 'loading';
				this.listLoading = true;
				const Model = api.env.model('mrp.production');
				let domain = [
					['to_check_state', '=', 'final_check']
				];
				if (!this.filterInfo.repair_state) {
					domain = [
						...domain,
						['repair_state', '!=', 'none']
					];
				} else {
					domain = [
						...domain,
						['repair_state', '=', this.filterInfo.repair_state]
					];
				}
				if (this.filterInfo.check_result) {
					domain = [
						...domain,
						['check_result', '=', this.filterInfo.check_result]
					]
				}
				if (id) {
					domain = [
						...domain,
						['id', 'in', id],
					]
				}
				const res = await Model.search_read({
					order: "write_date DESC",
					domain: [
						...domain,
					],
					fields: [
						"batch_code", "date_start", "bom_id", "categ_id", "check_ids", "check_result",
						"company_id",
						"complete_lot_num",
						"display_name", "id", "gf_qty", "lot_producing_id", "origin",
						"product_id", "product_name", "product_code", "product_qty", "size",
						"product_tracking",
						"serial_num",
						"task_qty", "tracking", "state", "to_check_state", "repair_state", "tech_note",
						"write_date"
					]
				})
				uni.stopPullDownRefresh();
				if (res) {
					this.productionList = res.length ? [...res] : [];
					this.searchList = this.search_word ? this.productionList.filter(item =>
						typeof item.complete_lot_num === 'string' &&
						item.complete_lot_num.toLowerCase().includes(this.search_word.toLowerCase())) : [...this
						.productionList
					]
				} else {
					if (vListRef) vListRef.loadmore = 'loadmore'
					if (vListRef) vListRef.loadText.loadmore = '加载失败，点击重试'
				}
				this.listLoading = false;
				this.fullLoading = false;
			},
			getRepairCount() {
				const Model = api.env.model('mrp.production');
				let domain = [
					['to_check_state', '=', 'final_check'],
					['repair_state', '=', 'to_be_repaired']
				];
				const res = Model.search_read({
					order: "origin DESC",
					domain: [
						...domain,
					],
					fields: [
						"check_result", "repair_state", "tech_note"
					]
				}).then((res) => {
					if (res?.length > 0) {
						this.repairCount = res.length;
					}
				})
			},
			renderOptionMenu(listItem, prevList) {
				return renderOptionMenu(listItem, prevList, true);
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			stateSelect(value, key) {
				this.filterInfo[key] = value;
				// this.closeDropdown();
				this.$refs.customSearch.filterShow = false;
				this.filterConfirm();
			},
			filterConfirm() {
				this.paginationReset();
				this.getList();
			},
			filterReset() {
				this.filterInfo = {
					...this.filterInfo,
					check_result: null
				}
				this.paginationReset();
				this.getList();
			},
			changeTab(index) {
				this.filterInfo.repair_state = this.repairStateList[index].value;
				this.paginationReset();
				this.getList();
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
							typeof item.complete_lot_num === 'string' &&
							item.complete_lot_num.toLowerCase().includes(this.search_word.toLowerCase())) :
						this.productionList
				}, 500)
			},
			// 扫码
			scanClick() {
				// #ifdef H5
				this.search_word = 'TQGF-XS-2024-DD-0127-009/CM32DLA-Y01-24-0128-001'
				let ids = this.productionList.filter((item) => item.finished_lot_id[1] ===
					this.search_word).map(p => p.id);
				if (ids) {
					this.fullLoading = true;
					this.paginationReset();
					this.refresh(ids, 'scan');
				} else {
					this.$refs.uTips.show({
						title: '未找到匹配项',
						type: 'warning',
						duration: '2000'
					})
				}
				// #endif
				// 扫码跳转
				uni.scanCode({
					success: (res) => {
						// 携带参数跳转
						this.search_word = res.result || '';
						let ids = this.productionList.filter((item) => item.finished_lot_id[1] ===
							this.search_word).map(p => p.id);
						if (ids) {
							this.fullLoading = true;
							this.refresh(ids, 'scan');
						} else {
							this.$refs.uTips.show({
								title: '未找到匹配项',
								type: 'warning',
								duration: '2000'
							})
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
			noteClick(row) {
				this.rowItem = row;
				this.productionNoteShow = true;
			},
			toDetail(item) {
				// uni.navigateTo({
				// 	url: `/pages/tqgf/application/production/detail?id=${item.id}&production_id=${item.id}`
				// })
			},
			menuChange(menu, row, index, isAuto) {
				this.rowItem = row;
				this.optionBtnIndex = index;
				if (menu.value === 'production_done') return
				if (menu.value === 'button_block') {
					this.clogShow = true;
					return
				}
				if (menu.value === 'button_accept') {
					if (isAuto) {
						this.callButton(menu.value, row);
					} else {
						uni.showModal({
							title: '提示',
							content: '是否接收？',
							success: (res) => {
								if (res.confirm) {
									this.callButton(menu.value, row);
								}
							}
						});
					}
					return;
				}
				if (menu.value === 'button_start') {
					uni.showModal({
						title: '提示',
						content: '是否开工？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_finish') {
					uni.showModal({
						title: '提示',
						content: '是否完工？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_recheck') {
					uni.showModal({
						title: '提示',
						content: '是否完工送检？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'do_repaired') {
					this.repairShow = true;
					// uni.showModal({
					// 	title: '提示',
					// 	content: '是否完成返修？',
					// 	success: (res) => {
					// 		if (res.confirm) {
					// 			this.callButton(menu.value, row);
					// 		}
					// 	}
					// });
					return;
				}
				if (menu.value === 'button_unblock') {
					uni.showModal({
						title: '提示',
						content: '是否解除阻塞？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_continue') {
					this.callButton('button_start', row);
					return;
				}
				this.callButton(menu.value, row);
			},
			async callButton(buttonType, row) {
				this.btnLoading = true;
				const Model = buttonType === 'button_recheck' || buttonType === 'do_repaired' ? api.env.model(
					'mrp.production') : api.env.model(
					'mrp.workorder');
				const id = buttonType === 'button_mark_done' ? row.production_id[0] : row.id;
				try {
					let res = await Model.call_button(buttonType, [id]);
					if (res === false) {
						if (buttonType === 'button_finish') {
							uni.showToast({
								title: '已完工',
								icon: 'success'
							})
						} else if (buttonType === 'button_recheck') {
							// this.$refs.uTips.show({
							// 	title: '已送检',
							// 	type: 'primary',
							// 	duration: '1500'
							// })
							uni.showToast({
								title: '已送检',
								icon: 'success'
							})
						}
						this.refresh();
					}
				} catch (e) {}
				this.btnLoading = false;
			},
			clogConfirm() {
				this.refresh();
			},
			repairConfirm() {
				this.refresh();
			},
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		created() {
			this.initData();
		},
		onUnload() {
			this.$mStore.dispatch('tabbar/clear_timer')
		}
	}
</script>

<style lang="scss" scoped>
	.production-page {
		// min-height: 100vh;

		.search-sticky {
			width: 100%;
			background-color: #fff;
			padding-top: 20rpx;
			border-bottom: 1px solid rgba(0, 0, 0, .1);
			position: fixed;
			z-index: 99;

			&.dark {
				background-color: $uni-bg-dark-light;
			}

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

				&.phone {
					/deep/ .u-content {
						padding-left: 18rpx;
					}
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

			.filter-container {
				background-color: #fff;

				&.dark {
					background-color: $uni-bg-dark-light;
				}
			}
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