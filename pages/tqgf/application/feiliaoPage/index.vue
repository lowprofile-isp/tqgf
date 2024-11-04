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
		<!-- <view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view> -->
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y>
					<!-- <view class="page-state success" v-if="baseFormData.state == 'done'">已完成</view> -->
					<view v-if="list.length > 0" style="padding-bottom: 20rpx;">
						<card-info v-for="(info, index) in list" :key="index" :title="info.product_name" :checked="true"
							:head-border-bottom="false" :line-icon="false" :id="'scroll--' + info.serial">
							<uni-forms class="content-form">
								<uni-forms-item v-if="info.serial" class="content-item" label=" " label-width="0"
									label-align="center" :border-bottom="false">
									<view class="value" style="color: initial">{{info.serial || ''}}</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="类别" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{info.categ_name || ''}}
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="已用数量" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{info.used_quantity || ''}}
										<span class="unit">{{info.product_uom || ''}}</span>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="存放位置" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										<uni-data-select v-model="info.location_id"
											:localdata="location_list"></uni-data-select>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="废料数量" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value" v-if="isEdit">
										<uni-easyinput style="flex: 1;" :value="info.feiliao_num"
											:styles="easyinputStyles" type="number" placeholder=""
											:focus="current_index === index && info.serial === current_lot"
											@input="inputChange"
											@blur="(event) => inputBlur(event, index)"></uni-easyinput>
										<span class="unit">{{info.product_uom || ''}}</span>
									</view>
									<view v-else class="value">
										{{info.feiliao_num}}
										<span class="unit">{{info.product_uom || ''}}</span>
									</view>
								</uni-forms-item>
							</uni-forms>
						</card-info>
					</view>
					<empty v-else></empty>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" v-if="isEdit">
			<u-button type="primary" :loading="btnLoading" hover-class="none" @click="submit">提交</u-button>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup-account ref="userPopupRef" @confirm="userPopupConfirm"></user-popup-account>
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
	import cardInfo from '@/components/card-info/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			departmentPopup,
			userPopupAccount,
			cardInfo
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '生产废料入库',
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
				list: [],
				selectUser: null,
				selectList: null,
				isEdit: true,
				scroll_view: '',
				current_lot: '',
				current_index: null,
				location_list: []
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
				let data = this.list.map((item) => {
					return {
						serial: item.serial,
						location_id: item.location_id,
						quantity: item.feiliao_num - 0
					}
				})
				let params = {
					workorder_id: this.parent_obj.res_id,
					data
				}
				api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_waste_materials',
					args: [
						[]
					],
					kwargs: {
						...params
					}
				}).then((res) => {
					if (res) {
						this.isEdit = false;
						// this.list = res.map((item) => ({
						// 	...item,
						// 	product_uom: item.uom,
						// 	feiliao_num: item.product_qty
						// }));
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							success: () => {
								setTimeout(() => {
									uni.navigateBack()
									// this.getDetail()
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
					model: 'mrp.workorder',
					method: 'get_used_component',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.parent_obj.res_id
					}
				})
				uni.hideLoading();
				if (res?.length) {
					this.isEdit = true;
					this.list = res.map((item) => ({
						...item,
						location_id: item.location_id || 4556,
						feiliao_num: ''
					}));
				} else {
					this.isEdit = false;
					this.list = [];
				}
			},
			async getLocationList() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_waste_location',
					args: [
						[]
					],
					kwargs: {}
				})
				if (res?.length > 0) {
					this.location_list = res.map((item) => ({
						value: item.id,
						text: item.complete_name
					}));
				}
			},
			inputChange(event) {
				return event
			},
			inputBlur(event, index) {
				this.list[index].feiliao_num = event.detail.value
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
				this.$refs.userPopupRef.open();
				// }).catch(err => {
				// 	console.log('err', err);
				// })
			},
			mapLot() {
				let lot_list = [];
				if (this.list?.length) {
					this.list.forEach((m) => {
						lot_list.push(m.serial)
					})
				}
				return lot_list
			},
			matchView(barcode) {
				// uni.showLoading()
				// api.web.dataset.call_kw({
				// 	model: 'stock.picking',
				// 	method: 'picking_material_scan_barcode',
				// 	args: [
				// 		[]
				// 	],
				// 	kwargs: {
				// 		picking_id: this.parent_obj.id,
				// 		barcode
				// 	}
				// }).then((res) => {
				// 	if (res) {
				// 		this.scroll_view = this.current_lot = '';
				// 		let lot_list = this.mapLot();
				// 		let lot = lot_list.find((l) => l === barcode);
				// 		if (lot) {
				// 			this.scroll_view = 'scroll--' + lot;
				// 			this.current_lot = lot;
				// 			this.pageScroll();
				// 		}
				// 	}
				// }).finally(() => {
				// 	uni.hideLoading()
				// })
				let lot_list = this.mapLot();
				let lot = lot_list.findIndex((l) => l === barcode);
				if (lot > -1) {
					this.scroll_view = 'scroll--' + lot_list[lot];
					this.current_lot = lot_list[lot];
					this.current_index = lot;
					this.pageScroll();
				}
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
			userPopupConfirm(e) {
				this.selectUser = e;
				this.submit();
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							this.matchView(scanCode)
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
				let barcode = 'B2409300009'
				this.matchView(barcode)
			}
		},
		async onLoad(options) {
			let param = options.param ? JSON.parse(options.param) : {};
			this.parent_obj = {
				...param
			}
			await this.getLocationList();
			this.getDetail();
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
					height: calc(100vh - 188rpx);
					padding: 20rpx;

					.item-cell {
						display: flex;
						align-items: center;
						// margin: 10rpx 0;

						.label {
							display: inline-block;
							width: 104rpx;
						}

						.not-title {
							font-size: 26rpx;
							color: $uni-color-primary;
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
						// overflow: hidden;

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

								/deep/ .uni-select {
									border-color: #a7a7a7;
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

					/deep/.u-card {
						padding: 10rpx;
						overflow: inherit;
						.u-card__body {
							padding-top: 0 !important;

							.value {
								width: 100%;
							}
						}

						.content-form {
							.content-item:not(:last-child) {
								.uni-forms-item__inner {
									padding-bottom: 5rpx;
								}
							}
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