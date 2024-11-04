<template>
	<view class="dataReport-page">
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
					<view style="flex: 1; line-height: 1; display: flex; align-items: center;"
						v-if="gy_popup_info.currentInfo.text">
						<span class="in2line">{{gy_popup_info.currentInfo.text || ''}}</span>
						<i v-if="gyImages && gyImages.length"
							style="margin-left: 20rpx; font-size: 40rpx; vertical-align: text-top;"
							class="iconfont icon-gongyituzhi link" @click="showImage"></i>
					</view>
					<!-- <uni-data-select v-model="filterInfo.group_id" :localdata="groupList" :clear="false"
						placeholder="请选择工艺模版" @change="() => getGroupParams()"></uni-data-select> -->
					<u-button class="custom-btn" style="width: 180rpx; margin: 0; margin-left: 20rpx;" type="primary"
						plain size="medium" hover-class="none" @click="selectClick">选择工艺模版</u-button>
				</view>
				<v-tabs v-if="isTab" ref="vTabs" style="margin-top: 20rpx;" v-model="tabCurrent" :tabs="tabList"
					paddingItem="0 30rpx" height="60rpx" :active-color="$mStore.state.themeColor.color"
					:line-color="$mStore.state.themeColor.color" :lineScale="0.7" lineRadius="10rpx" :zIndex="98"
					@change="changeTab"></v-tabs>
			</view>
			<view class="content">
				<!-- scroll-view v-if="isTab" class="material-list" :style="{paddingTop: isTab ? '180rpx' : '100rpx'}"
					scroll-y :scroll-into-view="scroll_view">
					<swiper :style="{
								minHeight: '100%',
								backgroundColor: '#f6f6f6',
								transition: 'padding .3s'
							}" :current="swiperCurrent" @transition="transition" @change="animationfinish">
						<swiper-item class="swiper-item" v-for="(formItem, index) in tabFormList" :key="index">
							<view class="material-item">
								<fast-form :form-list="formItem" @inputBlur="inputBlur" @inputNext="inputNext">
									<template v-slot:right="{rowItem, rowIndex}">
										<view v-if="rowItem.readonly">
											<u-icon v-if="!rowItem.readed"
												style="margin-left: 20rpx;margin-right: -20rpx;" name="info-circle"
												color="#EA5455" size="50" @click="setRead(rowItem, rowIndex)"></u-icon>
											<u-icon v-else style="margin-left: 20rpx;margin-right: -20rpx;"
												name="checkmark-circle" color="#28C76F" size="50"></u-icon>
										</view>
									</template>
								</fast-form>
							</view>
						</swiper-item>
					</swiper>
					</scroll-view> -->
				<scroll-view class="material-list" :style="{paddingTop: isTab ? '180rpx' : '100rpx'}" scroll-y
					:scroll-into-view="scroll_view">
					<view class="material-item">
						<fast-form :form-list="formList" @inputBlur="inputBlur" @inputDate="inputDate" @inputNext="inputNext">
							<uni-forms-item v-if="formList.length" label="完成状态">
								<u-tag :text="wancheng_state ? '已完成' : '未完成'"
									:type="wancheng_state ? 'success' : 'warning'"></u-tag>
							</uni-forms-item>
							<template v-slot:right="{rowItem, rowIndex}">
								<view v-if="rowItem.readonly">
									<u-icon v-if="!rowItem.readed" style="margin-left: 20rpx;margin-right: -20rpx;"
										name="info-circle" color="#EA5455" size="50"
										@click="setRead(rowItem, rowIndex)"></u-icon>
									<u-icon v-else style="margin-left: 20rpx;margin-right: -20rpx;"
										name="checkmark-circle" color="#28C76F" size="50"></u-icon>
								</view>
							</template>
						</fast-form>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="btn-group" v-if="filterInfo.group_id">
			<u-button style="width: 35%; flex: none;" type="error" :loading="btnLoading" hover-class="none"
				@click="submit(true)">异常</u-button>
			<u-button style="width: 35%; flex: none;" type="primary" :loading="btnLoading" hover-class="none"
				@click="submit(false)">创建生产记录</u-button>
		</view>
		<uni-popup class="gy-group-popup" ref="gyGroupPopup" type="bottom" @close="groupClose">
			<view class="head">
				<text>{{gy_popup_info.title}}</text>
			</view>
			<view class="content">
				<scroll-view scroll-y="true" style="height: 70vh;"
					:scroll-into-view="gy_popup_info.isScrollInto && gy_popup_info.currentInfo.group_id ? 'groupItem-'+gy_popup_info.currentInfo.group_id : ''">
					<template v-if="gy_popup_info.list.length > 0">
						<view class="item" :class="item.checked ? 'active' : ''" :id="'userItem-'+item.value"
							v-for="(item, index) in gy_popup_info.list" @click="checkChange(item)">
							<view>{{item.text}}</view>
							<!-- <u-checkbox v-model="item.checked" active-color="#6190e8"></u-checkbox> -->
							<!-- <u-tag v-if="item.readed !== undefined" :text="item.readed ? '已读' : '未读'"
								:type="item.readed ? 'success' : 'error'"></u-tag> -->
							<u-icon v-if="!item.readed" name="info-circle" color="#EA5455" size="50"></u-icon>
						</view>
					</template>
					<empty v-else text="暂无数据" mode="list"></empty>
				</scroll-view>
			</view>
			<view v-if="gy_popup_info.isFooter" class="footer">
				<u-button :custom-style="gy_popup_info.cancelStyle" size="medium" hover-class="none" :hair-line="false"
					@click="closeGyGroupPopup">取消</u-button>
				<u-button :custom-style="gy_popup_info.customStyle" size="medium" hover-class="none" :hair-line="false"
					@click="groupConfirm">确定</u-button>
			</view>
		</uni-popup>
		<u-popup v-model="authChoosePopupShow" width="100%" mode="right">
			<auth-choose show-close-btn @close="() => authChoosePopupShow = false"></auth-choose>
		</u-popup>
		<user-popup-account ref="userPopupRef" @confirm="userPopupConfirm"></user-popup-account>
		<uni-popup ref="imagePopup" class="image-popup" background-color="#fff">
			<view class="head">
				<text>工艺图纸</text>
			</view>
			<scroll-view class="content" scroll-y="">
				<view class="image-box">
					<view class="image-item" v-for="(image, index) in gyImages" :index="index">
						<image mode="aspectFill" style="height: 300rpx; width: 100%;" :src="image.url" webp lazy-load
							@click="previewImage(index)"></image>
						<view class="text">{{image.name || ''}}</view>
					</view>
				</view>
			</scroll-view>
		</uni-popup>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</view>
