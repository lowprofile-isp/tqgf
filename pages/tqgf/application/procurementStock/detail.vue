<template>
	<view class="errorPush-page">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<!-- <view class="right-item" @click="() => refresh()">
					<u-icon name="reload" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<view class="right-item" @click="noticeClick">
					<u-icon name="bell-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
					<u-badge type="error" count="7" :offset="[-8, 14]"></u-badge>
				</view> -->
				<!-- <view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop">
					<!-- <view class="page-state success" v-if="baseFormData.state == 'done'">已完成</view> -->
					<card-info title="基本信息">
						<template v-slot:head-right>
							<u-tag :text="stateFilter(baseFormData.state).text || ''"
								:type="stateFilter(baseFormData.state).type" />
						</template>
						<uni-forms class="content-form">
							<uni-forms-item label="单号" label-width="100" class="content-item">
								<span>{{baseFormData.name || ''}}</span>
								<span v-if="baseFormData.name" class="copy-text link"
									@click="$mHelper.copyText(baseFormData.name)">
									<i class="iconfont icon-copy-template"></i>复制
								</span>
							</uni-forms-item>
							<uni-forms-item label="采购单号" label-width="100" class="content-item">
								<span>{{baseFormData.purchase_order_name || ''}}</span>
							</uni-forms-item>
							<uni-forms-item label="供应商" label-width="100" class="content-item">
								<span>{{baseFormData.partner_id || ''}}</span>
							</uni-forms-item>
							<uni-forms-item label="采购日期" label-width="100" class="content-item">
								<span>{{$mHelper.dateToUTC(baseFormData.date_order) || ''}}</span>
							</uni-forms-item>
							<uni-forms-item label="预计到货日期" label-width="100" class="content-item">
								<span>{{$mHelper.dateToUTC(baseFormData.date_planned, 'YYYY-MM-DD') || ''}}</span>
							</uni-forms-item>
						</uni-forms>
					</card-info>
					<card-info title="物料">
						<uni-forms class="material-item" :modelValue="baseFormData" label-width="60">
							<uni-forms-item label="" class="not-width-form-item">
								<view class="list">
									<!-- <view class="list-title"><span class="sign"></span>物料</view> -->
									<view class="list-item"
										v-for="(info, index) in baseFormData.move_ids_without_package" :key="index">
										<view class="item-cell">
											<view class="label">批次</view>
											<view class="value" style="justify-content: space-between;">
												<span>
													{{info.receive_batch || '--'}}
													<i v-if="info.receive_batch" style="margin-left: 20rpx;"
														class="iconfont icon-24gf-printer primary"
														@click="print2(info)"></i>
												</span>
												<u-tag v-if="info.inspection_state == 'pending_receive'"
													style="width: 96rpx; margin-left: 10rpx; font-size: 26rpx;"
													:text="'接收'" :type="'primary'" mode="dark"
													@click="toReceive(info)" />
												<u-tag v-if="info.inspection_state == 'pending_inspect'"
													style="width: 96rpx; margin-left: 10rpx; font-size: 26rpx;"
													:text="'送检'" :type="'success'" mode="dark" @click="toCheck(info)" />
											</view>
										</view>
										<view class="item-cell">
											<view class="label">产品名称</view>
											<view class="value">{{info.product_name || ''}}</view>
										</view>
										<view class="item-cell">
											<view class="label">送检状态</view>
											<view class="value"
												:style="{color: checkResultColor(info.inspection_state)}">
												{{info.inspection_state | checkResultText}}
											</view>
										</view>
										<view class="item-cell"
											v-if="info.inspection_state !== 'pending_receive' && info.inspection_state !== 'pending_inspect'">
											<view class="label">送检日期</view>
											<view class="value">
												{{info.date_sent || ''}}
											</view>
										</view>
										<view class="row-group">
											<view class="item-cell">
												<view class="label">采购数量</view>
												<view class="value">
													{{info.product_uom_qty || 0}}
													<span class="unit">{{info.product_uom}}</span>
												</view>
											</view>
											<view class="item-cell"
												v-if="info.inspection_state !== 'pending_receive' && info.inspection_state !== 'pending_inspect'">
												<view class="label">送检数量</view>
												<view class="value">
													{{info.sent_quantity || 0}}
													<span class="unit">{{info.product_uom}}</span>
												</view>
											</view>
										</view>
										<template v-if="info.inspection_state == 'released'">
											<view class="item-cell" style="align-items: flex-start;">
												<view class="label">包装类型</view>
												<view v-if="isEdit"
													style="display: flex; flex-direction: column; flex-wrap: wrap; flex: 1;">
													<u-radio-group v-model="info.unit_quantity_type"
														style="margin-bottom: 20rpx;">
														<u-radio name="different_per_box" label-size="28rpx"
															icon-size="28rpx">
															数量不同
														</u-radio>
														<u-radio name="same_per_box" label-size="28rpx"
															icon-size="28rpx">
															数量相同
														</u-radio>
													</u-radio-group>
												</view>
												<view v-else class="value">
													<text
														v-if="info.unit_quantity_type == 'different_per_box'">数量不同</text>
													<text v-if="info.unit_quantity_type == 'same_per_box'">数量相同</text>
												</view>
											</view>
											<view class="item-cell"
												v-if="info.unit_quantity_type == 'different_per_box'">
												<view class="label" style="width: 90rpx;">总数</view>
												<view class="value">
													<!-- <span class="unit">#</span> -->
													{{info.boxes.length || 0}}
												</view>
												<view class="label" style="width: 90rpx;">总数量</view>
												<view class="value">
													<span>{{sumQuantity(info.boxes)}}</span>
													<span class="unit">{{info.product_uom}}</span>
												</view>
												<u-button v-if="isEdit" class="item-add" throttle-time="0"
													@click="boxAdd(index)">添加</u-button>
											</view>
											<view class="item-cell" style="align-items: flex-start;">
												<view class="box-container">
													<template v-if="info.unit_quantity_type == 'different_per_box'">
														<view style="margin-right: 10rpx; width: 100%;">
															<view class="box-item" v-for="(box, b_index) in info.boxes"
																:key="b_index">
																<view class="item-cell">
																	<view class="label">编号</view>
																	<view class="value">{{b_index + 1}}#</view>
																</view>
																<view class="item-cell" v-if="box.batch_number">
																	<view class="label">批次</view>
																	<view class="value">{{box.batch_number}}</view>
																</view>
																<view class="item-cell">
																	<view class="label">数量</view>
																	<view class="value">
																		<!-- <u-number-box v-if="isEdit" v-model="box.quantity"
																		input-width="68" input-height="44"></u-number-box> -->
																		<template v-if="isEdit">
																			<uni-easyinput :value="box.quantity"
																				type="number" placeholder=""
																				@input="inputChange"
																				@blur="(event) => inputBlur(event, index, b_index)"></uni-easyinput>
																			<span
																				class="unit">{{info.product_uom}}</span>
																		</template>
																		<template v-else>
																			<span class="quantity"
																				@click="batchNumClikc(info.boxes)">{{box.quantity}}</span>
																			<span
																				class="unit">{{info.product_uom}}</span>
																		</template>
																	</view>
																</view>
																<span v-if="isEdit" class="item-close"
																	@click="boxDel(index, b_index)">
																	<uni-icons type="trash" size="20"
																		color="#FF7878"></uni-icons>
																</span>
																<!-- <span v-if="!isEdit" style="top: 10rpx; right: 12rpx;"
																	class="item-close" @click="toCheck(box, info)">
																	<text
																		:class="box.inspection_exists ? 'success' : ''">{{box.inspection_exists ? '已送检' : '送检'}}</text>
																</span> -->
															</view>
														</view>
													</template>
													<template v-else>
														<view style="margin-right: 10rpx; width: 100%;">
															<view class="box-item">
																<view class="item-cell">
																	<view class="label">总数</view>
																	<view class="value">
																		<uni-easyinput v-if="isEdit"
																			:value="info.box_count" type="number"
																			placeholder="" @input="inputChange"
																			@blur="(event) => inputBlur2(event, index, 'box_count')"></uni-easyinput>
																		<span v-else
																			class="quantity">{{info.box_count}}</span>
																	</view>
																</view>
																<view class="item-cell">
																	<view class="label">数量</view>
																	<view class="value">
																		<template v-if="isEdit">
																			<uni-easyinput
																				:value="info.quantity_per_box"
																				type="number" placeholder=""
																				@input="inputChange"
																				@blur="(event) => inputBlur2(event, index, 'quantity_per_box')"></uni-easyinput>
																			<span
																				class="unit">{{info.product_uom}}</span>
																		</template>
																		<template v-else>
																			<span
																				class="quantity">{{info.quantity_per_box}}</span>
																			<span
																				class="unit">{{info.product_uom}}</span>
																		</template>
																	</view>
																</view>
															</view>
														</view>
													</template>
												</view>
											</view>
										</template>

									</view>
								</view>
							</uni-forms-item>
						</uni-forms>
					</card-info>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" :style="{opacity: keyboardHeight > 0 ? 0 : 1}">
			<template v-if="!isEdit">
				<u-button style="flex: none; width: 160rpx; margin-right: 20rpx;" type="primary" hover-class="none"
					@click="ruku">上架</u-button>
				<print-button @print="print"></print-button>
			</template>
			<u-button v-if="isEdit" type="primary" :loading="btnLoading" :disabled="!baseFormData.id || !totalBoxes"
				hover-class="none" @click="submit">提交</u-button>
		</view>
		<u-modal v-model="checkShow" title="送检" :show-cancel-button="true" cancel-text="取消"
			:title-style="{paddingTop: '20rpx', fontSize: 32}" @confirm="checkConfirm" @cancel="checkShow = false">
			<view class="slot-content">
				<view class="service-modal">
					<u-field v-model="checkInfo.receive_batch" disabled label="批次号" placeholder="">
					</u-field>
					<u-field v-model="checkInfo.quantity_sent" type="number" :border-bottom="false" label="送检数量"
						placeholder="">
						<span slot="right" class="unit">{{checkInfo.product_uom || ''}}</span>
					</u-field>
				</view>
			</view>
		</u-modal>
		<u-popup class="custom-bottom-popup-style" v-model="batchShow" mode="bottom">
			<view class="head">
				<text>批次号</text>
			</view>
			<view class="content">
				<scroll-view v-if="batch_list.length" scroll-y="true" style="height: 700rpx;">
					<view class="item" :id="'userItem-'+item.id" v-for="(item, index) in batch_list">
						<view>{{item}}</view>
					</view>
				</scroll-view>
				<u-empty v-else mode="list"></u-empty>
			</view>
			<view class="footer">
				<!-- <u-button :custom-style="cancelStyle" size="medium" hover-class="none" :hair-line="false"
					@click="show = false">取消</u-button> -->
				<!-- <u-button style="flex: 1;" :custom-style="customStyle" size="medium" hover-class="none"
					:hair-line="false" @click="">打印</u-button> -->
			</view>
		</u-popup>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<printer ref="printer" @print="print"></printer>
		<printer ref="printer2" @print="() => print2(currentInfo)"></printer>
		<department-popup ref="departmentPopupRef" multiple require
			@confirm="departmentPopupConfirm"></department-popup>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		uploadFilePromise
	} from '@/common/upload.js';
	import authChoose from '@/pages/public/authChoose.vue';
	import userNameSign from '@/components/user-name/index.vue';
	import customUpload from '@/components/custom-upload/index.vue';
	import departmentPopup from '@/components/department-popup/index.vue';
	import printer from '@/components/printer/index.vue';
	import printButton from '@/components/print-button/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	import {
		printCGRKLotCPCL,
		printMaCPCL
	} from '@/common/print/print/labelPrinter.js';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			departmentPopup,
			printer,
			printButton,
			cardInfo
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '采购入库',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				customStyle: {
					backgroundColor: '#6190e8',
					color: '#fff',
					borderColor: '#6190e8',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				authChoosePopupShow: false,
				scrollTop: 0,
				btnLoading: false,
				parent_obj: {},
				baseFormData: {},
				selectList: null,
				batchShow: false,
				batch_list: [],
				checkShow: false,
				checkInfo: {
					batch_number: '',
					lot_id: '',
					quantity_sent: '',
					product_uom: ''
				},
				keyboardHeight: 0,
				currentInfo: {}
			}
		},
		computed: {
			isEdit() {
				return this.baseFormData.state !== 'done'
			},
			sumQuantity() {
				return (boxs) => {
					return boxs.reduce((sum, item) => {
						return sum + Number(item.quantity)
					}, 0)
				}
			},
			totalBoxes() {
				return this.baseFormData.move_ids_without_package.reduce((sum, item) => {
					return sum + (item.boxes ? item.boxes.length : 0);
				}, 0)
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			checkResultText(value) {
				let text = ''
				switch (value) {
					case 'pending_receive':
						text = '待接收';
						break;
					case 'pending_inspect':
						text = '待送检';
						break;
					case 'inspected':
						text = '待检验';
						break;
					case 'pending_judgment':
						text = '待判定';
						break;
					case 'released':
						text = '放行';
						break;
					case 'review':
						text = '复核';
						break;
					case 'returned':
						text = '退货';
						break;

					default:
						text = value;
				}
				return text;
			},
		},
		methods: {
			submit() {
				uni.showModal({
					content: '是否确认提交？',
					success: async (e) => {
						if (e.confirm) {
							uni.showLoading({
								title: '提交中'
							});
							this.btnLoading = true;
							let params = {
								picking_id: this.baseFormData.id,
								products: this.baseFormData.move_ids_without_package.map((p) => {
									return p.unit_quantity_type == 'different_per_box' ? {
										move_id: p.move_id,
										product_id: p.product_id,
										unit_quantity_type: p.unit_quantity_type,
										boxes: p.boxes.map((b, b_index) => {
											return {
												box_number: b_index + 1,
												quantity: b.quantity
											}
										})
									} : {
										move_id: p.move_id,
										product_id: p.product_id,
										unit_quantity_type: p.unit_quantity_type,
										box_count: p.box_count,
										quantity_per_box: p.quantity_per_box
									}
								})
							}
							api.web.dataset.call_kw({
								model: 'stock.picking',
								method: 'validate_raw_material_inventory',
								args: [
									[]
								],
								kwargs: {
									...params
								}
							}).then((res) => {
								if (res) {
									uni.showToast({
										title: '提交成功',
										icon: 'success',
										success: () => {
											setTimeout(() => {
												// uni.navigateBack()
												this.getDetail()
											}, 1000)
										}
									})
								}
							}).finally(() => {
								this.btnLoading = false;
								uni.hideLoading();
							})
						}
					}
				})
			},
			async getDetail() {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'get_raw_material_inventory',
					args: [
						[]
					],
					kwargs: {
						picking_id: this.parent_obj.id
					}
				})
				uni.hideLoading();
				if (res?.length) {
					let info = res[0];
					this.baseFormData = {
						...info,
						move_ids_without_package: info.move_ids_without_package?.length > 0 ? info
							.move_ids_without_package.map((p) => ({
								...p,
								quantity: 0,
								unit_quantity_type: p.unit_quantity_type || 'different_per_box',
								boxes: p.boxes?.length > 0 ? p.boxes.map((b) => ({
									...b,
									name: p.product_name
								})) : []
							})) : []
					}
				}
			},
			mapLot() {
				let lot_list = [];
				if (this.baseFormData.move_ids_without_package?.length) {
					this.baseFormData.move_ids_without_package.forEach((m) => {
						if (m.boxes?.length) {
							m.boxes.forEach((b) => {
								let obj = {
									name: m.product_name,
									product_code: m.product_code,
									batch_number: b.batch_number,
									quantity: m.unit_quantity_type == 'different_per_box' ? b
										.quantity : b.quantity_per_box,
									product_uom: m.product_uom
								}
								lot_list.push(obj)
							})
						}
					})
				}
				return lot_list
			},
			boxAdd(index) {
				let box = {
					box_number: 0,
					quantity: '',
					name: this.baseFormData.move_ids_without_package[index].product_name || ''
				}
				this.baseFormData.move_ids_without_package[index].boxes.push(box)
			},
			boxDel(index, b_index) {
				uni.showModal({
					content: '是否删除该数据？',
					success: (res) => {
						if (res.confirm) {
							this.baseFormData.move_ids_without_package[index].boxes.splice(b_index, 1)
						}
					}
				})
			},
			toCheck(info) {
				// if (box.inspection_exists) return;
				// this.checkInfo.batch_number = box.batch_number;
				// this.checkInfo.lot_id = box.lot_id;
				// this.checkInfo.quantity_sent = box.quantity;
				// this.checkInfo.product_id = info.product_id;
				// this.checkInfo.picking_id = this.parent_obj.id;
				// this.checkInfo.product_uom = info.product_uom;
				// this.checkShow = true;
				this.checkInfo.picking_id = Number(this.parent_obj.id);
				this.checkInfo.move_id = Number(info.move_id);
				this.checkInfo.quantity_sent = info.product_uom_qty;
				this.checkInfo.product_uom = info.product_uom;
				this.checkInfo.receive_batch = info.receive_batch;
				this.checkShow = true;
			},
			async toReceive(info) {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'stock.move',
					method: 'generate_receive_batch',
					args: [
						[]
					],
					kwargs: {
						picking_id: Number(this.parent_obj.id),
						move_id: Number(info.move_id)
					}
				})
				uni.hideLoading();
				if (res) {
					this.getDetail();
				}
			},
			async checkConfirm() {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'initiate_quality_inspection_entry',
					args: [
						[]
					],
					kwargs: {
						...this.checkInfo
					}
				})
				uni.hideLoading();
				if (res) {
					uni.showToast({
						title: '已送检',
						icon: 'none'
					})
					this.checkShow = false;
					this.getDetail();
				}
			},
			print() {
				let lot_list = this.mapLot();
				if (!lot_list?.length) {
					uni.showToast({
						title: '没有要打印的批次',
						icon: 'none'
					});
					return
				}
				printCGRKLotCPCL(this.$refs.printer, lot_list.map((lot) => {
					let product_name = (lot.name || '')?.split(']');
					let name = product_name?.length > 1 ? product_name[1].trim() : product_name[0];
					return {
						product_code: lot.product_code || '',
						barcode: lot.batch_number || '',
						name,
						quantity: lot.quantity + ' ' + lot.product_uom
					}
				}))
			},
			print2(info) {
				this.currentInfo = info || {};
				let name = this.currentInfo.product_name || '';
				let data = {
					order_name: this.baseFormData.purchase_order_name || '',
					barcode: this.currentInfo.receive_batch || '',
					name,
					quantity: this.currentInfo.sent_quantity ? this.currentInfo.sent_quantity + ' ' + this.currentInfo
						.product_uom : '',
					date: this.currentInfo.date_sent || '2024-09-10 16:08:20'
				}
				printMaCPCL(this.$refs.printer2, data)
			},
			ruku() {
				let url = '/pages/tqgf/application/materialManagementScan/index?is_back=true'
				uni.navigateTo({
					url
				})
			},
			batchNumClikc(boxes) {
				// this.batch_list = boxes.map(b => b.batch_number)
				// this.batchShow = true
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
				// 	this.$refs.departmentPopupRef.open();
				// }).catch(err => {
				// 	console.log('err', err);
				// })
			},
			inputChange(event) {
				return event
			},
			inputBlur(event, index, b_index) {
				this.baseFormData.move_ids_without_package[index].boxes[b_index].quantity = event.detail.value
			},
			inputBlur2(event, index, key) {
				this.baseFormData.move_ids_without_package[index][key] = event.detail.value
			},
			stateFilter(value) {
				let stateInfo = {
					type: 'primary',
					text: '待处理'
				}
				switch (value) {
					case 'done':
						stateInfo.type = 'success';
						stateInfo.text = '已完成'
						break;
				}
				return stateInfo;
			},
			checkResultColor(value) {
				let color = ''
				switch (value) {
					case 'released':
						color = '#28C76F';
						break;
					case 'returned':
						color = '#EA5455';
						break;
					case 'pending_receive':
					case 'pending_inspect':
						color = '#6190e8';
						break;
					case 'review':
					case 'pending_judgment':
					case 'inspected':
						color = '#FF9F43';
						break;
					default:
						color = '#909399';
				}
				return color;
			},
			departmentPopupConfirm(e) {
				this.selectList = e;
				this.submit();
			},
			prevPageRefresh() {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				let prevPageVm = null;
				// #ifdef APP-PLUS
				prevPageVm = prevPage?.$vm;
				// #endif
				// #ifndef APP-PLUS
				prevPageVm = prevPage;
				// #endif
				if (prevPageVm) {
					typeof prevPageVm.refresh === 'function' && prevPageVm.refresh();
				}
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							// if (!scanCode.includes(':')) {
							// } else {
							// }
						} else {
							uni.showToast({
								title: '无效的条码：' + code,
								icon: 'none',
								duration: 3000
							})
						}
					})
				}
			}
		},
		async onLoad(options) {
			if (options.id) {
				this.parent_obj = {
					id: options.id
				}
				this.getDetail();
			}
			uni.onKeyboardHeightChange((res) => {
				this.keyboardHeight = res.height;
			});
			// uni.hideTabBar();
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onUnload() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light;
		height: 100%;
	}
