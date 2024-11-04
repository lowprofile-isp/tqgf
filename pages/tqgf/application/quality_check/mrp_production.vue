<template>
	<view class="mrp-production-page">
		<!-- 提示信息 -->
		<u-toast ref="uToast" />
		<u-mask :show="fullLoading" :custom-style="{background: 'rgba(0, 0, 0, 0.2)'}">
			<view style="display: flex;justify-content: center;align-items: center;height: 100%;">
				<u-loading :color="$mStore.getters.themeColor.color" size="60" />
			</view>
		</u-mask>
		<!-- 导航栏 -->
		<u-navbar :is-back="false" :title="navStyles.navTitle" :background="{background: navStyles.navBarBg}"
			:title-color="navStyles.textColor" :title-size="navStyles.navBarFontSize">
			<!-- <view class="slot-wrap">
				<view class="left-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" :count="msgCount" :offset="[-8, -8]"></u-badge>
				</view>
			</view> -->
			<view slot="right" class="slot-wrap">
				<view class="right-item"
					v-if="!isJISHU && (typeValue === 'final_check' || typeValue === 'mould_workshop' || typeValue === 'in_process_check')">
					<u-button :style="{padding: $mStore.state.isPad ? '0 40rpx' : '0 20rpx'}" type="primary"
						:size="$mStore.state.isPad ? 'medium' : 'mini'" plain @click="topiliangjianyan">批量检验</u-button>
				</view>
				<view class="right-item" @click.stop="refresh">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view> -->
				<!-- <user-name-sign></user-name-sign> -->
				<!-- <view class="right-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" count="7" :offset="[-8, 14]"></u-badge>
				</view> -->
			</view>
		</u-navbar>
		<!-- 悬浮扫码 -->
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- 返回顶部 -->
		<!-- <u-back-top :scroll-top="scrollTop" top="600" tips="顶部" :duration="200" :icon-style="iconStyle"
			:custom-style="{backgroundColor: $mStore.getters.themeColor.color, color: '#fff'}"></u-back-top> -->
		<view class="mrp-container">
			<view class="page-menu style2"
				:style="{top: (navigationBarHeight || 0) + 'px', height: `calc(100vh - ${49 + navigationBarHeight}px)`}"
				v-if="deviceInfo.deviceType !== 'phone'">
				<view class="tag-box">
					<view v-for="(type, index) in typeList"
						:class="['tag-item', 'primary', type.value === typeValue ? 'dark' : '']" @tap="typeClick(type)"
						:key="index">
						<text class="tag-text">{{type.text}}</text>
						<u-badge class="tag-badge" size="mini" type="error" :count="type.count"
							:offset="[-12, -12]"></u-badge>
					</view>
				</view>
			</view>
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
					<u-dropdown v-if="typeValue === 'incoming_check'" key="incoming_check" ref="uDropdown"
						class="filter-container" :class="[
							filterInfo.check_result ? 'd-active-2' : '',
							filterInfo.categ_id ? 'd-active-1' : '',
							filterInfo.repair_state ? 'd-active-3' : '',
							filterInfo.check_type ? 'd-active-4' : '',
							$mStore.state.themeColor.dark ? 'dark' : ''
							]" :inactive-color="$mStore.state.themeColor.dark ? '#fff' : '#333'">
						<!-- <u-dropdown-item v-model="filterInfo.check_result" :title="checkStateActiveTitle || '质检结果'"
							:options="checkResultList" @change="filterChange"></u-dropdown-item> -->
						<production-category-dropdown name="incoming_check" :value="filterInfo.categ_id"
							@confirm="categorySelect" @close="categorySelectClose"></production-category-dropdown>
						<!-- <u-dropdown-item v-if="!isJISHU"
							v-model="filterInfo.check_type" :title="checkTypeActiveTitle || '检验类型'"
							:options="checkTypeList" @change="filterChange"></u-dropdown-item> -->
					</u-dropdown>
					<!-- <u-dropdown v-else-if="typeValue === 'mould_workshop'" key="incoming_check" ref="uDropdown"
						class="filter-container" :class="[
							filterInfo.check_result ? 'd-active-1' : '',
							filterInfo.categ_id ? 'd-active-2' : '',
							filterInfo.repair_state ? 'd-active-3' : '',
							filterInfo.check_type ? 'd-active-4' : '',
							$mStore.state.themeColor.dark ? 'dark' : ''
							]" :inactive-color="$mStore.state.themeColor.dark ? '#fff' : '#333'">
					</u-dropdown> -->
					<template v-else-if="typeValue === 'mould_workshop'"></template>
					<template v-else-if="typeValue === 'in_process_check'"></template>
					<u-dropdown v-else key="not_incoming_check" ref="uDropdown" class="filter-container" :class="[
							filterInfo.check_result ? 'd-active-1' : '',
							filterInfo.categ_id ? 'd-active-2' : '',
							filterInfo.repair_state ? 'd-active-3' : '',
							filterInfo.check_type ? 'd-active-4' : '',
							$mStore.state.themeColor.dark ? 'dark' : ''
							]" :inactive-color="$mStore.state.themeColor.dark ? '#fff' : '#333'">
						<u-dropdown-item v-model="filterInfo.check_result" :title="checkStateActiveTitle || '质检结果'"
							:options="checkResultList" @change="filterChange"></u-dropdown-item>
						<production-category-dropdown :value="filterInfo.categ_id" @confirm="categorySelect"
							@close="categorySelectClose"></production-category-dropdown>
						<u-dropdown-item v-model="filterInfo.repair_state" :title="repairStateActiveTitle || '返修状态'"
							:options="repairStateList" @change="filterChange"></u-dropdown-item>
						<u-dropdown-item v-if="!isJISHU" v-model="filterInfo.check_type"
							:title="checkTypeActiveTitle || '检验类型'" :options="checkTypeList"
							@change="filterChange"></u-dropdown-item>
					</u-dropdown>

					<!-- 分类筛选 -->
					<view class="tag-box" v-if="deviceInfo.deviceType === 'phone'">
						<view v-for="(type, index) in typeList"
							:class="['tag-item', 'primary', type.value === typeValue ? 'dark' : '']" :key="index"
							@tap="typeClick(type)">
							<text class="tag-text">{{type.text}}</text>
							<u-badge class="tag-badge" size="mini" type="error" :count="type.count"
								:offset="[-12, -12]"></u-badge>
						</view>
					</view>
					<!-- <view v-if="typeValue === 'in_process_check'" class="workshop">
						<u-tag v-for="(w, index) in workshop_list" :key="index" :text="w.label"
							:mode="workshop === w.value ? 'light' : 'plain'" @click="workshopChange(w)" />
					</view> -->
					<view v-if="typeValue === 'in_process_check'" class="workshop">
						<u-tag v-for="(w, index) in workcenter_list" :key="index" :text="w.name"
							:mode="workcenter.value === w.value ? 'dark' : 'plain'" @click="workcenterChange(w)" />
					</view>
				</view>
				<empty text="暂无数据" v-if="!listLoading && searchList.length <= 0"></empty>
				<view v-else class="list-container"
					:style="{paddingTop: typeValue === 'in_process_check' ? deviceInfo.deviceType === 'phone' ? '348rpx' : '305rpx' : ''}">
					<!-- 列表 -->
					<page-list v-if="typeValue === 'incoming_check'" ref="pageListRef" is-table :loading="listLoading"
						:table-data="searchList" columnKey="quality_check_enter" :page-no="pageNo" :page-size="pageSize"
						:total="total" @pageChange="pageChange" @itemClick="toQualityCheck">
						<template v-if="$mStore.state.isPad" v-slot:listItem="{item}">
							<uni-td>{{item.name || ''}}</uni-td>
							<!-- <uni-td>{{item.product_category || ''}}</uni-td> -->
							<uni-td>{{ item.receive_batch || ''}}</uni-td>
							<uni-td>{{item.product_name || ''}}</uni-td>
							<uni-td>{{item.product_specification || ''}}</uni-td>
							<uni-td>{{ $mHelper.dateToUTC(item.date_sent) || '' }}</uni-td>
							<uni-td align="center"><u-tag :text="item.state | stateInfoFilterJC('state')"
									:type="item.state | stateInfoFilterJC('type')" /></uni-td>
						</template>
						<template v-else v-slot:listItem="{item}">
							<view class="list-item-cell">
								<view>
									<span class="list-item-cell-text">单号：{{item.name || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">接收批次：{{item.receive_batch || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">产品：{{item.product_name || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">规格：{{item.product_specification || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">送检日期：{{$mHelper.dateToUTC(item.date_sent) || ''}}</span>
								</view>
								<!-- <view>
									<span class="list-item-cell-text">产品规格：{{item.size || '--'}}</span>
								</view> -->
								<view>
									<span class="list-item-cell-text">状态：<u-tag
											:text="item.state | stateInfoFilterJC('state')"
											:type="item.state | stateInfoFilterJC('type')" /></span>
								</view>
							</view>
						</template>
					</page-list>
					<page-list v-else-if="typeValue === 'in_process_check'" ref="pageListRef" is-table
						:loading="listLoading" :table-data="searchList" columnKey="quality_check_process"
						:page-no="pageNo" :page-size="pageSize" :total="total" @pageChange="pageChange"
						@itemClick="toGuoChengCheck">
						<template v-if="$mStore.state.isPad" v-slot:listItem="{item}">
							<uni-td>{{item.name || ''}}</uni-td>
							<uni-td>{{item.process_id | findValueDec}}</uni-td>
							<uni-td>{{ item.inspector | findValueDec}}</uni-td>
							<uni-td>{{ $mHelper.dateToUTC(item.inspection_date) || '' }}</uni-td>
							<uni-td align="center"><u-tag :text="item.state | stateInfoFilterGC('state')"
									:type="item.state | stateInfoFilterGC('type')" /></uni-td>
						</template>
						<template v-else v-slot:listItem="{item}">
							<view class="list-item-cell">
								<view>
									<span class="list-item-cell-text">巡检单：{{item.name || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">工序：{{item.process_id | findValueDec}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">检验员：{{item.inspector | findValueDec}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">检验日期：{{item.inspection_date || ''}}件</span>
								</view>
								<view>
									<span class="list-item-cell-text">状态：<u-tag
											:text="item.state | stateInfoFilterGC('state')"
											:type="item.state | stateInfoFilterGC('type')" /></span>
								</view>
							</view>
						</template>
					</page-list>
					<page-list v-else-if="typeValue === 'mould_workshop'" ref="pageListRef" is-table
						:loading="listLoading" :table-data="searchList" columnKey="quality_check_mould"
						:page-no="pageNo" :page-size="pageSize" :total="total" @pageChange="pageChange"
						@itemClick="toQualityCheck">
						<template v-if="$mStore.state.isPad" v-slot:listItem="{item}">
							<uni-td>{{item.number || '--' }}</uni-td>
							<uni-td>{{item.inspection_date || '--'}}</uni-td>
							<uni-td align="center">{{ item.inspection_mould_number || '--' }}</uni-td>
							<uni-td>{{ item.inspection_user || '--' }}</uni-td>
							<!-- <uni-td align="center"><u-tag :text="item.check_result || ''"
									:type="item.check_result | checkResultFilter" /></uni-td> -->
						</template>
						<template v-else v-slot:listItem="{item}">
							<view class="list-item-cell">
								<view>
									<span class="list-item-cell-text">巡检单号：{{item.number || '--'}}</span>
								</view>
								<view>
									<span
										class="list-item-cell-text">巡检日期：{{item.inspection_date | findValueDec}}</span>
								</view>
								<view>
									<span
										class="list-item-cell-text">巡检数量：{{item.inspection_mould_number || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">巡检人：{{item.inspection_user || '--'}}</span>
								</view>
								<!-- <view>
									<span class="list-item-cell-text">质检结果：<u-tag :text="item.check_result || ''"
											:type="item.check_result | checkResultFilter" mode="dark"
											size="mini" /></span>
								</view> -->
							</view>
						</template>
					</page-list>
					<page-list v-else ref="pageListRef" is-table :loading="listLoading" :table-data="searchList"
						columnKey="quality_check" :page-no="pageNo" :page-size="pageSize" :total="total"
						@pageChange="pageChange" @itemClick="toQualityCheck">
						<template v-if="$mStore.state.isPad" v-slot:listItem="{item}">
							<uni-td>{{item.product_name || '--' }}</uni-td>
							<uni-td>{{item.categ_id | findValueDec}}</uni-td>
							<uni-td>{{ item.complete_lot_num || '--' }}</uni-td>
							<uni-td align="center">{{ item.product_qty || '--' }}</uni-td>
							<uni-td>{{ item.size || '--' }}</uni-td>
							<!-- <uni-td><u-tag :text="item.state | stateInfoFilter('state')"
									:type="item.state | stateInfoFilter('type')" size="mini" /></uni-td> -->
							<uni-td align="center">
								<u-button size="mini" type="primary" plain @click.stop="noteClick(item)">
									<u-icon name="eye"></u-icon>查看
								</u-button>
							</uni-td>
							<uni-td>{{ item.tech_note || '' }}</uni-td>
							<uni-td align="center" class="list-item-cell-text"
								:class="item.repair_state | repairStateFilter('type')">
								<view>
									{{item.repair_state | repairStateFilter('state')}}
								</view>
							</uni-td>
							<uni-td align="center"><u-tag :text="item.check_result || ''"
									:type="item.check_result | checkResultFilter" /></uni-td>
						</template>
						<template v-else v-slot:listItem="{item}">
							<view class="list-item-cell">
								<view>
									<span class="list-item-cell-text">产品：{{item.product_name || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">产品分类：{{item.categ_id | findValueDec}}</span>
								</view>
								<!-- 	<view>
								<span class="list-item-cell-text">产品序号：{{item.serial_num || '--'}}</span>
							</view> -->
								<view>
									<span class="list-item-cell-text">批次/序列号：{{item.complete_lot_num || '--'}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">数量：{{item.product_qty || '--'}}件</span>
								</view>
								<view>
									<span class="list-item-cell-text">产品规格：{{item.size || '--'}}</span>
								</view>
								<!-- <view>
								<span class="list-item-cell-text">产品代号：{{item.product_code || '--'}}</span>
							</view> -->
								<!-- <view>
									<span class="list-item-cell-text">状态：<u-tag
											:text="item.state | stateInfoFilter('state')"
											:type="item.state | stateInfoFilter('type')" size="mini" /></span>
								</view> -->
								<view>
									<span class="list-item-cell-text">返修状态：<u-tag :text="item.repair_state || ''"
											:type="item.repair_state | repairStateFilter" mode="dark"
											size="mini" /></span>
								</view>
								<view>
									<span class="list-item-cell-text">返修备注：<u-button style="margin-left: 0;" size="mini"
											type="primary" plain @click.stop="noteClick(item)">
											<u-icon name="eye"></u-icon>查看
										</u-button>
									</span>
								</view>
								<view>
									<span class="list-item-cell-text">工艺备注：{{item.tech_note || ''}}</span>
								</view>
								<view>
									<span class="list-item-cell-text">质检结果：<u-tag :text="item.check_result || ''"
											:type="item.check_result | checkResultFilter" mode="dark"
											size="mini" /></span>
								</view>
							</view>
						</template>
					</page-list>
				</view>
			</view>
		</view>
		<production-note-popup v-model="productionNoteShow" :rowItem="rowItem"></production-note-popup>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import VList from '@/components/v-list/index.vue';
	import userNameSign from '@/components/user-name/index.vue';
	import pageList from '@/components/page-list/req-list.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import productionCategoryDropdown from '@/namesearch/production-category-dropdown/index.vue';
	import productionNotePopup from '../production/productionNotePopup.vue';
	import {
		groupSigns
	} from '@/common/const.js';
	import {
		check_state_list,
		check_type_list,
		repair_state_list,
		workshop_list
	} from '../data.js';
	export default {
		components: {
			VList,
			userNameSign,
			pageList,
			productionCategoryDropdown,
			productionNotePopup,
			authChoose
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '质量检验',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: this.$mStore.getters.themeColor.color,
					textColor: '#ffffff',
				},
				scrollTop: 0,
				isFirst: true,
				fullLoading: false,
				listLoading: false,
				search_word: '',
				filterInfo: {
					categ_id: null,
					check_result: '待检验',
					check_type: null,
					repair_state: null
				},
				typeValue: 'final_check',
				workshop: 'mold_workshop',
				typeList: [{
						text: '进厂检验',
						value: 'incoming_check',
						type: 'error',
						count: 0,
					},
					{
						text: '过程检验',
						value: 'in_process_check',
						type: 'warning',
						count: 0,
					},
					{
						text: '成品检验',
						value: 'final_check',
						type: 'success',
						count: 0,
					},
					// {
					// 	text: '模具检验',
					// 	value: 'mould_workshop',
					// 	type: 'success',
					// 	count: 0,
					// },
				],
				checkResultList: check_state_list,
				checkTypeList: check_type_list,
				repairStateList: repair_state_list,
				workshop_list: workshop_list,
				workcenter_list: [],
				workcenter: {},
				code_result: '',
				ProductionList: [],
				searchList: [],
				rowItem: {},
				productionNoteShow: false,
				groupSigns: groupSigns,
				pageSize: 10,
				pageNo: 1,
				total: 0,
				authChoosePopupShow: false
			}
		},
		computed: {
			...mapGetters(['isPad', 'msgCount']),
			isJISHU() {
				return this.$mStore.state.user.group_info[groupSigns.JISHU]
			},
			navigationBarHeight() {
				return this.$mStore.state.sysInfo.statusBarHeight + (this.$mStore.state.sysInfo.titleBarHeight || 44);
			},
			deviceInfo() {
				return this.$mStore.state.deviceInfo || {};
			},
			// 批次号列表
			searchSuggestList() {
				return this.ProductionList.map(() => item.complete_lot_num);
			},
			checkStateActiveTitle() {
				let result = this.checkResultList.find(item => item.value === this.filterInfo.check_result)
				return !result?.value ? '' : result?.label
			},
			checkTypeActiveTitle() {
				let result = this.checkTypeList.find(item => item.value === this.filterInfo.check_type)
				return !result?.value ? '' : result?.label
			},
			repairStateActiveTitle() {
				let result = this.repairStateList.find(item => item.value === this.filterInfo.repair_state)
				return !result?.value ? '' : result?.label
			},
			workshopName() {
				return this.workshop_list.find(w => w.value === this.workshop).label
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
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
			stateInfoFilter(state, type) {
				let state_info = {
					state: '',
					type: ''
				}
				switch (state) {
					case 'draft':
						state_info.state = '草稿';
						state_info.type = 'info';
						break;
					case 'to_close':
						state_info.state = '待关闭';
						state_info.type = 'success';
						break;
					case 'progress':
						state_info.state = '进行中';
						state_info.type = 'warning';
						break;
					case 'confirmed':
						state_info.state = '已确认';
						state_info.type = 'primary';
						break;
					case 'done':
						state_info.state = '已完成';
						state_info.type = 'success';
						break;
					default:
						state_info.state = '--';
						state_info.type = 'info';
						break;
				}
				return type === 'state' ? state_info.state : state_info.type;
			},
			stateInfoFilterJC(state, type) {
				let state_info = {
					state: '',
					type: ''
				}
				switch (state) {
					case 'review':
						state_info.state = '质检复核';
						state_info.type = 'info';
						break;
					case 'sent':
						state_info.state = '待检验';
						state_info.type = 'warning';
						break;
					case 'pending':
						state_info.state = '待判定';
						state_info.type = 'warning';
						break;
					case 'released':
						state_info.state = '可放行';
						state_info.type = 'success';
						break;
					case 'returned':
						state_info.state = '已完成';
						state_info.type = 'error';
						break;
					default:
						state_info.state = '--';
						state_info.type = 'info';
						break;
				}
				return type === 'state' ? state_info.state : state_info.type;
			},
			stateInfoFilterGC(state, type) {
				let state_info = {
					state: '',
					type: ''
				}
				switch (state) {
					case 'cancel':
						state_info.state = '已取消';
						state_info.type = 'info';
						break;
					case 'feedback':
						state_info.state = '已反馈';
						state_info.type = 'info';
						break;
					case 'to_process':
						state_info.state = '待处理';
						state_info.type = 'warning';
						break;
					case 'approval':
						state_info.state = '审批中';
						state_info.type = 'primary';
						break;
					case 'submitted':
						state_info.state = '已提交';
						state_info.type = 'primary';
						break;
					case 'qualified':
						state_info.state = '合格';
						state_info.type = 'success';
						break;
					case 'done':
						state_info.state = '已完成';
						state_info.type = 'success';
						break;
					default:
						state_info.state = '--';
						state_info.type = 'info';
						break;
				}
				return type === 'state' ? state_info.state : state_info.type;
			}
		},
		methods: {
			async initData() {
				await this.$mStore.dispatch('user/hasGroup', groupSigns.JISHU);
				await this.getOperationList();
				if (this.isJISHU) {
					this.filterInfo.check_result = '技术判定';
					// this.typeList = [{
					// 	text: '成品检验',
					// 	value: 'final_check',
					// 	type: 'success',
					// 	count: 0
					// }]
				}
				this.getProductionList();
			},
			async refresh() {
				this.search_word = '';
				await this.getOperationList();
				this.getProductionList();
			},
			renderDomain(ids = []) {
				let domain = [];
				if (this.filterInfo.check_result) {
					domain = [
						...domain,
						['check_result', '=', this.filterInfo.check_result]
					]
				}
				domain = [
					...domain,
					// ['quality_check_type', 'ilike', this.typeValue],
					// ['id', 'in', ids],
				]
				if (this.search_word) {
					domain = [
						...domain,
						['lot_producing_id.name', 'ilike', this.search_word],
					]
				}
				// if (this.typeValue === 'final_check') {
				// 	domain = [
				// 		...domain,
				// 		['state', '=', 'done'],
				// 	]
				// }
				if (ids.length > 0) {
					domain = [
						...domain,
						['id', 'in', ids],
					]
				}

				if (this.filterInfo.check_type) {
					domain = [
						...domain,
						['check_type', '=', this.filterInfo.check_type]
					]
				}
				if (this.filterInfo.repair_state) {
					domain = [
						...domain,
						['repair_state', '=', this.filterInfo.repair_state]
					]
				}
				if (this.filterInfo.categ_id) {
					domain = [
						...domain,
						['categ_id', '=', this.filterInfo.categ_id]
					]
				}
				if (this.search_read) {
					domain = [
						...domain,
						['lot_producing_id', '=', this.search_read]
					]
				}
				if (this.typeValue === 'in_process_check' && this.workshop) {
					domain = [
						...domain,
						['workshops_for_process_check', 'ilike', this.workshopName]
					]
				}

				return domain;
			},
			async getProductionList(id) {
				let vListRef = this.$refs?.vListRef;
				if (vListRef) vListRef.loadmore = 'loading';
				this.listLoading = true;
				let ids = [];
				if (!id) {
					// const company_id = uni.getStorageSync('company_id')
					// const checkModel = api.env.model('quality.check')
					// // const PointModel = api.env.model('quality.point')
					// // const pointList = await PointModel.search_read({
					// // 	domain: [
					// // 		['quality_point_type', '=', this.typeValue],
					// // 	]
					// // })
					// // let pointIds = pointList?.map(item => item.id) ?? [];
					// let domain = [
					// 	['quality_point_type', '=', this.typeValue],
					// 	['production_id', '!=', false],
					// ]
					// if(this.typeValue === 'in_process_check' && this.workshop) {
					// 	domain = [
					// 		...domain,
					// 		['workshop', '=', this.workshop]
					// 	]
					// }
					// const check_res = await checkModel.search_read({
					// 	domain,
					// 	fields: ["production_id"]
					// });
					// if (check_res?.length > 0) {
					// 	ids = [...new Set(check_res.map(c => c.production_id[0]))];
					// }
				} else {
					ids = [id]
				}
				let res = [];
				if (this.typeValue === 'incoming_check') {
					let kw = {
						limit: this.pageSize,
						offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
					};
					// if (this.filterInfo.check_result) {
					// 	kw.check_result = this.filterInfo.check_result;
					// }
					if (this.filterInfo.categ_id) {
						kw.category_id = this.filterInfo.categ_id;
					}
					if (this.search_word) {
						kw.barcode = this.search_word;
					}
					let result = await api.web.dataset.call_kw({
						model: 'quality.inspection.entry',
						method: 'get_entry_inspection_details',
						args: [
							[]
						],
						kwargs: kw
					});
					res = result?.list || [];
					this.total = result?.total ?? 0;
					if (res.length > 0) {
						// this.toQualityCheck(res[0]);
					}
				} else if (this.typeValue === 'mould_workshop') {
					let kw = {
						limit: this.pageSize,
						offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
					};
					let domain = [
						['state', '!=', 'pending']
					]
					if (this.filterInfo.check_result === '技术判定') {
						domain = [
							['state', '=', 'pending']
						]
					}
					// if (this.filterInfo.check_result) {
					// 	kw.check_result = this.filterInfo.check_result;
					// }
					// if (this.filterInfo.categ_id) {
					// 	kw.category_id = this.filterInfo.categ_id;
					// }
					// if (this.search_word) {
					// 	kw.lot_id = this.search_word;
					// }
					let result = await api.web.dataset.call_kw({
						model: 'mould.inspection.record',
						method: 'pad_get_inspection_records_by_criteria',
						args: [
							[]
						],
						kwargs: {
							...kw,
							domain
						}
					});
					res = result?.results?.length > 0 ? result.results : [];
					this.total = result?.count ?? 0;
				} else if (this.typeValue === 'in_process_check') {
					let kw = {
						order: 'inspection_date desc',
						limit: this.pageSize,
						offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
					};
					let domain = [
						['state', '!=', 'pending']
					]
					if (this.filterInfo.check_result === '技术判定') {
						domain = [
							['state', '=', 'pending']
						]
					}
					// if (this.filterInfo.check_result) {
					// 	kw.check_result = this.filterInfo.check_result;
					// }
					// if (this.filterInfo.categ_id) {
					// 	kw.category_id = this.filterInfo.categ_id;
					// }
					// if (this.search_word) {
					// 	kw.lot_id = this.search_word;
					// }
					const result = await api.web.dataset.call_kw({
						model: 'ipc.record',
						method: 'get_ipc_info',
						args: [],
						kwargs: {
							...kw,
							domain,
							process_id: this.workcenter.value,
						}
					})
					res = result?.list?.length > 0 ? result.list : [];
					this.total = result?.total ?? 0;
				} else {
					const Model = api.env.model('mrp.production');
					let domain = this.renderDomain(ids);
					const total = await api.web.dataset.call_kw({
						model: 'mrp.production',
						method: 'search_count',
						args: [
							domain
						],
						kwargs: {}
					});
					res = await Model.search_read({
						order: "id DESC",
						domain,
						limit: this.pageSize,
						offset: (this.pageNo - 1 > 0 ? this.pageNo - 1 : 0) * 10,
						fields: this.typeValue === 'incoming_check' ? [] : [
							"batch_code", "date_start", "bom_id", "categ_id", "check_ids", "check_result",
							"check_type",
							"company_id",
							"complete_lot_num",
							"display_name", "id", "gf_qty", "lot_producing_id", "origin",
							"product_id", "product_name", "product_code", "product_qty", "size",
							"product_tracking",
							"serial_num",
							"task_qty", "tracking", "state", "to_check_state", "repair_state", "tech_note"
						]
					});
					this.total = total;
				}
				uni.stopPullDownRefresh();
				this.listLoading = false;
				if (res) {
					this.searchList = res.length ? [...res] : [];
				} else {
					if (vListRef) vListRef.loadmore = 'loadmore'
					if (vListRef) vListRef.loadText.loadmore = '加载失败，点击重试'
				}
			},
			async getOperationList() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.process',
					method: 'get_operation_list',
					args: [],
					kwargs: {}
				})
				if (res?.length > 0) {
					let list = res.map((w) => ({
						name: w.process_name,
						value: w.process_id
					}))
					this.workcenter_list = [...list];
					this.workcenter = this.workcenter_list[0];
				}
			},
			paginationReset() {
				this.pageNo = 1;
				this.pageSize = 10;
			},
			filterClear() {
				this.filterInfo = {
					categ_id: null,
					check_result: null,
					check_type: null,
					repair_state: null
				}
			},
			// 搜索使用节流
			searchChange(isReset) {
				isReset && this.paginationReset();
				this.$u.debounce(() => {
					// this.searchList = this.search_word ?
					// 	this.ProductionList.filter(item =>
					// 		typeof item.complete_lot_num === 'string' &&
					// 		item.complete_lot_num.toLowerCase().includes(this.search_word.toLowerCase())) : [...
					// 		this.ProductionList
					// 	]···············
					this.getProductionList();
				}, 500)
			},
			workshopChange(workshop) {
				this.workshop = workshop.value;
				this.paginationReset();
				this.getProductionList();
			},
			workcenterChange(workcenter) {
				this.workcenter = workcenter;
				this.paginationReset();
				this.getProductionList();
			},
			typeClick(type) {
				if (this.listLoading) return;
				this.typeValue = type.value;
				this.filterInfo = {
					categ_id: null,
					check_result: this.isJISHU ? '技术判定' : '待检验',
					check_type: null,
					repair_state: null
				};
				this.paginationReset();
				if (this.search_word) {
					this.search_word = '';
				} else {
					this.getProductionList();
				}
			},
			filterChange() {
				this.paginationReset();
				this.getProductionList();
			},
			categorySelect(res) {
				this.paginationReset();
				this.filterInfo.categ_id = res?.length > 0 ? res[0] : res;
				this.getProductionList();
				this.closeDropdown();
			},
			categorySelectClose() {
				this.closeDropdown();
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			// 消息通知
			noticeClick() {
				uni.navigateTo({
					url: '/pages/tqgf/message_notification/index?from=production_page'
				})
			},
			scanGuoChengResult(barcode) {
				// api.web.dataset.call_kw({
				// 	model: 'mrp.production',
				// 	method: 'get_ipc_points_and_production_info',
				// 	args: [],
				// 	kwargs: {
				// 		barcode: barcode,
				// 		process_id: this.workcenter.value,
				// 		process_name: this.workcenter.name
				// 	}
				// }).then(async (result) => {
				// 	if (result?.length > 0) {
				// 		let points = result;
				// 		// this.filterInfo = {
				// 		// 	categ_id: null,
				// 		// 	check_result: null,
				// 		// 	check_type: null,
				// 		// 	repair_state: null
				// 		// }
				// 		// // await this.getProductionList(result);
				// 		// this.search_word = barcode;
				// 		// let obj = {
				// 		// 	id: product.id,
				// 		// 	_ids: []
				// 		// }
				// 		this.toGuoChengCheck(points);
				// 	} else {
				// 		this.$refs.uToast.show({
				// 			title: '未找到匹配项',
				// 			type: 'warning',
				// 		})
				// 	}
				// })
				this.toGuoChengCheck(null, barcode);
			},
			// 扫码
			scanClick() {
				// #ifdef H5
				uni.showToast({
					title: '不支持扫码',
					icon: 'none'
				})
				// if (this.typeValue === 'in_process_check') {
				// 	this.scanGuoChengResult('T2019-2/HQ320XBA-24-1017-316')
				// } else {
				// 	this.search_word = 'TQZH241016ZC01/Q24-097-4132-24-1101-099';
				// 	this.getProductionList();
				// }
				// #endif
				// #ifdef APP-PLUS
				uni.scanCode({
					success: async (res) => {
						this.fullLoading = true;
						if (this.typeValue === 'in_process_check') {
							this.scanGuoChengResult(res.result);
						} else {
							this.search_word = res.result || '';
							this.getProductionList();
						}
						// this.search_word = res.result || '';
						// await this.getProductionList();
						// let params = this.searchList.length > 0 ? this.searchList[0] : null;
						// if (params) {
						// 	this.toQualityCheck(params);
						// } else {
						// 	this.$refs.uToast.show({
						// 		title: '未找到匹配项',
						// 		type: 'warning',
						// 	})
						// }
					},
					complete: () => {
						this.fullLoading = false;
					},
					fail: (err) => {
						this.$refs.uToast.show({
							title: JSON.stringify(err),
							type: 'error',
						})
					}
				});
				// #endif
			},
			noteClick(row) {
				this.rowItem = row;
				this.productionNoteShow = true;
			},
			pageChange(pageNo) {
				this.pageNo = pageNo;
				this.getProductionList();
			},
			toQualityCheck(item) {
				let path = this.typeValue === 'in_process_check' ?
					'/pages/tqgf/application/quality_check/product_inspection_course' : this.typeValue ===
					'incoming_check' ? '/pages/tqgf/application/quality_check/product_inspection_enter' : this
					.typeValue === 'mould_workshop' ?
					'/pages/tqgf/application/quality_check/product_inspection_piliang_mould' :
					'/pages/tqgf/application/quality_check/product_inspection'
				// if (this.isJISHU) {
				// #ifdef H5
				if (this.typeValue === 'final_check') {
					// const Model = api.env.model('mrp.production');
					let domain = this.renderDomain();
					// Model.search_read({
					// 	order: "id DESC",
					// 	domain,
					// 	fields: [
					// 		"id"]
					// }).then((res) => {
					// 	if (res && res.length) {
					// 		const ids = res.map(p => p.id);
							
					// 	}
					// })
					let obj = {
						id: item.id,
						_ids: [],
						domain,
						search_word: item.complete_lot_num
					}
					const params = encodeURIComponent(JSON.stringify(obj));
					uni.navigateTo({
						url: `${path}?typeValue=${this.typeValue}&workshop=${this.workshop}&params=${params}`
					})
				} else {
					let obj = this.typeValue === 'incoming_check' ? {
						...item,
						_ids: []
					} : {
						id: item.id,
						_ids: []
					}
					delete obj.control_points;
					delete obj.control_point_results;
					const params = encodeURIComponent(JSON.stringify(obj));
					uni.navigateTo({
						url: `${path}?typeValue=${this.typeValue}&workshop=${this.workshop}&params=${params}`
					})
				}
				// } else {
				// #endif
				// #ifndef H5
				let domain = this.renderDomain();
				let obj = this.typeValue === 'incoming_check' ? {
					...item,
					_ids: []
				} : {
					id: item.id,
					_ids: [],
					domain,
					search_word: item.complete_lot_num
				}
				const params = encodeURIComponent(JSON.stringify(obj));
				uni.navigateTo({
					url: `${path}?typeValue=${this.typeValue}&workshop=${this.workshop}&params=${params}`
				})
				// #endif
				// }
			},
			// 批量检验
			topiliangjianyan() {
				if (this.typeValue === 'mould_workshop') {
					uni.navigateTo({
						url: `/pages/tqgf/application/quality_check/product_inspection_piliang_mould?typeValue=${this.typeValue}`
					})
				} else if (this.typeValue === 'in_process_check') {
					this.toGuoChengCheck();
				} else {
					let obj = {
						typeValue: 'final_check'
					}
					const params = encodeURIComponent(JSON.stringify(obj));
					uni.navigateTo({
						url: `/pages/tqgf/application/quality_check/product_inspection_piliang?typeValue=${this.typeValue}`
					})
				}

			},
			toGuoChengCheck(item, barcode) {
				let obj = {
					barcode: barcode || '',
					process_id: this.workcenter.value,
					process_name: this.workcenter.name,
					inspection_id: item?.inspection_id ?? null,
					categ_id: item?.categ_id ?? null
				}
				let path = '/pages/tqgf/application/quality_check/product_inspection_piliang_guocheng'
				const params = encodeURIComponent(JSON.stringify(obj));
				uni.navigateTo({
					url: `${path}?typeValue=${this.typeValue}&params=${params}`
				})
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();

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
		onPageScroll(e) {},
		onPullDownRefresh() {
			this.refresh();
		},
		onShow() {
			if (!this.isFirst) {
				this.getProductionList();
				setTimeout(() => {
					this.scanStart();
				}, 300)
			}
		},
		onHide() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onLoad() {
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
	.mrp-production-page {
		.u-size-mini {
			font-size: 24rpx;
		}

		.mrp-container {
			display: flex;

			.page-menu {
				width: 320rpx;
				height: 100vh;
				position: fixed;
				left: 0;
				top: 0;

				&.style2 {
					padding: 20rpx;
					border-right: 1px solid rgba(0, 0, 0, .1);

					.tag-box {
						.tag-item {
							border-radius: 10rpx;
							margin-bottom: 10px;

							&:not(:last-child) {
								border-bottom: 0;
							}
						}
					}
				}

				.tag-box {
					.tag-item {
						position: relative;
						box-sizing: border-box;
						border-radius: 0;
						display: block;
						height: 100rpx;
						line-height: 100rpx;
						font-size: 36rpx;
						color: #333;
						border: none;
						text-align: center;

						&:not(:last-child) {
							border-bottom: 2rpx solid #c8c9cc;
						}
					}
				}
			}

			.page-content {
				flex: 1;
				padding-left: 320rpx;

				.list-container {
					background-color: #f5f5f5;
					padding: 20rpx;
					padding-top: 220rpx;
					max-height: 100%;
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
			bottom: 350rpx;
			right: 40rpx;
			border-radius: 50%;
		}

		.search-sticky {
			width: calc(100vw - 320rpx);
			background-color: #fff;
			padding-top: 20rpx;
			border-bottom: 1px solid rgba(0, 0, 0, .1);
			position: fixed;
			z-index: 99;

			.workshop {
				background-color: #fff;
				padding: 20rpx 30rpx;

				.u-tag {
					margin-right: 15rpx;
					margin-bottom: 10rpx;
					&:last-child {
						margin-right: 0;
					}
				}
			}

			.search-container {
				position: relative;
				height: 80rpx;
				margin: 0 30rpx;
				margin-bottom: 20rpx;

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
					font-size: 38rpx;
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

		.tag-box {
			.tag-item {
				position: relative;
				box-sizing: border-box;
				border-radius: 4rpx;
				display: block;
				height: 64rpx;
				line-height: 64rpx;
				font-size: 28rpx;
				padding: 0rpx 28rpx;
				background-color: #f4f4f5;
				color: #909399;
				border: 1px solid #c8c9cc;
				transition: all .5s;

				&.dark {
					background-color: #909399;
					color: #fff;
					border-color: #909399;
				}

				&:not(:last-child) {
					border-bottom: 2rpx solid #ddd;
				}

				&.primary {
					background-color: #ecf5ff;
					color: $uni-color-primary !important;
					border-color: $uni-color-primary;

					&.dark {
						background-color: $uni-color-primary;
						color: #fff !important;
						border-color: $uni-color-primary;
					}
				}

				&.success {
					background-color: #dbf1e1;
					color: $uni-color-success;
					border-color: $uni-color-success;

					&.dark {
						background-color: $uni-color-success;
						color: #fff;
						border-color: $uni-color-success;
					}
				}

				&.error {
					background-color: #fef0f0;
					color: $uni-color-error;
					border-color: $uni-color-error;

					&.dark {
						background-color: $uni-color-error;
						color: #fff;
						border-color: $uni-color-error;
					}
				}

				&.warning {
					background-color: #fdf6ec;
					color: $uni-color-warning;
					border-color: $uni-color-warning;

					&.dark {
						background-color: $uni-color-warning;
						color: #fff;
						border-color: $uni-color-warning;
					}
				}

				.tag-badge {
					font-size: 28rpx !important;
					padding: 8rpx 12rpx !important;
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
	}

	@media (min-width: 481px) {
		.global_empty {
			left: calc(50% + 320rpx / 2);
			top: 44%;
		}
	}

	// 手机端
	@media (max-width: 480px) {
		.mrp-production-page {

			.mrp-container {
				flex-direction: column;

				.page-menu {
					display: none;
				}

				.page-content {
					padding-left: 0;

					.list-container {
						padding-top: 290rpx;
					}
				}

				.search-sticky {
					width: 100vw;

					.search-container {
						height: 70rpx;
					}

					.workshop {
						padding: 15rpx 20rpx;

						.u-tag {
							margin-right: 4rpx;
						}
					}

					/deep/ .search-sign {
						.u-content {
							height: 70rpx !important;
						}

						.u-input {
							font-size: 28rpx;
						}
					}

					.tag-box {
						margin-top: 12rpx;
						padding: 0 20rpx 10rpx;

						.tag-item {
							display: inline-block;
							height: 64rpx;
							line-height: 64rpx;

							&:not(:last-child) {
								margin-right: 16rpx;
								margin-top: 8rpx;
							}
						}
					}
				}
			}
		}
	}
</style>