</template>

<script>
	import api from '@/odooapi';
	import baseConfig from '@/config/index.config.js';
	import {
		uploadFilePromise
	} from '@/common/upload.js';
	import userNameSign from '@/components/user-name/index.vue';
	import authChoose from '@/pages/public/authChoose.vue';
	import customUpload from '@/components/custom-upload/index.vue';
	import userPopupAccount from '@/components/user-popup-account/index.vue';
	import fastForm from '@/components/fast-form/index.vue';
	import {
		zhenci_ziduan_arr
	} from './data';
	import {
		isFalse
	} from '../../../../common/checker';
	import img1 from './1.png';
	import img2 from './2.png';
	export default {
		components: {
			userNameSign,
			authChoose,
			customUpload,
			userPopupAccount,
			fastForm
		},
		data() {
			return {
				iconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
				navStyles: {
					navTitle: '生产记录',
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
				filterInfo: {
					group_id: null
				},
				parent_obj: {},
				baseFormData: {},
				selectUser: null,
				groupList: [],
				formList: [],
				tabFormList: [],
				scroll_view: '',
				gy_popup_info: {
					title: '工艺模版',
					isFooter: false,
					show: false,
					isScrollInto: false,
					cancelStyle: {
						backgroundColor: '#F5F5F5',
						borderColor: '#F5F5F5',
						borderRadius: '60rpx',
						margin: 'initial'
					},
					customStyle: {
						backgroundColor: '#6190e8',
						color: '#fff',
						borderColor: '#6190e8',
						borderRadius: '60rpx',
						margin: 'initial'
					},
					currentInfo: {},
					list: []
				},
				formDetail: {},
				layerList: [{
					label: '1层',
					value: 1
				}, {
					label: '2层',
					value: 2
				}, {
					label: '3层',
					value: 3
				}, {
					label: '4层',
					value: 4
				}, {
					label: '5层',
					value: 5
				}],
				swiperCurrent: 0,
				tabCurrent: 0,
				isTabClick: false,
				zhenci_ziduan: '',
				isTab: false,
				imagePopup: false,
				gyImages: []
			}
		},
		computed: {
			isEdit() {
				return this.formDetail.group_id ? false : true
			},
			tabList() {
				return this.tabFormList.map((item, index) => {
					return index + 1 + '层'
				})
			},
			wancheng_state() {
				return this.isTab ? this.tabFormList[this.swiperCurrent].some(form => form.wancheng === true) : this
					.formList.every(form => form.wancheng === true)
			}
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			}
		},
		methods: {
			async initData() {
				if (this.formDetail?.group_id) {
					this.getDetail();
				} else {
					if (!this.parent_obj.group_id) {
						this.gy_popup_info.show = true;
						this.showGyGroupPopup();
					}
				}
				await this.getGroup();
				this.getImages();
			},
			submit(report) {
				// uni.showModal({
				// 	content: '是否确认提交？',
				// 	success: async (e) => {
				// 		if (e.confirm) {
				uni.showLoading({
					title: '提交中'
				});
				this.btnLoading = true;
				api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'write_params',
					args: [
						[]
					],
					kwargs: {
						params: this.isTab ? [this.mapWriteParams()] : this.formList,
						report
					}
				}).then((res) => {
					if (res) {
						uni.showToast({
							title: '提交成功',
							icon: 'success',
							success: () => {
								setTimeout(() => {
									uni.navigateBack();
								}, 1000)
							}
						})
					}
				}).finally(() => {
					setTimeout(() => {
						this.btnLoading = false;
					}, 1000)
					uni.hideLoading();
				})
				// 		}
				// 	}
				// })
			},
			setRead(rowItem, rowIndex) {
				uni.showLoading({
					mask: true
				})
				api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'write_params',
					args: [
						[]
					],
					kwargs: {
						params: this.isTab ? [{
							...this.mapWriteParams(),
							readed: true
						}] : [{
							...rowItem,
							readed: true
						}],
						report: false
					}
				}).then((res) => {
					if (res) {
						if (this.isTab) {
							this.tabFormList[this.tabCurrent][rowIndex].readed = true;
						} else {
							this.formList[rowIndex].readed = true;
						}
					}
				}).finally(() => {
					uni.hideLoading();
				})
			},
			getDetail(item) {
				let param = this.formDetail;
				if (param) {
					this.filterInfo.group_id = param.group_id;
					this.formList = param.params || [];
					let info = {
						...item,
						text: param.name,
					}
					this.gy_popup_info.currentInfo = info;
				}
			},
			async getGroup() {
				uni.showLoading({
					mask: true
				});
				const res = await api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'get_group',
					args: [
						[]
					],
					kwargs: {
						res_model: this.parent_obj.res_model,
						res_id: this.parent_obj.res_id
					}
				})
				uni.hideLoading();
				uni.stopPullDownRefresh();
				if (res?.length) {
					this.gy_popup_info.list = res.map(item => {
						let is_current = false;
						// let param = this.formDetail;
						// this.getDetail(item);
						if (this.gy_popup_info?.currentInfo?.value === item.group_id) {
							is_current = true;
						}
						return {
							text: item.name,
							value: item.group_id,
							checked: is_current,
							readed: item.readed,
							zhenci_ziduan: item.zhenci_ziduan
						}
					});
					// }, 1000)

				} else {
					this.gy_popup_info.list = [];
				}
			},
			async getGroupParams() {
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'get_group_params',
					args: [
						[]
					],
					kwargs: {
						group_id: this.filterInfo.group_id,
						res_id: this.parent_obj.res_id
					}
				})
				if (res?.length) {
					let isTab = res.find(form => form.res_name == '针刺工序' && !isFalse(form.cengci));
					this.isTab = isTab;
					let arr = res.map(item => ({
						...item,
						value: item.value || ''
					}));
					if (this.isTab) {
						this.tabCurrent = this.swiperCurrent = arr.findIndex(form => isFalse(form.wancheng));
						this.tabFormList = Object.values(this.getTabFormList('cengci', arr));
						this.formList = this.tabFormList[this.swiperCurrent];
						this.$nextTick(() => {
							setTimeout(() => {
								uni.hideLoading();
								this.$refs.vTabs.update();
							}, 500)
						});
					} else {
						this.formList = arr;
						setTimeout(() => {
							uni.hideLoading();
						}, 500)
					}
				} else {
					uni.hideLoading();
					uni.showToast({
						title: '暂无参数',
						icon: 'none'
					})
					this.formList = []
				}
			},
			getTabFormList(key, formList) {
				return formList.reduce((result, obj) => {
					const category = obj[key];
					if (!isFalse(category)) {
						result[category] = result[category] || [];
						result[category].push(obj);
						let keys = this.zhenci_ziduan.split(',');
						if (keys.length > 0) {
							keys.forEach((key) => {
								let find = zhenci_ziduan_arr.find(item => item.en == key);
								if (find) {
									result[category].push({
										id: obj.id,
										name: find.zh,
										_key: find.en,
										value: obj[find.en] || '',
										value_type: 'text'
									})
								}
							})
						}
					}
					return result;
				}, {});
			},
			async getImages() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_attachment',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.parent_obj.res_id
					}
				})
				if (res?.length) {
					this.gyImages = res.map((img) => ({
						...img,
						url: baseConfig.baseUrl + img.url
					}));
				}
			},
			mapWriteParams() {
				let obj = {};
				let isFlag = false;
				this.tabFormList[this.tabCurrent].forEach((item) => {
					if (item.id && !isFlag) {
						obj = item;
						isFlag = true;
						return
					}
					obj[item._key] = item.value;
				})
				return obj
			},
			checkChange(item) {
				this.gy_popup_info.isScrollInto = false;
				// let active = this.gy_popup_info.currentInfo.value === item.value;
				// if (active) {
				// 	this.gy_popup_info.currentInfo = {};
				// 	this.$set(item, 'checked', false);
				// } else {
				this.gy_popup_info.list.forEach(l => {
					if (l.value !== item.value) {
						this.$set(l, 'checked', false);
					} else {
						this.gy_popup_info.currentInfo = item;
						this.$set(l, 'checked', true);
					}
				});
				// }
				if (!this.gy_popup_info.isFooter) {
					let matchedInfo = this.gy_popup_info.list.find(item => this.gy_popup_info.currentInfo.value ==
						item.value);
					this.groupPopupConfirm(matchedInfo);
				}
			},
			groupClose() {
				this.gy_popup_info.isScrollInto = false;
			},
			inputNext(index) {
				this.scroll_view = 'input-' + index;
			},
			inputBlur(event, index) {
				let value = event?.detail?.value ?? event;
				if (this.isTab) {
					this.$set(this.tabFormList[this.tabCurrent][index], 'value', value)
				} else {
					this.$set(this.formList[index], 'value', value)
				}
			},
			inputDate(event, index) {
				let value = event?.detail?.value ?? event;
				if (this.isTab) {
					this.$set(this.tabFormList[this.tabCurrent][index], '_date', value)
				} else {
					this.$set(this.formList[index], '_date', value)
				}
			},
			itemDel(index, b_index) {
				uni.showModal({
					content: '是否删除该箱数据？',
					success: (res) => {
						if (res.confirm) {
							this.baseFormData.move_ids_without_package[index].boxes.splice(b_index, 1)
						}
					}
				})
			},
			btnClick() {
				// this.$refs.baseForm.validate().then(res => {
				this.$refs.userPopupRef.open();
				// }).catch(err => {
				// 	console.log('err', err);
				// })
			},
			selectClick() {
				this.getGroup();
				this.gy_popup_info.show = true;
				this.showGyGroupPopup();
			},
			changeTab(index) {
				this.isTabClick = true;
				this.swiperCurrent = index;
				this.tabCurrent = index;
				// uni.showLoading({mask: true});
				// setTimeout(() => {
				this.formList = this.tabFormList[this.swiperCurrent];
				// 	uni.hideLoading();
				// }, 500)
			},
			transition(e) {
				let dx = e.detail.dx;
				if (!this.isTabClick) this.tabCurrent = dx;
			},
			animationfinish(e) {
				this.isTabClick = false;
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.tabCurrent = current;
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
			groupPopupConfirm(e) {
				this.filterInfo.group_id = this.gy_popup_info.currentInfo.value;
				this.zhenci_ziduan = this.gy_popup_info.currentInfo.zhenci_ziduan || '';
				this.gy_popup_info.show = false;
				this.closeGyGroupPopup();
				this.getGroupParams();
			},
			showGyGroupPopup() {
				this.$nextTick(() => {
					this.$refs.gyGroupPopup.open();
				})
			},
			closeGyGroupPopup() {
				this.$refs.gyGroupPopup.close();
			},
			showImage() {
				this.$refs.imagePopup.open();
			},
			previewImage(index) {
				let imgs = this.gyImages.map(img => img.url)
				uni.previewImage({
					urls: imgs,
					current: index
				});
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
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
				// this.inputDate('2024-10-30', 0)
			}
		},
		async onLoad(options) {
			if (options.detail) {
				let detail = JSON.parse(decodeURIComponent(options.detail))
				this.formDetail = detail
			}
			let param = options.param ? JSON.parse(options.param) : {};
			this.parent_obj = {
				...param
			}
			this.initData();
			uni.$on('requestErrorConfirm', () => {
				uni.switchTab({
					url: '/pages/tqgf/application/production/index'
				});
			})
			// uni.hideTabBar();
		},
		onReady() {
			// setTimeout(() => {
			// 	this.scanStart();
			// }, 300)
		},
		onUnload() {
			uni.$off('requestErrorConfirm');
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
		onPullDownRefresh() {
			this.initData();
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

	.dataReport-page {

		.container {
			.filter-container {
				width: 100%;
				background-color: #fff;
				padding: 20rpx;
				border-bottom: 1px solid rgba(181, 181, 181, .1);
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

		.custom-btn {
			background-color: $primary-color;
			border-color: $primary-color;
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
			border-top: 1px solid rgba(181, 181, 181, .1);
			z-index: 1;

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

		.image-popup {
			.head {
				padding: 25rpx 80rpx 20rpx;
				font-size: 32rpx;
				font-weight: bold;
				background-color: #fff;
				text-align: center;
			}

			.content {
				width: 95vw;
				height: 630rpx;
				padding: 0 25rpx 25rpx;

				.image-box {
					display: flex;
					flex-wrap: wrap;
				}

				.image-item {
					width: 30%;
					margin: 10rpx;

					image {
						background-color: #eeeeee;
						border: 1px solid #bebebe;
						box-shadow: 0 0 10rpx #eee;
					}

					.text {
						text-align: center;
					}
				}
			}
		}

		.gy-group-popup {
			.head {
				padding: 25rpx 80rpx 20rpx;
				font-size: 32rpx;
				font-weight: bold;
				background-color: #fff;
				text-align: center;
			}

			.content {
				padding: 24rpx;
				text-align: center;
				background-color: $page-color-light;

				.item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					background-color: #fff;
					margin-bottom: 20rpx;
					padding: 20rpx 40rpx;
					font-weight: bold;
					box-shadow: 0px 0px 0px #ddd;
					transition: all .1s linear;

					/deep/ .u-checkbox {
						flex-direction: row-reverse;
					}

					&.active {
						background-color: $primary-color;
						color: #fff;
					}
				}
			}

			.footer {
				background-color: #fff;
				padding: 20rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
</style>