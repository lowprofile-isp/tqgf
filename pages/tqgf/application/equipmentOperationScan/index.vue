<template>
	<view class="equipmentOperationScan-page" :style="{height: `calc(100vh - ${$mStore.state.navBarHeight}px)`}">
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
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- #endif -->
		<view class="container">
			<view class="header">
				<view v-if="equipmentInfo.name" class="header-content">
					<view class="title">
						{{equipmentInfo.name}}
						<!-- <view style="display: flex; align-items: center; font-size: 32rpx;font-weight: 400;">
							<span class="sign" :class="stateFilter(equipmentInfo.active)"></span>
							{{equipmentInfo.active ? '正常' : '设备故障'}}
						</view> -->
					</view>
				</view>
				<view v-else style="text-align: center;">请扫描设备二维码</view>
			</view>
			<view class="content" v-if="equipmentInfo.id">
				<view class="content-title">
					已扫描: {{material_list.length}}件
				</view>
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop" @scroll="scrollTap">
					<template v-if="e_type === 'start'">
						<view v-if="material_list.length <= 0" class="not-empty">请扫描产品</view>
						<view v-else class="material-item" :style="{backgroundColor: e_type === 'end' ? '#fff' : ''}"
							v-for="(item,index) in material_list" :key="index">
							<view class="item-cell">
								<span>批次号: {{item.serial_num}}</span>
							</view>
							<view class="item-cell">
								<span>产品: {{item.product}}</span>
							</view>
							<view class="item-cell">
								<span>产品状态: {{item.order_state}}</span>
							</view>
							<!-- <view class="item-cell">
								<span>产品规格: {{item.size}}</span>
							</view> -->
							<span class="item-close" @click="delHanlde(index)">
								<uni-icons type="trash" size="22" color="#FF7878"></uni-icons>
							</span>
						</view>
					</template>
					<template v-else-if="e_type === 'end'">
						<view class="material-item" :style="{backgroundColor: e_type === 'end' ? '#fff' : ''}"
							v-for="(item, index) in material_list" :key="index">
							<view class="item-cell">
								<span>批次号: {{item.finished_lot_id | findValueDec}}</span>
							</view>
							<view class="item-cell">
								<span>产品: {{item.product_id | findValueDec}}</span>
							</view>
							<view class="item-cell">
								<span>产品状态: {{item.order_state}}</span>
							</view>
						</view>
					</template>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group">
			<template v-if="e_type === 'start'">
				<u-button type="primary" :loading="btnLoading" hover-class="none" :disabled="material_list.length <= 0"
					@click="btnClick">设备上工</u-button>
				<u-button style="margin-left: 30rpx;" type="primary" hover-class="none" :loading="btnLoading"
					@click="btnClick('person')">人员上工</u-button>
			</template>
			<template v-if="e_type === 'end'">
				<u-button type="primary" :loading="btnLoading" hover-class="none" @click="btnClick">设备下工</u-button>
				<u-button style="margin-left: 30rpx;" type="primary" :loading="btnLoading" hover-class="none"
					@click="btnClick('person')">人员下工</u-button>
			</template>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup ref="userPopupRef" multiple @confirm="userPopupConfirm"></user-popup>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		getEquipmentInfoAPI,
		getPersonInfoAPI
	} from '@/api/inventory.js';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import userPopup from '@/components/user-popup/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			userPopup
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '设备报工',
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
				e_type: null,
				equipmentInfo: {},
				selectUser: [],
				material_list: []
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			stateFilter(value) {
				let type = '';
				switch (value) {
					// case '未排产':
					// 	type = 'info';
					// 	break;
					// case '待拆炉':
					// 	type = 'success';
					// 	break;
					// case '待装炉':
					// 	type = 'primary';
					// 	break;
					// case '已装炉':
					// 	type = 'warning';
					// 	break;
					case true:
						type = 'success';
						break;
					case false:
						type = 'error';
						break;
				}
				return type;
			},
			userPopupConfirm(e) {
				this.selectUser = e;
				if (this.e_type === 'start') {
					if (this.btnType === 'person') {
						this.postPersonInfo();
					} else {
						this.postEquipmentInfo();
					}
				} else if (this.e_type === 'end') {
					if (this.btnType === 'person') {
						this.postPersonInfo();
					} else {
						this.endEquipmentInfo();
					}
				}
			},
			btnClick(type) {
				this.btnType = type;
				this.$refs.userPopupRef.open();
			},
			postPersonInfo() {
				this.btnLoading = true;
				getPersonInfoAPI({
					barcode: this.equipmentInfo.barcode,
					employees: this.selectUser.map(u => u.id)
				}).then((res) => {
					if (res && res.result) {
						uni.showToast({
							title: res.result.message,
							icon: 'none'
						});
					}
				}).finally(() => {
					this.btnLoading = false;
				});
			},
			postEquipmentInfo() {
				// uni.showModal({
				// 	content: '是否确认提交？',
				// 	success: (e) => {
				// 		if (e.confirm) {
				let serial_nums = this.material_list.map(m => m.serial_num);
				this.btnLoading = true;
				uni.showLoading({
					title: '上传中'
				});
				api.web.dataset.call_kw({
					model: 'mrp.production',
					method: 'do_start_stop',
					args: [
						[]
					],
					kwargs: {
						barcode: this.equipmentInfo.barcode,
						products: serial_nums,
						employees: this.selectUser.map(u => u.id)
					}
				}).then((res) => {
					if (res) {
						uni.showToast({
							// title: res.result.message,
							title: '已上工',
							icon: 'success'
						});
					}
				}).finally(() => {
					uni.hideLoading();
					this.btnLoading = false;
				});
				// 		}
				// 	}
				// })
			},
			endEquipmentInfo() {
				// uni.showModal({
				// 	content: '是否将该设备所有产品下工？',
				// 	success: (e) => {
				// 		if (e.confirm) {
				this.btnLoading = true;
				uni.showLoading({
					title: '上传中'
				});
				getEquipmentInfoAPI({
					barcode: this.equipmentInfo.barcode,
					employees: this.selectUser.map(u => u.id)
				}).then((res) => {
					if (res && res.result) {
						uni.showToast({
							title: res.result.message,
							icon: 'none'
						});
						this.getEndProduct();
					}
				}).finally(() => {
					uni.hideLoading();
					this.btnLoading = false;
				});
				// 		}
				// 	}
				// })
			},
			async getProductionInfo(barcode) {
				if (!this.equipmentInfo.id) {
					uni.showToast({
						title: '请先扫描设备',
						icon: 'none'
					})
					return
				}
				// if (!this.equipmentInfo.active) {
				// 	uni.showToast({
				// 		title: '该设备故障',
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				if (this.e_type === 'end') {
					return
				}
				const res = await api.web.dataset.call_kw({
					model: 'mrp.production',
					method: 'get_info_by_barcode',
					args: [
						[]
					],
					kwargs: {
						barcode
					}
				})
				if (res?.length > 0) {
					let info = res[0] || {};
					if (!info.serial_num) {
						uni.showToast({
							title: '无效的条码：' + barcode,
							icon: 'none',
							duration: 3000
						});
						return
					}
					let index = this.material_list.findIndex(m => m.serial_num === info.serial_num);
					if (index > -1) {
						uni.showToast({
							title: '扫码重复：' + barcode,
							icon: 'none',
							duration: 3000
						});
						return
					}
					this.material_list.unshift(info);
					this.backToTop();
				}
			},
			async getEquipmentInfo(barcode) {
				let barcodes = barcode.split(':');
				let type = barcodes[barcodes.length - 1];
				this.e_type = type;
				if (this.e_type === 'start' || this.e_type === 'end' || this.e_type === 'stop') {
					uni.showLoading({
						title: '加载中'
					});
					try {
						let model = barcodes[0];
						let workcenter_id = barcodes[1];
						// const Model = api.env.model(model);
						// const res = await Model.search_read({
						// 	domain: [
						// 		['id', '=', workcenter_id]
						// 	]
						// });
						const res = await api.web.dataset.call_kw({
							model,
							method: 'get_info_by_barcode',
							args: [
								[]
							],
							kwargs: {
								barcode
							}
						})
						if (res && res.length > 0) {
							this.equipmentInfo = {
								...res[0],
								id: 1,
								barcode
							};
							if (this.e_type === 'end') {
								this.getEndProduct();
							}
						}
						uni.hideLoading();
					} catch (e) {
						uni.hideLoading();
					}
				} else {
					uni.showToast({
						title: '无效的条码：' + barcode,
						icon: 'none',
						duration: 3000
					})
				}
			},
			async getEndProduct() {
				const Model = api.env.model('mrp.workorder');
				const res = await Model.search_read({
					domain: [
						['workcenter_id', '=', this.equipmentInfo.id],
						['state', '=', 'progress'],
					],
					fields: ["finished_lot_id", "product_id", "order_state"]
				});
				if (res && res.length > 0) {
					this.material_list = [...res];
				} else {
					this.material_list = []
				}
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', (code) => {
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
				await this.getEquipmentInfo('mrp.workcenter:1:19:start');
				[
					'MK240521ZC01/MK36DLA-24-0527-141'
				]
				.forEach((item) => {
					this.getProductionInfo(item);
				})
			}
		},
		onLoad() {
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

	.equipmentOperationScan-page {
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
					height: calc(100% - 182rpx);
					padding: 22rpx;

					.not-empty {
						padding-top: 60rpx;
						text-align: center;
						color: $primary-color;
					}

					.material-item {
						background-color: #fff;
						padding: 20rpx 40rpx 20rpx 20rpx;
						border-radius: 10rpx;
						box-shadow: 0px 0px 8rpx rgba(211, 211, 211, .5);
						position: relative;

						&:not(:last-child) {
							margin-bottom: 22rpx;
						}

						&:first-child {
							background-color: rgba(173, 216, 230, .4);
						}

						.item-cell {
							margin-bottom: 16rpx;
							word-break: break-all;
							overflow-wrap: break-word;
						}

						.item-close {
							position: absolute;
							right: 0rpx;
							top: 10rpx;
							line-height: 32rpx;
							text-align: center;
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