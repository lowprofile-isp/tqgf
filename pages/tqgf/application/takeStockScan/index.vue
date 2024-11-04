<template>
	<view class="materialManagementScan-page" :style="{height: `calc(100vh - ${$mStore.state.navBarHeight}px)`}">
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
			<u-icon size="48" name="scan"></u-icon>
		</view> -->
		<view class="container">
			<view class="header">
				<view v-if="equipmentInfo.name" class="header-content">
					<view class="title">
						{{equipmentInfo.name}}
					</view>
				</view>
				<view v-else style="text-align: center;">尚未扫描库位</view>
			</view>
			<view class="content" v-if="equipmentInfo.name">
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop" @scroll="scrollTap">
					<card-info title="系统">
						<view v-if="material_list.length > 0">
							<card-info v-for="(item, index) in material_list" :key="index" :title="item.product_name"
								:head-border-bottom="false" :line-icon="false">
								<uni-forms class="content-form">
									<uni-forms-item class="content-item" label=" " label-width="0"
										:border-bottom="false">
										<view class="value" style="color: initial">{{item.serial_number || ''}}</view>
									</uni-forms-item>
									<uni-forms-item class="content-item" label="数量" :border-bottom="false">
										<view class="value" style="color: initial">
											<uni-easyinput :value="item.scanned_quantity" type="number"
												:styles="easyinputStyles" placeholder="" @input="inputChange"
												@blur="(event) => inputBlur(event, index)"></uni-easyinput>
											<span class="unit">{{item.product_uom}}</span>
										</view>
									</uni-forms-item>
								</uni-forms>
							</card-info>
						</view>
						<view v-else class="not-empty">暂无数据</view>
					</card-info>
					<card-info title="盘点">
						<view v-if="material_scan_list.length > 0">
							<card-info v-for="(item, index) in material_scan_list" :key="index"
								:title="item.product_name" :head-border-bottom="false" :line-icon="false">
								<uni-forms class="content-form">
									<uni-forms-item class="content-item" label=" " label-width="0"
										:border-bottom="false">
										<view class="value" style="color: initial">{{item.serial_number || ''}}</view>
									</uni-forms-item>
									<uni-forms-item class="content-item" label="数量" :border-bottom="false">
										<view class="value" style="color: initial">
											<uni-easyinput :value="item.scanned_quantity" type="number"
												:styles="easyinputStyles" placeholder="" @input="inputChange"
												@blur="(event) => inputBlur(event, index)"></uni-easyinput>
											<span class="unit">{{item.product_uom}}</span>
										</view>
									</uni-forms-item>
								</uni-forms>
								<template v-slot:head-right>
									<span class="item-close" @click="delHanlde(index)">
										<uni-icons type="trash" size="20" color="#FF7878"></uni-icons>
									</span>
								</template>
							</card-info>
						</view>
						<view v-else class="not-empty">请扫描产品</view>
					</card-info>

					<!-- <view v-if="material_list.length <= 0" class="not-empty">请扫描产品</view>
					<uni-forms v-else class="material-item" v-for="(item,index) in material_list" :key="index"
						:modelValue="item" label-width="60">
						<uni-forms-item label="批次号">
							<span>{{item.serial_num || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="产品">
							<span>{{item.product || ''}}</span>
						</uni-forms-item>
						<span class="item-close" @click="delHanlde(index)">
							<uni-icons type="trash" size="22" color="#FF7878"></uni-icons>
						</span>
					</uni-forms> -->
				</scroll-view>
			</view>
		</view>
		<view>
			<view class="btn-group">
				<u-button type="primary" :loading="btnLoading" hover-class="none" :disabled="!equipmentInfo.name"
					@click="btnClick">盘点完成</u-button>
			</view>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup ref="userPopupRef" :default-value="uid ? [uid] : []" @confirm="userPopupConfirm"></user-popup>
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
	import {
		getEquipmentInfoAPI
	} from '@/api/inventory.js';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import userPopup from '@/components/user-popup/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			userPopup,
			cardInfo
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '库房盘点',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				authChoosePopupShow: false,
				currentScroll: 0,
				scrollTop: 0,
				btnLoading: false,
				loading: true,
				barcode: '',
				e_type: null,
				equipmentInfo: {},
				material_list: [],
				material_scan_list: [],
				selectList: []
			}
		},
		computed: {
			...mapGetters(['uid'])
		},
		methods: {
			postEquipmentInfo() {
				// uni.showModal({
				// 	content: '是否确认提交？',
				// 	success: (e) => {
				// 		if (e.confirm) {
				let list = [...this.material_list];
				let newArr = [];
				this.material_scan_list.forEach(scanItem => {
					const fIndex = list.findIndex(item => item.serial_number === scanItem.serial_number);
					if (fIndex > -1) {
						list[fIndex].scanned_quantity = scanItem.scanned_quantity;
					} else {
						newArr.push(scanItem);
					}
				});
				let self_data = {
					location_code: this.equipmentInfo.name,
					// counter: this.selectList.map(u => u.id)[0],
					counter: this.uid,
					entries: [...list, ...newArr].map(d => {
						return {
							product_id: d.product_id,
							serial_number: d.serial_number,
							system_quantity: d.system_quantity,
							scanned_quantity: d.scanned_quantity
						}
					})
				}
				api.web.dataset.call_kw({
					model: 'warehouse.inventory',
					method: 'create_inventory_line',
					args: [
						self_data
					],
					kwargs: {}
				}).then((res) => {
					if (res) {
						uni.showToast({
							title: '盘点完成'
						})
						this.reset();
					}
				})
				// 		}
				// 	}
				// })
			},
			btnClick() {
				// this.$refs.userPopupRef.open();
				this.postEquipmentInfo();
			},
			async getProductionInfo(barcode) {
				if (!this.equipmentInfo.name) {
					uni.showToast({
						title: '请扫描库位',
						icon: 'none',
						duration: 2000
					});
					return
				}
				const res = await api.web.dataset.call_kw({
					model: 'stock.quant',
					method: 'do_barcode_info',
					args: [
						[]
					],
					kwargs: {
						barcode
					}
				})
				if (res) {
					if (res?.length <= 0) {
						uni.showToast({
							title: '无效的条码：' + barcode,
							icon: 'none',
							duration: 3000
						});
						return
					}
					let result = {
						scanned_quantity: 1,
						system_quantity: 0,
						product_id: res[0].product_id?.length > 0 ? res[0].product_id[0] : null,
						product_name: res[0].product_id?.length > 1 ? res[0].product_id[1] : '',
						serial_number: res[0].serial_num || ''
					}
					let index = this.material_scan_list.findIndex(m => m.serial_number === result.serial_number);
					if (index > -1) {
						// uni.showToast({
						// 	title: '扫码重复：' + barcode,
						// 	icon: 'none',
						// 	duration: 3000
						// });
						this.material_scan_list[index].scanned_quantity += 1;
						return
					}
					this.material_scan_list.unshift(result);
					this.backToTop();
				}
			},
			async getEquipmentInfo(barcode) {
				uni.showLoading({
					title: '加载中'
				});
				try {
					this.barcode = barcode;
					let codes = barcode.split(':')
					barcode = codes[codes.length - 1];
					this.reset();
					this.equipmentInfo = {
						name: barcode
					}
					const res = await api.web.dataset.call_kw({
						model: 'warehouse.inventory',
						method: 'get_quant_products_by_location',
						args: [
							[barcode]
						],
						kwargs: {}
					})
					if (res?.products?.length) {
						this.material_list = res.products.map(p => {
							return {
								...p,
								system_quantity: p.quantity,
								scanned_quantity: 0,
								product_name: p.product_code || '',
							}
						})
					}
					uni.hideLoading();
				} catch (e) {
					uni.hideLoading();
				}
			},
			userPopupConfirm(e) {
				this.selectList = e;
				this.postEquipmentInfo();
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							if (!scanCode.includes(':')) {
								this.getProductionInfo(scanCode);
							} else {
								this.getEquipmentInfo(scanCode);
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
			inputChange(event) {
				console.log(event)
				return event
			},
			inputBlur(event, index) {
				console.log(event)
				this.material_scan_list[index].scanned_quantity = event.detail.value
			},
			reset() {
				this.material_list = [];
				this.material_scan_list = [];
				this.equipmentInfo = {};
			},
			delHanlde(index) {
				this.material_list.splice(index, 1);
			},
			backToTop() {
				this.scrollTop = this.currentScrollTop;
				this.$nextTick(() => {
					this.scrollTop = 0;
				})
			},
			scrollTap(e) {
				this.currentScrollTop = e.detail.scrollTop;
			},
			async scanClick() {
				// this.getEquipmentInfo('stock.location:24:C-10-2')
				await this.getEquipmentInfo('stock.location:13214:5-16-南-A-1-1');
				[
					'JK240430ZC02/JK36GTE-24-0512-198',
				]
				.forEach((item) => {
					this.getProductionInfo(item);
				})
			}
		},
		onLoad() {},
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

	uni-view {
		font-size: 30rpx;
	}
</style>
<style lang="scss" scoped>
	@import './index.scss';

	.materialManagementScan-page {
		height: 100%;
		padding-bottom: 100rpx;

		.container {
			height: 100%;

			.header {
				padding: 0 40rpx;
				width: 100%;
				height: 60px;
				float: left;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 20rpx;
				box-shadow: rgba(150, 148, 148, .15) 0rpx 0rpx 6rpx 2rpx;
				background-color: #fff;

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
				height: 100%;

				.content-title {
					padding: 0 20rpx;
				}

				.material-list {
					height: calc(100% - 110rpx);
					padding: 20rpx;

					.material-card {
						background-color: #fff;
						padding: 25rpx;
						border-radius: 12rpx;
						box-shadow: 0px 0px 6rpx #eee;

						&:not(:last-child) {
							margin-bottom: 20rpx;
						}

						.card-container {
							padding-left: 42rpx;
						}

						.title {
							font-size: 36rpx;
							font-weight: bold;
							margin-bottom: 10rpx;
							position: relative;

							.sign {
								display: inline-block;
								width: 30rpx;
								height: 30rpx;
								border-radius: 50%;
								margin-left: 20rpx;
								margin-right: 12rpx;
								position: absolute;
								left: -60rpx;
								top: 12rpx;

								&.primary {
									background-color: #696eff;
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

						.sub-title {
							color: #999;
							font-size: 28rpx;
							margin-bottom: 10rpx;
						}

						.list {
							border-radius: 15rpx;
							overflow: hidden;

							.list-item {
								background-color: #E8F2FF;

								&:not(:last-child) {
									border-bottom: 2rpx solid #E0E7F2;
								}

								.item-cell {
									display: flex;
									align-items: center;
									padding: 22rpx;
									word-break: break-all;
									overflow-wrap: break-word;

									&:not(:last-child) {
										padding-bottom: 10rpx;
									}

									.label {
										width: 150rpx;
										color: #6190e8;
									}

									.value {
										flex: 1;
									}
								}
							}
						}
					}

					.not-empty {
						padding-top: 60rpx;
						padding-bottom: 60rpx;
						text-align: center;
						color: $primary-color;
					}

					.material-item {
						margin: 20rpx 20rpx 0;
						background-color: #fff;
						padding: 20rpx 40rpx 20rpx 20rpx;
						border-radius: 10rpx;
						box-shadow: 0px 0px 8rpx rgba(211, 211, 211, .5);
						position: relative;

						&:first-child {
							background-color: rgba(173, 216, 230, .4);
						}

						.item-close {
							position: absolute;
							right: 0rpx;
							top: 10rpx;
							line-height: 32rpx;
							text-align: center;
						}

						/deep/ .uni-forms-item__inner {
							padding-bottom: 10rpx;

							.uni-forms-item__label {
								height: auto;
							}

							.uni-forms-item__content {
								min-height: auto;
								display: inline-flex;
								align-items: center;
								word-break: break-all;
								overflow-wrap: break-word;
							}
						}

						/deep/ .uni-easyinput {
							.uni-easyinput__content {
								min-height: 60rpx;
								height: 60rpx;

								&.is-textarea {
									height: auto;
								}
							}

							&.submit-icon {
								.uni-icons {
									color: $uni-color-success !important;
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

			.u-btn--primary {
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