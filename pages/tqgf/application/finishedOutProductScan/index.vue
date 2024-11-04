<template>
	<view class="finishedProductScan-page" :style="{height: `calc(100vh - ${$mStore.state.navBarHeight}px)`}">
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<!-- <view slot="right" class="slot-right-wrap">
				<view v-if="$mStore.state.user.auths.length > 1" class="right-item" @click="authChoosePopupShow = true">
					<u-icon name="grid-fill" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
				</view>
				<user-name-sign></user-name-sign>
			</view> -->
		</u-navbar>
		<!-- #ifdef H5 -->
		<!-- <view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view> -->
		<!-- #endif -->
		<view class="container">
			<!-- <view class="header">
				<view v-if="equipmentInfo.name" class="header-content">
					<view class="title">
						{{equipmentInfo.name}}
					</view>
				</view>
				<view v-else style="text-align: center;">尚未扫描库位</view>
			</view> -->
			<view class="content">
				<view class="content-title">
					已扫描: {{material_list.length}}件
				</view>
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop" @scroll="scrollTap">
					<view v-if="material_list.length <= 0" class="not-empty">请扫描产品</view>
					<uni-forms v-else class="material-item" v-for="(item,index) in material_list" :key="index"
						:modelValue="item" label-width="60">
						<uni-forms-item label="编号">
							<span>{{'No.' + (index + 1)}}</span>
						</uni-forms-item>
						<uni-forms-item label="批次号">
							<span>{{item.serial_num || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="产品">
							<span>{{item.product || ''}}</span>
						</uni-forms-item>
						<!-- <uni-forms-item label="重量">
							<uni-easyinput v-model="item.weight" class="submit-icon" :styles="easyinputStyles"
								suffixIcon="checkmarkempty" type="number"
								@iconClick="weightSubmit(index)"></uni-easyinput>
						</uni-forms-item>
						<uni-forms-item label="体积">
							<span>{{item.volume.toFixed(2) || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="密度">
							<span>{{item.density.toFixed(2) || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="外观">
							<uni-data-checkbox v-model="item.unqualified_appearance" selectedColor="#6190e8"
								selectedTextColor="#6190e8" :localdata="wg_list"></uni-data-checkbox>
						</uni-forms-item>
						<uni-forms-item label="外观备注">
							<uni-easyinput v-model="item.appearance_evaluation" type="textarea" autoHeight
								:styles="easyinputStyles" placeholder="请输入外观备注"></uni-easyinput>
						</uni-forms-item> -->
						<span class="item-close" @click="delHanlde(index)">
							<uni-icons type="trash" size="22" color="#FF7878"></uni-icons>
						</span>
					</uni-forms>
				</scroll-view>
			</view>
		</view>
		<view>
			<view class="btn-group">
				<!-- <u-button type="error" style="flex: 1; margin-right: 20rpx;"
					:disabled="!equipmentInfo.id || !material_list.length" @click="errorClick">异常</u-button> -->
				<u-button type="primary" :loading="btnLoading" :disabled="!material_list.length" @click="postEquipmentInfo">出 库</u-button>
			</view>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<!-- <zzbz-popup ref="zzbzPopupRef" @confirm="zzbzPopupConfirm"></zzbz-popup> -->
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		getEquipmentInfoAPI
	} from '@/api/inventory.js';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import zzbzPopup from '@/components/zzbz-popup/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			zzbzPopup
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '交付出库',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
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
				selectList: null,
				operate: '交付出库'
			}
		},
		methods: {
			postEquipmentInfo() {
				// if (!this.equipmentInfo.id) {
				// 	uni.showToast({
				// 		title: '尚未扫描库位',
				// 		icon: 'none',
				// 		duration: 2000
				// 	});
				// 	return
				// }
				if (this.material_list.length <= 0) {
					uni.showToast({
						title: '尚未扫描产品',
						icon: 'none',
						duration: 2000
					});
					return
				}
				uni.showModal({
					content: '是否确认提交？',
					success: (e) => {
						if (e.confirm) {
							// let products = this.material_list.map((m) => {
							// 	return {
							// 		...m,
							// 		product_id: m.product_id?.length > 0 ? m.product_id[0] : null,
							// 		location_id: m.location_id?.length > 0 ? m.location_id[0] : null
							// 	}
							// });
							// let location_dest_id = this.equipmentInfo.id;
							this.btnLoading = true;
							uni.showLoading({
								title: '正在出库...'
							});
							let kwargs = {
								barcode: this.material_list.map(m => m.serial_num),
								operate: this.operate,
							}
							// if (this.selectList) {
							// 	kwargs.note = this.selectList;
							// }
							api.web.dataset.call_kw({
								model: 'stock.picking.tysj',
								method: 'do_picking_record',
								args: [
									[]
								],
								kwargs
							}).then((res) => {
								if (res) {
									this.material_list = [];
									uni.showToast({
										title: '出库成功',
										icon: 'none'
									});
								}
							}).finally(() => {
								uni.hideLoading();
								this.btnLoading = false;
							});
						}
					}
				})
			},
			errorClick() {
				this.$refs.zzbzPopupRef.open();
			},
			async getProductionInfo(barcode) {
				let index = this.material_list.findIndex(m => m.serial_num === barcode);
				if (index > -1 && !refresh) {
					uni.showToast({
						title: '扫码重复：' + barcode,
						icon: 'none',
						duration: 3000
					});
					return
				}
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'stock.quant',
					method: 'get_quant_info',
					args: [
						[]
					],
					kwargs: {
						operate: this.operate,
						barcode
					}
				})
				uni.hideLoading();
				if (res) {
					if (res?.length <= 0) {
						uni.showToast({
							title: '无效的条码：' + barcode,
							icon: 'none',
							duration: 3000
						});
						return
					}
					let result = res[0];
					this.material_list.unshift(result);
					this.backToTop();
				}
			},
			async getEquipmentInfo(barcode) {
				uni.showLoading({
					title: '加载中'
				});
				try {
					let codes = barcode.split(':')
					barcode = codes[codes.length - 1];
					let model = 'stock.location';
					const Model = api.env.model(model);
					const res = await Model.search_read({
						domain: [
							['name', '=', barcode]
						],
						fields: ['name', 'location_id']
					});
					if (res) {
						if (res?.length <= 0) {
							uni.showToast({
								title: '无效的条码：' + barcode,
								icon: 'none',
								duration: 3000
							});
							return
						}
						this.equipmentInfo = {
							...res[0],
							barcode
						};
					}
					uni.hideLoading();
				} catch (e) {
					uni.hideLoading();
				}
			},
			zzbzPopupConfirm(e) {
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
				// await this.getEquipmentInfo('1-4-北-A-1-1');
				[
					'MK240509ZC02/MK32DQA-24-0512-02303'
				]
				.forEach((item) => {
					this.getProductionInfo(item);
				})
			}
		},
		onLoad(options) {
			if (options.barcode) {
				this.getProductionInfo(options.barcode);
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
		background-color: $page-color-light;
		height: 100%;
	}

	uni-view {
		font-size: 32rpx;
	}
</style>
<style lang="scss" scoped>
	@import './index.scss';

	.finishedProductScan-page {
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
					padding: 10rpx 20rpx;
				}

				.material-list {
					height: calc(100% - 60rpx);

					.item-cell {
						display: flex;
						align-items: center;
						margin: 10rpx 0;

						.label {
							display: inline-block;
							width: 100rpx;
						}
					}

					.not-empty {
						padding-top: 60rpx;
						text-align: center;
						color: $primary-color;
					}

					.material-item {
						margin: 0 20rpx 20rpx;
						background-color: #fff;
						padding: 20rpx 40rpx 20rpx 20rpx;
						border-radius: 10rpx;
						box-shadow: 0px 0px 8rpx rgba(211, 211, 211, .5);
						position: relative;

						&:first-child {
							background-color: rgba(173, 216, 230, .4);
						}
						&:last-child {
							margin-bottom: 0;
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