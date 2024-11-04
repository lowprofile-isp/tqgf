<template>
	<view class="product_inspection">
		<u-top-tips ref="uToast" />
		<!-- 悬浮扫码 -->
		<!-- #ifdef APP-PLUS -->
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- #endif -->
		<page-loading :loadmore="loadmore" @refresh="refresh">
			<u-table>
				<u-tr style="min-height: 70rpx; height: auto;">
					<u-td class="table-label">产品名称</u-td>
					<u-td class="table-value">{{production_obj.product_name}}</u-td>
					<u-td class="table-label">批号/序号</u-td>
					<u-td
						class="table-value">{{production_obj.batch_code + '-' + production_obj.serial_num || ''}}</u-td>
					<u-td class="table-label">产品规格</u-td>
					<u-td class="table-value">{{production_obj.size || ''}}</u-td>
					<u-td class="table-label">产品数量</u-td>
					<u-td
						class="table-value">{{production_obj.product_qty ? production_obj.product_qty + '件' : ''}}</u-td>
				</u-tr>
			</u-table>
			<scroll-view scroll-x scroll-y show-scrollbar class="product-table"
				:style="{height: iskeyOpen ? 'calc(100% - 386rpx + 110rpx + 154rpx)' : ''}">
				<u-table style="border-top: none; table-layout: fixed; width: 100%; padding-bottom: 260rpx;">
					<u-tr style="height: auto; position: sticky; top: 0; z-index: 11;">
						<u-td class="table-label" style="flex: none;">{{'检验项\n（标准值）'}}</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="min-height: 130rpx; height: auto;">
								<u-th :width="!isBespread ? '300rpx' : ''"
									style="white-space: pre-wrap; word-break: break-all; font-weight: 500;"
									v-for="(item, index) in categoryList" :key="index">
									{{item.type}}
									<view :style="{fontSize: item.type_s.length > 10 ? '20rpx' : '26rpx'}"
										v-if="item.type_s">({{item.type_s }})</view>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;">
						<u-td class="table-label" style="flex: none;">检验工具</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="height: 100%;">
								<u-th :width="!isBespread ? '300rpx' : ''" style="font-weight: 400;"
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
					<u-tr style="min-height: 70rpx; height: auto;">
						<u-td class="table-label" style="flex: none;">工具编号</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="height: 100%;">
								<u-th :width="!isBespread ? '300rpx' : ''" style="font-weight: 400;"
									v-for="(item,index) in categoryList" :key="index">
									<view v-if="item.type == '外观'"></view>
									<template v-else>
										<!-- <u-input v-model="item.code" type="text" input-align="center" disabled
											placeholder="选择工具后自动带出" /> -->
										<u-input v-model="item.code" type="text" input-align="center" disabled
											placeholder="" />
									</template>
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="min-height: 70rpx; height: auto;" v-if="production_obj.x_norm_tolerance">
						<u-td class="table-label" style="flex: none;">检验公差</u-td>
						<u-th :style="{flex: !isBespread ? '0 0 ' + (300 * categoryList.length) + 'rpx' : ''}"
							style="flex-grow: 1; text-align: left; padding: 10rpx 30rpx;">
							{{ production_obj.x_norm_tolerance || '' }}
						</u-th>
					</u-tr>

					<u-tr style="min-height: 70rpx; height: auto;">
						<!-- <u-td style="width: 200rpx; flex: none; font-size: 40rpx; font-weight: bold;
							writing-mode: vertical-rl; letter-spacing: 10rpx; text-orientation: upright;">第1次检验</u-td> -->
						<u-td class="table-label" style="flex: none; font-size: 40rpx; font-weight: bold;
							writing-mode: vertical-rl; letter-spacing: 10rpx; text-orientation: upright; color: #C0C4CC;">*</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr v-for="(item,index) in inspection_list" :key="index">
								<!-- <u-td><u-input type="text" disabled input-align="center" placeholder="*" /></u-td> -->
								<u-td :width="!isBespread ? '300rpx' : 'auto'" class="category-cell"
									v-for="(i,index2) in item" :key="index2">
									<!-- <template v-if="i.type === '外观'"> -->
									<!-- <template v-if="false">
										<u-input v-model="i[i.type]" :type="i[i.type] === null ? 'number' : 'select'"
											input-align="center" :placeholder="i[i.type]==='' ? '请选择' : '*'"
											:disabled="i[i.type] === null || !isEdit"
											@click.native="handleFocus2(index, index2)" />
									</template> -->
									<!-- @focus="inputHandler('focus',index, index2)"
											@blur="inputHandler('blur',index, index2)" -->
									<template v-if="i.type_value === 'Measure'">
										<input :value="i[i.type]" @input="inputChange"
											@blur="(event) => inputBlur(event, index, index2)" :type="'number'"
											input-align="center" :clearable="false"
											:selection-start="String(i[i.type]).length - 1"
											:selection-end="String(i[i.type]).length - 1"
											:placeholder="i[i.type] === null ? '*' : ''" :disabled="
											i[i.type] === null ||
											!isEdit ||
											i.title === '密度'" />
									</template>
									<template v-else>
										<u-input :value="i[i.type]" @input="inputTextChange"
											@blur="(event) => inputTextBlur(event, index, index2)" type="text"
											input-align="center" :clearable="false"
											:placeholder="i[i.type] === null ? '*' : ''"
											:disabled="i[i.type] === null || !isEdit" />
									</template>
								</u-td>
							</u-tr>
						</u-td>
					</u-tr>
					<u-tr style="min-height: 100rpx; height: auto;">
						<u-td class="table-label" style="flex: none;">平均值</u-td>
						<u-td style="flex: auto; flex-grow: 1; padding: 0; border-bottom: 0; border-right: 0;">
							<u-tr style="height: 100%;">
								<u-th :width="!isBespread ? '300rpx' : ''" style="font-weight: 400;"
									v-for="(item,index) in categoryList.filter(cate => cate.type)" :key="index">
									<u-input v-model="item.average_value" type="text" input-align="center" disabled
										placeholder="" />
								</u-th>
							</u-tr>
						</u-td>
					</u-tr>
				</u-table>
			</scroll-view>
			<u-table :style="iskeyOpen ? hideStyle : {}" v-if="true" style="position: fixed; left: 0; bottom: 152rpx;">
				<u-tr style="height: 100rpx;">
					<u-td v-if="!isJISHU" style="font-weight: bold;font-size: 32rpx; color: #333;">检验类型</u-td>
					<u-td v-if="!isJISHU" style="align-items: center;">
						<u-radio-group v-model="production_obj.check_type">
							<u-radio v-for="(item, index) in checkTypeList" :key="index" :name="item.value">
								{{item.label}}
							</u-radio>
						</u-radio-group>
					</u-td>
					<u-td style="font-weight: bold;font-size: 32rpx; color: #333;">检验结果</u-td>
					<u-td>
						<text style="font-weight: bold;font-size: 40rpx;"
							:style="{color: checkResultFilter(production_obj.check_result)}">{{production_obj.check_result || ''}}</text>
					</u-td>
				</u-tr>
			</u-table>
			<view :style="iskeyOpen ? hideStyle : {}" class="product-btn-box" v-if="isEdit">
				<view class="btn-box-left">
					<u-button :loading="saveLoading" type="primary"
						@click="inspectionConfirm(true, false)">暂存/保存</u-button>
					<u-button type="success" :loading="submitLoading"
						@click="inspectionConfirm(true, true)">提交</u-button>
					<text v-if="resetCheckLoading" style="opacity: .7;">
						<u-loading style="margin-bottom: 4rpx; margin-right: 10rpx;" mode="circle"
							:color="$mStore.state.themeColor.color"></u-loading>
						一键清空质检数据
					</text>
					<text v-else @click="resetCheck">一键清空质检数据</text>
				</view>
				<view class="btn-box-right">
					<view class="btn-box-label">人工判定</view>
					<u-button type="success" :loading="submitLoading" @click="judgeHanlder('success')">合格</u-button>
					<u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">让步放行</u-button>
					<u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button>
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('fanxiu')">返修/核实</u-button>
					<u-button v-if="!production_obj.check_result || production_obj.check_result == '让步放行'" type="primary" :loading="submitLoading" @click="submit_jishu">提交技术判定</u-button>
				</view>
			</view>
			<view :style="iskeyOpen ? hideStyle : {}" class="product-btn-box" v-else-if="isJISHU">
				<view class="btn-box-right">
					<view class="btn-box-label">技术判定</view>
					<!-- <u-button type="success" :loading="submitLoading" @click="judgeHanlder('success')">合格</u-button> -->
					<u-button type="warning" :loading="submitLoading" @click="judgeHanlder('warning')">让步放行</u-button>
					<u-button type="error" :loading="submitLoading" @click="judgeHanlder('error')">隔离</u-button>
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('fanxiu')">返修/核实</u-button>
					<u-button type="primary" :loading="submitLoading" @click="judgeHanlder('zhuan')">转实验流转并补产</u-button>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<template>
				<view class="pagination-btn left" :class="paginationIndex <= 0 ? 'disabled' : ''"
					@click="prevHandle(paginationIndex)">
					<u-icon name="arrow-left" size="60" :color="$mStore.state.themeColor.color"></u-icon>
				</view>
				<view class="pagination-btn right" :class="paginationIndex >= pagination_ids.length ? 'disabled' : ''"
					@click="nextHandle(paginationIndex)">
					<u-icon name="arrow-right" size="60" :color="$mStore.state.themeColor.color"></u-icon>
				</view>
			</template>
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
			<!-- <u-modal ref="repairPopup" v-model="repairShow" width="800" title="返修原因/说明" show-cancel-button async-close
				confirm-text="提交" :title-style="{paddingTop: '32rpx', fontSize: '32rpx'}" @confirm="repairConfirm"
				@cancel="repairClose">
				<view class="repair-content" style="padding: 20rpx 30rpx;">
					<textarea v-model="repairDec" placeholder="请描述返修原因/建议" auto-height auto-focus />
				</view>
			</u-modal> -->
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
	import {
		htmlToText
	} from './utils';
	export default {
		components: {
			pageLoading
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
				check_list: [],
				category_list: [],
				other_category_list: [],
				inspection_list: [],
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
				average_values: [],
				groupSigns: groupSigns,
				is_first_check: true,
				isEdit: true,
				repairDec: '',
				pagination_ids: [],
				paginationIndex: 0,
				inspector_user: '',
				search_word: '',
				production_state: false,
				check_state: false,
				isBack: false
			}
		},
		computed: {
			isBespread() {
				return this.$mStore.state.sysInfo.windowWidth > (this.categoryList.length * 300) / 2
			},
			isJISHU() {
				return this.$mStore.state.user.group_info[groupSigns.JISHU] && this.production_obj.check_result == '技术判定'
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
					.category_list.concat([{}, {}, {}, {}])
			}
		},
		methods: {
			async initData(production_obj) {
				this.loadmore = 'loadmore';
				await this.getProductionInfo(production_obj.id);
				const categIdArray = this.production_obj.categ_id?.length > 1 ? this.production_obj.categ_id[1].split(
					'/') : [];
				const title = categIdArray[categIdArray.length - 1]?.trim() || '';
				uni.setNavigationBarTitle({
					title: `${title}检验`
				});
				await this.getProductionIds(production_obj.domain);
				this.paginationIndex = this.pagination_ids.findIndex(p => p === this.production_obj.id);
				uni.onKeyboardHeightChange(this.onKeyboardHeightChange);
				await this.$mStore.dispatch('user/hasGroup', groupSigns.JISHU);
				if (this.$mStore.state.user.group_info[groupSigns.JISHU]) {
					this.isEdit = false
				}
				this.getToolList();
				await this.getStandardValues();
				this.getOtherInfo();
				await this.getCheckList();
				if (production_obj.search_word) {
					this.search_word = production_obj.search_word
				}
				if (!this.production_state || !this.check_state) {
					this.autoDoneProduction();
					return
				}
				if (this.production_obj.check_result) {
					this.showCheckResult();
				}
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
			inputBlur(event, index, subIndex) {
				this.inspection_list[index][subIndex][this.inspection_list[index][subIndex].type] = event.detail.value
			},
			inputTextChange(event) {
				return event
			},
			inputTextBlur2(event) {
				this.inspector_user = event.detail.value
			},
			inputTextBlur(event, index, subIndex) {
				this.inspection_list[index][subIndex][this.inspection_list[index][subIndex].type] = event
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
			async getProductionIds(domain = []) {
				const Model = api.env.model('mrp.production');
				let res = await Model.search_read({
					order: "id DESC",
					domain,
					fields: [
						"id"
					]
				})
				if (res && res.length) {
					this.pagination_ids = res.map(p => p.id);
				}
			},
			async getProductionInfo(id) {
				let product_id = id || this.production_obj.id;
				const Model = api.env.model('mrp.production');
				try {
					let domain = [];
					if (this.search_word) {
						domain = [
							['lot_producing_id', 'ilike', this.search_word || '']
						]
					} else {
						domain = [
							['id', '=', product_id]
						]
					}
					const res = await Model.search_read({
						domain,
						// fields: [
						// 	'volume', 'density', 'x_appearance_classification',
						// 	"batch_code", "date_start", "bom_id", "categ_id", "check_ids", "check_result",
						// 	"company_id",
						// 	"complete_lot_num",
						// 	"display_name", "id", "gf_qty", "lot_producing_id", "origin",
						// 	"product_id", "product_name", "product_code", "product_qty", "size",
						// 	"product_tracking",
						// 	"serial_num",
						// 	"task_qty", "tracking", "state", "to_check_state", "repair_state", "tech_note",
						// 	"norm_weight", "norm_volume"
						// ]
					})
					if (res) {
						let result = {};
						if (res.length > 0) {
							result = res[0];
							this.checkIds = result.check_ids || [];
							if (this.checkIds.length <= 0) {
								this.production_state = false;
								this.check_state = false;
								// uni.showToast({
								// 	title: '当前产品暂未完工～',
								// 	icon: 'none',
								// 	duration: 3000
								// })
								return
							}
							this.production_state = true;
							this.production_obj = {
								...result
							};
						} else {
							uni.showToast({
								title: '未查询到产品',
								icon: 'none'
							});
							this.production_state = false;
						}

					}
				} catch (e) {
					//TODO handle the exception
				}
			},
			/* 
				页面加载时调用
				check_list:  'quality.check'
				category_list: 对 'quality.check' 依据 test_type_id 分类
			 */
			async getCheckList() {
				let inspection_list = [];
				const Model = api.env.model('quality.check')
				const ids = this.production_obj.check_ids
				const company_id = uni.getStorageSync('company_id')
				const PointModel = api.env.model('quality.point')
				const pointList = await PointModel.search_read({
					domain: [
						['quality_point_type', '=', this.typeValue]
					],
					fields: ["id"]
				})
				let pointIds = pointList?.map(item => item.id) ?? [];
				const res = await Model.search_read({
					domain: [
						['id', 'in', ids],
						['point_id', 'in', pointIds],
						// ['company_id', '=', company_id],
					],
					fields: ["create_date", "control_date", "default_code", "display_name", "employee_id",
						"finished_lot_id", "id", "is_deleted", "lot_id", "measure", "measure_tool",
						"name", "norm_unit", "point_id", "product_id", "quality_state", "team_id",
						"test_type_id", "title", "tolerance_max", "tolerance_min", "user_id", "note",
						"is_show"
					]
				})
				uni.stopPullDownRefresh();
				if (!res) {
					this.loadmore = 'error';
					return
				}
				if (res?.length > 0) {
					this.loadmore = 'more';
					this.check_state = true;
					const groupedArray = {};
					res.forEach((item, index) => {
						const typeId = item.test_type_id[0] + '_type_id';
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
							const type = title.replace(/[0-9]/g, ''); // 提取类型，如 "高度"、"重量"、"内径"
							let standard_value = this.mapStandardValue(type);
							let average_value = this.mapAverageValues(type);
							// 如果该类型还没有在结果对象中创建对应的项，就创建一个
							if (!result[type]) {
								result[type] = {
									id: item.test_type_id[0],
									type_value: item.test_type_id[1],
									type,
									type_s: standard_value,
									average_value,
									content: []
								};
							}
							// 添加原始对象到结果对象的 content 数组中
							result[type].content.push(item);
						});
					})
					this.category_list = Object.values(result);
					this.category_list.push(...this.category_list.splice(this.category_list.findIndex(v => v
							.type ==
							'外观'),
						1));
					let weightIndex = this.category_list.findIndex(c => c && c.content.length > 0 ? c.content[0]
						.title == '体积' : -1)
					if (weightIndex > -1) {
						this.category_list.splice(weightIndex + 1, 0, ...this.other_category_list)
					}
					this.category_list.forEach((category) => {
						const measureItem = category.content.find((item) => item.measure_tool && item
							.measure_tool[1] !== "false");
						const match = measureItem?.measure_tool[1]?.match(/\[(.*?)\]\s*(.*)/);
						if (measureItem && match) {
							this.$set(category, 'tool', match[2]);
							this.$set(category, 'code', match[1]);
							this.$set(category, 'measure_id', measureItem.measure_tool[0]);
						} else {
							this.$set(category, 'tool', "");
							this.$set(category, 'code', "");
							this.$set(category, 'measure_id', "");
						}
					});
					const max = Math.max(...this.category_list.map(item => item.content.length))
					for (let i = 0; i < max; i++) {
						const obj = {}
						const arr = []
						for (let j = 0; j < this.category_list.length; j++) {
							obj[this.category_list[j].type] =
								this.category_list[j].content[i] ?
								(this.category_list[j].type_value == 'Measure' ?
									(this.$mHelper.isNumber(this.category_list[j].content[i].measure) && this
										.category_list[j].content[i].measure != 0 ? this.category_list[j].content[
											i]
										.measure.toFixed(2) : this
										.category_list[j].content[i].is_show ? this.category_list[j].content[i]
										.measure : '') :
									htmlToText(this.category_list[j].content[i].note)) : null
							let type_value = obj[this.category_list[j].type];
							// if (this.category_list[j].type_value === 'Instructions' && obj[this
							if (this.category_list[j].type_value !== 'Measure' && obj[this
									.category_list[j].type] != null && !obj[this.category_list[j].type]) {
								type_value = ''
							}
							// if (this.category_list[j].type == '外观') {
							// 	if (obj[this.category_list[j].type] != null && !obj[this.category_list[j].type]) {
							// 		type_value = ''
							// 	}
							// 	if (obj[this.category_list[j].type] == 1) {
							// 		type_value = '合格'
							// 	}
							// 	if (obj[this.category_list[j].type] == 2) {
							// 		type_value = '隔离'
							// 	}
							// }
							arr.push({
								[this.category_list[j].type]: type_value,
								'id': this.category_list[j].content[i] ? this.category_list[j].content[i]
									.id : null,
								'check_id': this.category_list[j].content[i] ? this.category_list[j]
									.content[i]
									.check_id : null,
								'type': this.category_list[j].type,
								title: this.category_list[j].content[i] ? this.category_list[j].content[i]
									.title : null,
								type_value: this.category_list[j].type_value,
								initial_value: type_value
							})
						}
						inspection_list.push(arr)
					}
					this.inspection_list = [...inspection_list]
				} else {
					// this.loadmore = 'nomore';
					this.check_state = false;
					// this.$refs.uToast.show({
					// 	title: '请配置检验点～',
					// 	type: 'warning'
					// })
				}
			},
			async autoDoneProduction() {
				let res = await api.web.dataset.call_kw({
					model: 'quality.check',
					method: 'auto_done_production',
					args: [
						[]
					],
					kwargs: {
						serial: this.search_word
					}
				})
				if (res) {
					this.refresh();
				} else {
					uni.hideLoading();
					this.loadmore = 'nomore';
				}
			},
			mapStandardValue(title) {
				let standard_val = this.standard_values.find((item) => item.label === '标准' + title)
				return standard_val?.value || ''
			},
			mapAverageValues(title) {
				let average_val = this.average_values.find((item) => item.label === title)
				return average_val && !Number.isNaN(average_val.value) ? Number(average_val.value).toFixed(2) : ''
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
					let arr_average = this.$mStore.state.industryCustomFields.filter(item => {
						return item.pad_type_selection && item.pad_type_selection.includes('平均值') && item
							.categ_ids.includes(this
								.production_obj.categ_id?.length >
								0 ? this
								.production_obj.categ_id[
									0] : null);
					})
					this.average_values = arr_average.map(item => {
						return {
							label: item.name,
							value: this.production_obj[item.cname]
						}
					})
					this.standard_values = [...publicArr, ...arr.map((item) => {
						return {
							label: item.name,
							value: this.production_obj[item.cname]
						}
					})]
				} catch (e) {
					console.log(e)
					//TODO handle the exception
				}
			},
			// 扫码
			async scanClick() {
				// #ifdef H5
				// this.search_word = 'MK240509ZC02/MK36DLB-24-0524-396';
				// await this.inspectionConfirm();
				// this.refresh(true);
				uni.showToast({
					title: '不支持扫码',
					icon: 'none'
				})
				// #endif
				// #ifdef APP-PLUS
				uni.scanCode({
					success: async (res) => {
						this.search_word = res.result || '';
						await this.inspectionConfirm();
						this.refresh(true);
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
				if (result === 'zhuan') {
					chinese = '转实验流转并补产';
					method = 'do_to_experiment';
				}
				if (result === 'fanxiu') {
					chinese = '返修';
					method = 'do_fail';
					this.repairShow = true;
					uni.showModal({
						title: '返修原因/说明',
						content: '请描述返修原因/说明',
						editable: true,
						confirmText: '提交',
						success: (res) => {
							if(res.confirm) {
								this.repairConfirm();
							}
						}
					})
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
								} = this.production_obj
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
									this.removeHanlde(this.paginationIndex);
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
			inspectionConfirm(isToast = true, isSubmit = false) {
				const fun = async () => {
					let check_data = this.inspection_list.flat().filter(c => c.id != null);
					let data = [{
						production_id: this.production_obj.id,
						check_data: check_data.map(check => {
							return {
								check_id: check.id,
								test_type: check.type_value,
								value: check[check.type]
							}
						})
					}]
					try {
						let res = await api.web.dataset.call_kw({
							model: 'mrp.production',
							method: 'yiqichengpinjian',
							args: [
								[]
							],
							kwargs: {
								data,
								is_zancun: isSubmit ? 0 : 1,
								check_inspector: '',
								check_type: this.production_obj.check_type
							}
						});
						if (res) {
							if (isToast) {
								// uni.showToast({
								// 	title: isSubmit ? `提交成功` : '保存成功',
								// 	icon: 'none'
								// })
								this.$refs.uToast.show({
									title: isSubmit ? `提交成功` : '保存成功',
									type: 'success',
								});
							}

							if (isSubmit) {
								const {
									id
								} = this.production_obj
								const args = [id]
								const kwargs = {}
								api.web.dataset.call_kw({
									model: 'mrp.production',
									method: 'update_check_date',
									args,
									kwargs
								})
								// this.showCheckResult();
								this.refresh();
							}
						}
						uni.hideLoading();
						this.submitLoading = false;
						this.saveLoading = false;
					} catch (e) {
						console.log(e)
						uni.showToast({
							title: '提交失败，请重新提交',
							icon: 'none'
						})
						uni.hideLoading();
						this.submitLoading = false;
						this.saveLoading = false;
					}
				}
				if (isSubmit) {
					uni.showModal({
						content: '是否确认提交？',
						success: async (e) => {
							if (e.confirm) {
								uni.showLoading({
									title: '提交中',
									mask: true
								});
								this.submitLoading = true;
								fun();
							}
						}
					})
				} else {
					this.saveLoading = true;
					fun();
				}
			},
			/* 保存按钮 操作quality.check 写入 measule_tool以及measure  tips: 后续可能会有新字段写入 */
			inspectionConfirm2(isToast = true) {
				this.saveLoading = true;
				return new Promise((rv, rj) => {
					this.clearTimer();
					this.saveTimer = setTimeout(() => {
						const Model = api.env.model('quality.check');
						const P_Model = api.env.model('mrp.production');
						const promises = [];

						this.category_list.forEach(item => {
							item.content.forEach(check => {
								// 寻找匹配的 inspection
								const matchingInspection = this.findMatchingInspection(
									check.id);
								// 如果找到匹配的 inspection，执行 write 操作
								if (matchingInspection) {
									let p = () => {
										return new Promise((resolve, reject) => {
											let value = matchingInspection[
												matchingInspection[
													'type']]
											// if (matchingInspection['type'] == '外观') {
											// 	value = matchingInspection[
											// 			matchingInspection['type']] ===
											// 		'合格' ? 1 :
											// 		matchingInspection[matchingInspection[
											// 			'type']] === '隔离' ? 2 : ''
											// }
											let is_custom = ['密度'].indexOf(
												check
												.title) > -1;
											if (is_custom) {
												let key = 'density'
												P_Model.write(this
													.production_obj
													.id, {
														write_uid: [uni
															.getStorageSync(
																'currentUser'
															)
															.uuid,
															uni
															.getStorageSync(
																'currentUser'
															).name
														],
														write_date: dayjs()
															.format(
																'YYYY-MM-DD HH:mm:ss'
															),
														// measure_tool: item
														// 	.measure_id,
														[key]: key ===
															'measure' ?
															value - 0 :
															value
													}).then((res) => {
													resolve({
														result: res,
														title: check
															.title,
														id: check
															.id
													})
												}, (e) => {
													reject({
														result: e,
														title: check
															.title,
														id: check
															.id
													})
												})
											} else {
												let key = check
													.test_type_id
													?.length > 1 &&
													check.test_type_id[
														1] ==
													'Measure' ?
													'measure' : 'note'
												Model.write(check.id, {
													write_uid: [uni
														.getStorageSync(
															'currentUser'
														)
														.uuid,
														uni
														.getStorageSync(
															'currentUser'
														).name
													],
													write_date: dayjs()
														.format(
															'YYYY-MM-DD HH:mm:ss'
														),
													measure_tool: item
														.measure_id,
													[key]: key ===
														'measure' ?
														value - 0 :
														value
												}).then((res) => {
													resolve({
														result: res,
														title: check
															.title,
														id: check
															.id
													})
												}, (e) => {
													reject({
														result: e,
														title: check
															.title,
														id: check
															.id
													})
												})
											}
										});
									};
									promises.push(p)
								}
							})
						})
						Promise.all(promises.map((promise) => promise())).then((res) => {
							let findIndex = res.length > 0 ? res.findIndex(r => r.result !==
								true) : -1
							if (findIndex > -1) {
								throw Error(res[findIndex])
							}
							this.isSave = true
							isToast && this.$refs.uToast.show({
								title: '保存成功',
								type: 'success',
							})
							rv(res)
						}).catch((e) => {
							this.$refs.uToast.show({
								// title: `${e?.title || ''} 保存失败, 请检查网络或联系技术人员处理`,
								title: `检验数据保存失败, 请检查网络或联系技术人员处理`,
								type: 'error',
								duration: 3000
							})
							rj(e)
						}).finally(() => {
							this.saveLoading = false;
						})
					}, 500)
				})
			},
			/* 提交按钮 调用mrp.production模型get_result方法 */
			inspectionSubmmit() {
				uni.showModal({
					content: '是否确认提交？',
					success: async (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '提交中',
								mask: true
							});
							this.submitLoading = true;
							try {
								await this.inspectionConfirm(false);
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
										// this.$refs.uToast.show({
										// 	title: `提交成功`,
										// 	type: 'success',
										// })
										uni.showToast({
											title: '提交成功',
											icon: 'none',
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
				this.refresh(false, this.pagination_ids[this.paginationIndex]);
			},
			nextHandle(index) {
				if (index >= this.pagination_ids.length) return;
				this.paginationIndex = this.paginationIndex + 1;
				this.refresh(false, this.pagination_ids[this.paginationIndex]);
			},
			async refresh(is_refresh, product_id) {
				try {
					if (is_refresh) this.loadmore = 'loadmore';
					else {
						// setTimeout(() => {
						// 	uni.showLoading();
						// }, 2000)
						// setTimeout(() => {
						// 	uni.hideLoading();
						// }, 3500)
						uni.showLoading({
							mask: true
						})
					}
					await this.getProductionInfo(product_id);
					await this.getStandardValues();
					this.getOtherInfo();
					await this.getCheckList();
					if (!this.production_state || !this.check_state) {
						this.autoDoneProduction();
						return
					}
					uni.hideLoading();
					if (this.production_obj.check_result) {
						this.showCheckResult();
					}
				} catch (e) {
					uni.hideLoading();
				}

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
			if (e.index === 0) {
				this.refresh(true)
			}
		},
		onBackPress() {
			if (!this.isBack && !this.isJISHU) {
				uni.showModal({
					title: '是否退出当前页面？',
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
			this.refresh(true)
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
		.product-table {
			// height: 100%;
			// padding-bottom: 120rpx;
			height: calc(100% - 386rpx);
			// overflow: auto;

			/deep/ .u-td {
				height: auto;
			}

			.uni-input-placeholder {
				font-weight: 400;
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

		.table-value {
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