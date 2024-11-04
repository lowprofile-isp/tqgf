<template>
	<view class="safeEpa-page">
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
		<!-- #ifdef H5 -->
		<view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="scan"></u-icon>
		</view>
		<!-- #endif -->
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y :scroll-top="scrollTop">
					<uni-forms ref="baseForm" class="material-item" :modelValue="baseFormData" validateTrigger="bind"
						label-width="70">
						<uni-forms-item label="巡检任务" name="inspection_task_id" required>
							<span v-if="disabled">{{baseFormData.inspection_task_name || ''}}</span>
							<uni-data-select v-else v-model="baseFormData.inspection_task_id" :localdata="taskList"
								:clear="true" @change="selectChange"></uni-data-select>
						</uni-forms-item>
						<template v-if="baseFormData.inspection_task_id">
							<uni-forms-item style="padding-bottom: 10rpx;" label="厂区位置" name="position">
								<span>{{baseFormData.position || ''}}</span>
							</uni-forms-item>
							<uni-forms-item style="padding-bottom: 10rpx;" label="安全事项" name="safety_matters">
								<span>{{baseFormData.safety_matters || ''}}</span>
							</uni-forms-item>
							<uni-forms-item style="padding-bottom: 10rpx;" label="安全标准" name="safety_standards">
								<span>{{baseFormData.safety_standards || ''}}</span>
							</uni-forms-item>
							<uni-forms-item style="padding-bottom: 10rpx;" label="巡检周期" name="inspection_cycle">
								<span>{{baseFormData.inspection_cycle || ''}}</span>
							</uni-forms-item>
							<!-- <uni-forms-item style="padding-bottom: 10rpx;" label="创建人" name="create_uid">
								<span>{{baseFormData.create_uid | findValueDec}}</span>
							</uni-forms-item> -->
							<uni-forms-item style="padding-bottom: 10rpx;" label="创建日期" name="create_date">
								<span>{{baseFormData.create_date || ''}}</span>
							</uni-forms-item>
							<template v-if="detail_id">
								<uni-forms-item style="padding-bottom: 10rpx;" label="处理人">
									<!-- <uni-easyinput v-model="baseFormData.fix_person" :styles="easyinputStyles"
										clearSize="22" placeholder="请填写处理人"></uni-easyinput> -->
									<!-- <u-tag style="margin: 10rpx;" v-for="(user, index) in selectList" :key="index"
										:text="user.name"></u-tag> -->
									<u-tag v-if="baseFormData.fix_person" style="margin: 10rpx;"
										:text="baseFormData.fix_person"></u-tag>
									<text v-if="!disabled" style="display: inline-block;color: #6190e8;"
										@click="selectUserClick">选择人员</text>
								</uni-forms-item>
								<uni-forms-item label="处理结果">
									<uni-easyinput v-model="baseFormData.fix_result" type="textarea" autoHeight
										:styles="easyinputStyles" :disabled="disabled" clearSize="22"
										placeholder="请填写处理结果"></uni-easyinput>
								</uni-forms-item>
								<uni-forms-item label="上传照片">
									<u-upload ref="uUpload" :class="disabled ? 'upload-disabled' : ''"
										:custom-btn="true" :file-list="baseFormData.picList" :sourceType="['camera']"
										:deletable="!disabled" :auto-upload="false" :custom-upload="true"
										@customUpload="customUpload">
										<view slot="addBtn" class="upload-slot-btn" hover-class="upload-slot-btn__hover"
											hover-stay-time="150">
											<u-icon name="camera-fill" size="100" color="#c0c4cc"></u-icon>
										</view>
									</u-upload>
								</uni-forms-item>
							</template>
						</template>
					</uni-forms>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" v-if="!disabled">
			<!-- <u-button v-if="detail_id" type="primary" :loading="btnLoading" hover-class="none"
				@click="doneClick">{{stateFilter(baseFormData.state).text}}</u-button> -->
			<u-button v-if="detail_id" type="primary" :loading="btnLoading" hover-class="none"
				@click="doneClick">完成处理</u-button>
			<u-button v-else type="primary" :loading="btnLoading" hover-class="none" @click="btnClick">创建</u-button>
		</view>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup ref="userPopupRef" :default-value="selectList" @confirm="userPopupConfirm"></user-popup>
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
	import userPopup from '@/components/user-popup/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			userPopup
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '安环巡检',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				customStyle: {
					margin: 0, // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					color: '#fff',
					backgroundColor: '#6190e8',
					borderColor: '#6190e8'
				},
				authChoosePopupShow: false,
				scrollTop: 0,
				btnLoading: false,
				baseFormData: {
					inspection_task_id: '',
					inspection_task_name: '',
					position: '',
					safety_matters: '',
					safety_standards: '',
					inspection_cycle: '',
					create_uid: '',
					create_date: '',
					fix_person: '',
					fix_date: '',
					fix_result: '',
					state: '',
					picList: [],
				},
				rules: {
					inspection_task_id: {
						rules: [{
							required: true,
							errorMessage: '请选择巡检任务'
						}]
					},
				},
				uploadInfo: {
					res_model: '',
					res_id: null
				},
				taskInfo: {},
				selectList: [],
				detail_id: null,
				taskList: []
			}
		},
		computed: {
			disabled() {
				return this.baseFormData.state === '完成'
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
					case '草稿':
						stateInfo.text = '分派';
						stateInfo.type = 'info';
						stateInfo.func = 'do_assign';
						break;
					case '待处理':
						stateInfo.text = '开始';
						stateInfo.type = 'primary';
						stateInfo.func = 'do_start';
						break;
					case '进行中':
						stateInfo.text = '处置完成';
						stateInfo.type = 'warning';
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
						this.uploadInfo = {
							...result
						};
						let fileList = this.$refs.uUpload.lists || [];
						if (fileList.length) {
							// 循环上传图片
							let promises = [];
							fileList.forEach((file, index) => {
								let p = () => {
									return new Promise((resolve, reject) => {
										uploadFilePromise({
											...file,
											res_model: this.uploadInfo
												.res_model,
											res_id: this.uploadInfo
												.res_id
										}).then((uploadResult) => {
											if (!uploadResult) {
												file.error = true;
												// uni.showToast({
												// 	title: '图片上传失败',
												// 	icon: 'none'
												// })
											}
											resolve()
										}).catch(e => {
											reject()
										})
									})
								}
								promises.push(p)
							});
							Promise.all(promises.map((promise) => promise())).then(() => {
								// uni.hideLoading();
								this.btnLoading = false;
								uni.showToast({
									title: '处理完成',
									success: () => {
										setTimeout(() => {
											uni.navigateBack();
										}, 1500);
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
				if (!this.baseFormData.fix_person) {
					uni.showToast({
						title: '请选择处理人',
						icon: 'none'
					})
					callback(false)
					return
				}
				this.btnLoading = true;
				uni.showLoading();
				let payload = {
					id: this.detail_id,
					fix_date: '',
					fix_person: this.selectList.map(u => u.id)[0],
					fix_result: this.baseFormData.fix_result,
				}
				api.web.dataset.call_kw({
					model: 'safety.environmental.protection',
					method: 'update_records',
					args: [
						[]
					],
					kwargs: {
						...payload
					}
				}).then(async (res) => {
					if (res) {
						callback({
							res_id: this.detail_id,
							res_model: 'safety.environmental.protection'
						});
						await this.stateUpdate('state_done');
						this.prevPageRefresh();
						// this.getDetail(this.detail_id);
					} else {
						callback(false)
					}
				}).finally(() => {
					this.btnLoading = false;
					uni.hideLoading();
				})

			},
			create() {
				api.web.dataset.call_kw({
					model: 'safety.environmental.protection',
					method: 'create_records',
					args: [
						[]
					],
					kwargs: {
						inspection_task_id: this.baseFormData.inspection_task_id
					}
				}).then((res) => {
					if (res) {
						this.detail_id = res;
						this.prevPageRefresh();
					}
				})
			},
			async stateUpdate(method) {
				await api.web.dataset.call_kw({
					model: 'safety.environmental.protection',
					method,
					args: [
						[]
					],
					kwargs: {
						id: this.detail_id
					}
				})
			},
			async getDetail(id) {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'safety.environmental.protection',
					method: 'get_safety_info',
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
					this.detail_id = info.id;
					this.baseFormData.inspection_task_id = info.inspection_task_id || '';
					this.baseFormData.inspection_task_name = info.inspection_task_name || '';
					this.baseFormData.position = info.position || '';
					this.baseFormData.safety_matters = info.safety_matters || '';
					this.baseFormData.safety_standards = info.safety_standards || '';
					this.baseFormData.inspection_cycle = info.inspection_cycle || '';
					this.baseFormData.create_uid = info.create_uid || '';
					this.baseFormData.create_date = info.create_date || '';
					this.baseFormData.fix_person = info.fix_person || '';
					this.baseFormData.fix_date = info.fix_date || '';
					this.baseFormData.fix_result = info.fix_result || '';
					this.baseFormData.state = info.state || '';
					this.baseFormData.picList = info.attachments?.length > 0 ? info.attachments : [];
				}
			},
			async getTaskList() {
				const res = await api.web.dataset.call_kw({
					model: 'safety.environmental.protection',
					method: 'get_inspection_task',
					args: [
						[]
					],
					kwargs: {}
				})
				if (res?.length) {
					this.taskList = res.map(t => {
						return {
							...t,
							text: t.name,
							value: t.id,
						}
					})
				}
			},
			getTaskDetail(id) {
				let taskInfo = this.taskList.find(t => t.value === id);
				if (taskInfo) {
					this.taskInfo = taskInfo;
					this.baseFormData.inspection_task_id = taskInfo.id || '';
					this.baseFormData.position = taskInfo.position || '';
					this.baseFormData.safety_matters = taskInfo.safety_matters || '';
					this.baseFormData.safety_standards = taskInfo.safety_standards || '';
					this.baseFormData.inspection_cycle = taskInfo.inspection_cycle || '';
					// this.baseFormData.create_uid = taskInfo.create_uid || '';
					// this.baseFormData.create_date = taskInfo.create_date || '';
				}
			},
			selectChange(e) {
				this.$refs.baseForm.validate();
				this.getTaskDetail(e);
			},
			selectUserClick() {
				this.$refs.userPopupRef.open();
			},
			doneClick() {
				this.submit();
			},
			btnClick() {
				this.$refs.baseForm.validate().then(res => {
					this.create();
				}).catch(err => {
					console.log('err', err);
				})
			},
			userPopupConfirm(e) {
				this.selectList = e;
				this.baseFormData.fix_person = this.selectList.map(u => u.name)[0];
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
		},
		async onLoad(options) {
			this.detail_id = options.id;
			await this.getTaskList();
			if (this.detail_id) {
				this.getDetail(this.detail_id);
			}
		},
		onReady() {
			this.$refs.baseForm.setRules(this.rules);
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

	.safeEpa-page {
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

						/deep/ .uni-forms-item-error {
							.uni-forms-item__inner {
								padding-bottom: 46rpx;
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

						/deep/ .uni-select {
							border-color: #a7a7a7;
						}

						/deep/ .is-disabled {
							background-color: #f8f8f8;
							color: #6a6a6a;
						}

						.text-high {
							color: $primary-color;
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