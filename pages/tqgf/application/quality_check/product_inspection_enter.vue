<template>
	<view class="product_inspection">
		<u-top-tips ref="uToast" />
		<!-- 悬浮扫码 -->
		<view v-if="categoryList.length > 0" class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view>
		<!-- <view v-if="inspection_list_arr.length <= 0" class="tishi_title">请扫描需要检验的产品</view> -->
		<page-loading :loadmore="loadmore" @refresh="refresh">
			<u-table>
				<u-tr style="height: 70rpx;">
					<u-td class="table-label">产品名称</u-td>
					<u-td
						:style="{fontSize: parent_obj.product_name.length > 10 ? '24rpx' : '28rpx'}">{{parent_obj.product_name || ''}}</u-td>
					<u-td class="table-label">产品规格</u-td>
					<u-td>{{parent_obj.product_specification || ''}}</u-td>
					<u-td class="table-label">供应商</u-td>
					<u-td>{{parent_obj.supplier_code || ''}}</u-td>
					<u-td class="table-label">接收批次</u-td>
					<u-td>{{parent_obj.receive_batch || ''}}</u-td>
				</u-tr>
				<u-tr style="height: 70rpx;">
					<u-td class="table-label">送检数量</u-td>
					<u-td>
						<span class="unit">{{parent_obj.quantity_sent}}{{parent_obj.product_uom || ''}}</span>
					</u-td>
					<u-td class="table-label">检验数量</u-td>
					<u-td style="flex-direction: row; align-items: center;">
						<u-input :value="parent_obj.quantity_inspected || ''" input-align="center"
							@input="inputTextChange" @blur="(event) => inputTextBlur2(event, 'quantity_inspected')"
							type="text" placeholder="" />
						<span class="unit" style="width: 40rpx;">{{parent_obj.product_uom || ''}}</span>
					</u-td>
					<u-td class="table-label">送检日期</u-td>
					<u-td>{{parent_obj.date_sent || ''}}</u-td>
				</u-tr>
				<u-tr style="height: 70rpx;">
					<u-td class="table-label">检验依据</u-td>
					<u-td>{{parent_obj.b || 'TFJZ-TS'}}</u-td>
				</u-tr>
				<u-tr style="min-height: 70rpx; height: auto;"
					:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
					<u-td class="table-label">备注</u-td>
					<u-td>
						<u-input :value="parent_obj.b || '表观：黑色、色泽均匀，无明显毛丝'" @input="inputTextChange"
							@blur="(event) => inputTextBlur2(event, 'b')" disabled type="textarea" :maxlength="10000"
							auto-height placeholder="" />
					</u-td>
				</u-tr>
			</u-table>
			<!-- <scroll-view scroll-x scroll-y show-scrollbar id="scroll-view-box" class="product-table"
				:scroll-top="scrollTop" :style="{height: iskeyOpen ? 'calc(100% - 386rpx + 110rpx + 154rpx)' : ''}"> -->
			<view class="product-table" :style="{height: iskeyOpen ? 'calc(100% - 386rpx + 110rpx + 154rpx)' : ''}">
				<!-- <view class="my-scroll-view">
					<view class="my-scroll-view" style="overflow: auto;">
						<view class="my-scroll-view-content"> -->
				<u-table style="border-top: none; table-layout: fixed; width: 100%; padding-bottom: 260rpx;"
					id="scroll-view-content">
					<u-tr style="height: auto; position: sticky; top: 0; z-index: 11;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td class="table-label"
							style="flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;">检验项</u-td>
						<!-- <u-td
							style="width: 294rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;">批次号</u-td> -->
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="min-height: 130rpx; height: auto;">
								<u-th :style="{fontSize: item.type.length > 10 ? '26rpx' : '28rpx'}"
									:width="isBespread ? '300rpx' : ''" style="white-space: pre-wrap;"
									v-for="(item, index) in categoryList" :key="index">
									{{item.type}}
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="height: 70rpx; position: sticky; top: 0; z-index: 11;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td class="table-label"
							style="flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;">检验标准</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr>
								<u-th :style="{fontSize: item.type.length > 10 ? '20rpx' : '28rpx'}"
									:width="isBespread ? '300rpx' : ''" style="white-space: pre-wrap;"
									v-for="(item, index) in categoryList" :key="index">
									<view
										:style="{fontSize: item.type_s.length > 10 ? '20rpx' : '28rpx', fontWeight: 400}">
										{{ item.type_s || '' }}
									</view>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td class="table-label"
							style="flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;">检验工具</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="height: 100%;">
								<u-th :width="isBespread ? '300rpx' : ''" style="font-weight: 400;"
									class="category-cell" v-for="(item,index) in categoryList" :key="index">
									<view v-if="item.type == '外观'"></view>
									<template v-else>
										<view :class="!item.tool ? 'link' : 'link'" @click="handleFocus(index)">
											{{item.tool || '选择'}}
										</view>
										<!-- <u-input v-else v-model="item.tool" type="select" input-align="center"
											placeholder="请选择" @click="handleFocus(index, toolList)" /> -->
										<!-- <u-input v-model="item.tool" type="text" input-align="center" disabled
											placeholder="" /> -->
									</template>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}">
						<u-td class="table-label"
							style="flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;">工具编号</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="height: 100%;">
								<u-th :width="isBespread ? '300rpx' : ''" style="font-weight: 400;"
									v-for="(item,index) in categoryList" :key="index">
									<view v-if="item.type == '外观'"></view>
									<template v-else>
										<!-- <u-input v-model="item.code" type="text" input-align="center" disabled :clearable="false"
											placeholder="" /> -->
										<view style="text-align: center; word-break: break-all; height: 100%;">
											{{item.code}}
										</view>
									</template>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<!-- <u-tr style="height: 88rpx;"
						:style="{width: isBespread ? categoryList.length * 300 + 294 + 'rpx' : 'auto'}"
						v-if="parent_obj.x_norm_tolerance">
						<u-td
							style="width: 260rpx; flex: none; position: sticky; left: 0; background-color: #fff; z-index: 9;"><u-input
								type="text" placeholder="检验公差" input-align="center" disabled /></u-td>
						<u-th :style="{flex: isBespread ? '0 0 ' + (300 * categoryList.length) + 'rpx' : ''}"
							style="flex-grow: 1; text-align: left; padding: 10rpx 30rpx;">
							{{ parent_obj.x_norm_tolerance || '' }}
						</u-th>
					</u-tr> -->
					<u-tr style="height: auto;"
						:style="{width: isBespread ? list.inspection_list[0].length * 300 + 294 + 'rpx' : 'auto'}"
						v-for="(list, l_index) in inspection_list_arr" :key="l_index">
						<!-- <u-td style="width: 200rpx; flex: none; font-size: 40rpx; font-weight: bold;
											writing-mode: vertical-rl; letter-spacing: 10rpx; text-orientation: upright;">第1次检验</u-td> -->

						<u-td class="table-label" style="flex: none; font-size: 26rpx; color: #333;
											overflow-wrap: break-word; position: sticky; left: 0; background-color: #fff; z-index: 10;">
							<uni-icons type="minus-filled" :size="24" color="#EA5455"
								@click="delInspectionList(l_index)"></uni-icons>
							{{list.number}}
						</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<!-- <check-input v-for="(item,index) in inspection_list" :key="index"
												:inspection_list_item="item" :is-edit="isEdit" :isBespread="isBespread"
												@inputBlur="(event, index2) => inputBlur(event, index, index2, l_index)"></check-input> -->
							<u-tr style="height: 100%;" v-for="(item,index) in list.inspection_list" :key="index">
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
									<input v-if="i.type_value === 'Measure'" style="height: 100%;" :value="i[i.type]"
										@blur="(event) => inputBlur(event, index, index2, l_index)" :type="'number'"
										input-align="center" :clearable="false"
										:placeholder="i[i.type] === null ? '*' : ''" :disabled="
													i[i.type] === null ||
													!isEdit ||
													i.title === '密度'" />
									<u-input v-else :value="i[i.type]" @input="inputTextChange"
										@blur="(event) => inputTextBlur(event, index, index2, l_index)" type="text"
										:placeholder="i[i.type] === null ? '*' : ''"
										:disabled="i[i.type] === null || !isEdit" />
								</u-td>
							</u-tr>
						</u-td>
					</u-tr>
					<!-- <u-tr style="height: 70rpx;">
						<u-td class="table-label">平均值</u-td>
						<u-td v-for="(item, index) in categoryList" :key="index">
							{{item.ren}}
						</u-td>
					</u-tr> -->
					<u-tr style="min-height: 70rpx; height: auto;">
						<u-td class="table-label">检验结果</u-td>
						<u-td v-for="(item, index) in pointResultList" :key="index">
							<u-input :value="item.result || ''" input-align="center" :clearable="false"
								@input="inputTextChange" @blur="(event) => inputTextBlur3(event, index)" type="textarea"
								:maxlength="10000" auto-height placeholder="" />
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;">
						<u-td class="table-label">结论</u-td>
						<u-td>
							<u-input :value="parent_obj.inspection_conclusion || ''" @input="inputTextChange"
								@blur="(event) => inputTextBlur2(event, 'inspection_conclusion')" type="textarea"
								:maxlength="10000" auto-height placeholder="" />
						</u-td>
					</u-tr>
					<u-tr style="height: 70rpx;">
						<u-td class="table-label">检验员</u-td>
						<u-td>
							<!-- <u-input :value="parent_obj.inspector" input-align="center" clearable @focus="userSelect"
									@input="inputTextChange" @blur="(event) => inputTextBlur2(event, 'inspector')"
									type="text" placeholder="" /> -->
							<view style="display: flex;">
								<text>{{parent_obj.inspector || ''}}</text>
								<!-- <text style="width: 100rpx; text-align: center; color: #6190e8"
									@click="userSelect(parent_obj.inspector ? 'clear': 'select')">{{parent_obj.inspector ? '清空' : '选择'}}</text> -->
								<text style="width: 100rpx; text-align: center; color: #6190e8"
									@click="userSelect('select')">{{'选择'}}</text>
							</view>
						</u-td>
						<u-td class="table-label">审核人</u-td>
						<u-td>
							<view style="display: flex;">
								<text>{{parent_obj.auditor || ''}}</text>
								<!-- <text style="width: 100rpx; text-align: center; color: #6190e8"
									@click="userSelect2(parent_obj.auditor ? 'clear': 'select')">{{parent_obj.auditor ? '清空' : '选择'}}</text> -->
							</view>
						</u-td>
						<u-td class="table-label">检验日期</u-td>
						<u-td>
							<u-input :value="parent_obj.inspection_date || ''" input-align="center"
								@input="inputTextChange" @blur="(event) => inputTextBlur2(event, 'inspection_date')"
								type="text" placeholder="" />
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;">
						<u-td class="table-label">处理意见</u-td>
						<u-td>
							<u-input :value="parent_obj.processing_opinion || ''" @input="inputTextChange"
								@blur="(event) => inputTextBlur2(event, 'processing_opinion')" disabled type="textarea"
								:maxlength="10000" auto-height placeholder="" />
						</u-td>
					</u-tr>
				</u-table>
				<!-- </view>
					</view>
				</view> -->
			</view>

			<!-- </scroll-view> -->
			<u-table :style="iskeyOpen ? hideStyle : {}" style="position: fixed; left: 0; bottom: 152rpx; z-index: 99;">
				<u-tr style="height: 100rpx;">
					<!-- <u-td v-if="!isJISHU" style="font-weight: bold;font-size: 32rpx; color: #333;">检验类型</u-td>
					<u-td v-if="!isJISHU" style="align-items: center;">
						<u-radio-group v-model="parent_obj.check_type">
							<u-radio v-for="(item, index) in checkTypeList" :key="index" :name="item.value">
								{{item.label}}
							</u-radio>
						</u-radio-group>
					</u-td> -->
					<u-td style="font-weight: bold;font-size: 32rpx; color: #333;">送检状态</u-td>
					<u-td style="align-items: center; border: none;">
						<u-tag style="font-weight: bold;font-size: 40rpx; width: max-content;"
							:text="parent_obj.state | stateInfoFilterJC('state')"
							:type="parent_obj.state | stateInfoFilterJC('type')"></u-tag>
					</u-td>
				</u-tr>
			</u-table>
			<view :style="iskeyOpen ? hideStyle : {}" style="z-index: 99;" class="product-btn-box" v-if="isEdit">
				<view class="btn-box-left">
					<u-button type="success" :loading="submitLoading" @click="inspectionSubmmit">提交</u-button>
					<!-- <text v-if="resetCheckLoading" style="opacity: .7;">
						<u-loading style="margin-bottom: 4rpx; margin-right: 10rpx;" mode="circle"
							:color="$mStore.state.themeColor.color"></u-loading>
						一键清空质检数据
					</text>
					<text v-else @click="resetCheck">一键清空质检数据</text> -->
				</view>
				<!-- <view class="btn-box-right">
					<view class="btn-box-label">人工判定</view>
					<u-button type="success" :loading="submitLoading" @click="judgeHanlder('success')">合格</u-button>
					<u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">让步放行</u-button>
					<u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button>
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('fanxiu')">返修/核实</u-button>
				</view> -->
				<!-- <view class="btn-box-right"
					v-if="!parent_obj.check_result || parent_obj.check_result == '让步放行'">
					<u-button type="primary" :loading="submitLoading" @click="submit_jishu">提交技术判定</u-button>
				</view> -->
			</view>
			<!-- <view :style="iskeyOpen ? hideStyle : {}" class="product-btn-box" v-else-if="isJISHU">
				<view class="btn-box-right">
					<view class="btn-box-label">技术判定</view>
					<u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">让步放行</u-button>
					<u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button>
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('fanxiu')">返修/核实</u-button>
				</view>
			</view> -->
			<check-tool-popup ref="checkToolPopupRef" :defaultValue="currentTool"
				@confirm="checkToolPopupConfirm"></check-tool-popup>
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
		<user-popup ref="userPopupRef"
			:default-value="parent_obj.inspector_id ? [Array.isArray(parent_obj.inspector_id) && parent_obj.inspector_id.length > 0 ? parent_obj.inspector_id[0] : parent_obj.inspector_id] : []"
			:is-footer="false" @confirm="userPopupConfirm"></user-popup>
		<user-popup ref="userPopupRef2" :is-footer="false" @confirm="userPopupConfirm2"></user-popup>
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
	import userPopup from '@/components/user-popup-account/index.vue';
	import checkToolPopup from '@/components/check-tool-popup/index.vue';
	import checkInput from './check_input.vue';
	import {
		htmlToText
	} from './utils';
	export default {
		components: {
			pageLoading,
			checkInput,
			userPopup,
			checkToolPopup
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
				resetCheckLoading: false,
				repairShow: false,
				typeValue: '',
				workshop: '',
				check_name: '',
				parent_obj: {},
				parent_obj_init: {},
				check_list: [],
				category_list: [],
				other_category_list: [],
				inspection_list: [],
				inspection_list_arr: [],
				userList: [],
				editingIndex: null,
				editRowIndex: null,
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
				groupSigns: groupSigns,
				is_first_check: true,
				isEdit: true,
				repairDec: '',
				pagination_ids: [],
				paginationIndex: 0,
				inspector_user: '',
				barcode: '',
				checkIds: [],
				isFirstScan: true,
				scrollTop: 0,
				production_state: false,
				check_state: true,
				isBack: false,
				selectUser: null,
				selectUser2: null,
				pointResultList: [],
				currentTool: null
			}
		},
		computed: {
			isBespread() {
				// return this.$mStore.state.sysInfo.windowWidth > (this.categoryList.length * 300) / 2
				return false
			},
			isJISHU() {
				return this.$mStore.state.user.group_info[groupSigns.JISHU] && this.parent_obj.check_result == '技术判定'
			},
			categoryList() {
				return this.iskeyOpen || this.isJISHU || this.category_list.length <= 7 ? this.category_list : this
					.category_list.concat()
			}
		},
		filters: {
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
			}
		},
		methods: {
			async initData(parent_obj) {
				this.loadmore = 'loadmore';
				this.parent_obj = parent_obj;
				this.barcode = this.parent_obj.barcode;
				const product_name = this.parent_obj.product_name || '';
				uni.setNavigationBarTitle({
					title: `${product_name}检验记录`
				});
				uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
				// if (this.parent_obj.barcode)
				this.getCheckResult();
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
			inputChange(event) {
				return event.detail.value
			},
			inputBlur(event, index, subIndex, l_index) {
				let item = this.inspection_list_arr[l_index].inspection_list[index][subIndex];
				item[item.type] = event?.detail?.value ?? event;
				this.$set(this.inspection_list_arr[l_index].inspection_list[index], subIndex, item);
			},
			inputTextChange(event) {
				return event
			},
			inputTextBlur3(event, index) {
				this.pointResultList[index].result = event
			},
			inputTextBlur2(event, key) {
				this.parent_obj[key] = event
			},
			inputTextBlur(event, index, subIndex, l_index) {
				let item = this.inspection_list_arr[l_index].inspection_list[index][subIndex];
				item[item.type] = event;
			},
			initCategoryList(checks) {
				let res = [];
				if (checks?.length > 0) {
					res = [...checks];
				}
				uni.stopPullDownRefresh();
				if (!res) {
					// this.loadmore = 'error';
					return
				}
				if (res?.length > 0) {
					this.loadmore = 'more';
					this.mapChecks(res);
					this.category_list = JSON.parse(JSON.stringify(this.check_list));
					this.category_list.forEach((category) => {
						const measureItem = category.content.find((item) => item.measure_tool_id && item
							.measure_tool_id[1]);
						const match = measureItem?.measure_tool_id[1]?.match(/\[(.*?)\]\s*(.*)/);
						if (measureItem && match) {
							this.$set(category, 'tool', match[2]);
							this.$set(category, 'code', match[1]);
							this.$set(category, 'measure_id', measureItem.measure_tool_id[0]);
						} else {
							this.$set(category, 'tool', "");
							this.$set(category, 'code', "");
							this.$set(category, 'measure_id', "");
						}
					});
				}
			},
			async getCheckList() {
				let inspection_list = [];
				const max = Math.max(...this.check_list.map(item => item.content.length))
				for (let i = 0; i < max; i++) {
					const obj = {}
					const arr = []
					for (let j = 0; j < this.check_list.length; j++) {
						obj[this.check_list[j].type] =
							this.check_list[j].content[i] ?
							(this.check_list[j].type_value == 'Measure' ?
								(this.$mHelper.isNumber(this.check_list[j].content[i].measure) && this
									.check_list[j].content[i].measure != 0 ? this.check_list[j].content[
										i]
									.measure : this
									.check_list[j].content[i].is_show ? this.check_list[j].content[i]
									.measure : '') :
								htmlToText(this.check_list[j].content[i].note)) : null
						let type_value = obj[this.check_list[j].type];
						// 密度绑定
						if (this.check_list[j].type.split('\n')?.length > 0 && this.check_list[j].type.split(
								'\n')[0] == '密度' && type_value !== null) {
							type_value = this.$mHelper.isNumber(this.parent_obj.density) && this.parent_obj
								.density != 0 ? this.parent_obj.density : '';
						}
						// if (this.check_list[j].type_value === 'Instructions' && obj[this
						if (this.check_list[j].type_value !== 'Measure' && obj[this
								.check_list[j].type] != null && !obj[this.check_list[j].type]) {
							type_value = ''
						}
						arr.push({
							[this.check_list[j].type]: type_value,
							id: this.check_list[j].content[i] ? this.check_list[j].content[i]
								.id : null,
							check_id: this.check_list[j].content[i] ? this.check_list[j]
								.content[i]
								.check_id : null,
							type: this.check_list[j].type,
							point_id: this.check_list[j].point_id,
							title: this.check_list[j].content[i] ? this.check_list[j].content[i]
								.title : null,
							type_value: this.check_list[j].type_value,
							initial_value: type_value,
						})
					}
					inspection_list.push(arr)
				}
				this.inspection_list = [...inspection_list]
			},
			mapChecks(checks) {
				let _checks = [];
				if (checks?.length > 0) {
					this.check_state = true;
					const groupedArray = {};
					checks.forEach((item, index) => {
						const typeId = item.test_type_id[0] + '_type_id';
						if (!groupedArray[typeId]) {
							groupedArray[typeId] = [];
						}
						groupedArray[typeId].push(item);
					});
					_checks = Object.values(groupedArray);
					const result = {}
					let measureArray = []
					_checks.forEach(item => {
						measureArray = item;
						// 遍历 measureArray，根据 title 分类
						measureArray.forEach(item => {
							const title = item.title || '';
							// const type = title.replace(/[0-9]/g, ''); // 提取类型，如 "高度"、"重量"、"内径"
							const type = title; // 提取类型，如 "高度"、"重量"、"内径"
							// let standard_value = this.mapStandardValue(type);
							let standard_value = item.inspection_norm || '';
							// 如果该类型还没有在结果对象中创建对应的项，就创建一个
							if (!result[type]) {
								result[type] = {
									id: item.test_type_id[0],
									type_value: item.test_type_id[1],
									type,
									type_s: standard_value,
									point_id: Array.isArray(item.point_id) && item.point_id.length >
										0 ? item.point_id[0] : item.point_id,
									content: []
								};
							}
							// 添加原始对象到结果对象的 content 数组中
							result[type].content.push(item.quality_check || item);
						});
					})
					this.check_list = Object.values(result);
				} else {
					this.check_list = [];
					this.check_state = false;
					this.loadmore = 'nomore';
					uni.showToast({
						title: '当前产品暂未完工～',
						icon: 'none',
						duration: 3000
					})
				}
			},
			async getCheckResult(add) {
				uni.showLoading({
					title: '加载中...',
					mask: true
				});
				let result = await api.web.dataset.call_kw({
					model: 'quality.inspection.entry',
					method: 'get_entry_inspection_details',
					args: [
						[]
					],
					kwargs: {
						inspection_id: this.parent_obj.id
					}
				});
				let res = result?.list?.length > 0 ? result.list[0] : null;
				setTimeout(() => {
					uni.hideLoading();
				}, 3000)
				if (res) {
					let points = res.control_points?.length > 0 ? res.control_points : [];
					if (points.length <= 0) {
						this.loadmore = 'nomore';
						uni.hideLoading();
						this.$refs.uToast.show({
							title: '请配置检验点～',
							type: 'warning',
						})
						return
					}
					let checks = res.quality_checks?.length > 0 ? res.quality_checks : [];
					this.pointResultList = res.control_point_results || [];
					if (this.isFirstScan) {
						this.initCategoryList(points)
						this.parent_obj_init = {
							...res
						}
						this.isFirstScan = false
					}
					this.parent_obj = {
						...res
					};
					this.inspectionListArrHanlder(checks, add);
				}
			},
			async inspectionListArrHanlder(checks, add) {
				// let find = this.inspection_list_arr.find(item => item.lot_id === this.barcode);
				// if (find) {
				// 	uni.showToast({
				// 		title: '请勿重复扫码',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				// if (!this.isFirstScan && (this.parent_obj.product_category_id !== this.parent_obj_init
				// 		.product_category_id)) {
				// 	uni.showToast({
				// 		title: '请扫描相同类别产品',
				// 		icon: 'none',
				// 		duration: 3000
				// 	});
				// 	return
				// }
				if (!this.check_state) return
				// uni.showLoading();
				if (add) {
					let _checks = this.categoryList.map(c => ({
						...c.content[0]
					}))
					this.mapChecks(_checks);
					this.getCheckList();
					let obj = {
						number: this.inspection_list_arr.length + 1,
						inspection_list: this.inspection_list
					};
					this.inspection_list_arr.push(obj);
				} else {
					this.inspection_list_arr = checks.map(item => {
						this.mapChecks(item.checks);
						this.getCheckList();
						return {
							number: item.number,
							inspection_list: this.inspection_list.slice()
						}
					})
				}
				// this.mapChecks(points);
				// this.getCheckList();
				// // uni.hideLoading();

				this.scrollToBottom();
			},
			inspectionConfirm(isSubmit = false) {},
			inspectionSubmmit() {
				uni.showModal({
					content: '是否确认提交？',
					success: async (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '提交中',
								mask: true
							})
							this.submitLoading = true;
							try {
								let {
									id,
									inspector_id,
									inspection_conclusion
								} = this.parent_obj;
								let params = {
									inspection_id: id,
									quantity_inspected: this.parent_obj.quantity_inspected - 0,
									inspection_conclusion,
									inspector_id: Array.isArray(inspector_id) ? inspector_id[0] :
										inspector_id,
									control_point_results: this.pointResultList,
									submissions: this.inspection_list_arr.map((ins, index) => {
										return {
											number: ins.number,
											checks: ins.inspection_list.flat().map((check) => {
												let key = check.type_value == 'Measure' ?
													'measure' : 'note';
												let value = check[check['type']]
												return {
													point_id: check.point_id,
													test_type_id: key,
													test_type: check.id,
													[key]: key === 'measure' ? value - 0 :
														value
												}
											})
										}
									})
								}
								api.web.dataset.call_kw({
									model: 'quality.inspection.entry',
									method: 'submit_inspection_entry_results',
									args: [
										[]
									],
									kwargs: {
										...params
									}
								}).then(async res => {
									if (res) {
										this.$refs.uToast.show({
											title: `提交成功`,
											type: 'success',
										})
										this.getCheckResult();
									} else {
										uni.hideLoading();
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
			mapStandardValue(title) {
				let standard_val = this.standard_values.find((item) => item.label === '标准' + title)
				return standard_val?.value || ''
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
			userSelect(type) {
				if (type == 'clear') {
					this.parent_obj.inspector_id = null;
					this.$set(this.parent_obj, 'inspector', '')
				} else
					this.$refs.userPopupRef.open();
			},
			userSelect2(type) {
				if (type == 'clear') {
					this.parent_obj.auditor_id = null;
					this.$set(this.parent_obj, 'auditor', '')
				} else
					this.$refs.userPopupRef2.open();
			},
			userPopupConfirm(e) {
				if (e?.length) {
					this.selectUser = e[0];
					this.parent_obj.inspector_id = this.selectUser?.id || null;
					this.$set(this.parent_obj, 'inspector', this.selectUser?.name || '')
				} else {
					this.userSelect('clear')
				}
			},
			userPopupConfirm2(e) {
				if (e) {
					this.selectUser2 = e[0];
					this.parent_obj.auditor_id = this.selectUser2.id;
					this.$set(this.parent_obj, 'auditor', this.selectUser2.name);
				}
			},
			// 扫码
			async scanClick() {
				this.inspectionListArrHanlder([], true);
				// // #ifdef APP-PLUS
				// uni.scanCode({
				// 	success: async (res) => {
				// 		this.barcode = res.result || '';
				// 		this.getCheckResult();
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
				// // #endif
			},
			handleFocus2(rowIndex, index) {
				if (!this.isEdit) return
				this.eligibleToolFlag = true;
				this.editRowIndex = rowIndex;
				// 更新编辑的索引
				this.editingIndex = index;
			},
			handleFocus(index) {
				this.currentTool = this.category_list[index].tool ? [this.category_list[index].tool] : [];
				this.eligibleToolFlag = false;
				typeof this.$refs.checkToolPopupRef.open === 'function' && this.$refs.checkToolPopupRef.open();
				// 更新编辑的索引
				this.editingIndex = index;
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
			checkToolPopupConfirm(tool) {
				let item = tool?.length > 0 ? tool[0] : null;
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
			},
			// 人工判定按钮组
			judgeHanlder(result) {
				let chinese = '';
				let method = '';
				if (result === 'success') {
					chinese = '合格';
					method = 'do_pass';
				}
				if (result === 'warning') {
					chinese = '让步放行';
					method = 'do_release';
				}
				if (result === 'error') {
					chinese = '隔离';
					method = 'do_fail';
				}
				if (result === 'fanxiu') {
					chinese = '返修';
					method = 'do_fail';
					this.repairShow = true;
					return
				}
				uni.showModal({
					content: `是否判定为${chinese}？`,
					success: async (e) => {
						if (e.confirm) {
							this.submitLoading = true;
							try {
								// if (!this.isSave) {
								// await this.inspectionConfirm();
								// }
								const model = 'mrp.production'
								const {
									id
								} = this.parent_obj
								const args = [id]
								const kwargs = {}
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
					} = this.parent_obj
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
								} = this.parent_obj
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
				} = this.parent_obj
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
			showCheckResult() {
				this.isConfirmButtonShow = false;
			},
			async refresh(is_refresh, product_id) {
				uni.showModal({
					content: '是否刷新？',
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
			let parent_obj = {};
			this.typeValue = options.typeValue || '';
			this.workshop = options.workshop || '';
			if ('params' in options) {
				parent_obj = JSON.parse(options.params);
			}
			this.initData({
				...parent_obj,
				quantity_inspected: ''
			});
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
			// height: calc(100% - 156rpx);
			height: calc(100% - 436rpx);
			// height: calc(100% - 286rpx);
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
			font-size: 28rpx;
			color: #303133;
			font-weight: bold;
			background-color: #fff;
			flex: none;
			width: 160rpx;
			height: auto;
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
			bottom: 350rpx;
			right: 40rpx;
			border-radius: 50%;
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
			height: calc(100% - 438rpx) !important;

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