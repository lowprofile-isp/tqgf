<template>
	<view class="notifiction-page">
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
		<view class="container">
			<view class="content">
				<scroll-view class="material-list" scroll-y :scroll-into-view="scroll_view">
					<view class="notice-detail">
						<view class="title">
							<span class="text ellipsis">{{baseFormData.title || ''}}</span>
							<u-tag v-if="baseFormData.tag" :text="baseFormData.tag" type="error" mode="light" />
						</view>
						<view class="sub-title">
							<span>创建时间: {{baseFormData.create_date || ''}}</span>
							<span>创建人: {{baseFormData.create_user || ''}}</span>
						</view>
					</view>
					<view class="notice-detail">
						<view class="desc">
							<view>来源: &nbsp;{{baseFormData.origin || ''}}</view>
							<view>抄送人: &nbsp;{{baseFormData.cc_users || ''}}</view>
							<view>责任人: &nbsp;{{baseFormData.responsible_user || ''}}</view>
							<view><u-parse :html="baseFormData.note"></u-parse></view>
						</view>
						<template v-if="baseFormData.fix_suggestion">
							<u-line style="margin: 20rpx 0;" />
							<view class="other-content">
								<view class="item-cell">
									处理结果: &nbsp;<u-parse :html="baseFormData.fix_suggestion"></u-parse>
								</view>
							</view>
						</template>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- <view class="btn-group" v-if="isEdit">
			<u-button type="primary" :loading="btnLoading" :disabled="!baseFormData.picking_id" hover-class="none"
				@click="btnClick">提交</u-button>
		</view> -->
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup-account ref="userPopupRef" @confirm="userPopupConfirm"
			@close="isSelect = false"></user-popup-account>
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
	import userPopupAccount from '@/components/user-popup-account/index.vue';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			userPopupAccount,
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '通知详情',
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
				isEdit: true,
				scroll_view: '',
				current_move_index: null,
				isSelect: false
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
				// uni.showLoading({
				// 	title: '提交中'
				// });
				// 		}
				// 	}
				// })
			},
			async getDetail() {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'mail.activity',
					method: 'get_info_activity_detail',
					args: [
						[]
					],
					kwargs: {
						activity_id: this.parent_obj.id - 0
					}
				})
				uni.hideLoading();
				if (res?.id) {
					this.baseFormData = {
						...res
					}
					this.setRead(res);
				}
			},
			async setRead(item) {
				await this.$mStore.dispatch('notification/setRead', {
					id: item.id
				});
			},
			inputChange(event) {
				return event
			},
			inputBlur(event, index, b_index) {
				this.baseFormData.move_info[index].batches[b_index].quantity_verified = event.detail.value
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
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
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();

						}
					})
				}
			},
		},
		async onLoad(options) {
			if (options.id) {
				this.parent_obj = {
					id: options.id
				}
				this.getDetail();
			}
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
	$primary-color: #6190e8;

	.notifiction-page {
		.container {
			.content {
				.content-title {
					padding: 0 20rpx;
				}

				.material-list {
					// height: calc(100vh - 188rpx);

					.item-cell {
						display: flex;
						align-items: center;
						color: #a7a7a7;
						word-break: break-all;
						// margin: 10rpx 0;

						.label {
							display: inline-block;
							// width: 104rpx;
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

					.notice-detail {
						padding: 22rpx 30rpx;
						margin-bottom: 20rpx;
						background-color: #fff;

						.title {
							display: flex;
							justify-content: space-between;
							align-items: center;
							font-size: 32rpx;
							font-weight: 600;
							line-height: 1;

							.text {
								flex: 1;
							}
						}

						.sub-title {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-top: 22rpx;
							color: #a7a7a7;
							font-size: 28rpx;
						}

						.desc {
							margin-top: 20rpx;
							color: $font-color-base;

							uni-view {
								margin-bottom: 20rpx;
								font-size: 30rpx;
								word-break: break-all;
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