<template>
	<view class="product_inspection">
		<u-toast ref="uToast" />
		<!-- 悬浮扫码 -->
		<!-- #ifdef APP-PLUS -->
		<view v-if="isEdit" class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view>
		<!-- #endif -->
		<!-- <view v-if="!inspection_list_arr.length <= 0" class="tishi_title">请扫描需要批量检验的产品</view> -->
		<page-loading :loadmore="loadmore" @refresh="refresh">
			<u-table>
				<u-tr style="height: 45px;">
					<u-td class="table-label">供应商</u-td>
					<u-td><input style="height: 100%;" :value="production_obj.supplier"
							@blur="(event) => inputFormBlur(event, 'supplier')" type="text" input-align="center"
							:clearable="false" placeholder="" :disabled="!isEdit" /></u-td>
					<u-td class="table-label">合同号</u-td>
					<u-td><input style="height: 100%;" :value="production_obj.contract_no"
							@blur="(event) => inputFormBlur(event, 'contract_no')" type="text" input-align="center"
							:clearable="false" placeholder="" :disabled="!isEdit" /></u-td>
					<u-td class="table-label">进场批次</u-td>
					<u-td><input style="height: 100%;" :value="production_obj.factory_batch"
							@blur="(event) => inputFormBlur(event, 'factory_batch')" type="text" input-align="center"
							:clearable="false" placeholder="" :disabled="!isEdit" /></u-td>
				</u-tr>
				<u-tr style="height: 45px;">
					<u-td class="table-label">模具名称</u-td>
					<u-td>
						<uni-data-select class="mould_name" v-model="production_obj.mould_name"
							:localdata="mould_name_data" :clear="false" @change="mouldNameChange"
							:disabled="!isEdit"></uni-data-select>
						<!-- <input style="height: 100%;" :value="production_obj.mould_name"
							@blur="(event) => inputFormBlur(event, 'mould_name')" type="text" input-align="center"
							:clearable="false" placeholder="" /> -->
					</u-td>
					<u-td class="table-label">规格型号</u-td>
					<u-td><input style="height: 100%;" :value="production_obj.specification_signal"
							@blur="(event) => inputFormBlur(event, 'specification_signal')" type="text"
							input-align="center" :clearable="false" placeholder="" :disabled="!isEdit" /></u-td>
					<u-td class="table-label">送检数量</u-td>
					<u-td>
						<!-- <u-number-box v-model="production_obj.numbers_to_inspection"></u-number-box> -->
						<input style="height: 100%;" :value="production_obj.numbers_to_inspection"
							@blur="(event) => inputFormBlur(event, 'numbers_to_inspection')" type="number"
							input-align="center" :clearable="false" placeholder="" :disabled="!isEdit" />
					</u-td>
					<u-td class="table-label">检验数量</u-td>
					<u-td>
						<!-- <u-number-box v-model="production_obj.numbers_fo_inspection"></u-number-box> -->
						<input style="height: 100%;" :value="production_obj.numbers_fo_inspection"
							@blur="(event) => inputFormBlur(event, 'numbers_fo_inspection')" type="number"
							input-align="center" :clearable="false" placeholder="" :disabled="!isEdit" />
					</u-td>
				</u-tr>
				<u-tr style="height: 40px;"
					:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
					<u-td
						style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
							type="text" placeholder-style="color: #333;" placeholder="检验依据" input-align="center"
							disabled /></u-td>
					<u-th :style="{flex: isBespread ? '0 0 ' + (300 * categoryList.length) + 'rpx' : ''}"
						style="flex-grow: 1; text-align: center; padding: 10rpx 30rpx;">
						{{ production_obj.inspection_regulation || '' }}
					</u-th>
				</u-tr>
				<u-tr style="height: 40px;"
					:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
					<u-td
						style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
							type="text" placeholder-style="color: #333;" placeholder="外观" input-align="center"
							disabled /></u-td>
					<u-th :style="{flex: isBespread ? '0 0 ' + (300 * categoryList.length) + 'rpx' : ''}"
						style="flex-grow: 1; text-align: center; padding: 10rpx 30rpx;">
						{{ production_obj.exterior || '' }}
					</u-th>
				</u-tr>
			</u-table>
			<!-- <scroll-view scroll-x scroll-y show-scrollbar id="scroll-view-box" class="product-table"
				:scroll-top="scrollTop" :style="{height: iskeyOpen ? 'calc(100% - 386rpx + 110rpx + 154rpx)' : ''}"> -->
			<view v-if="category_id" class="product-table"
				:style="{height: iskeyOpen ? 'calc(100% - 254rpx - 110rpx - 154rpx - 342rpx)' : ''}">
				<!-- <view class="my-scroll-view">
					<view class="my-scroll-view" style="overflow: auto;">
						<view class="my-scroll-view-content"> -->
				<u-table style="border-top: none; table-layout: fixed; width: 100%; padding-bottom: 260rpx;"
					id="scroll-view-content">
					<u-tr style="height: auto; position: sticky; top: 0; z-index: 11;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td
							style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
								type="text" placeholder-style="color: #333;" :placeholder="`检验项`" input-align="center"
								disabled /></u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr>
								<u-th :width="isBespread ? '300rpx' : ''" style="white-space: pre-wrap;"
									v-for="(item, index) in categoryList" :key="index">
									{{item.type}}
								</u-th>
							</u-tr>
							<u-tr>
								<u-th :width="isBespread ? '300rpx' : ''" style="white-space: pre-wrap;"
									v-for="(item, index) in categoryList" :key="index">
									<view :style="{fontSize: item.type_s.length > 10 ? '20rpx' : '24rpx'}"
										v-if="item.type_s">{{item.type_s }}</view>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="height: 60rpx;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td
							style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
								type="text" placeholder-style="color: #333;" placeholder="检验工具" input-align="center"
								disabled /></u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr>
								<u-th :width="isBespread ? '300rpx' : ''" style="font-weight: 400;"
									class="category-cell" v-for="(item,index) in categoryList" :key="index">
									<view v-if="item.type == '外观'"></view>
									<template v-else>
										<!-- <u-input v-model="item.tool" type="select" input-align="center"
															placeholder="请选择" @click.native="handleFocus(index, toolList)" /> -->
										<u-input v-model="item.tool" type="text" input-align="center" disabled
											placeholder="" />
									</template>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="height: 60rpx;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td
							style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
								type="text" placeholder-style="color: #333;" placeholder="工具编号" input-align="center"
								disabled /></u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr>
								<u-th :width="isBespread ? '300rpx' : ''" style="font-weight: 400;"
									v-for="(item,index) in categoryList" :key="index">
									<view v-if="item.type == '外观'"></view>
									<template v-else>
										<u-input v-model="item.code" type="text" input-align="center" disabled
											placeholder="" />
									</template>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="height: 60rpx;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}"
						v-if="production_obj.x_norm_tolerance">
						<u-td
							style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
								type="text" placeholder-style="color: #333;" placeholder="检验公差" input-align="center"
								disabled /></u-td>
						<u-th :style="{flex: isBespread ? '0 0 ' + (300 * categoryList.length) + 'rpx' : ''}"
							style="flex-grow: 1; text-align: left; padding: 10rpx 30rpx;">
							{{ production_obj.x_norm_tolerance || '' }}
						</u-th>
					</u-tr>
					<u-tr style="height: auto;"
						:style="{width: isBespread ? list.inspection_list[0].length * 300 + 294 + 'rpx' : 'auto'}"
						v-for="(list, l_index) in inspection_list_arr" :key="l_index">
						<!-- <u-td style="width: 200rpx; flex: none; font-size: 40rpx; font-weight: bold;
											writing-mode: vertical-rl; letter-spacing: 10rpx; text-orientation: upright;">第1次检验</u-td> -->

						<u-td style="width: 294rpx; flex: none; font-size: 22rpx; color: #333;
											overflow-wrap: break-word; position: sticky; left: 0; background-color: #fff; z-index: 10;">
							<uni-icons v-if="isEdit" type="minus-filled" :size="26" color="#EA5455"
								@click="delInspectionList(l_index)"></uni-icons>
							<uni-data-select v-if="isEdit" class="mould_select" v-model="list.lot_id"
								:localdata="mould_select_data" :clear="false"
								@change="(e) => mouldSelectChange(e, l_index)"></uni-data-select>
							<view v-else style="font-size: 24rpx;">{{list.default_code}}</view>
							<!-- <textarea v-else
								style="width: 100%; font-size: 26rpx; padding: 12rpx 18rpx; border: 1rpx solid #dadbde; border-radius: 8rpx;"
								:value="list.lot_id" @blur="(event) => inputTextBlur3(event, l_index)" auto-height
								:placeholder="''"></textarea> -->
						</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<!-- <check-input v-for="(item,index) in inspection_list" :key="index"
												:inspection_list_item="item" :is-edit="isEdit" :isBespread="isBespread"
												@inputBlur="(event, index2) => inputBlur(event, index, index2, l_index)"></check-input> -->
							<u-tr v-for="(item,index) in list.inspection_list" :key="index" style="height: 100%;">
								<u-td :width="isBespread ? '300rpx' : 'auto'" class="category-cell"
									v-for="(i,index2) in item" :key="index2">
									<!-- <view
										:style="{position: 'absolute', left: 0, width: '100%', height: '100rpx', lineHeight: '100rpx', backgroundColor: '#fff', zIndex: l_index == rowIndex && index === cellIndex && index2 === inputIndex ? 3 : 1}">
										<input v-if="i.type_value === 'Measure'" style="height: 100%;"
											:value="i[i.type]"
											@blur="(event) => inputBlur(event, index, index2, l_index)" :type="'number'"
											:focus="l_index == rowIndex && index === cellIndex && index2 === inputIndex"
											input-align="center" :clearable="false"
											:placeholder="i[i.type] === null ? '*' : ''" :disabled="
														i[i.type] === null ||
														!isEdit ||
														i.title === '密度'" />
										<u-input v-else :value="i[i.type]" @input="inputTextChange"
											@blur="(event) => inputTextBlur(event, index, index2, l_index)" type="text"
											:focus="true" input-align="center" :clearable="false"
											:placeholder="i[i.type] === null ? '*' : ''"
											:disabled="i[i.type] === null || !isEdit" />
									</view>
									<view
										:style="{position: 'absolute', left: 0, width: '100%', height: '100rpx', lineHeight: '100rpx', backgroundColor: '#fff', zIndex: 2}">
										<text style="color: #999999;"
											v-if="i[i.type] === null || !isEdit || i.title === '密度'">*</text>
										<text v-else
											style="display: inline-block; height: 100%; width: 100%; line-height: 100rpx;"
											@click="showInput(index, index2, l_index)">{{i[i.type]}}</text>
									</view> -->
									<input v-if="i.type_value === 'Measure'" style="height: 100%;"
										:style="i[i.type] && (i[i.type] > i.tolerance_max || i[i.type] < i.tolerance_min) ? {color: 'red', fontWeight: 'bold'} : {color:  '#606266'}"
										:value="i[i.type]" @blur="(event) => inputBlur(event, index, index2, l_index)"
										:type="'number'" input-align="center" :clearable="false"
										:placeholder="i[i.type] === null ? '*' : ''" :disabled="
													i[i.type] === null ||
													!isEdit ||
													i.title === '密度'" />
									<input v-else :value="i[i.type]" @input="inputTextChange"
										@blur="(event) => inputTextBlur(event, index, index2, l_index)" type="text"
										:placeholder="i[i.type] === null ? '*' : ''"
										:disabled="i[i.type] === null || !isEdit" />
								</u-td>
							</u-tr>
						</u-td>
					</u-tr>
				</u-table>
				<!-- </view>
					</view>
				</view> -->
			</view>

			<!-- </scroll-view> -->
			<u-table :style="iskeyOpen ? hideStyle : {}" v-if="true"
				style="position: fixed; left: 0; bottom: 152rpx; z-index: 99;">
				<u-tr style="height: 100rpx;">
					<template v-if="isEdit">
						<u-td style="font-weight: bold;font-size: 32rpx; color: #333;"
							:style="isJISHU ? {flex: 'none', width: '260rpx'} : {}">检验员</u-td>
						<u-td :style="isJISHU ? {flex: 'none', width: '360rpx'} : {}">
							<input :value="inspector_user" @blur="(event) => inputTextBlur2(event)" type="text"
								input-align="center" :clearable="false" :disabled="!isEdit" />
						</u-td>
					</template>
					<!-- <u-td v-if="!isJISHU" style="font-weight: bold;font-size: 32rpx; color: #333;">检验类型</u-td>
					<u-td v-if="!isJISHU" style="align-items: center;">
						<u-radio-group v-model="production_obj.check_type">
							<u-radio v-for="(item, index) in checkTypeList" :key="index" :name="item.value">
								{{item.label}}
							</u-radio>
						</u-radio-group>
					</u-td> -->
					<!-- <u-td style="font-weight: bold;font-size: 32rpx; color: #333;">检验结果</u-td>
					<u-td>
						<text style="font-weight: bold;font-size: 40rpx;"
							:style="{color: checkResultFilter(production_obj.check_result)}">{{production_obj.check_result || ''}}</text>
					</u-td> -->
					<template v-if="isJISHU">
						<u-td style="font-weight: bold;font-size: 32rpx; color: #333;">处理意见</u-td>
						<u-td>
							<textarea :value="production_obj.conclusion" :clearable="false" placeholder=""
								@blur="(event) => inputFormBlur(event, 'conclusion')"
								style="width: 100%; max-height: 100%;" />
						</u-td>
					</template>
				</u-tr>
			</u-table>
			<view :style="iskeyOpen ? hideStyle : {}" style="z-index: 99; padding-right: 180rpx;"
				class="product-btn-box" v-if="isEdit && production_obj.mould_name">
				<view class="btn-box-left">
					<!-- <u-button :loading="saveLoading" type="primary" @click="inspectionConfirm(false)">暂存/保存</u-button> -->
					<u-button type="success" :loading="submitLoading" @click="inspectionConfirm(true)">提交</u-button>
					<!-- <text v-if="resetCheckLoading" style="opacity: .7;">
						<u-loading style="margin-bottom: 4rpx; margin-right: 10rpx;" mode="circle"
							:color="$mStore.state.themeColor.color"></u-loading>
						一键清空质检数据
					</text>
					<text v-else @click="resetCheck">一键清空质检数据</text> -->
				</view>
				<view class="btn-box-right">
					<view class="btn-box-label">人工判定</view>
					<u-button type="success" :loading="submitLoading" @click="judgeHanlder('success')">合格</u-button>
					<u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">技术判定</u-button>
					<!-- <u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button> -->
					<!-- <u-button type="primary" :loading="submitLoading" @click="judgeHanlder('primary')">已处理</u-button> -->
				</view>
				<!-- <view class="btn-box-right"
					v-if="!production_obj.check_result || production_obj.check_result == '让步放行'">
					<u-button type="primary" :loading="submitLoading" @click="submit_jishu">提交技术判定</u-button>
				</view> -->
			</view>
			<view :style="iskeyOpen ? hideStyle : {}" class="product-btn-box" v-else-if="isJISHU">
				<view class="btn-box-right">
					<view class="btn-box-label">技术判定</view>
					<!-- <u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">让步放行</u-button>
					<u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button> -->
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('primary')">完成判定</u-button>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<!-- <template>
				<view class="pagination-btn left" :class="paginationIndex <= 0 ? 'disabled' : ''"
					@click="prevHandle(paginationIndex)">
					<u-icon name="arrow-left" size="60" :color="$mStore.state.themeColor.color"></u-icon>
				</view>
				<view class="pagination-btn right" :class="paginationIndex >= pagination_ids.length ? 'disabled' : ''"
					@click="nextHandle(paginationIndex)">
					<u-icon name="arrow-right" size="60" :color="$mStore.state.themeColor.color"></u-icon>
				</view>
			</template> -->
			<!-- #endif -->

			<u-popup class="show-header popup-loading" v-model="searchToolFlag" mode="bottom">
				<view class="popup-header">
					<view class="right" :style="{color: $mStore.state.themeColor.color}" @click="selectTool">清除选择
					</view>
				</view>
				<view v-if="toolsLoading" class="popup-empty">
					<u-loading mode="circle"></u-loading>
				</view>
				<view v-else-if="matchToolList.length <= 0" class="popup-empty">
					<empty text="暂无工具"></empty>
				</view>
				<u-cell-item v-else v-for="(item, index) in matchToolList" :key="index" :title="item.text"
					:arrow="false" @click="selectTool(index)"></u-cell-item>
			</u-popup>
			<u-action-sheet :list="eligibleList" v-model="eligibleToolFlag" :safe-area-inset-bottom="true"
				cancel-text="清除选择" @click="selectEligible" @close="closeEligible"></u-action-sheet>
			<u-modal ref="repairPopup" v-model="repairShow" width="800" title="返修原因/说明" show-cancel-button async-close
				confirm-text="提交" :title-style="{paddingTop: '32rpx', fontSize: '32rpx'}" @confirm="repairConfirm"
				@cancel="repairClose">
				<view class="repair-content" style="padding: 20rpx 30rpx;">
					<textarea v-model="repairDec" placeholder="请描述返修原因/建议" auto-height auto-focus />
				</view>
			</u-modal>
		</page-loading>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import dayjs from 'dayjs';
	import {
		groupSigns
	} from '@/common/const';
	import {
		check_type_list
	} from '../data.js';
	import pageLoading from '@/components/pageLoading/index.vue';
	import checkInput from './check_input.vue';
	import {
		htmlToText
	} from './utils';
	export default {
		components: {
			pageLoading,
			checkInput
		},
		data() {
			return {
				toolTimer: null,
				saveTimer: null,
				submitTime: null,
				iskeyOpen: false,
				containerStyle: {},
				loadmore: 'loadmore',
				isSave: false,
				saveLoading: false,
				submitLoading: false,
				toolsLoading: false,
				resetCheckLoading: false,
				repairShow: false,
				typeValue: '',
				workshop: '',
				check_name: '',
				production_obj: {},
				production_obj_init: {},
				check_list: [],
				category_list: [],
				other_category_list: [],
				inspection_list: [],
				inspection_list_arr: [],
				userList: [],
				editingIndex: null,
				editRowIndex: null,
				toolList: [],
				hideStyle: {
					height: 0,
					overflow: 'hidden',
					padding: 0,
					border: 0
				},
				confirmStyle: {
					height: '110rpx',
					lineHeight: '110rpx',
					paddingRight: '20px',
					fontSize: '36px',
					marginTop: '20rpx',
					backgroundColor: '#67fcf2'
				},
				searchToolFlag: false,
				eligibleToolFlag: false,
				isConfirmButtonShow: true,
				checkTypeList: check_type_list.filter(c => c.value != null),
				eligibleList: [{
						id: 1,
						value: true,
						text: '合格'
					},
					{
						id: 2,
						value: false,
						text: '隔离'
					},
				],
				standard_values: [],
				mould_name_data: [],
				mould_select_data: [],
				groupSigns: groupSigns,
				is_first_check: true,
				isEdit: true,
				repairDec: '',
				pagination_ids: [],
				paginationIndex: 0,
				inspector_user: '',
				search_word: '',
				checkIds: [],
				isFirstScan: true,
				scrollTop: 0,
				production_state: false,
				check_state: '',
				isBack: false,
				category_id: null
			}
		},
		watch: {
			category_id: {
				async handler(val) {
					if (val) {
						await this.getMouldSelectData();
						await this.getCheckList();
					}
				},
			},
		},
		computed: {
			isBespread() {
				// return this.$mStore.state.sysInfo.windowWidth > (this.categoryList.length * 300) / 2
				return false
			},
			isJISHU() {
				return this.$mStore.state.user.group_info[groupSigns.JISHU]
			},
			matchToolList() {
				return this.toolList.map(tool => {
					return {
						...tool,
						text: tool.display_name
					}
				})
			},
			categoryList() {
				return this.iskeyOpen || this.isJISHU || this.category_list.length <= 7 ? this.category_list : this
					.category_list.concat()
			}
		},
		methods: {
			async initData(production_obj) {
				this.loadmore = 'loadmore';
				// await this.getProductionInfo(production_obj.id);
				// const categIdArray = this.production_obj.categ_id?.length > 1 ? this.production_obj.categ_id[1].split(
				// 	'/') : [];
				// const title = categIdArray[categIdArray.length - 1]?.trim() || '';
				// uni.setNavigationBarTitle({
				// 	title: `${title}检验`
				// });
				uni.setNavigationBarTitle({
					title: `批量模具检验`
				});
				// this.pagination_ids = [...production_obj._ids];
				// this.paginationIndex = this.pagination_ids.findIndex(p => p === this.production_obj.id);
				if (production_obj) {
					this.production_obj = {
						...production_obj,
						inspection_regulation: 'TFJZ-MJ-05',
						exterior: '1.无空鼓、无凹坑(深度≤3mm，直径≤10m，不超过5个)、无破损  2.木板间拼接裂缝≤2mm, 表面光滑、无破损、无毛刺.'
					};
				}
				uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
				await this.getMouldNameData();

				if (this.production_obj.id) {
					this.getCheckResult();
				}
				// await this.$mStore.dispatch('user/hasGroup', groupSigns.JISHU);
				if (this.$mStore.state.user.group_info[groupSigns.JISHU]) {
					this.isEdit = false
				}
				// this.getToolList();
				// await this.getStandardValues();
				// this.getOtherInfo();
				// this.getCheckList();
				// if (this.production_obj.check_result) {
				// 	this.showCheckResult();
				// }
			},
			checkResultFilter(value) {
				let color = '';
				switch (value) {
					case '合格':
					case '让步放行':
						color = '#28C76F';
						break;
					case '不合格':
					case '隔离':
						color = '#EA5455';
						break;
					case '待检验':
						color = '#6190e8';
						break;
					case '技术判定':
						color = '#FF9F43';
						break;
					case '返修中':
						color = '#909399';
						break;
					default:
						color = '#909399';
				}
				return color;
			},
			inputBlur(event, index, subIndex, l_index) {
				let item = this.inspection_list_arr[l_index].inspection_list[index][subIndex];
				item[item.type] = event.detail.value;
				this.$set(this.inspection_list_arr[l_index].inspection_list[index], subIndex, item);
			},
			inputTextChange(event) {
				return event
			},
			inputTextBlur2(event) {
				this.inspector_user = event.detail.value;
			},
			inputFormBlur(event, field) {
				this.production_obj[field] = event.detail.value;
			},
			inputTextBlur(event, index, subIndex, l_index) {
				let item = this.inspection_list_arr[l_index].inspection_list[index][subIndex];
				item[item.type] = event.detail.value;
			},
			inputTextBlur3(event, l_index) {
				this.inspection_list_arr[l_index].lot_id = event.detail.value;
				if (!event) return;
				this.getProductionInfo(event.detail.value, l_index);
			},
			// 获取体积、密度
			getOtherInfo() {
				let standard_value_density = this.mapStandardValue('密度');
				// let standard_value_volume = this.mapStandardValue('标准体积');
				this.other_category_list = [
					// {
					// 	type: standard_value_volume ? `体积\n（${standard_value_volume}）` : '体积',
					// 	type_value: 'Measure',
					// 	content: [{
					// 		title: '体积',
					// 		measure: result.volume || 0,
					// 		note: false
					// 	}]
					// },
					{
						type: standard_value_density ? `密度\n（${standard_value_density}）` : '密度',
						type_value: 'Measure',
						content: [{
							title: '密度',
							measure: this.production_obj.density || 0,
							note: false
						}]
					}
				]
			},
			getMouldSelectData() {
				return new Promise((resolve, reject) => {
					api.web.dataset.call_kw({
						model: 'product.product',
						method: 'pad_get_product_list',
						args: [
							[]
						],
						kwargs: {
							categ_id: this.category_id
						}
					}).then((res) => {
						if (res?.length) {
							this.mould_select_data = res.map(item => {
								return {
									value: item.id,
									text: item.default_code
								}
							});
						}
						resolve(res)
					}).catch((err) => {
						reject(err)
					})
				})
			},
			getMouldNameData() {
				return new Promise((resolve, reject) => {
					api.web.dataset.call_kw({
						model: 'product.category',
						method: 'pad_get_mold_parent_category_records',
						args: [
							[]
						],
						kwargs: {}
					}).then((res) => {
						this.loadmore = 'more';
						if (res?.length) {
							this.mould_name_data = res.map(item => {
								return {
									value: item[0],
									text: item[1]
								}
							});
						}
						resolve(res)
					}).catch((err) => {
						reject(err)
					})
				})
			},
			async mouldNameChange(e) {
				this.category_id = e;
			},
			mouldSelectChange(event, l_index) {
				this.inspection_list_arr[l_index].lot_id = event;
				this.inspection_list_arr[l_index].production_id = event;
				// if (!event) return;
				// this.getProductionInfo(event, l_index);
			},
			getPointList() {
				return new Promise((resolve, reject) => {
					api.web.dataset.call_kw({
						model: 'product.category',
						// method: 'pad_get_quality_points',
						method: 'pad_get_quality_points_norm',
						args: [
							[]
						],
						kwargs: {
							// inspection_workshop: 'mould_workshop'
							category_id: this.category_id
						}
					}).then((res) => {
						resolve(res)
					}).catch((err) => {
						reject(err)
					})
				})
			},
			async getProductionInfo(default_code, l_index) {
				api.web.dataset.call_kw({
					model: 'product.product',
					method: 'pad_get_product',
					args: [
						[]
					],
					kwargs: {
						default_code
					}
				}).then((res) => {
					if (res?.id) {
						let check = this.inspection_list_arr[l_index].inspection_list[0][0];
						check[check.type] = res.circumference;
						this.inspection_list_arr[l_index].production_id = res.id;
					}
				})
			},
			/* 
				页面加载时调用
				check_list:  'quality.check'
				category_list: 对 'quality.check' 依据 test_type_id 分类
			 */
			async getCheckList(checks) {
				let res = [];
				let inspection_list = [];
				if (checks?.length > 0) {
					res = [...checks];
				} else {
					try {
						// const Model = api.env.model('quality.check')
						// const ids = this.checkIds || this.production_obj.check_ids
						// const company_id = uni.getStorageSync('company_id')
						// const pointList = await PointModel.search_read({
						// 	domain: [
						// 		['quality_point_type', '=', this.typeValue]
						// 	],
						// 	fields: ["id"]
						// })
						// let pointIds = pointList?.map(item => item.id) ?? [];
						res = await this.getPointList();
					} catch (e) {
						console.log(e)
						//TODO handle the exception
						// this.loadmore = 'error';
					}
				}
				uni.stopPullDownRefresh();
				if (!res) {
					// this.loadmore = 'error';
					return
				}
				if (res?.length > 0) {
					this.loadmore = 'more';
					const groupedArray = {};
					res.forEach((item, index) => {
						const typeId = item.test_type_id[0].id + '_type_id';
						if (!groupedArray[typeId]) {
							groupedArray[typeId] = [];
						}
						groupedArray[typeId].push(item);
					});
					this.check_list = Object.values(groupedArray);
					const result = {}
					let measureArray = []
					this.check_list.forEach(item => {
						// measureArray = item.filter(function(i) {
						// 	return i.test_type_id[1] === "Measure" || i.test_type_id[1] ===
						// 		'Pass - Fail';
						// });
						measureArray = item;
						// 遍历 measureArray，根据 title 分类
						measureArray.forEach(item => {
							const title = item.title;
							// const type = title.replace(/[0-9]/g, '');
							const type = title;
							// let standard_value = this.mapStandardValue(type);
							let standard_value = item.norm_type === 'note' ? htmlToText(item.note) :
								item.norm;
							// 如果该类型还没有在结果对象中创建对应的项，就创建一个
							if (!result[type]) {
								result[type] = {
									id: item.id,
									test_type_id: item.test_type_id[0].id,
									type_value: item.test_type_id[0].name,
									type,
									type_s: standard_value,
									tolerance_max: item.tolerance_max,
									tolerance_min: item.tolerance_min,
									content: []
								};
							}
							// 添加原始对象到结果对象的 content 数组中
							result[type].content.push(item);
						});
					})
					// this.category_list = [...[{
					// 	id: null,
					// 	type: "理论周长",
					// 	type_s: "",
					// 	type_value: '',
					// 	content: []

					// }], ...Object.values(result)];
					this.category_list = Object.values(result);
					this.category_list.push(...this.category_list.splice(this.category_list.findIndex(v => v
							.type ==
							'外观'),
						1));
					// let weightIndex = this.category_list.findIndex(c => c && c.content.length > 0 ? c.content[0]
					// 	.title == '体积' : -1)
					// if (weightIndex > -1) {
					// 	this.category_list.splice(weightIndex + 1, 0, ...this.other_category_list)
					// }
					// this.category_list.forEach((category) => {
					// 	const measureItem = category.content.find((item) => item.measure_tool && item
					// 		.measure_tool[1] !== "false");
					// 	const match = measureItem?.measure_tool[1]?.match(/\[(.*?)\]\s*(.*)/);
					// 	if (measureItem && match) {
					// 		this.$set(category, 'tool', match[2]);
					// 		this.$set(category, 'code', match[1]);
					// 		this.$set(category, 'measure_id', measureItem.measure_tool[0]);
					// 	} else {
					// 		this.$set(category, 'tool', "");
					// 		this.$set(category, 'code', "");
					// 		this.$set(category, 'measure_id', "");
					// 	}
					// });
					// const max = Math.max(...this.category_list.map(item => item.content.length))
					// for (let i = 0; i < max; i++) {
					// 	const obj = {}
					// 	const arr = []
					// 	for (let j = 0; j < this.category_list.length; j++) {
					// 		obj[this.category_list[j].type] =
					// 			this.category_list[j].content[i] ?
					// 			(this.category_list[j].type_value == 'Measure' ?
					// 				(this.$mHelper.isNumber(this.category_list[j].content[i].measure) && this
					// 					.category_list[j].content[i].measure != 0 ? this.category_list[j].content[
					// 						i]
					// 					.measure.toFixed(2) : this
					// 					.category_list[j].content[i].is_show ? this.category_list[j].content[i]
					// 					.measure : '') :
					// 				htmlToText(this.category_list[j].content[i].note)) : null
					// 		let type_value = obj[this.category_list[j].type];
					// 		// 密度绑定
					// 		if (this.category_list[j].type.split('\n')?.length > 0 && this.category_list[j].type.split(
					// 				'\n')[0] == '密度' && type_value !== null) {
					// 			type_value = this.$mHelper.isNumber(this.production_obj.density) && this.production_obj
					// 				.density != 0 ? this.production_obj.density.toFixed(2) : '';
					// 		}
					// 		// if (this.category_list[j].type_value === 'Instructions' && obj[this
					// 		if (this.category_list[j].type_value !== 'Measure' && obj[this
					// 				.category_list[j].type] != null && !obj[this.category_list[j].type]) {
					// 			type_value = ''
					// 		}

					// 		// if (this.category_list[j].type == '外观') {
					// 		// 	if (obj[this.category_list[j].type] != null && !obj[this.category_list[j].type]) {
					// 		// 		type_value = ''
					// 		// 	}
					// 		// 	if (obj[this.category_list[j].type] == 1) {
					// 		// 		type_value = '合格'
					// 		// 	}
					// 		// 	if (obj[this.category_list[j].type] == 2) {
					// 		// 		type_value = '隔离'
					// 		// 	}
					// 		// }
					// 		arr.push({
					// 			[this.category_list[j].type]: type_value,
					// 			'id': this.category_list[j].content[i] ? this.category_list[j].content[i]
					// 				.id : null,
					// 			'check_id': this.category_list[j].content[i] ? this.category_list[j]
					// 				.content[i]
					// 				.check_id : null,
					// 			'type': this.category_list[j].type,
					// 			title: this.category_list[j].content[i] ? this.category_list[j].content[i]
					// 				.title : null,
					// 			type_value: this.category_list[j].type_value,
					// 			initial_value: type_value,
					// 		})
					// 	}
					// 	inspection_list.push(arr)
					// }
					// this.inspection_list = [...inspection_list]
				} else {
					// this.loadmore = 'nomore';
					uni.showToast({
						title: '当前产品暂未完工～',
						icon: 'none',
						duration: 3000
					})
					// this.$refs.uToast.show({
					// 	title: '请配置检验点～',
					// 	type: 'warning'
					// })
				}
			},
			mapStandardValue(title) {
				let standard_val = this.standard_values.find((item) => item.label === '标准' + title)
				return standard_val?.value || ''
			},
			async getStandardValues() {
				// 获取自定义字段
				try {
					await this.$mStore.dispatch('getIndustryCustomFields');
					let publicArr = [{
						label: '标准重量',
						value: this.production_obj['norm_weight']
					}, {
						label: '标准体积',
						value: this.production_obj['norm_volume']
					}]
					let arr = this.$mStore.state.industryCustomFields.filter(item => {
						return item.cname.includes('norm') && item.categ_ids.includes(this
							.production_obj.categ_id?.length >
							0 ? this
							.production_obj.categ_id[
								0] : null);
					})
					this.standard_values = [...publicArr, ...arr.map((item) => {
						return {
							label: item.name,
							value: this.production_obj[item.cname]
						}
					})]
				} catch (e) {
					//TODO handle the exception
				}
			},
			delInspectionList(l_index) {
				uni.showModal({
					content: `是否删除？`,
					success: (e) => {
						if (e.confirm) {
							this.inspection_list_arr.splice(l_index, 1)
						}
					}
				})
			},
			async inspectionListArrHanlder() {
				// let find = this.inspection_list_arr.find(item => item.lot_id === this.search_word);
				// if (find) {
				// 	uni.showToast({
				// 		title: '请勿重复扫码',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				// uni.showLoading();
				// await this.getProductionInfo();
				// if (this.isFirstScan) {
				// 	await this.getStandardValues();
				// 	this.getOtherInfo();
				// }
				// if (this.production_state) {
				// 	await this.getCheckList();
				// }
				// uni.hideLoading();
				if (!this.category_id) {
					uni.showToast({
						title: '请选择模具！',
						icon: 'none'
					})
					return
				}
				if (this.category_list?.length <= 0) {
					uni.showToast({
						title: '暂无检验项！',
						icon: 'none'
					})
					return
				}
				this.inspection_list = [this.category_list.map((item) => {
					return {
						check_id: undefined,
						id: item.id,
						initial_value: "",
						title: item.type,
						type: item.type,
						test_type_id: item.test_type_id,
						type_value: item.type_value,
						tolerance_max: item.tolerance_max,
						tolerance_min: item.tolerance_min,
						[item.type]: "",
					}
				})]
				let obj = {
					production_id: null,
					lot_id: '',
					inspection_list: this.inspection_list.slice()
				};
				this.inspection_list_arr.push(obj);
				console.log(this.inspection_list_arr)
				this.scrollToBottom();
				this.production_state = false;
				this.isFirstScan = false;
			},
			// 扫码
			async scanClick() {
				// #ifdef H5
				// let arr = ['JK240430ZC02/JK36GBD-24-0510-044', 'JK240430ZC02/JK36GBD-24-0509-028',
				// 	// 'JK240430ZC02/JK36DLE-24-0512-110', 'JK240430ZC02/JK36DLE-24-0511-088',
				// 	// 'JK240430ZC02/JK36DLE-24-0512-111'
				// ]
				// let index = 0
				// let time = setInterval(() => {
				// 	if(index === 5) {
				// 		clearInterval(time)
				// 	}
				// 	index += 1
				// 	this.search_word = arr[index];
				// 	this.inspectionListArrHanlder();
				// }, 5000)
				// this.search_word = this.isFirstScan ? 'SS240227ZC001/SS340XBB-24-0302-080' :
				// 	'SS240227ZC001/SS340XBB-24-0304-276'
				this.inspectionListArrHanlder();
				// #endif
				// #ifdef APP-PLUS
				this.inspectionListArrHanlder();
				// uni.scanCode({
				// 	success: async (res) => {
				// 		this.search_word = res.result || '';
				// 		this.inspectionListArrHanlder();
				// 		// this.search_word = res.result || '';
				// 		// await this.getProductionList();
				// 		// let params = this.searchList.length > 0 ? this.searchList[0] : null;
				// 		// if (params) {
				// 		// 	this.toQualityCheck(params);
				// 		// } else {
				// 		// 	this.$refs.uToast.show({
				// 		// 		title: '未找到匹配项',
				// 		// 		type: 'warning',
				// 		// 	})
				// 		// }
				// 	},
				// 	complete: () => {
				// 		this.fullLoading = false;
				// 	},
				// 	fail: (err) => {
				// 		if (err.errMsg === 'scanCode:fail cancel') {
				// 			return
				// 		}
				// 		this.$refs.uToast.show({
				// 			title: JSON.stringify(err),
				// 			type: 'error',
				// 		})
				// 	}
				// });
				// #endif
			},
			async getToolList() {
				const Model = api.env.model('product.product')
				const company_id = uni.getStorageSync('company_id')
				const res = await Model.search_read({
					domain: [
						// ['company_id', '=', company_id],
						['tysj_product_type', '=', 'measure_tools'],
						['department_id', '=', 3],
					],
					fields: ["id", "display_name"]
				})
				this.toolList = res || []
			},
			handleFocus2(rowIndex, index) {
				if (!this.isEdit) return
				this.searchToolFlag = false;
				this.eligibleToolFlag = true;
				this.editRowIndex = rowIndex;
				// 更新编辑的索引
				this.editingIndex = index;
			},
			handleFocus(index) {
				this.check_name = this.category_list[index];
				this.eligibleToolFlag = false;
				this.toolsLoading = true;
				this.searchToolFlag = true;
				// 更新编辑的索引
				this.editingIndex = index;
				this.clearTimer();
				this.toolTimer = setTimeout(() => {
					this.toolsLoading = false;
				}, 300)
			},
			closeEligible() {
				this.selectEligible();
			},
			selectEligible(index) {
				const editingCategory = this.inspection_list[this.editRowIndex][this.editingIndex];
				if (editingCategory) {
					this.$set(editingCategory, [editingCategory.type], index != null ? this.eligibleList[index]
						.text : '')
				}
			},
			closeTool() {
				this.selectTool();
			},
			selectTool(index) {
				let item = this.matchToolList[index];
				// 如果存在编辑的索引，就将值写入当前修改的对象
				if (this.editingIndex !== null) {
					// 使用正则表达式提取 [a] 和 b
					const editingCategory = this.category_list[this.editingIndex];
					const match = item?.display_name?.match(/\[(.*?)\]\s*(.*)/);
					if (editingCategory) {
						if (match) {
							// match[1] 匹配 [a]
							// match[2] 匹配 b
							// 如果存在编辑的索引，就将值写入当前修改的对象
							// 将获取到的值写入当前修改的对象的 code 和 tool 中
							this.$set(editingCategory, 'code', match[1]);
							this.$set(editingCategory, 'tool', match[2]);
							this.$set(editingCategory, 'measure_id', item.id);
						} else {
							this.$set(editingCategory, 'code', '');
							this.$set(editingCategory, 'tool', '');
							this.$set(editingCategory, 'measure_id', '');
						}
					}
				}
				this.searchToolFlag = false;
			},
			findMatchingInspection(id) {
				// 在 this.inspection_list 中寻找匹配的 inspection
				for (let i = 0; i < this.inspection_list.length; i++) {
					const inspectionItem = this.inspection_list[i].find(item => item.id === id);
					if (inspectionItem) {
						return inspectionItem;
					}
				}
				return null; // 如果找不到匹配的 inspection，返回 null
			},
			judgeHanlder(result) {
				let chinese = '';
				let method = '';
				if (result === 'success') {
					chinese = '合格';
					method = 'set_state_qualified';
				}
				if (result === 'warning') {
					chinese = '技术判定';
					method = 'set_state_pending';
				}
				if (result === 'primary') {
					chinese = '完成判定';
					method = 'pad_set_state_processed';
					if (!this.production_obj.conclusion) {
						uni.showToast({
							title: '请填写处理意见！',
							icon: 'none'
						})
						return
					}
					// this.repairShow = true;
					// return
				}
				uni.showModal({
					content: `是否判定为${chinese}？`,
					success: async (e) => {
						if (e.confirm) {
							this.submitLoading = true;
							try {
								let submit_res = await this.inspectionConfirm(false);
								if (!submit_res) return;
								const model = 'mould.inspection.record'
								const {
									id,
									conclusion
								} = this.production_obj
								const args = [
									[]
								]
								let kwargs = {
									inspection_id: id,
								}
								if (chinese === '已处理') {
									kwargs = {
										inspection_id: id,
										conclusion
									}
								}
								console.log(kwargs)
								api.web.dataset.call_kw({
									model,
									method,
									args,
									kwargs
								}).then(async res => {
									this.$refs.uToast.show({
										title: `提交成功`,
										type: 'success',
									});
									// this.removeHanlde(this.paginationIndex);
								}).catch(function(e) {
									if (e.code == 200) {
										uni.showToast({
											title: e.data.message,
											icon: 'error',
										});
									}
								}).finally(() => {
									this.submitLoading = false;
								})
							} catch (e) {
								console.error(e)
							}
						}
					}
				});
			},
			repairClose() {
				this.repairShow = false;
				this.repairDec = '';
			},
			repairConfirm() {
				if (!this.repairDec) {
					this.$refs.repairPopup.clearLoading();
					uni.showToast({
						title: '请填写返修原因/建议',
						icon: 'none'
					})
					return
				}
				try {
					const model = 'mrp.production'
					const {
						id
					} = this.production_obj
					const args = [id, id, this.repairDec]
					const kwargs = {}
					api.web.dataset.call_kw({
						model,
						method: 'button_repair',
						args,
						kwargs
					}).then(async res => {
						if (res?.error) return;
						this.$refs.uToast.show({
							title: `提交成功`,
							type: 'success',
						});
						this.repairClose();
						await this.getProductionInfo();
						this.showCheckResult();
					}).catch((e) => {
						if (e.code == 200) {
							uni.showToast({
								title: e.data.message,
								icon: 'error',
							});
						}
					}).finally(() => {
						this.$refs.repairPopup.clearLoading();
					})
				} catch (e) {
					console.error(e)
				}
			},
			submit_jishu() {
				uni.showModal({
					content: `是否提交技术判定？`,
					success: async (e) => {
						if (e.confirm) {
							this.submitLoading = true;
							try {
								const model = 'mrp.production'
								const {
									id
								} = this.production_obj
								const args = [id]
								const kwargs = {}
								api.web.dataset.call_kw({
									model,
									method: 'do_to_decide',
									args,
									kwargs
								}).then(res => {
									this.$refs.uToast.show({
										title: `提交成功`,
										type: 'success',
									});
								}).catch(function(e) {
									if (e.code == 200) {
										uni.showToast({
											title: e.data.message,
											icon: 'error',
										});
									}
								}).finally(() => {
									this.submitLoading = false;
								})
							} catch (e) {
								console.error(e)
							}
						}
					}
				});
			},
			resetCheck() {
				this.resetCheckLoading = true
				const model = 'mrp.production'
				const {
					id
				} = this.production_obj
				const args = [id]
				const kwargs = {}
				api.web.dataset.call_kw({
					model,
					method: 'reset_check',
					args,
					kwargs
				}).then(async () => {
					await this.refresh()
					this.resetCheckLoading = false
				}).catch(() => {
					this.resetCheckLoading = false
				})
			},
			scrollToBottom() {
				this.$nextTick(() => {
					let that = this;
					let query = uni.createSelectorQuery();
					query.select('#scroll-view-box').boundingClientRect();
					query.select('#scroll-view-content').boundingClientRect();
					query.exec((res) => {
						if (res[1]?.height != null && res[0]?.height != null) {
							that.scrollTop = res[1].height - (res[0].height - 68);
						}
					});
				})
			},
			async getCheckResult() {
				uni.showLoading();
				let res = await api.web.dataset.call_kw({
					model: 'mould.inspection.record',
					method: 'pad_get_inspection_details',
					args: [
						[]
					],
					kwargs: {
						mould_inspection_record_id: this.production_obj.id
						// production_ids: [12300, 12355, 12351, 12375, 12381, 12377]
					}
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 3000)
				if (res) {
					let data = res.data || [];
					let info = res.inspection_record || {};
					this.production_obj = {
						...this.production_obj,
						contract_no: info.contract_no || '',
						supplier: info.supplier || '',
						factory_batch: info.factory_batch || '',
						mould_name: info.mould_name ? Number(info.mould_name) : null,
						specification_signal: info.specification_signal || '',
						numbers_of_inspection: info.numbers_of_inspection || 0,
						numbers_to_inspection: info.numbers_to_inspection || 0,
						state: info.state
					};
					if (this.production_obj.mould_name) {
						this.category_id = this.production_obj.mould_name;
					}
					let arr = [];
					// TFGZ-GJ36GTB-JX-001
					this.inspection_list = [];
					data.forEach((item, index) => {
						// let llzc = this.inspection_list_arr?.length > 0 ? this.inspection_list_arr[index]
						// 	.inspection_list[0].find(f => f.type ===
						// 		'理论周长') : {
						// 		check_id: null,
						// 		id: null,
						// 		initial_value: "",
						// 		title: '理论周长',
						// 		type: '理论周长',
						// 		test_type_id: null,
						// 		type_value: '',
						// 		'理论周长': ''
						// 	};
						// llzc[llzc.type] = item.product.circumference;
						let inspection_list = [];
						let checks = item.quality_checks.map((check) => {
							let type_value = check.test_type_id?.length > 0 ? check.test_type_id[1] :
								'';
							let value = type_value === 'Measure' ? (this.$mHelper.isNumber(check
									.measure) && check.measure != 0 ? check.measure.toFixed(2) :
								'') : check.note ? htmlToText(check.note) : '';
							return {
								check_id: check.id,
								id: check.point_id?.length > 0 ? check.point_id[0] : null,
								initial_value: "",
								title: check.title,
								type: check.title,
								test_type_id: check.test_type_id?.length > 0 ? check.test_type_id[0] :
									null,
								type_value: check.test_type_id?.length > 1 ? check.test_type_id[1] :
									'',
								tolerance_max: check.tolerance_max,
								tolerance_min: check.tolerance_min,
								[check.title]: value
							}
						});
						// let ins_list = [llzc, ...checks];
						let ins_list = [...checks];
						ins_list.forEach((item2, index2) => {
							inspection_list.push(item2)
						});
						this.inspection_list = [inspection_list]
						arr.push({
							production_id: item.product.id,
							lot_id: item.product.id,
							default_code: item.product.default_code,
							inspection_list: this.inspection_list
						});
					})
					this.inspection_list_arr = [...arr];
				}
			},
			inspectionConfirm(isSubmit = false) {
				return new Promise((resolve, reject) => {
					if (!this.inspector_user) {
						uni.showToast({
							title: '请填写检验员',
							icon: 'none'
						});
						this.submitLoading = false;
						this.saveLoading = false;
						resolve(false)
						return;
					}
					const fun = async () => {
						let inspection_list_arr = JSON.parse(JSON.stringify(this.inspection_list_arr));
						let data = inspection_list_arr.map(item => {
							let check_data = item.inspection_list.flat().filter(c => c.id != null);
							return {
								checks: check_data.map(check => {
									return {
										product_id: item.production_id,
										point_id: check.id,
										test_type_id: check.test_type_id,
										test_type: check.type_value,
										value: check.type_value === 'Measure' ? check[check
											.type] - 0 : check[check.type]
									}
								})
							}
						});
						try {
							const {
								inspection_regulation,
								exterior,
								...kw
							} = this.production_obj;
							let res = await api.web.dataset.call_kw({
								model: 'mould.inspection.record',
								method: 'pad_create_mould_inspection_with_checks',
								args: [
									[]
								],
								kwargs: {
									inspection_id: this.production_obj.id || null,
									inspection_user: this.inspector_user,
									...kw,
									data,
									// is_zancun: isSubmit ? 0 : 1,
									// check_inspector: '',
									// check_type: this.production_obj.check_type
								}
							});
							if (res) {
								this.$refs.uToast.show({
									title: isSubmit ? `提交成功` : '保存成功',
									type: 'success',
								});
								this.production_obj.id = res || null;
								if (isSubmit) {
									this.getCheckResult();
								}
								resolve(true)
							} else {
								resolve(false)
							}
							this.submitLoading = false;
							this.saveLoading = false;
						} catch (e) {
							console.log(e)
							uni.showToast({
								title: '提交失败，请重新提交',
								icon: 'none'
							})
							this.submitLoading = false;
							this.saveLoading = false;
							resolve(false)
						}
					}
					if (isSubmit) {
						uni.showModal({
							content: '是否确认提交？',
							success: async (e) => {
								if (e.confirm) {
									this.submitLoading = true;
									fun();
								}
							}
						})
					} else {
						this.saveLoading = true;
						fun();
					}
				})

			},
			/* 提交按钮 调用mrp.production模型get_result方法 */
			inspectionSubmmit() {
				uni.showModal({
					content: '是否确认提交？',
					success: async (e) => {
						if (e.confirm) {
							this.submitLoading = true;
							try {
								let submit_res = await this.inspectionConfirm(false);
								if (!submit_res) return;
								const P_Model = api.env.model('mrp.production');
								P_Model.write(this.production_obj.id, {
									check_type: this.production_obj.check_type
								})
								const model = 'mrp.production'
								const method = 'get_result'
								const {
									id
								} = this.production_obj
								const args = [id]
								const kwargs = {}
								api.web.dataset.call_kw({
									model,
									method,
									args,
									kwargs
								}).then(async res => {
									if (res) {
										this.$refs.uToast.show({
											title: `提交成功`,
											type: 'success',
										})
										api.web.dataset.call_kw({
											model,
											method: 'update_check_date',
											args,
											kwargs
										})
										// this.showCheckResult();
										this.refresh();
									}
								}).catch(function(e) {
									if (e.code == 200) {
										uni.showToast({
											title: e.data.message,
											icon: 'error',
										});
									}
								}).finally(() => {
									this.submitLoading = false;
								})
							} catch (e) {
								this.submitLoading = false;
							}
						}
					}
				});
			},
			showCheckResult() {
				this.isConfirmButtonShow = false;
			},
			removeHanlde(index) {
				this.pagination_ids.splice(index, 1);
				if (index <= 0) {
					this.paginationIndex = 0;
				} else if (index >= this.pagination_ids.length) {
					this.paginationIndex = this.pagination_ids.length;
				} else {
					this.paginationIndex = this.paginationIndex + 1;
				}
				this.refresh(true, this.pagination_ids[this.paginationIndex]);
			},
			prevHandle(index) {
				if (index <= 0) return;
				this.paginationIndex = this.paginationIndex - 1;
				this.refresh(true, this.pagination_ids[this.paginationIndex]);
			},
			nextHandle(index) {
				if (index >= this.pagination_ids.length) return;
				this.paginationIndex = this.paginationIndex + 1;
				this.refresh(true, this.pagination_ids[this.paginationIndex]);
			},
			async refresh(is_refresh, product_id) {
				uni.showModal({
					content: '刷新后数据将丢失，是否刷新？',
					success: (e) => {
						if (e.confirm) {
							if (is_refresh) this.loadmore = 'loadmore';
							this.getCheckResult();
						} else {
							uni.stopPullDownRefresh();
						}
					}
				})
			},
			onKeyboardHeightChange(res) {
				const {
					height
				} = res;
				if (height > 0) {
					this.iskeyOpen = true;
				} else {
					this.iskeyOpen = false;
				}
			},
			clearTimer() {
				if (this.toolTimer) {
					clearTimeout(this.toolTimer);
					this.toolTimer = null;
				}
				if (this.saveTimer) {
					clearTimeout(this.saveTimer)
					this.saveTimer = null
				}
			}
		},
		async onLoad(options) {
			let production_obj = {};
			this.typeValue = options.typeValue || '';
			this.workshop = options.workshop || '';
			if ('params' in options) {
				production_obj = JSON.parse(decodeURIComponent(options.params));
			}
			this.initData(production_obj);
		},
		onUnload() {
			uni.offKeyboardHeightChange(this.onKeyboardHeightChange);
			this.clearTimer();
		},
		beforeDestroy() {
			if (this.saveTimer) clearTimeout(this.saveTimer)
			if (this.toolTimer) clearTimeout(this.toolTimer)
			if (this.submitTimer) clearTimeout(this.submitTimer)
		},
		onNavigationBarButtonTap(e) {
			// 提交按钮
			if (e.index === 0) {
				this.refresh()
			}
		},
		onBackPress() {
			if (!this.isBack) {
				uni.showModal({
					title: '退出当前页面将清空数据？',
					confirmText: '退出',
					success: function(res) {
						if (res.confirm) {
							this.isBack = true;
							uni.navigateBack();
						}
					}.bind(this)
				})
				return true;
			}
		},
		onPullDownRefresh() {
			// this.refresh()
		},
	}
</script>

<style>
	.u-tr {
		height: 130rpx;
	}
</style>

<style lang="scss" scoped>
	.repair-popup {
		/deep/ .uni-popup-dialog {
			width: 800rpx;

			.uni-dialog-title {
				padding-top: 32rpx;

				.uni-dialog-title-text {
					color: #333;
				}
			}

			.uni-dialog-content {
				padding: 20rpx 30rpx;
			}
		}
	}

	.repair-content {
		width: 100%;
		padding: 20rpx;

		uni-textarea {
			min-height: 400rpx;
			width: 100%;
		}
	}

	/deep/ .u-input__input {
		min-height: 100% !important;
	}

	.product_inspection {
		.mould_select {
			/deep/ .uni-select__selector-item {
				font-size: 20rpx;
			}
		}

		.mould_name {
			color: $uni-color-primary;

			/deep/ .uni-select__input-text {
				color: $uni-color-primary;
			}
		}

		.mould_name,
		.mould_select {
			/deep/ .uni-select__input-text {
				white-space: pre-wrap;
				font-size: 24rpx;
			}
		}

		.tishi_title {
			position: absolute;
			top: 34%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: $uni-color-primary;
			font-size: 36rpx;
		}

		.product-table {
			// height: 100%;
			// padding-bottom: 260rpx;
			height: calc(100% - 254rpx - 342rpx);
			// height: calc(100% - 386rpx);
			// overflow: auto;
			// overflow-x: scroll;

			/deep/ .u-td {
				height: auto;
			}

			/deep/ .uni-input-input {
				font-size: 24rpx !important;
			}

			.uni-input-placeholder {
				font-weight: 400;
			}

			.my-scroll-view {
				width: 100%;
				height: 100%;
				position: relative;
				// -webkit-overflow-scrolling: touch;
				max-height: inherit;

				&-content {
					width: 100%;
					height: 100%;
				}
			}

			// #ifdef H5
			@media (min-width: 1009px) {
				/deep/ .uni-scroll-view::-webkit-scrollbar {
					display: block;
					width: 18rpx !important;
					height: 18rpx !important;
				}

				/deep/ .uni-scroll-view::-webkit-scrollbar-thumb {
					background-color: $uni-scroll-color;
					border-radius: 10rpx;
				}

				/deep/ .my-scroll-view::-webkit-scrollbar {
					display: block;
					width: 18rpx !important;
					height: 18rpx !important;
				}

				/deep/ .my-scroll-view::-webkit-scrollbar-thumb {
					background-color: $uni-scroll-color;
					border-radius: 10rpx;
				}
			}

			// #endif
		}

		.table-label {
			font-size: 14px;
			color: #303133;
			font-weight: bold;
			background-color: #fff;
		}

		.product-btn-box {
			display: flex;
			align-items: flex-end;
			justify-content: space-around;
			padding: 20rpx 20rpx 40rpx;
			position: fixed;
			width: 100%;
			bottom: 0;
			left: 0;
			border-top: 2rpx solid $border-color-base;
			background-color: #fff;

			.btn-box-left {
				flex: auto;

				.u-btn,
				uni-button,
				uni-text {
					width: auto;
					display: inline-block;
					margin: 6rpx 0;
					margin-left: 40rpx;
				}

				uni-text {
					color: $uni-color-primary;
				}
			}

			.btn-box-right {
				flex: 60%;
				text-align: right;

				.u-btn {
					width: auto;
					display: inline-block;
					margin: 6rpx 0;
					margin-right: 40rpx;
				}

				.btn-box-label {
					display: inline-block;
					margin-right: 18rpx;
					font-weight: bold;
				}

				@media (max-width: 839px) {
					.btn-box-label {
						display: block;
					}
				}
			}
		}

		.popup-loading {
			/deep/ .u-drawer__scroll-view {
				height: 70vh;
			}
		}

		.pagination-btn {
			position: fixed;
			top: 50%;
			width: 160rpx;
			height: 160rpx;
			background-color: rgba(120, 192, 255, .26);
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			transform: translateY(-80rpx);
			z-index: 99;
			cursor: pointer;

			&.disabled {
				opacity: .4;
			}

			&.left {
				left: 30rpx;
			}

			&.right {
				right: 30rpx;
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
			// bottom: 350rpx;
			bottom: 50rpx;
			right: 40rpx;
			border-radius: 50%;
			z-index: 999;
		}
	}

	.category-cell {
		position: relative;

		.key-list-box {
			// background-color: #f2f2f2;
			position: absolute;
			left: 50%;
			top: 124%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			width: 90%;
			background-color: #ffffff;
			z-index: 999;
			box-shadow: 0 0 20rpx rgba(0, 0, 0, .3);
			border-radius: 10rpx;

			.keyword-entry {
				line-height: 110rpx;
				height: 110rpx;
				max-width: 100%;
				font-size: 40rpx;
				color: #333;
				padding: 0 30rpx;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;

				&:not(:last-child) {
					border-bottom: solid 4rpx #fff;
				}
			}
		}
	}



	.keyword-entry-tap {
		background-color: #eee;
	}

	@media (min-width: 375px) and (max-width: 1009px) {
		.product-table {
			height: calc(100% - 242rpx) !important;

			// padding-bottom: 174rpx !important;
			.u-table {
				// min-width: 2020rpx;
			}
		}
	}

	.box_bt {
		border-bottom: unset !important;
	}

	.box_pd {
		padding: unset !important;
	}

	.box_br {
		border-right: unset !important;
	}

	.box_cus {
		padding: 10px 3px !important;
	}
</style>