<template>
	<uni-forms class="fast-form" label-width="100">
		<slot></slot>
		<uni-forms-item :label="form.name" v-for="(form, index) in formList" :id="'input-'+index" :key="index">
			<uni-easyinput v-if="form.value_type == 'text' || form.value_type == 'number'" v-model="form.value"
				:styles="easyinputStyles" :type="form.value_type == 'text' ? 'textarea' : form.value_type"
				:autoHeight="true" :maxlength="-1" :confirm-type="confirmType" :focus="focus_index === index"
				:disabled="form.readonly" clearSize="22" placeholder="" @blur="(event) => inputBlur(event, index)"
				@focus="inputFocus(index)" @confirm="inputNext(index)"></uni-easyinput>
			<zxz-uni-data-select v-else-if="form.value_type == 'bool'" class="fast-select" v-model="form.value"
				:localdata="booleanSelectList" :clear="false" placeholder=" "></zxz-uni-data-select>
			<zxz-uni-data-select v-else-if="form.value_type == 'selector'" v-model="form.value"
				:localdata="mapSelectionList(form.selection)" :clear="false" placeholder=" "></zxz-uni-data-select>
			<!-- <uni-data-checkbox v-else-if="form.value_type == 'checked'" v-model="form.value"
				:localdata="mapCheckList(form.check)" @change="change"></uni-data-checkbox> -->
			<view v-if="form._date">{{form._date}}</view>
			<slot name="right" :rowItem="form" :rowIndex="index"></slot>
		</uni-forms-item>
		<!-- #ifdef APP-PLUS -->
		<qs-scanlistener></qs-scanlistener>
		<!-- #endif -->
	</uni-forms>
</template>

<script>
	export default {
		props: {
			formList: {
				type: Array,
				default: () => []
			},
		},
		data() {
			return {
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				focus_index: -1,
				confirmType: 'next',
				booleanSelectList: [{
					text: '是',
					value: '是'
				}, {
					text: '否',
					value: '否'
				}]
			}
		},
		methods: {
			inputNext(index) {
				if (index + 1 > this.formList.length) {
					this.focus_index = -1;
					return
				}
				this.focus_index = Number(index) + 1;
				this.$emit('inputNext', this.focus_index)
			},
			inputFocus(index) {
				this.focus_index = index;
				if (index + 1 == this.formList.length) {
					this.confirmType = 'done'
				} else {
					this.confirmType = 'next'
				}
			},
			inputChange(event, index) {
				// this.$emit('inputBlur', event, index);
				return event
			},
			inputBlur(event, index) {
				this.focus_index = -1;
				// this.$emit('inputBlur', event, index)
			},
			mapSelectionList(selection) {
				let selection_list = [];
				if (selection) {
					let selections = selection.split('|');
					selection_list = selections.map((s, index) => ({
						text: s,
						value: s
					}))
				}
				return selection_list
			},
			mapCheckList(check) {
				let check_list = [];
				if (check) {
					let checks = check.split('|');
					check_list = checks.map((c, index) => ({
						text: c,
						value: c
					}))
				}
				return check_list
			},
			setDate(date) {
				let value = date;
				this.$emit('inputDate', value, this.focus_index);
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							if (this.focus_index > -1) {
								let fill = this.$mHelper.scanInputFill(scanCode);
								if (fill.date) {
									this.setDate(fill.str);
								} else {
									let value = this.formList[this.focus_index].value + ' ' + fill.str;
									this.$emit('inputBlur', value, this.focus_index);
								}
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
		},
		created() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		beforeDestroy() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		}
	}
</script>

<style lang="scss">
	.fast-form {
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

		/deep/.label-text {
			// word-break: break-all;
			word-break: auto-phrase;
			font-size: 26rpx;
		}

		/deep/ .uni-select {
			border-color: #a7a7a7;
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

			.uni-easyinput__content-textarea {
				height: auto;
				min-height: initial;
			}
		}

		/deep/ .is-disabled {
			background-color: #f8f8f8;
			color: #6a6a6a;
		}

		/deep/ .checklist-box.is-disable {
			opacity: .8 !important;
		}
	}
</style>