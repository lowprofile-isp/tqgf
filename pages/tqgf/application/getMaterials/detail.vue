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
				</view> -->
				<!-- <user-name-sign></user-name-sign> -->
			</view>
		</u-navbar>
		<!-- <view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view> -->
		<view class="container">
			<view class="content">
				<empty v-if="!detailInfo" text="未查询到数据"></empty>
				<scroll-view v-else class="material-list" scroll-y>
					<!-- <view class="page-state success" v-if="baseFormData.state == 'done'">已完成</view> -->
					<card-info title="基本信息">
						<template v-slot:head-right>
							<u-tag :text="stateFilter(baseFormData.state).text || ''"
								:type="stateFilter(baseFormData.state).type" />
						</template>
						<uni-forms class="content-form">
							<!-- <uni-forms-item label="产品">
								<span>{{baseFormData.product_name || ''}}</span>
							</uni-forms-item>
							<uni-forms-item label="批次/序列号">
								<span>{{baseFormData.product_batch || ''}}</span>
							</uni-forms-item> -->
							<uni-forms-item label="领料单" label-width="100" class="content-item">
								<view class="value">
									{{Array.isArray(baseFormData.picking_name) ? baseFormData.picking_name.join(',') : (baseFormData.picking_name || '')}}
								</view>
							</uni-forms-item>
							<uni-forms-item label="制造单号" label-width="100" class="content-item">
								<view class="value">{{baseFormData.production_name || ''}}</view>
							</uni-forms-item>
							<uni-forms-item label="计划开始时间" label-width="100" class="content-item">
								<view class="value">{{$mHelper.dateToUTC(baseFormData.scheduled_date) || ''}}</view>
							</uni-forms-item>
							<uni-forms-item label="计划结束时间" label-width="100" class="content-item">
								<view class="value">{{$mHelper.dateToUTC(baseFormData.date_deadline) || ''}}</view>
							</uni-forms-item>
							<!-- <uni-forms-item label="物料是否齐套">
								<span :style="{color: baseFormData.is_complete === false ? 'red' : ''}">
									{{ baseFormData.is_complete === true ? '是' : baseFormData.is_complete === false ? '否' : '' }}
								</span>
							</uni-forms-item> -->
							<uni-forms-item class="content-item" label="存放位置" label-width="100">
								<span class="value">{{selectLocation && selectLocation.name || ''}}</span>
								<span v-if="isEdit && parent_obj.from != '现场用料'" class="link"
									style="margin-left: 10rpx;" @click="openLocationPopup(true)">选择</span>
							</uni-forms-item>
							<uni-forms-item class="content-item" label="领料人" label-width="100">
								<span class="value"
									style="width: auto; max-width: 100%;">{{selectUser && selectUser.length > 0 ? selectUser[0].name : ''}}</span>
								<span v-if="isEdit" class="link" style="margin-left: 10rpx;"
									@click="openUserPopup(true)">选择</span>
							</uni-forms-item>
							<!-- <uni-forms-item label="" class="not-width-form-item">
								<view class="list">
									<view class="list-title"><span class="sign"></span>制造单</view>
									<view class="list-item" v-for="(info, index) in baseFormData.production_info"
										:key="index">
										<view class="item-cell">
											<view class="label">产品名称</view>
											<view class="value">{{info.product_name || ''}}</view>
										</view>
										<view class="item-cell">
											<view class="label">批次号</view>
											<view class="value">{{info.product_batch || ''}}</view>
										</view>
									</view>
								</view>
							</uni-forms-item> -->
						</uni-forms>
					</card-info>
					<card-info :title="parent_obj.from == '现场用料' ? '核料' : '物料'">
						<!-- <view @click="scanClick">123123123</view> -->
						<card-tab v-if="tabItems.length > 0"
							:styles="{boxShadow: 'none', paddingTop: 0, paddingBottom: '30rpx'}" :current="tabCurrent"
							:values="tabItems" @clickItem="(e) => tabCurrent = e"></card-tab>
						<template v-if="tabCurrent == 0">
							<uni-forms class="material-item" label-width="60">
								<uni-forms-item label="" class="not-width-form-item">
									<view v-if="baseFormData.move_info.length" class="wuliao_list">
										<view class="list-item" v-for="(info, index) in baseFormData.move_info"
											:key="index">
											<view class="item-cell">
												<view class="label">产品名称</view>
												<view class="value">{{info.product_name || ''}}</view>
											</view>
											<view class="row-group">
												<view class="item-cell">
													<view class="label">需求数量</view>
													<view class="value">
														{{info.product_uom_qty || ''}}
														<span class="unit">{{info.product_uom}}</span>
													</view>
												</view>
												<view class="item-cell">
													<view class="label" style="width: 60rpx;">型号</view>
													<view class="value">
														{{info.model_id || ''}}
													</view>
												</view>
											</view>
											<view v-if="info.std_value1 || info.std_value2" class="row-group">
												<view class="item-cell">
													<view class="label">面密度</view>
													<view class="value">
														{{info.std_value1 || ''}}
														<span class="unit">g/m²</span>
													</view>
												</view>
												<view class="item-cell">
													<view class="label" style="width: 60rpx;">幅宽</view>
													<view class="value">
														{{info.std_value2 || ''}}
														<span class="unit">mm</span>
													</view>
												</view>
											</view>
											<!-- <view class="item-cell">
											<view class="label">可用数量</view>
											<view class="value">{{info.quantity || ''}}</view>
										</view> -->
											<view class="item-cell" style="align-items: flex-start;">
												<template v-if="!info.batches.length">
													<view class="label">批次</view>
													<view class="not-title" @click="scanClick">请扫描物料二维码</view>
													<!-- <view class="not-title" v-if="index === current_move_index">请扫描物料二维码</view> -->
													<!-- <view class="not-title" v-else @click="current_move_index = index">领取物料
												</view> -->
												</template>
												<view v-else class="box-container">
													<view style="margin-right: 10rpx; width: 100%;">
														<view class="box-item"
															:class="b.lot_name === current_lot ? 'active' : ''"
															v-for="(b, b_index) in info.batches" :key="b_index"
															:id="`scroll--${b.lot_name}_${info.move_id}_${b_index}`">
															<view class="item-cell">
																<view class="label">批次号</view>
																<view class="value" style="font-size: 25rpx;">
																	{{b.lot_name || ''}}
																</view>
															</view>
															<!-- <view class="item-cell">
															<view class="label">数量</view>
															<view class="value">
																{{b.quantity || 0}}
															</view>
														</view> -->
															<view class="item-cell" v-if="parent_obj.from != '现场用料'">
																<view class="label">实际领用</view>
																<view class="value">
																	<!-- <u-number-box v-if="isEdit" v-model="b.quantity_verified"
																	input-width="68" input-height="44"></u-number-box> -->
																	<template v-if="b.is_add">
																		<uni-easyinput :value="b.quantity_verified"
																			type="number" placeholder=""
																			@input="inputChange" clearable
																			@focus="inputFocus"
																			@blur="(event) => inputBlur(event, index, b_index)"></uni-easyinput>
																		<span class="unit">{{info.product_uom}}</span>
																	</template>
																	<template v-else>
																		<span class="quantity"
																			@click="batchNumClikc(info.batches)">{{b.quantity_verified}}</span>
																		<span class="unit">{{info.product_uom}}</span>
																	</template>
																</view>
															</view>
															<span v-if="b.is_add" class="item-close"
																@click="boxDel(index, b_index)">
																<uni-icons type="trash" size="20"
																	color="#FF7878"></uni-icons>
															</span>
														</view>
													</view>
													<!-- <u-button v-if="isEdit" class="item-add" size="mini"
													@click="boxAdd(index)">添加</u-button> -->
												</view>
											</view>
										</view>
									</view>
									<empty v-else text="暂无领料数据"></empty>
								</uni-forms-item>
							</uni-forms>
						</template>
						<template v-else-if="tabCurrent == 1">
							<uni-forms class="material-item" label-width="60">
								<uni-forms-item label="" class="not-width-form-item">
									<view v-if="baseFormData.use_move_info.length" class="wuliao_list">
										<view class="list-item" v-for="(info, index) in baseFormData.use_move_info"
											:key="index">
											<view class="item-cell">
												<view class="label">产品名称</view>
												<view class="value">{{info.product_name || ''}}</view>
											</view>
											<view class="row-group">
												<view class="item-cell">
													<view class="label">需求数量</view>
													<view class="value">
														{{info.product_uom_qty || ''}}
														<span class="unit">{{info.product_uom}}</span>
													</view>
												</view>
												<view class="item-cell">
													<view class="label" style="width: 60rpx;">型号</view>
													<view class="value">
														{{info.model_id || ''}}
													</view>
												</view>
											</view>
											<view v-if="info.std_value1 || info.std_value2" class="row-group">
												<view class="item-cell">
													<view class="label">面密度</view>
													<view class="value">
														{{info.std_value1 ? info.std_value1.toFixed(2) : '--'}}
														<span class="unit">g/m²</span>
													</view>
												</view>
												<view class="item-cell">
													<view class="label" style="width: 60rpx;">幅宽</view>
													<view class="value">
														{{info.std_value2 ? info.std_value2.toFixed(2) : '--'}}
														<span class="unit">mm</span>
													</view>
												</view>
											</view>
											<!-- <view class="item-cell">
											<view class="label">可用数量</view>
											<view class="value">{{info.quantity || ''}}</view>
										</view> -->
											<view class="item-cell" style="align-items: flex-start;">
												<template v-if="!info.batches.length">
													<view class="label">批次</view>
													<view class="not-title" style="color: #909399;">暂无批次信息</view>
													<!-- <view class="not-title" v-if="index === current_move_index">请扫描物料二维码</view> -->
													<!-- <view class="not-title" v-else @click="current_move_index = index">领取物料
												</view> -->
												</template>
												<view v-else class="box-container">
													<view style="margin-right: 10rpx; width: 100%;">
														<view class="box-item" v-for="(b, b_index) in info.batches"
															:key="b_index">
															<view class="item-cell">
																<view class="label">批次号</view>
																<view class="value" style="font-size: 25rpx;">
																	{{b.lot_name || ''}}
																</view>
															</view>
															<!-- <view class="item-cell">
															<view class="label">数量</view>
															<view class="value">
																{{b.quantity || 0}}
															</view>
														</view> -->
															<view class="item-cell" v-if="parent_obj.from != '现场用料'">
																<view class="label">实际领用</view>
																<view class="value">
																	<!-- <u-number-box v-if="isEdit" v-model="b.quantity_verified"
																	input-width="68" input-height="44"></u-number-box> -->
																	<!-- <template v-if="b.is_add">
																		<uni-easyinput :value="b.quantity_verified" type="number"
																			placeholder="" @input="inputChange" clearable
																			@focus="inputFocus"
																			@blur="(event) => inputBlur(event, index, b_index)"></uni-easyinput>
																		<span class="unit">{{info.product_uom}}</span>
																	</template> -->
																	<!-- <template v-else> -->
																	<span class="quantity"
																		@click="batchNumClikc(info.batches)">{{b.quantity_verified}}</span>
																	<span class="unit">{{info.product_uom}}</span>
																	<!-- </template> -->
																</view>
															</view>
															<!-- <span v-if="b.is_add" class="item-close"
																@click="boxDel(index, b_index)">
																<uni-icons type="trash" size="20"
																	color="#FF7878"></uni-icons>
															</span> -->
														</view>
													</view>
													<!-- <u-button v-if="isEdit" class="item-add" size="mini"
													@click="boxAdd(index)">添加</u-button> -->
												</view>
											</view>
										</view>
									</view>
									<empty v-else text="暂无领料数据"></empty>
								</uni-forms-item>
							</uni-forms>
						</template>

					</card-info>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group">
			<u-button type="primary" :loading="btnLoading" hover-class="none" @click="btnClick">提交</u-button>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup-account ref="userPopupRef"
			:default-value="selectUser ? [Array.isArray(selectUser) && selectUser.length > 0 ? selectUser[0].id : selectUser] : []"
			@confirm="userPopupConfirm" @close="isSelect = false"></user-popup-account>
		<location-popup ref="locationPopupRef" :default-value="selectLocation?[selectLocation.id]:[]" tag-style
			:is-footer="false" @confirm="locationPopupConfirm" @close="isSelect = false"></location-popup>
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
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import customUpload from '@/components/custom-upload/index.vue';
	import departmentPopup from '@/components/department-popup/index.vue';
	import userPopupAccount from '@/components/user-popup-account/index.vue';
	import locationPopup from '@/components/location-popup/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	import cardTab from '@/components/card-tab/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			departmentPopup,
			userPopupAccount,
			locationPopup,
			cardInfo,
			cardTab
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '生产领料',
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
				btnLoading: false,
				parent_obj: {},
				baseFormData: {},
				detailInfo: false,
				selectUser: null,
				selectList: null,
				selectLocation: null,
				isEdit: true,
				batchShow: false,
				batch_list: [],
				scroll_view: '',
				current_lot: '',
				current_move_index: null,
				isSelect: false,
				tabCurrent: 0,
				tabItems: ['领料', '已领物料'],
			}
		},
		computed: {
			location_name() {
				return this.selectLocation?.name ?? ''
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			submit() {
				// uni.showModal({
				// 	content: '是否确认提交？',
				// 	success: async (e) => {
				// 		if (e.confirm) {
				uni.showLoading({
					title: '提交中',
					mask: true
				});
				this.btnLoading = true;
				if (this.parent_obj.from == '现场用料') {
					let params = {
						workorder_id: Number(this.parent_obj.workorder_id),
						user_id: this.selectUser?.length > 0 ? this.selectUser[0].id : null,
						scan_move_data: this.mapLot()
					}
					api.web.dataset.call_kw({
						model: 'mrp.workorder',
						method: 'action_verify',
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
									this.current_lot = '';
									setTimeout(() => {
										// uni.navigateBack()
										this.getDetail();
										// this.prevPageRefresh();
									}, 1000)
								}
							})
						}
					}).finally(() => {
						this.btnLoading = false;
						uni.hideLoading();
					})
				} else {
					let lot_list = this.mapLot();
					let params = {
						// picking_id: this.baseFormData.picking_id,
						location_dest_id: this.selectLocation.id,
						user_id: this.selectUser?.length > 0 ? this.selectUser[0].id : null,
						move_info: lot_list
					}
					api.web.dataset.call_kw({
						model: 'stock.picking',
						method: 'verify_picking_material',
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
									this.current_lot = '';
									setTimeout(() => {
										// uni.navigateBack()
										this.getDetail();
										this.prevPageRefresh();
									}, 1000)
								}
							})
						}
					}).finally(() => {
						this.btnLoading = false;
						uni.hideLoading();
					})
				}

				// 		}
				// 	}
				// })
			},
			async getDetail() {
				uni.showLoading();
				let kw = {};
				let method = '';
				let model = 'stock.picking';
				if (this.parent_obj.from) {
					kw.workorder_id = Number(this.parent_obj.workorder_id);
					if (this.parent_obj.from == '现场用料') {
						method = 'wo_material_info';
						model = 'mrp.workorder';
					} else {
						method = 'picking_material_detail';
					}
				} else {
					kw.picking_id = Number(this.parent_obj.id);
					method = 'get_picking_list';
				}
				const res = await api.web.dataset.call_kw({
					model,
					method,
					args: [
						[]
					],
					kwargs: kw
				})
				uni.hideLoading();
				if (res?.length) {
					let info = res[0];
					this.isEdit = info.state === 'done' ? false : true;
					this.detailInfo = true;
					// let move_info = this.parent_obj.from == '现场用料' ? info.move_info : info.move_info;
					this.selectUser = info.user_id;
					this.baseFormData = {
						...info,
						scheduled_date: info.scheduled_date || this.parent_obj.scheduled_date || '',
						date_deadline: info.date_deadline || this.parent_obj.date_deadline || '',
						product_batch: info.move_info?.length > 0 ? info.move_info[0]
							.product_batch : '',
						product_name: info.move_info?.length > 0 ? info.move_info[0]
							.product_name : '',
						use_move_info: info.move_info || [],
						move_info: info.to_picking_move_info || info.move_info
					}
				}
			},
			boxAdd(barcode, moves) {
				moves.forEach((move) => {
					let moveInfo = this.baseFormData.move_info.find(m => m.move_id == move.move_id);
					if (!moveInfo) {
						// uni.showToast({
						// 	title: '',
						// 	icon: 'none'
						// })
						return
					}
					let findIndex = moveInfo.batches.findIndex(b => b.lot_name === barcode);
					if (findIndex > -1) {
						// uni.showToast({
						// 	title: '扫码重复',
						// 	icon: 'none'
						// })
						this.scroll_view = `scroll--${barcode}_${move.move_id}_${findIndex}`;
						this.pageScroll();
						return
					}
					let box = {
						product_id: moveInfo.product_id,
						lot_name: barcode,
						quantity_verified: (this.parent_obj.from == '现场用料' ? moveInfo.product_uom_qty :
							move.batch_quantity) || '',
						is_add: true
					}
					moveInfo.batches.push(box);
					this.scroll_view = `scroll--${barcode}_${move.move_id}_${moveInfo.batches.length-1}`;
					this.pageScroll();
				})
			},
			boxDel(index, b_index) {
				uni.showModal({
					content: '是否删除该箱数据？',
					success: (res) => {
						if (res.confirm) {
							this.baseFormData.move_info[index].batches.splice(b_index, 1)
						}
					}
				})
			},
			inputChange(event) {
				return event
			},
			inputFocus() {
				this.current_lot = '';
			},
			inputBlur(event, index, b_index) {
				this.baseFormData.move_info[index].batches[b_index].quantity_verified = event.detail.value
			},
			batchNumClikc(boxes) {
				// this.batch_list = boxes.map(b => b.batch_number)
				// this.batchShow = true
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
				if (!this.selectLocation?.id) this.openLocationPopup();
				else if (!this.selectUser || this.selectUser?.length <= 0) this.openUserPopup();
				else this.submit();
				// }).catch(err => {
				// 	console.log('err', err);
				// })
			},
			openLocationPopup(isSelect) {
				this.isSelect = isSelect;
				typeof this.$refs.locationPopupRef.open === 'function' && this.$refs.locationPopupRef.open();
			},
			openUserPopup(isSelect) {
				this.isSelect = isSelect;
				typeof this.$refs.userPopupRef.open === 'function' && this.$refs.userPopupRef.open();
			},
			mapLot() {
				let lot_list = [];
				if (this.baseFormData.move_info?.length) {
					this.baseFormData.move_info.forEach((m) => {
						if (m.batches.length) {
							m.batches.forEach((b) => {
								lot_list.push({
									...b,
									move_id: m.move_id,
									quantity_verified: b.quantity_verified ? b.quantity_verified -
										0 : 0
								})
							})
						}
					})
				}
				return lot_list
			},
			matchView(barcode) {
				uni.showLoading({
					mask: true
				})
				let kw = {};
				let method = '';
				if (this.parent_obj.from) {
					kw.workorder_id = Number(this.parent_obj.workorder_id);
					kw.type = this.parent_obj.from == '现场用料' ? 'checking' : 'picking';
				} else {
					kw.picking_id = Number(this.parent_obj.id);
					kw.type = 'picking';
				}
				api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'picking_material_scan_barcode',
					args: [
						[]
					],
					kwargs: {
						...kw,
						barcode
					}
				}).then((res) => {
					if (res?.length > 0) {
						this.current_lot = barcode;
						this.boxAdd(barcode, res)
					}
				}).finally(() => {
					uni.hideLoading()
				})
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
			viewSizeInfo(field) {
				// let charArray = ['复合布', '网胎', '碳布'];
				// let product_name = product?.length > 1 ? product[1] : '';
				// let isView = charArray.some(char => product_name.includes(char));
				let isView = charArray.some(char => product_name.includes(char));
				return isView
			},
			departmentPopupConfirm(e) {
				this.selectList = e;
				this.submit();
			},
			pageScroll() {
				uni.createSelectorQuery().select('#' + this.scroll_view).boundingClientRect((res) => {
					if (res) {
						uni.pageScrollTo({
							scrollTop: res.top,
							duration: 200
						})
					}
				}).exec();
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
			locationPopupConfirm(e) {
				this.selectLocation = e?.length > 0 ? e[0] : {};
				if (this.isSelect) return
				if (!this.selectUser || this.selectUser?.length <= 0) {
					this.openUserPopup();
				} else {
					this.submit();
				}
			},
			userPopupConfirm(e) {
				this.selectUser = e;
				if (this.isSelect) return
				if (!this.selectLocation?.id) {
					this.openLocationPopup();
				} else {
					this.submit();
				}
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							// if (this.isEdit) {
							// if (this.current_move_index != null)
							this.matchView(scanCode);
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
			},
			scanClick() {
				// let barcode = 'A240820006'
				let barcode = 'A2410150024'
				this.matchView(barcode);
				// if (this.current_move_index != null)
				// 	this.matchView(barcode);
			}
		},
		async onLoad(options) {
			// if (options.id) {
			this.parent_obj = {
				id: options.id,
				workorder_id: options.workorder_id,
				from: options.from || '',
				production_name: options.production_name || '',
				production_id: options.production_id || '',
				date_deadline: options.date_deadline || '',
				scheduled_date: options.scheduled_date || ''
			}
			if (options.location) {
				this.selectLocation = JSON.parse(options.location);
			}
			if (this.parent_obj.from == '现场用料') {
				this.tabItems = []
			}
			this.getDetail();
			// } else {
			// 	uni.showModal({
			// 		content: 'picking_id不能为空',
			// 		showCancel: false
			// 	})
			// }
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
							width: 104rpx;
						}

						.not-title {
							font-size: 30rpx;
							color: $uni-color-primary;
						}
					}

					.not-empty {
						padding-top: 60rpx;
						text-align: center;
						color: $primary-color;
					}

					.wuliao_list {
						width: 100%;
						border-radius: 15rpx;
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
									width: 122rpx;
									// color: #6190e8;
									font-size: 30rpx;
									margin-right: 20rpx;
								}

								.value {
									flex: 1;
									font-size: 30rpx;
									display: flex;
									align-items: center;
									color: $font-color-base;
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

					.material-item {
						background-color: #fff;
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

						.link {
							color: $uni-color-primary;
							margin-left: 10rpx;
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
								min-height: 230rpx;
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