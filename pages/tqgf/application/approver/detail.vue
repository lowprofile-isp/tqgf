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
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop">
					<uni-forms ref="baseForm" class="material-item" :modelValue="baseFormData" :rules="rules"
						label-width="70">
						<uni-forms-item label="异常标题" name="name">
							<!-- <uni-easyinput v-model="baseFormData.name" :styles="easyinputStyles"
								:disabled="error_id ? true : false" clearSize="22"
								placeholder="请输入异常标题"></uni-easyinput> -->
							<span>{{baseFormData.name || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="异常标签" name="tag_ids">
							<!-- <uni-data-checkbox mode="button" multiple v-model="baseFormData.tag_ids"
								:localdata="tagList" selectedColor="#6190e8"></uni-data-checkbox> -->
							<u-tag v-for="(tag, t_index) in currentTag" :text="tag.text" type="error" mode="light"
								:key="t_index" />
						</uni-forms-item>
						<uni-forms-item style="padding-bottom: 10rpx;" label="异常设备" name="device_name">
							<span v-if="baseFormData.device_name">{{baseFormData.device_name}}</span>
							<span v-else class="text-high">{{ error_id ? '' : '请扫描设备二维码'}}</span>
						</uni-forms-item>
						<uni-forms-item label="异常产品" name="product_name">
							<span v-if="baseFormData.product_name">{{baseFormData.product_name}}</span>
							<span v-else class="text-high">{{ error_id ? '' : '请扫描产品二维码'}}</span>
						</uni-forms-item>
						<uni-forms-item label="部门" name="department_ids">
							<span>{{baseFormData.department_ids}}</span>
						</uni-forms-item>
						<uni-forms-item label="备注" name="note">
							<uni-easyinput v-if="isEdit" v-model="baseFormData.note" type="textarea" autoHeight
								:styles="easyinputStyles" clearSize="22" placeholder="请输入备注"></uni-easyinput>
							<span v-else>{{baseFormData.note || ''}}</span>
						</uni-forms-item>
						<uni-forms-item label="上传照片">
							<!-- <custom-upload ref="customUploadRef" :auto-upload="false" @uploadGetResultInfo="uploadGetResultInfo"></custom-upload> -->
							<u-upload ref="uUpload" :class="error_id ? 'upload-disabled' : ''" :custom-btn="true"
								:file-list="baseFormData.picList" :sourceType="['camera']" :auto-upload="false"
								:custom-upload="true" :deletable="!error_id" @customUpload="customUpload">
								<view slot="addBtn" class="upload-slot-btn" hover-class="upload-slot-btn__hover"
									hover-stay-time="150">
									<u-icon name="camera-fill" size="100" color="#c0c4cc"></u-icon>
								</view>
							</u-upload>
						</uni-forms-item>
					</uni-forms>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group">
			<u-button v-if="!error_id" type="primary" :loading="btnLoading" hover-class="none"
				@click="btnClick">提交</u-button>
			<u-button v-else-if="stateFilter(baseFormData.state).text" type="primary" :loading="btnLoading"
				hover-class="none" @click="doneClick">{{stateFilter(baseFormData.state).text}}</u-button>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
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
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			departmentPopup
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '异常处理',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				authChoosePopupShow: false,
				scrollTop: 0,
				btnLoading: false,
				baseFormData: {
					name: '',
					product: '',
					product_name: '',
					department_ids: '',
					device: '',
					device_name: '',
					note: '',
					state: null,
					picList: [],
					tag_ids: []
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '名称不能为空'
						}]
					},
				},
				uploadInfo: {
					res_model: '',
					res_id: null
				},
				productInfo: {},
				equipmentInfo: {},
				selectList: null,
				error_id: null,
				tagList: []
			}
		},
		computed: {
			currentTag() {
				return this.tagList.filter(t => this.baseFormData.tag_ids.indexOf(t.value) > -1)
			},
			isEdit() {
				return this.baseFormData.state == '待处理'
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			stateFilter(value) {
				let stateInfo = {
					text: '',
					type: '',
					func: ''
				};
				switch (value) {
					case '待处理':
						stateInfo.text = '处理完成';
						stateInfo.type = 'primary';
						stateInfo.func = 'do_finish';
						break;
				}
				return stateInfo;
			},
			submit() {
				// uni.showModal({
				// 	content: '是否确认提交？',
				// 	success: async (e) => {
				// 		if (e.confirm) {
				this.uploadGetResultInfo(null, (result) => {
					if (result) {
						this.error_id = result.res_id;
						this.baseFormData.state = '草稿';
						this.tagList.forEach(t => t.disable = true);
						this.uploadInfo = {
							...result
						};
						let fileList = this.$refs.uUpload.lists || [];
						if (fileList.length) {
							// 循环上传图片
							fileList.forEach((file, index) => {
								uploadFilePromise({
									...file,
									res_model: this.uploadInfo
										.res_model,
									res_id: this.uploadInfo
										.res_id
								}).then((uploadResult) => {
									this.prevPageRefresh();
									if (!uploadResult) {
										file.error = true;
										// uni.showToast({
										// 	title: '图片上传失败',
										// 	icon: 'none'
										// })
									}
								})
							})
						}
					}
				})
				// 		}
				// 	}
				// })

			},
			customUpload(file, callback) {
				uploadFilePromise({
					...file,
					res_model: this.uploadInfo.res_model,
					res_id: this.uploadInfo.res_id
				}).then((uploadResult) => {
					if (!uploadResult) {
						file.error = true
					}
				}).finally(() => {
					callback();
				})
			},
			uploadGetResultInfo(params, callback) {
				// if (!this.baseFormData.name) {
				// 	uni.showToast({
				// 		title: '请先填写名称',
				// 		icon: 'none'
				// 	})
				// 	callback(false)
				// 	return
				// }
				uni.showLoading({
					title: '上传中'
				});
				this.btnLoading = true;
				const {
					picList,
					product_name,
					device_name,
					state,
					...payload
				} = this.baseFormData;
				payload['department_ids'] = this.selectList.map(s => s.id);
				api.web.dataset.call_kw({
					model: 'mrp.abnormal',
					method: 'create',
					args: [{
						...payload
					}],
					kwargs: {}
				}).then((res) => {
					if (res) {
						callback({
							res_id: res,
							res_model: 'mrp.abnormal'
						});
						uni.showToast({
							title: '上报成功',
							icon: 'none'
						})
					} else {
						callback(false)
					}
				}).finally(() => {
					this.btnLoading = false;
					uni.hideLoading();
				})
			},
			async getProductInfo(barcode) {
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
					let result = res[0];
					this.productInfo = result;
					this.baseFormData.product = barcode;
					this.baseFormData.product_name = this.productInfo.product || '';
				}
			},
			async getEquipmentInfo(barcode) {
				let barcodes = barcode.split(':');
				let model = barcodes[0];
				let workcenter_id = barcodes[1];
				const Model = api.env.model(model);
				const res = await Model.search_read({
					domain: [
						['id', '=', workcenter_id]
					],
					fields: ['name']
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
					this.baseFormData.device = barcode;
					this.baseFormData.device_name = this.equipmentInfo.name;
				}
			},
			async getDetail(id) {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'mrp.abnormal',
					method: 'get_abnormal_info',
					args: [
						[]
					],
					kwargs: {
						id
					}
				})
				uni.hideLoading();
				if (res?.id) {
					let info = res;
					this.baseFormData.id = info.id;
					this.baseFormData.name = info.name || '';
					this.baseFormData.department_ids = info.department_ids || '';
					this.baseFormData.device_name = info.device;
					this.baseFormData.product_name = info.product;
					this.baseFormData.note = info.note || '';
					this.baseFormData.state = info.state || null;
					this.baseFormData.picList = info.attachments?.length > 0 ? info.attachments : [];
					this.baseFormData.tag_ids = info.tag_ids?.length > 0 ? info.tag_ids : [];
				}
			},
			async getTagList() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.abnormal',
					method: 'get_tags',
					args: [
						[]
					],
					kwargs: {}
				})
				if (res?.length) {
					this.tagList = res.map(t => {
						return {
							text: t.name,
							value: t.id,
							disable: this.error_id ? true : false
						}
					})
				}
			},
			doneClick() {
				let stateInfo = this.stateFilter(this.baseFormData.state);
				if (stateInfo.func) {
					api.web.dataset.call_kw({
						model: 'mrp.abnormal',
						method: stateInfo.func,
						args: [
							[]
						],
						kwargs: {
							abnormal_id: this.baseFormData.id
						}
					}).then((res) => {
						if (res) {
							uni.showToast({
								title: '操作成功',
								icon: 'success',
								success: () => {
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/tqgf/application/errorAccept/index'
										})
									}, 1000)
								}
							})
						}
					})
				}
			},
			btnClick() {
				this.$refs.baseForm.validate().then(res => {
					this.$refs.departmentPopupRef.open();
				}).catch(err => {
					console.log('err', err);
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
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							if (!scanCode.includes(':')) {
								this.getProductInfo(scanCode);
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
			async scanClick() {
				[
					'TQGF-XS-2024-DD-0222-010/DX32DLB-24-0223-027',
					'mrp.workcenter:154:11:sudududd'
				]
				.forEach((item) => {
					if (typeof item === 'string') {
						let scanCode = item.trim();
						if (!scanCode.includes(':')) {
							this.getProductInfo(scanCode);
						} else {
							this.getEquipmentInfo(scanCode);
						}
					} else {
						uni.showToast({
							title: '无效的条码：' + item,
							icon: 'none',
							duration: 3000
						})
					}
				})
			}
		},
		async onLoad(options) {
			this.error_id = options.id;
			await this.getTagList();
			if (this.error_id) {
				this.getDetail(this.error_id);
			}
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
			this.$refs.baseForm.setRules(this.rules);
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