</style>
<style lang="scss" scoped>
	@import './index.scss';

	.errorPush-page {
		.container {
			.content {
				.content-title {
					padding: 0 20rpx;
				}

				.material-list {
					// height: calc(100vh - 188rpx);
					padding: 20rpx 20rpx 0;

					.item-cell {
						display: flex;
						align-items: center;
						// margin: 10rpx 0;

						.label {
							display: inline-block;
							width: 126rpx;
						}
					}

					.not-empty {
						padding-top: 60rpx;
						text-align: center;
						color: $primary-color;
					}

					.list {
						width: 100%;
						border-radius: 15rpx;
						overflow: hidden;

						.list-title {
							background-color: #e5efff;
							padding: 22rpx 22rpx 0;
							color: #a3bfec;
							// color: $uni-color-primary;

							.sign {
								display: inline-block;
								width: 24rpx;
								height: 24rpx;
								border-radius: 50%;
								margin-right: 12rpx;
								background-color: #a3bfec;
								// background-color: $uni-color-primary;

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
							padding-bottom: 14rpx;

							&:not(:last-child) {
								border-bottom: 2rpx solid #c1d9ff;
							}

							.row-group {
								margin-bottom: 10rpx;

								.item-cell {
									padding-bottom: 10rpx;
								}
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
									width: 134rpx;
									// color: #6190e8;
									margin-right: 20rpx;
								}

								.value {
									flex: 1;
									display: flex;
									align-items: center;
									color: $font-color-base;
								}

								.item-add {
									height: 64rpx;
									line-height: 64rpx;
								}

								.box-container {
									display: flex;
									align-items: center;
									flex: 1;

									.box-item {
										position: relative;
										padding: 16rpx 40rpx 10rpx 16rpx;
										background-color: #fcfdfe;

										&:not(:last-child) {
											margin-bottom: 10rpx;
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

										.label {
											width: 130rpx;
											// width: 82rpx;
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

												&.success {
													color: $uni-color-success;
												}
											}
										}
									}
								}
							}
						}
					}

					.material-item {
						background-color: #fff;
						border-radius: 10rpx;
						// box-shadow: 0px 0px 8rpx rgba(211, 211, 211, .5);
						position: relative;

						&:first-child {
							// background-color: rgba(173, 216, 230, .4);
						}

						.item-close {
							position: absolute;
							right: 0rpx;
							top: 10rpx;
							line-height: 32rpx;
							text-align: center;
						}

						.not-width-form-item {
							/deep/ .uni-forms-item__label {
								width: 0 !important;
							}
						}

						/deep/ .uni-forms-item__inner {
							padding-bottom: 0rpx;

							.uni-forms-item__label {
								height: auto;
							}

							.uni-forms-item__content {
								// min-height: auto;
								display: inline-flex;
								align-items: center;
							}
						}

						/deep/ .uni-easyinput {
							.uni-easyinput__content {
								// min-height: 60rpx;
								// height: 60rpx;

								&.is-textarea {
									height: auto;
								}

								// .uni-icons {
								// 	color: $uni-color-success !important;
								// }
							}
						}

						.text-high {
							color: $primary-color;
						}

						/deep/ .is-disabled {
							background-color: #f8f8f8;
							color: #6a6a6a;
						}

						/deep/ .checklist-box.is-disable {
							opacity: .8 !important;
						}

					}

					&>/deep/.uni-scroll-view {
						.uni-scroll-view {
							padding-bottom: 120rpx;
						}
					}

					/deep/ .uni-scroll-view::-webkit-scrollbar {
						display: block;
						width: 12rpx !important;
						height: 12rpx !important;
					}

					/deep/ .uni-scroll-view::-webkit-scrollbar-thumb {
						background-color: $uni-scroll-color;
						border-radius: 10rpx;
					}
				}
			}
		}

		.btn-group {
			width: 100%;
			height: 100rpx;
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 0 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			z-index: 9;

			.u-btn {
				flex: 1;
				font-size: 32rpx;
				background-color: $primary-color;
				border-color: $primary-color;

				&.u-btn--primary--disabled {
					background-color: #bcd2f3 !important;
					border-color: #bcd2f3 !important;
				}
			}
		}

		.upload-disabled {
			.upload-slot-btn {
				display: none;
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