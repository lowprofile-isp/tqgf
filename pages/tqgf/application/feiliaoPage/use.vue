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
			<view class="filter-container stick" :class="$mStore.state.themeColor.dark ? 'dark' : ''">
				<view style="display: flex; align-items: center; width: 100%;">
					<uni-data-select v-model="baseFormData.location_id" :localdata="location_list" :clear="false"
						placeholder="请选择废料库位"></uni-data-select>
				</view>
			</view>
			<view class="content">
				<scroll-view class="material-list" style="padding-top: 130rpx;" scroll-y
					:scroll-into-view="scroll_view">
					<empty text="暂无数据" v-if="baseFormData.location_id && list.length <= 0"></empty>
					<view v-else style="padding-bottom: 20rpx;">
						<card-info :class="info.serial === current_lot ? 'active' : ''" v-for="(info, index) in list"
							:key="index" @itemClick="() => rowClick(index)" :id="'scroll--' + info.serial + '_' + index"
							:title="info.name" :checked="true" :head-border-bottom="false" :line-icon="false">
							<template v-slot:checked>
								<u-checkbox v-model="info.checked"></u-checkbox>
							</template>
							<uni-forms class="content-form">
								<uni-forms-item class="content-item" label=" " label-width="0" label-align="center"
									:border-bottom="false">
									<view class="value" style="color: initial">{{info.serial || ''}}</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="规格" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{info.width}} | {{info.weight}} | {{info.volume}}
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="现有数量" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{info.quantity || ''}}
										<span class="unit">{{info.uom || ''}}</span>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="使用数量" label-width="80" label-align="left"
									:border-bottom="false">
									<view class="value">
										<view style="flex: 1;" @click.stop="rowClick(index, true)">
											<uni-easyinput v-if="isEdit" :value="info.quantity_verified" type="number"
												placeholder="" @input="inputChange" clearable
												:focus="current_lot === info.serial"
												@focus="(event) => inputFocus(event, index)"
												@blur="(event) => inputBlur(event, index)"></uni-easyinput>
										</view>
										<span class="unit">{{info.uom || ''}}</span>
									</view>
								</uni-forms-item>
							</uni-forms>
						</card-info>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" v-if="isEdit" :style="{opacity: keyboardHeight > 0 ? 0 : 1}">
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
					navTitle: '生产废料使用',
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
				baseFormData: {
					location_id: ''
				},
				list: [],
				selectUser: null,
				selectList: null,
				isEdit: false,
				scroll_view: '',
				current_lot: '',
				location_list: [],
				keyboardHeight: 0
			}
		},
		computed: {
			checkList() {
				return this.list.filter(item => item.checked)
			}
		},
		watch: {
			'baseFormData.location_id'(val) {
				this.getDetail();
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			refresh() {
				if (this.baseFormData.location_id) {
					this.getDetail();
				} else {
					this.baseFormData.location_id = '';
					this.list = [];
					this.getLocationList();
				}
			},
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
				let params = {
					data: this.checkList.map(c => ({
						location_id: this.baseFormData.location_id,
						workorder_id: this.parent_obj.res_id,
						quantity: c.quantity_verified - 0,
						serial: c.serial
					}))
				}
				api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'move_waste_materials',
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
									uni.navigateBack()
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
				uni.showLoading({
					mask: true
				});
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_materials_by_location',
					args: [
						[]
					],
					kwargs: {
						location_id: this.baseFormData.location_id
					}
				})
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (res?.length) {
					this.isEdit = true;
					this.list = res.map(item => ({
						...item,
						quantity_verified: '',
						checked: false
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
				uni.stopPullDownRefresh();
				if (res?.length > 0) {
					this.location_list = res.map((item) => ({
						value: item.id,
						text: item.complete_name
					}));
				}
			},
			rowClick(index, check) {
				this.current_lot = '';
				this.$set(this.list[index], 'checked', check || !this.list[index]['checked']);
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
					this.list.forEach((m, index) => {
						lot_list.push({
							lot: m.serial,
							index
						})
					})
				}
				return lot_list
			},
			matchView(barcode) {
				this.scroll_view = this.current_lot = '';
				let lot_list = this.mapLot();
				let lot = lot_list.find((l) => l.lot === barcode);
				if (lot) {
					this.scroll_view = 'scroll--' + lot.lot + '_' + lot.index;
					this.current_lot = lot.lot;
				}
			},
			inputChange(event) {
				return event
			},
			inputFocus(event, index) {
				this.list[index].checked = true;
			},
			inputBlur(event, index) {
				this.list[index].quantity_verified = event.detail.value
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
							this.matchView(scanCode);
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
				let barcode = 'B240819033'
				this.matchView(barcode)
			}
		},
		async onLoad(options) {
			let param = options.param ? JSON.parse(options.param) : {};
			this.parent_obj = {
				...param
			}
			await this.getLocationList();
			// this.getDetail();
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
		onPullDownRefresh() {
			this.refresh();
		},
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light;
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
			.filter-container {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-bottom: 1px solid rgba(181, 181, 181, .1);
				display: flex;
				justify-content: space-between;
				align-items: center;
				position: fixed;
				left: 0;
				z-index: 9;

				&.dark {
					background-color: $uni-bg-dark-light;
				}

				&.sticky {
					position: fixed;
					z-index: 99;
				}

				/deep/ .select-cap {
					flex: none;
					width: fit-content;
					background-color: $primary-color;
					border-radius: 50px;

					.uni-select {
						border: none;
						padding: 0 28rpx;
						height: 66rpx;

						.uni-select__input-box {
							justify-content: center;

							.uni-select__input-text {
								color: #fff;
							}
						}
					}

					.uni-icons {
						color: #fff !important;
						margin-left: 10rpx;
					}

					.uni-select__input-text {
						width: auto;
					}

					.uni-select__input-placeholder {
						font-size: 32rpx;
						color: #f5f5f5;
					}
				}

				.search-sign {
					/deep/ .u-content {
						padding-left: 240rpx;
					}

					/deep/ .u-icon__icon {
						font-size: 40rpx !important;
						padding-right: 10rpx;
					}

					/deep/ .u-input {
						font-size: 32rpx;
					}
				}

				.header-content {
					flex: 1;
				}

				&.primary {
					background-color: #e5eaff;
				}

				&.success {
					background-color: #dbf1e1;
				}

				&.error {
					background-color: #fef0f0;
				}

				&.warning {
					background-color: #fdf6ec;
				}

				.title {
					font-weight: 500;
					font-size: 40rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				@keyframes breathing {
					0% {
						transform: scale(1);
						opacity: 1;
					}

					50% {
						transform: scale(1.2);
						opacity: 0.5;
					}

					100% {
						transform: scale(1);
						opacity: 1;
					}
				}

				.sign {
					display: inline-block;
					width: 30rpx;
					height: 30rpx;
					border-radius: 50%;
					margin-left: 20rpx;
					margin-right: 12rpx;

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
							width: 146rpx;
						}

						.value {
							flex: 1;
							display: flex;
							align-items: center;
							word-break: break-all;
							line-height: 1;
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

					.material-item {
						background-color: #fff;
						padding: 30rpx;
						padding-left: 80rpx;
						margin: 22rpx;
						border-radius: 10rpx;
						box-shadow: 0px 0px 12rpx 2rpx #eee;
						position: relative;

						&:first-child {
							// background-color: rgba(173, 216, 230, .4);
						}

						&.active {
							background-color: #cdffff;
							animation: flicker 1s;
							animation-iteration-count: 2;
							animation-fill-mode: forwards;
						}

						.check {
							position: absolute;
							left: 24rpx;
							top: 50%;
							transform: translateY(-50%);
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
					}
					
					/deep/.u-card {
						padding: 10rpx;
					
						.u-card__body {
							padding-top: 0 !important;
					
							.value {
								width: 100%;
							}
							.uni-forms-item__inner {
								padding-bottom: 10rpx;
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