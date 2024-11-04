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
				<view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign>
			</view>
		</u-navbar>
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view>
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y :scroll-into-view="scroll_view">
					<view class="page-state success" v-if="baseFormData.state == 'done'">已完成</view>
					<uni-forms class="material-item" :modelValue="baseFormData" label-width="60">
						<!-- <uni-forms-item label="产品">
							<span>{{baseFormData.product_name || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="批次/序列号">
							<span>{{baseFormData.product_batch || ''}}</span>
						</uni-forms-item> -->
						<uni-forms-item label="制造单号">
							<span>{{baseFormData.origin || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="计划开始时间">
							<span>{{baseFormData.scheduled_date || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="计划结束时间">
							<span>{{baseFormData.date_deadline || ''}}</span>
						</uni-forms-item>
						<!-- <uni-forms-item label="物料是否齐套">
							<span :style="{color: baseFormData.is_complete === false ? 'red' : ''}">
								{{ baseFormData.is_complete === true ? '是' : baseFormData.is_complete === false ? '否' : '' }}
							</span>
						</uni-forms-item> -->
						<uni-forms-item label="存放位置">
							<span>{{selectLocation && selectLocation.name || ''}}</span>
							<!-- <span v-if="isEdit" class="link" @click="openLocationPopup(true)">选择</span> -->
						</uni-forms-item>
						<uni-forms-item label="领料人">
							<span>{{selectUser && selectUser.length > 0 ? selectUser[0].name : ''}}</span>
							<span v-if="isEdit" class="link" @click="openUserPopup(true)">选择</span>
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
						<uni-forms-item label="" class="not-width-form-item">
							<view v-if="!baseFormData.move_info || baseFormData.move_info.length <= 0" class="link" style="margin: 0 auto;">请扫描物料二维码</view>
							<view v-else class="wuliao_list">
								<view class="list-title"><span class="sign"></span>物料</view>
								<view class="list-item" v-for="(info, index) in baseFormData.move_info" :key="index">
									<view class="item-cell">
										<view class="label">产品名称</view>
										<view class="value">{{info.product_name || ''}}</view>
									</view>
									<view class="item-cell">
										<view class="label">需求数量</view>
										<view class="value">
											{{info.product_uom_qty || ''}}
											<span class="unit">{{info.product_uom}}</span>
										</view>
									</view>
									<!-- <view class="item-cell">
										<view class="label">可用数量</view>
										<view class="value">{{info.quantity || ''}}</view>
									</view> -->
									<view class="item-cell" style="align-items: flex-start;">
										<view class="box-container">
											<view style="margin-right: 10rpx; width: 100%;">
												<view class="box-item"
													:class="b.lot_name === current_lot ? 'active' : ''"
													v-for="(b, b_index) in info.batches" :key="b_index"
													:id="'scroll--' + b.lot_name">
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
													<view class="item-cell">
														<view class="label">实际领用</view>
														<view class="value">
															<!-- <u-number-box v-if="isEdit" v-model="b.quantity_verified"
																input-width="68" input-height="44"></u-number-box> -->
															<template v-if="isEdit">
																<uni-easyinput v-if="isEdit"
																	:value="b.quantity_verified" type="number"
																	placeholder="" @input="inputChange"
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
													<span v-if="isEdit" class="item-close"
														@click="boxDel(index, b_index)">
														<uni-icons type="trash" size="20" color="#FF7878"></uni-icons>
													</span>
												</view>
											</view>
											<!-- <u-button v-if="isEdit" class="item-add" size="mini"
												@click="boxAdd(index)">添加</u-button> -->
										</view>
									</view>
								</view>
							</view>
						</uni-forms-item>
					</uni-forms>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" v-if="isEdit">
			<u-button type="primary" :loading="btnLoading" :disabled="!baseFormData.picking_id" hover-class="none"
				@click="btnClick">提交</u-button>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup-account ref="userPopupRef" @confirm="userPopupConfirm"
			@close="isSelect = false"></user-popup-account>
		<location-popup ref="locationPopupRef" tag-style :is-footer="false" @confirm="locationPopupConfirm"
			@close="isSelect = false"></location-popup>
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
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			departmentPopup,
			userPopupAccount,
			locationPopup
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '现场用料',
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
				selectUser: null,
				selectList: null,
				selectLocation: null,
				isEdit: true,
				batchShow: false,
				batch_list: [],
				scroll_view: '',
				current_lot: '',
				current_move_index: null,
				isSelect: false
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
					title: '提交中'
				});
				this.btnLoading = true;
				let lot_list = this.mapLot();
				let params = {
					picking_id: this.baseFormData.picking_id,
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
				// 		}
				// 	}
				// })
			},
			async getDetail() {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'picking_material_list',
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
					this.isEdit = info.state === 'done' ? false : true;
					this.baseFormData = {
						...info,
						product_batch: info.move_info?.length > 0 ? info.move_info[0]
							.product_batch : '',
						product_name: info.move_info?.length > 0 ? info.move_info[0]
							.product_name : '',
						init_move_info: info.move_info,
						move_info: []
						// move_info: info.move_info.map((m) => {
						// 	return {
						// 		...m,
						// 		batches: m.batches?.length > 0 ? m.batches.map((b) => ({
						// 			...b
						// 		})) : []
						// 	}
						// })
					}
				}
			},
			boxAdd(barcode, move) {
				let moveInfo = this.baseFormData.initmove_info.find(m => m.product_id == move.product_id);
				let findIndex = moveInfo.batches.findIndex(b => b.lot_name === barcode);
				if (findIndex > -1) {
					uni.showToast({
						title: '扫码重复',
						icon: 'none'
					})
					return
				}
				let box = {
					product_id: moveInfo.product_id,
					lot_name: barcode,
					quantity_verified: '',
				}
				moveInfo.batches.push(box)
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
			inputBlur(event, index, b_index) {
				this.baseFormData.move_info[index].batches[b_index].quantity_verified = event.detail.value
			},
			batchNumClikc(boxes) {
				// this.batch_list = boxes.map(b => b.batch_number)
				// this.batchShow = true
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
				console.log(this.selectUser)
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
				uni.showLoading()
				api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'picking_material_scan_barcode',
					args: [
						[]
					],
					kwargs: {
						picking_id: this.parent_obj.id,
						barcode
					}
				}).then((res) => {
					if (res?.length > 0) {
						this.boxAdd(barcode, res[0])
					}
				}).finally(() => {
					uni.hideLoading()
				})
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
			locationPopupConfirm(e) {
				this.selectLocation = e?.length > 0 ? e[0] : {};
				if (this.isSelect) return
				if (!this.selectUser) {
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
							if (this.isEdit) {
								if (this.current_move_index != null)
									this.matchView(scanCode);
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
			scanClick() {
				let barcode = 'A240806015'
				if (this.current_move_index != null)
					this.matchView(barcode);
			}
		},
		async onLoad(options) {
			if (options.id) {
				this.parent_obj = {
					id: options.id,
					from: options.from || '',
					production_name: options.production_name || ''
				}
				if (options.location) {
					this.selectLocation = JSON.parse(options.location);
				}
				this.getDetail();
			} else {
				uni.showModal({
					content: 'picking_id不能为空',
					showCancel: false
				})
			}
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
		// background-color: $page-color-light;
		background-color: #fff;
		height: 100%;
	}

	uni-view {
		font-size: 32rpx;
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
					height: calc(100vh - 188rpx);

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

					.material-item {
						background-color: #fff;
						padding: 40rpx;
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
							padding-bottom: 20rpx;

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
			z-index: 1;

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