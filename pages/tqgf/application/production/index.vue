<template>
	<view class="production-page">
		<u-top-tips ref="uTips" :navbar-height="navBarHeight"></u-top-tips>
		<u-mask :show="false">
			<view style="display: flex;justify-content: center;align-items: center;height: 100%;">
				<u-loading size="40" :color="$mStore.state.themeColor.color" /><text
					:style="{marginLeft: '20rpx', color: $mStore.state.themeColor.color}">加载中...</text>
			</view>
		</u-mask>
		<u-navbar :is-back="false" :title="navStyles.navTitle" :background="{background: navStyles.navBarBg}"
			:title-color="navStyles.textColor" :title-size="navStyles.navBarFontSize">
			<!-- <view class="slot-wrap">
				<view class="left-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" :count="msgCount" :offset="[-8, -8]"></u-badge>
				</view>
			</view> -->
			<view slot="right" class="slot-wrap">
				<view class="right-item">
					<u-button :style="{padding: isPad ? '0 40rpx' : '0 20rpx'}" type="primary"
						:size="isPad ? 'medium' : 'mini'" plain @click="toRepair">维修工单</u-button>
					<u-badge type="error" :count="repairCount" :size="isPad ? '' : 'mini'" :offset="[-8, 14]"></u-badge>
					<!-- <u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon> -->
				</view>
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view> -->
				<!-- <user-name-sign></user-name-sign> -->
				<!-- <view class="right-item" @click="() => refresh()">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view> -->
				<!-- <user-name-sign></user-name-sign> -->
				<!-- <view class="right-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" count="7" :offset="[-8, 14]"></u-badge>
				</view> -->
			</view>
		</u-navbar>
		<!-- 悬浮扫码 -->
		<view v-if="isPad" style="bottom: 410rpx;" class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- 返回顶部 -->
		<u-back-top :scroll-top="scrollTop" top="600" bottom="300rpx" tips="顶部" :duration="200" :icon-style="iconStyle"
			:custom-style="{backgroundColor: $mStore.getters.themeColor.color, color: '#fff'}"></u-back-top>
		<!-- <empty text="尚未开放" mode="permission" :margin-top="300"></empty> -->
		<view class="production-container">
			<view class="page-content">
				<view class="search-sticky" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
					<!-- 搜索栏 -->
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

						<!-- <view class="filter-item">
							<view class="head">质检结果</view>
							<view class="content">
								<u-dropdown ref="uDropdown" :class="[filterInfo.check_result ? 'active' : '']"
									:active-color="$mStore.state.themeColor.color"
									:inactive-color="$mStore.state.themeColor.dark ? '#fff' : '#333'">
									<u-dropdown-item :title="checkStateActiveTitle || '全部'">
										<view class="slot-content" style="background-color: #FFFFFF;">
											<scroll-view scroll-y="true" style="max-height: 60vh">
												<u-cell-item v-for="(c, c_index) in checkResultList" :key="c_index"
													:title="c.label" :arrow="false"
													:title-style="{color: c.value === filterInfo.check_result ? $mStore.getters.themeColor.color : ''}"
													@click="stateSelect(c.value, 'check_result')">
													<u-icon v-if="c.value === filterInfo.check_result" slot="right-icon"
														:color="$mStore.getters.themeColor.color" size="32"
														name="checkbox-mark"></u-icon>
												</u-cell-item>
											</scroll-view>
										</view>
									</u-dropdown-item>
								</u-dropdown>
							</view>
						</view> -->
					</custom-search>
					<v-tabs ref="vTabs" style="margin: 15rpx 0;" :value="activeTab" :tabs="tabList"
						paddingItem="0 30rpx" height="50rpx" active-color="#6190e8" line-color="#6190e8"
						:lineScale="0.7" lineRadius="0" lineHeight="0rpx" :zIndex="98" @change="changeTab"></v-tabs>
				</view>
				<view class="list-container">
					<!-- 列表 -->
					<!-- <page-list ref="pageListRef" v-if="isPad" :loading="listLoading" options other-menu
						:other-list="otherList" :table-data="searchList" :page-no="pageNo" :page-size="pageSize"
						:total="total" columnKey="production" @pageChange="pageChange" @itemClick="toDetail"
						@menuItemChange="menuItemChange">
						<template v-slot:listItem="{item}">
							<uni-td class="list-item-cell-text">{{ item.name }}</uni-td>
							<uni-td class="list-item-cell-text">{{ item.production_id | findValueDec }}</uni-td>
							<uni-td class="list-item-cell-text">{{ item.product_id | findValueDec }}</uni-td>
							<uni-td class="list-item-cell-text">{{ item.finished_lot_id | findValueDec }}</uni-td>
							<uni-td
								class="list-item-cell-text">{{ item.employee_ids | findEmployeeName($mStore) }}</uni-td>
							<uni-td
								class="list-item-cell-text">{{ $mHelper.dateToUTC(item.date_start) || '--' }}</uni-td>
							<uni-td class="list-item-cell-text">{{ item.duration.toFixed(2) }}</uni-td>
							<uni-td align="center" class="list-item-cell-text"><u-tag
									:text="item.state | stateInfoFilter('state', stateList)"
									:type="item.state | stateInfoFilter('type', stateList)" mode="light" /></uni-td>
							<uni-td align="center" class="list-item-cell-text"
								:class="item.check_result | checkResultFilter">
								<view v-if="item.production_state == 'done'">
									{{item.check_result || ''}}
								</view>
							</uni-td>
						</template>
						<template v-slot:options="{item}">
							<u-button class="option-btn" v-for="(menu, index) in renderOptionMenu(item, menu_list)"
								:key="menu.value" size="mini" :type="menu.type"
								:loading="rowItem.id === item.id && optionBtnIndex === index && btnLoading"
								:disabled="menu.disabled"
								@click.stop="menuChange(menu, item, index)">{{menu.label}}</u-button>
						</template>
					</page-list> -->
					<page-list ref="pageListRef" :loading="listLoading" options other-menu fixed-pagination
						:other-list="renderOtherMenu(otherList)" :table-data="searchList" :page-no="pageNo"
						:page-size="pageSize" :total="total" columnKey="production" @pageChange="pageChange"
						@itemClick="toDetail" @menuItemChange="menuItemChange">
						<template v-slot:listItem="{item}">
							<view class="list-item-cell">
								<u-cell-group class="cell-header"
									:class="item.state | stateInfoFilter('type', stateList)" :border="false">
									<u-cell-item :title="item.name"
										:value="item.state | stateInfoFilter('state', stateList)" :border-bottom="false"
										:arrow="false"
										:title-style="{width: 'calc(88vw - 200rpx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}"
										:value-style="{width: '200rpx'}"></u-cell-item>
								</u-cell-group>
								<view>
									<span class="list-item-cell-text">产品名称：{{item.product_id | findValueDec}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">生产单号：{{item.production_id | findValueDec}}</span>
								</view>
								<view>
									<span
										class="list-item-cell-text">批次/序号：{{item.finished_lot_id | findValueDec}}</span>
								</view>
								<view v-if="item.state != 'done' && item.state != 'progress'">
									<span
										class="list-item-cell-text">计划开工时间：{{$mHelper.dateToUTC(item.date_start) || '--'}}</span>
								</view>
								<view v-else>
									<span
										class="list-item-cell-text">开工时间：{{$mHelper.dateToUTC(item.date_start) || '--'}}</span>
								</view>
								<view v-if="item.state != 'done'">
									<span
										class="list-item-cell-text">计划完工时间：{{$mHelper.dateToUTC(item.date_finished) || '--'}}</span>
								</view>
								<view v-else>
									<span
										class="list-item-cell-text">完工时间：{{$mHelper.dateToUTC(item.date_finished) || '--'}}</span>
								</view>
								<view class="list-item-row">
									<!-- <span
										class="list-item-cell-text">作业员：{{Array.isArray(item.employee_assigned_ids) && item.employee_assigned_ids.length > 0 ? item.employee_assigned_ids.join(', ') : '--'}}</span> -->
									<span class="list-item-cell-text">实际时长：{{item.duration.toFixed(2)}}</span>
									<span class="list-item-cell-text" v-if="item.production_state == 'done'">质检结果：<u-tag
											style="padding: 10rpx 12rpx; font-size: 24rpx;"
											:text="item.check_result || ''"
											:type="item.check_result | checkResultFilter" mode="dark"
											size="mini" /></span>
									<span v-if="item.workcenter_id[0] == 4" class="list-item-cell-text">送检状态：
										<span
											class="link">{{item.production_state === 'to_close' ? '未送检' : '已送检'}}</span>
									</span>
								</view>
								<view class="list-item-row" v-if="item.state == 'ready'">
									<span class="list-item-cell-text">领料状态：
										<span
											:class="!item.is_picking ? 'link-warning' : 'link'">{{item.is_picking ? '已领料' : '未领料'}}</span>
									</span>
									<span class="list-item-cell-text">核料状态：
										<span
											:class="!item.is_verify ? 'link-warning' : 'link'">{{item.is_verify ? '已核料' : '未核料'}}</span>
									</span>
								</view>
								<!-- <view v-if="viewSizeInfo(item.product_id)" class="list-item-row">
									<span class="list-item-cell-text">幅宽：{{item.width ? item.width.toFixed(2) : '--'}}
										<span class="unit">mm</span>
									</span>
									<span
										class="list-item-cell-text">面密度：{{item.density ? item.density.toFixed(2) : '--'}}
										<span class="unit">g/m²</span>
									</span>
									<span
										class="list-item-cell-text">米数：{{item.product_qty ? item.product_qty.toFixed(2) : '--'}}
										<span class="unit">m</span>
									</span>
								</view> -->
							</view>
						</template>
						<template v-slot:options="{item, index}">
							<u-button class="option-btn" v-for="(menu, index2) in renderOptionMenu(item, menu_list)"
								:key="menu.value" size="mini" :type="menu.type"
								:loading="rowItem.id === item.id && optionBtnIndex === index2 && btnLoading"
								:disabled="menu.disabled"
								@click.stop="menuChange(menu, item, index2)">{{menu.label}}</u-button>
						</template>
					</page-list>
					<!-- <v-list ref="vListRef" :list-data="searchList" show-menu option-type="custom"
							:loading="listLoading" :buffer="2000" :item-height="200" @loadmore="getList()"
							@itemClick="toDetail">
							<template v-slot:listItem="{item}">
								<view class="list-item-cell">
									<u-cell-group class="cell-header"
										:class="item.state | stateInfoFilter('type', stateList)" :border="false">
										<u-cell-item :title="item.name"
											:value="item.state | stateInfoFilter('state', stateList)"
											:border-bottom="false" :arrow="false"
											:title-style="{width: 'calc(88vw - 200rpx)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}"
											:value-style="{width: '200rpx'}"></u-cell-item>
									</u-cell-group>
									<view>
										<span class="list-item-cell-text">产品：{{item.product_id | findValueDec}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">批次/序列号：{{item.finished_lot_id | findValueDec}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">作业员工：{{item.employee_ids | findEmployeeName($mStore)}}</span>
									</view>
									<view>
										<span
											class="list-item-cell-text">开工时间：{{$mHelper.dateToUTC(item.date_start) || '--'}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">实际时长：{{item.duration.toFixed(2)}}</span>
									</view>
									<view>
										<span class="list-item-cell-text">质检结果：<u-tag
												v-if="item.production_state == 'done'" :text="item.check_result || ''"
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
						</v-list> -->
					<clog-popup v-model="clogShow" :rowItem="rowItem" @confirm="clogConfirm"></clog-popup>
				</view>
			</view>
		</view>
		<u-popup class="select-popup" v-model="hl_show" mode="bottom" closeable @close="hl_list = []">
			<view class="head">
				<text>核料</text>
			</view>
			<view class="content">
				<scroll-view scroll-y="true" style="height: 60vh; padding: 20rpx;">
					<!-- <view v-if="hl_list.length <= 0" class="not-title">请扫描物料二维码</view> -->
					<view v-if="hl_list.length > 0" class="wuliao_list">
						<card-info v-for="(info, index) in hl_list" :key="index" :id="'scroll--' + info.lot_name"
							:title="`[${info.lot_name}]${info.product_name}`" :head-border-bottom="false"
							:line-icon="false">
							<uni-forms class="content-form">
								<!-- <uni-forms-item class="content-item" label=" " label-width="0" label-align="center"
									:border-bottom="false">
									<view class="value" style="color: initial">{{info.lot_name || ''}}</view>
								</uni-forms-item> -->
								<!-- <uni-forms-item class="content-item" label="需求数量" label-width="150rpx"
									label-align="left" :border-bottom="false">
									<view class="value">
										{{info.to_be_consumed || ''}}
										<span class="unit">{{info.product_uom}}</span>
									</view>
								</uni-forms-item> -->
								<uni-forms-item class="content-item" label="核料数量" label-width="150rpx"
									label-align="left" :border-bottom="false">
									<view class="value">
										<uni-easyinput :value="info.quantity" type="number" :styles="easyinputStyles"
											placeholder="" @input="inputChange"
											@blur="(event) => inputBlur(event, index)"></uni-easyinput>
										<span class="unit">{{info.product_uom}}</span>
									</view>
								</uni-forms-item>
							</uni-forms>
							<template v-slot:head-right>
								<span class="item-close" @click="hl_del(index)">
									<uni-icons type="trash" size="20" color="#FF7878"></uni-icons>
								</span>
							</template>
						</card-info>
					</view>
					<view v-else class="link" style="margin-top: 100rpx;">请扫描二维码</view>
					<!-- <view v-else class="list-item" v-for="(item, index) in hl_list" :key="index">
						<view class="item-cell">
							<view class="label">批次</view>
							<view class="value">{{item.barcode}}</view>
						</view>
						<view class="item-cell">
							<view class="label">核料数量</view>
							<view class="value">
								<uni-easyinput :value="item.quantity" type="number" :styles="easyinputStyles"
									placeholder="" @input="inputChange"
									@blur="(event) => inputBlur(event, index)"></uni-easyinput>
								<span class="unit">{{item.product_uom}}</span>
							</view>
						</view>
						<span class="item-close" @click="hl_del(index)">
							<uni-icons type="trash" size="20" color="#FF7878"></uni-icons>
						</span>
					</view> -->
				</scroll-view>
			</view>
			<view class="footer">
				<!-- <u-button :custom-style="cancelStyle" size="medium" hover-class="none" :hair-line="false"
					@click="hl_show = false">取消</u-button> -->
				<u-button :custom-style="customStyle" :loading="btnLoading" size="medium" hover-class="none"
					:hair-line="false" @click="hl_confirm">核料完成</u-button>
			</view>
		</u-popup>
		<u-action-sheet :list="ll_sheet" v-model="ll_sheet_show" :cancel-btn="false"
			@click="ll_sheet_click"></u-action-sheet>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<printer ref="printer" @print="print"></printer>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import VList from '@/components/v-list/index.vue';
	import userDropdown from '@/namesearch/user-dropdown/index.vue';
	import workcenterDropdown from '@/namesearch/workcenter-dropdown/index.vue';
	import userNameSign from '@/components/user-name/index.vue';
	import customUpload from '@/components/custom-upload/index.vue';
	import pageList from '@/components/page-list/req-list.vue';
	import cardList from '@/components/card-list/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import printer from '@/components/printer/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	import customSearch from '@/components/custom-search/index.vue';
	import {
		printLotCPCL
	} from '@/common/print/print/labelPrinter.js';
	import clogPopup from './clogPopup.vue';
	import {
		menu_list
	} from './data.js';
	import {
		renderOptionMenu
	} from './utils.js';
	import {
		check_state_list
	} from '../data.js';
	export default {
		components: {
			VList,
			pageList,
			cardList,
			userNameSign,
			userDropdown,
			workcenterDropdown,
			customUpload,
			clogPopup,
			authChoose,
			printer,
			cardInfo,
			customSearch
		},
		data() {
			return {
				intervalTimer: null,
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '生产报工',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: this.$mStore.getters.theme.navBar.backgroundColor,
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				cancelStyle: {
					backgroundColor: '#F5F5F5',
					borderColor: '#F5F5F5',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				customStyle: {
					width: '100%',
					backgroundColor: '#6190e8',
					color: '#fff',
					borderColor: '#6190e8',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				scrollTop: 0,
				isFirst: true,
				fullLoading: false,
				listLoading: false,
				btnLoading: false,
				optionBtnIndex: null,
				search_word: '',
				filterInfo: {
					user: null,
					state: 'waiting',
					check_result: null,
					workcenter_id: null
				},
				clogShow: false,
				authChoosePopupShow: false,
				rowItem: {},
				menu_list: menu_list,
				stateList: [{
						label: '全部',
						value: ''
					},
					{
						label: '等待组件',
						value: 'waiting',
						type: 'warning'
					},
					{
						label: '已等待另一工单',
						value: 'pending',
						type: 'success'
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
					{
						label: '已取消',
						value: 'cancel',
						type: 'info'
					},
					// {
					// 	label: '待定',
					// 	value: 'pending',
					// 	type: 'error'
					// },
				],
				otherList: [{
						title: '领料',
						value: 5
					},
					{
						title: '废料入库',
						value: 3
					},
					{
						title: '废料使用',
						value: 7
					},
					// {
					// 	title: '核料',
					// 	value: 4
					// },

					// {
					// 	title: '生产上报',
					// 	value: 1
					// },
					{
						title: '生产记录',
						value: 2
					},
					{
						title: '打印标签',
						value: 6
					},
					// {
					// 	title: '自检',
					// 	value: 2
					// }
				],
				checkResultList: check_state_list,
				searchList: [],
				pageSize: 10,
				pageNo: 1,
				total: 0,
				hl_show: false,
				hl_list: [],
				ll_sheet_show: false,
				ll_sheet: [{
					text: '库房领料'
				}, {
					text: '现场用料'
				}],
			}
		},
		computed: {
			...mapGetters(['isPad', 'msgCount', 'repairCount', 'navBarHeight']),
			stateActiveTitle() {
				let result = this.stateList.find(item => item.value === this.filterInfo.state)
				return !result?.value ? '' : result?.label
			},
			checkStateActiveTitle() {
				let result = this.checkResultList.find(item => item.value === this.filterInfo.check_result)
				return !result?.value ? '' : result?.label
			},
			tabList() {
				return this.stateList.map(state => state.label)
			},
			activeTab() {
				return this.stateList.findIndex(state => state.value == this.filterInfo.state)
			},
			filterAcitve() {
				return !!this.filterInfo.check_result
			}
		},
		watch: {
			search_word(val) {
				if (val) {
					this.filterInfo = {
						user: null,
						state: '',
						check_result: null
					}
				}
			},
			scrollTop() {
				if (this.$refs.pageListRef && this.$refs.pageListRef.otherMenuShow) {
					this.$refs.pageListRef.otherMenuShow = false;
				}
			}
		},
		filters: {
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
			},
		},
		methods: {
			clearTimer() {
				if (this.intervalTimer) {
					clearInterval(this.intervalTimer);
					this.intervalTimer = null;
				}
			},
			async initData() {
				this.listLoading = true;
				// this.getRepairCount();
				this.clearTimer();
				// this.intervalTimer = setInterval(() => {
				// 	this.getRepairCount();
				// }, 10000);
				await this.$mStore.dispatch('user/getEmployeeList');
				this.getList();
			},
			refresh(type, isReset) {
				// this.filterInfo = {
				// 	user: null,
				// 	state: 'ready',
				// }
				isReset && this.paginationReset();
				this.getList(type);
			},
			async getList(type) {
				// let vListRef = this.$refs?.vListRef;
				// if (vListRef) vListRef.loadmore = 'loading';
				this.listLoading = true;
				const Model = api.env.model('mrp.workorder');
				let domain = [];
				if (!this.filterInfo.state) {
					domain = [
						// ["state", "in", ["ready", "waiting", "progress"]],
					];
				} else {
					domain = [
						['state', '=', this.filterInfo.state]
					];
				}
				if (this.filterInfo.user) {
					domain = [
						...domain,
						['employee_ids', 'in', [this.filterInfo.user]]
					]
				}
				if (this.filterInfo.workcenter_id) {
					domain = [
						...domain,
						['workcenter_id', '=', this.filterInfo.workcenter_id]
					]
				}
				if (this.filterInfo.check_result) {
					domain = [
						...domain,
						['check_result', '=', this.filterInfo.check_result]
					]
				}
				if (this.search_word) {
					domain = [
						...domain,
						'|',
						['production_id.lot_producing_id.name', 'ilike', this.search_word],
						['production_id.name', 'ilike', this.search_word]
					]
				}
				domain = [
					...domain,
					['production_state', '!=', 'draft'],
					// ['finished_lot_id', '!=', false],

				];
				const total = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'search_count',
					args: [
						domain
					],
					kwargs: {}
				});
				this.total = total;
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_workorders_with_attr',
					args: [],
					kwargs: {
						order: this.filterInfo.state == "done" ? "date_finished desc" : "date_start asc",
						limit: this.pageSize,
						offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
						domain,
					}
				});
				// const res = await Model.search_read({
				// 	order: "date_start",
				// 	limit: this.pageSize,
				// 	offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
				// 	domain,
				// 	fields: []
				// })
				uni.stopPullDownRefresh();
				this.listLoading = false;
				this.fullLoading = false;
				if (res) {
					this.searchList = res.length ? [...res] : [];
					// 如果是扫码并且是接收状态，则自动接收
					if (type === 'scan') {
						if (this.searchList.length > 0) {
							let list_item = this.searchList[0];
							if (list_item.state === 'waiting') {
								let btns = this.renderOptionMenu(list_item, this.menu_list);
								let btnIndex = btns.findIndex(b => b.value === 'button_accept');
								this.menuChange(btns[btnIndex], list_item, btnIndex, true);
							}
						}
					}
				} else {
					// if (vListRef) vListRef.loadmore = 'loadmore'
					// if (vListRef) vListRef.loadText.loadmore = '加载失败，点击重试'
				}
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
				return renderOptionMenu(listItem, prevList);
			},
			renderOtherMenu(otherList) {
				return otherList
			},
			print() {
				let lot_list = this.rowItem.finished_lot_id?.length > 1 ? [this.rowItem] : [];
				if (!lot_list?.length) {
					uni.showToast({
						title: '没有要打印的批次',
						icon: 'none'
					});
					return
				}
				printLotCPCL(this.$refs.printer, lot_list.map((lot) => {
					let product_code = Array.isArray(lot.product_code) && lot.product_code?.length > 0 ? lot
						.product_code[0] : lot.product_code || '';
					let product_name = lot.product_id?.length > 1 ? lot.product_id[1] : '';
					// let name = product_name?.length > 1 ? product_name[1].trim() : product_name[0];
					return {
						product_code,
						barcode: lot.finished_lot_id[1] || '',
						name: product_name,
						quantity: lot.product_qty + ' ' + lot.uom_name,
						order: lot.order || '',
						next_order: lot.next_order || '',
						model_name: lot.model_name || '',
						user: Array.isArray(lot.employee_assigned_ids) && lot.employee_assigned_ids.length >
							0 ? lot.employee_assigned_ids.join(', ') : ''
					}
				}))
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
			workcenterSelect(res) {
				this.paginationReset();
				this.filterInfo.workcenter_id = res?.length > 0 ? res[0] : res;
				this.getList();
				this.closeDropdown();
			},
			workcenterSelectClose() {
				this.closeDropdown();
			},
			// 人员筛选
			userSelect(res) {
				this.paginationReset();
				this.filterInfo.user = res;
				this.getList();
				this.closeDropdown();
			},
			// 人员选择取消
			userSelectClose() {
				this.closeDropdown();
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
			// 消息通知
			noticeClick() {
				uni.navigateTo({
					url: '/pages/tqgf/message_notification/index?from=production_page'
				})
			},
			toRepair() {
				uni.navigateTo({
					url: '/pages/tqgf/application/production/repair'
				})
			},
			paginationReset() {
				this.pageNo = 1;
				this.pageSize = 10;
			},
			// 搜索使用节流
			searchChange(isReset) {
				// console.log(this.search_word)
				isReset && this.paginationReset();
				this.$u.debounce(() => {
					this.getList();
				}, 500)
			},
			// 扫码
			scanClick() {
				// #ifdef H5
				this.search_word = 'B240812001'
				// this.fullLoading = true;
				// this.getList('scan');
				// ['A2409230006'].forEach((lot) => {
				// 	this.hl_add(lot)
				// })
				// #endif
				// 扫码跳转
				uni.scanCode({
					success: (res) => {
						// 携带参数跳转
						this.search_word = res.result || '';
						if (res.result) {
							this.fullLoading = true;
							this.getList('scan');
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
			pageChange(pageNo) {
				this.pageNo = pageNo;
				this.getList();
			},
			menuItemChange(e, row) {
				this.rowItem = row;
				let production_id = row.production_id?.length > 0 ? row.production_id[0] : null;
				let production_name = row.production_id?.length > 1 ? row.production_id[1] : null;
				let item = {
					res_model: 'mrp.workorder',
					// res_id: production_id,
					res_id: row.id,
					record_type: '生产记录'
				}
				let param = item ? JSON.stringify(item) : '';
				if (e.value == 1) {
					let url =
						`/pages/tqgf/application/dataReport/detail?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 2) {
					let url =
						`/pages/tqgf/application/dataReport/params_list?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 3) {
					let url =
						`/pages/tqgf/application/feiliaoPage/index?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 4) {
					this.hl_show = true;
					this.get_hl_list();
				} else if (e.value == 5) {
					// this.ll_sheet_show = true;
					this.ll_sheet_click(0);
				} else if (e.value == 6) {
					this.print();
				} else if (e.value == 7) {
					let url =
						`/pages/tqgf/application/feiliaoPage/use?param=${param}`;
					uni.navigateTo({
						url
					})
				}
			},
			toDetail(item) {
				uni.navigateTo({
					url: `/pages/tqgf/application/production/detail?id=${item.id}&production_id=${item.production_id[0]}`
				})
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
				if (menu.value === 'button_mark_done') {
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
				if (menu.value == 'll') {
					// this.ll_sheet_show = true;
					this.ll_sheet_click(0);
					return
				}
				if (menu.value == 'hl') {
					// this.hl_show = true;
					// this.get_hl_list();
					this.ll_sheet_click(1);
					return
				}
				if (menu.value == 'scsb') {
					let item = {
						res_model: 'mrp.workorder',
						// res_id: production_id,
						res_id: row.id,
						record_type: '生产记录'
					}
					let param = item ? JSON.stringify(item) : '';
					let url =
						`/pages/tqgf/application/dataReport/detail?param=${param}`;
					uni.navigateTo({
						url
					})
					return
				}
				// if (menu.value === 'production_record') {
				// 	let item = {
				// 		res_model: 'mrp.production',
				// 		// res_id: row.production_id?.length > 0 ? row.production_id[0] : null
				// 	}
				// 	let param = item ? JSON.stringify(item) : '';
				// 	let url =
				// 		`/pages/tqgf/application/dataReport/detail?param=${param}`;
				// 	uni.navigateTo({
				// 		url
				// 	})
				// 	return;
				// }
				if (menu.value === 'button_continue') {
					this.callButton('button_start', row);
					return;
				}
				this.callButton(menu.value, row);
			},
			async callButton(buttonType, row) {
				this.btnLoading = true;
				const Model = buttonType === 'button_mark_done' ? api.env.model('mrp.production') : api.env.model(
					'mrp.workorder');
				const id = buttonType === 'button_mark_done' ? row.production_id[0] : row.id;
				try {
					let res = await Model.call_button(buttonType, [id], {
						context: {
							"auto_backorder": true
						}
					});
					if (res === false) {
						if (buttonType === 'button_finish') {
							uni.showToast({
								title: '已完工',
								icon: 'success'
							})
						} else if (buttonType === 'button_mark_done') {
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
				} catch (e) {
					this.btnLoading = false;
				}
				this.btnLoading = false;
			},
			clogConfirm() {
				this.refresh();
			},
			async hl_confirm() {
				// let param = {
				// 	production_id: this.rowItem.production_id?.length > 0 ? this.rowItem.production_id[0] : null,
				// 	material: this.hl_list.map((item) => ({
				// 		...item,
				// 		quantity: item.quantity ? item.quantity - 0 : 0
				// 	}))
				// }
				this.btnLoading = true;
				uni.showLoading({
					mask: true
				});
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'action_verify',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
						scan_move_data: this.hl_list.map((item) => ({
							...item,
							quantity: item.quantity ? item.quantity - 0 : 0
						}))
					}
				})
				this.btnLoading = false;
				uni.hideLoading();
				if (res) {
					uni.showToast({
						title: '核料完成',
						icon: 'none'
					})
					this.hl_list = [];
					this.hl_show = false;
					this.refresh();
				}
			},
			async getLotUom(barcode) {
				uni.showLoading({
					mask: true
				})
				let res = await api.web.dataset.call_kw({
					model: 'stock.lot',
					method: 'get_lot_uom',
					args: [
						[]
					],
					kwargs: {
						barcode
					}
				})
				uni.hideLoading();
				if (res) return res;
				else return null
			},
			async get_hl_list() {
				let res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'wo_material_info',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id
					}
				})
				if (res?.length) {
					let arr = [];
					res.forEach((r) => {
						r.batches.forEach((b) => {
							arr.push({
								...r,
								...b
							})
						})
					});
					// this.hl_list = arr;
				}
			},
			async hl_add(barcode) {
				const product = await this.getLotUom(barcode);
				if (product) {
					this.hl_list.push({
						...product,
						quantity: ''
					})
				}
			},
			hl_del(index) {
				this.hl_list.splice(index, 1)
			},
			async ll_sheet_click(index) {
				let production_name = this.rowItem.production_id?.length > 1 ? this.rowItem.production_id[1] : null;
				let production_id = this.rowItem.production_id?.length > 0 ? this.rowItem.production_id[0] : null;
				let workcenter_id = this.rowItem.workcenter_id?.length > 0 ? this.rowItem.workcenter_id[0] : null;
				let scheduled_date = this.rowItem.date_start || '';
				let date_deadline = this.rowItem.date_finished || '';
				uni.showLoading({
					mask: true
				})
				let res = await api.web.dataset.call_kw({
					model: 'stock.location',
					method: 'get_location_by_workcenter_id',
					args: [
						[]
					],
					kwargs: {
						production_id,
						workcenter_id
					}
				})
				uni.hideLoading();
				if (res) {
					let picking_id = res?.picking_id ?? '';
					let location = JSON.stringify({
						id: res?.id ?? null,
						name: res?.name ?? ''
					})
					// if (index == 1) {
					// 	let url =
					// 		`/pages/tqgf/application/getMaterials/scene_detail?production_name=${production_name}&id=${picking_id}&location=${location}&from=${index == 1 ? '现场用料' : '库房领料'}`;
					// 	uni.navigateTo({
					// 		url
					// 	})
					// } else {
					let url =
						`/pages/tqgf/application/getMaterials/detail?production_name=${production_name}&production_id=${production_id}&id=${picking_id}&workorder_id=${this.rowItem.id}&location=${location}&scheduled_date=${scheduled_date}&date_deadline=${date_deadline}&from=${index == 1 ? '现场用料' : '库房领料'}`;
					uni.navigateTo({
						url
					})
					// }
				}
			},
			viewSizeInfo(product) {
				let charArray = ['复合布', '网胎', '碳布'];
				let product_name = product?.length > 1 ? product[1] : '';
				let isView = charArray.some(char => product_name.includes(char));
				return isView
			},
			inputChange(event) {
				return event
			},
			inputBlur(event, index) {
				this.hl_list[index].quantity = event.detail.value
			},
			changeTab(index) {
				this.filterInfo.state = this.stateList[index].value;
				this.paginationReset();
				this.getList();
			},
			showPage() {
				this.$nextTick(() => {
					setTimeout(() => {
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
							if (this.hl_show) {
								this.hl_add(scanCode);
							} else {
								this.search_word = scanCode;
								this.fullLoading = true;
								this.getList('scan');
							}
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
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			if (this.$refs.pageListRef && this.$refs.pageListRef.otherMenuShow) {
				this.$refs.pageListRef.otherMenuShow = false;
			}
			this.refresh(null, true);
		},
		onShow() {
			if (!this.isFirst) {
				// await this.$mStore.dispatch('user/getEmployeeList');
				this.getList();
				// this.getRepairCount();
				this.clearTimer();
				// this.intervalTimer = setInterval(() => {
				// 	this.getRepairCount();
				// }, 10000);
				setTimeout(() => {
					this.scanStart();
				}, 300)
			}
		},
		onHide() {
			this.clearTimer();
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onLoad() {
			uni.$on('toProductionPage', ({search_word}) => {
				if(search_word) {
					this.search_word = search_word;
				}
			});
			this.initData();
			this.isFirst = false;
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onUnload() {
			this.$mStore.dispatch('tabbar/clear_timer');
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
	}
</script>
<style lang="scss" scoped>
	.production-page {
		// min-height: 100vh;

		.search-sticky {
			width: 100%;
			background-color: #fff;
			// padding-top: 20rpx;
			border-bottom: 1px solid rgba(0, 0, 0, .1);
			position: fixed;
			z-index: 99;

			&.dark {
				background-color: $uni-bg-dark-light;
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
					background-color: $page-color-light;
					// background-color: #f5f5f5;
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

		.list-item {
			position: relative;
			padding: 16rpx 40rpx 10rpx 16rpx;
			background-color: #e5efff;

			&:not(:last-child) {
				margin-bottom: 10rpx;
			}

			.quantity {
				color: $uni-color-primary;
			}

			.item-cell {
				padding: 0;
				display: flex;
				align-items: center;
				padding: 20rpx;
				word-break: break-all;
				overflow-wrap: break-word;
				position: relative;

				&:not(:last-child) {
					padding-bottom: 10rpx;
				}
			}

			.label {
				width: 64rpx;
				color: #6190e8;
				font-size: 32rpx;
				margin-right: 20rpx;
				// width: 82rpx;
			}

			.value {
				text-align: left;
				flex: 1;
				font-size: 32rpx;
				display: flex;
				align-items: center;
			}

			.item-close {
				position: absolute;
				right: 0rpx;
				top: 10rpx;
				line-height: 32rpx;
				text-align: center;

				text {
					color: $uni-color-primary;
					font-size: 28rpx;
				}
			}
		}

		/deep/ .slot-wrap {
			display: flex;
			align-items: center;

			.right-item {
				padding-right: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
			}

			.left-item {
				padding-left: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
			}
		}

		.select-popup {
			uni-view {
				font-size: 32rpx;
			}

			.content {
				padding: 0;
			}

			.wuliao_list {
				width: 100%;
				border-radius: 15rpx;
				overflow: hidden;
				text-align: left;
				overflow: hidden;

				.list-title {
					background-color: #e5efff;
					padding: 22rpx 22rpx 0;
					color: #8399bd;

					.sign {
						display: inline-block;
						width: 24rpx;
						height: 24rpx;
						border-radius: 50%;
						margin-right: 12rpx;
						background-color: #8399bd;

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

				.list-item {
					background-color: #e5efff;
					margin-bottom: 0;
					padding: 0;

					&:not(:last-child) {
						border-bottom: 2rpx solid #c1d9ff;
					}

					.item-cell {
						display: flex;
						align-items: center;
						padding: 22rpx;
						word-break: break-all;
						overflow-wrap: break-word;
						position: relative;

						&:not(:last-child) {
							padding-bottom: 10rpx;
						}

						.label {
							width: 122rpx;
							color: #6190e8;
							font-size: 30rpx;
							margin-right: 20rpx;
						}

						.value {
							flex: 1;
							font-size: 30rpx;
							display: flex;
							align-items: center;
						}

						.box-container {
							display: flex;
							align-items: center;
							flex: 1;

							.item-add {
								padding: 0 15rpx;
								height: 42rpx;
								line-height: 42rpx;
							}

							.box-item {
								position: relative;
								padding: 22rpx 40rpx;
								background-color: #fcfdfe;

								&:not(:last-child) {
									margin-bottom: 10rpx;
								}

								&.active {
									background-color: #cdffff;
									animation: flicker 1s;
									animation-iteration-count: 2
								}

								@keyframes flicker {
									0% {
										background-color: #cdffff;
									}

									50% {
										background-color: #fff;
									}

									100% {
										background-color: #cdffff;
									}
								}

								.quantity {
									color: $uni-color-primary;
								}

								.item-cell {
									padding: 0;

									&:not(:last-child) {
										padding-bottom: 10rpx;
									}
								}

								// .label {
								// 	width: 106rpx;
								// }

								.item-close {
									position: absolute;
									right: 0rpx;
									top: 10rpx;
									line-height: 32rpx;
									text-align: center;
								}
							}
						}
					}
				}
			}
		}
	}
</style>