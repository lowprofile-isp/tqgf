<template>
	<!-- 修理完成备注弹窗 -->
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-popup v-model="show" :mode="mode">
			<view class="repair-container">
				<u-form :model="repairFormInfo" ref="uForm" :label-width="220">
					<u-form-item label="完工处理">
						<u-radio-group v-model="currentValue">
							<u-radio v-for="(item, index) in selectList" :key="index" :name="item.name"
								:disabled="item.disabled">
								{{item.label}}
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item v-if="currentValue === 1" label="返修备注" prop="description">
						<u-input v-model="repairFormInfo.description" type="textarea" placeholder="请填写返修备注..." />
					</u-form-item>
				</u-form>
				<u-button style="width: 100%;" type="primary" :loading="btnLoading" @click="onSubmit">提交</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import api from '@/odooapi';
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
		data() {
			return {
				btnLoading: false,
				repairFormInfo: {
					description: ''
				},
				rules: {},
				selectList: [{
					name: 1,
					label: '技术判定'
				},{
					name: 2,
					label: '完工送检'
				}],
				currentValue: 1
			}
		},
		computed: {
			show: {
				get() {
					return this.value;
				},
				set(val) {
					if (val) {
						this.setRules();
					}
					this.$emit('input', val);
				}
			}
		},
		methods: {
			initData() {
				// const Model = api.env.model('mrp.production.note.type');
				// Model.name_search({
				// 	args: [],
				// }).then(res => {
				// 	if (res?.length) {
				// 		this.selectList = res.map((item) => {
				// 			return {
				// 				label: item[1],
				// 				name: item[0]
				// 			}
				// 		});
				// 		this.currentValue = this.selectList[0].name;
				// 	}
				// })
			},
			setRules() {
				this.$nextTick(function() {
					this.$refs.uForm.setRules(this.rules);
				})
			},
			popupClose() {
				this.show = false;
				this.repairFormInfo = {
					description: null,
				}
			},
			repairSubmit() {
				this.btnLoading = true;
				const Model = api.env.model('mrp.production.note');
				Model.create({
					type_id: this.currentValue,
					production_note: this.repairFormInfo.description
				}).then((result) => {
					uni.showToast({
						title: '已提交',
						icon: 'success'
					})
					this.popupClose();
					this.$emit('confirm');
				}).finally(() => {
					this.btnLoading = false;
				})
			},
			onSubmit() {
				if (this.currentValue === 1) {
					// this.repairSubmit()
					this.callButton('do_repaired', this.rowItem)
				} else if (this.currentValue === 2) {
					this.callButton('button_recheck', this.rowItem)
				}
				// this.$refs.uForm.validate(valid => {
				// 	if (valid) {

				// 	}
				// });
			},
			async callButton(buttonType, row) {
				this.btnLoading = true;
				const Model = api.env.model('mrp.production');
				const id = row.id;
				try {
					let res = await Model.call_button(buttonType, [id], buttonType === 'do_repaired' ? {
						production_note: this.repairFormInfo.description
					} : {});
					if (res === false) {
						if (buttonType === 'button_recheck') {
							uni.showToast({
								title: '已送检',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: '已提交',
								icon: 'success'
							})
						}
						this.popupClose();
						this.$emit('confirm');
					}
				} catch (e) {}
				this.btnLoading = false;
			},
		},
		created() {
			this.initData();
		}
	}
</script>
<style lang="scss" scoped>
	.repair-container {
		padding: 40rpx;
		height: 800rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>