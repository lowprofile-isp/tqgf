<template>
	<!-- 阻塞上报弹窗 -->
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-popup v-model="show" :mode="mode">
			<view class="clog-container">
				<u-form :model="clogFormInfo" ref="uForm" :label-width="220">
					<u-form-item label="损失原因" prop="loss_id" required>
						<mrp-loss :default-value="clogFormInfo.loss_id" @change="lossChange"
							placeholder="请选择损失原因"></mrp-loss>
					</u-form-item>
					<u-form-item label="描述" prop="description">
						<u-input v-model="clogFormInfo.description" type="textarea" placeholder="请填写描述信息..." />
					</u-form-item>
					<!-- <u-form-item label="附件照片" prop="img">
				<custom-upload></custom-upload>
			</u-form-item> -->
				</u-form>
				<u-button style="width: 100%;" type="primary" :loading="btnLoading" @click="onSubmit">提交</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import mrpLoss from '@/namesearch/mrp-loss/index.vue';
	export default {
		props: {
			value: {
				type: Boolean,
				default: false
			},
			mode: {
				type: String,
				default: 'bottom'
			},
			rowItem: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		components: {
			mrpLoss
		},
		data() {
			return {
				btnLoading: false,
				clogFormInfo: {
					loss_id: null,
					description: '',
					img: null
				},
				lossInfo: {},
				fileList: [],
				rules: {
					loss_id: [{
						required: true,
						message: '请选择阻塞原因',
						trigger: 'change'
					}],
				},
			}
		},
		computed: {
			show: {
				get() {
					return this.value;
				},
				set(val) {
					if(val) {
						this.setRules();
					}
					this.$emit('input', val);
				}
			}
		},
		methods: {
			setRules() {
				this.$nextTick(function() {
					this.$refs.uForm.setRules(this.rules);
				})
			},
			popupClose() {
				this.show = false;
				this.clogFormInfo = {
					loss_id: null,
					desc: '',
					img: null
				}
			},
			clogSubmit() {
				this.btnLoading = true;
				const Model = api.env.model('mrp.workcenter.productivity');
				Model.create({
					workorder_id: this.rowItem.id,
					loss_id: Number(this.clogFormInfo.loss_id),
					workcenter_id: this.rowItem.workcenter_id[0],
					description: this.clogFormInfo.desc,
					company_id: uni.getStorageSync('company_id')
				}).then((res) => {
					Model.call_button('button_block', [res]).then((result) => {
						if (result == null) {
							return
						}
						// this.$refs.uTips.show({
						// 	title: '已提交',
						// 	type: 'success',
						// 	duration: '1500'
						// })
						uni.showToast({
							title: '已提交',
							icon: 'success'
						})
						this.popupClose();
						this.$emit('confirm');
					}).finally(() => {
						this.btnLoading = false;
					})
				})
			},
			onSubmit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						if (this.lossInfo.label == '返回上一工序') {
							uni.showModal({
								title: '提示',
								content: '是否返回上一工序？',
								success: (res) => {
									if (res.confirm) {
										this.clogSubmit();
									}
								}
							})
						} else {
							this.clogSubmit();
						}
					}
				});
			},
			lossChange(loss) {
				this.lossInfo = loss || {};
				this.clogFormInfo.loss_id = this.lossInfo.value ? this.lossInfo.value + '' : null;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.clog-container {
		padding: 40rpx;
		height: 800rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>