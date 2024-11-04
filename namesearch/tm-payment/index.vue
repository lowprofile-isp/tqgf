<template>
	<view>
		<u-form-item label="付款方式" label-width="190">
			<u-input v-model="form.name" :border="border"  height="50" input-align="right"
				placeholder="请选择" @click="Search" />
			<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		</u-form-item>
		<!-- <u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		<input type="text" value="请选择" class="input_class" @click="Search" v-model="text" /> -->
	</view>
</template>

<script>
	import api from '@/odooapi'
	export default {
		data() {
			return {
				height: 0,
				type: 'text',
				border: false,
				form: {
					name: '',
					intro: '',
				},
				show: false,
				list: [],
				text: '请选择',
				payment_term_id: {},
			}
		},
		methods: {
			Search() {
				this.show = true
				this.list = []
				const Model = api.env.model('account.payment.term')
				Model.name_search({
					args: [
					],
					name: '',
				}).then(res => {
					for (var i = 0; i < res.length; i++) {
						this.list.push({
							label: res[i][1],
							value: i
						})
						this.payment_term_id[res[i][1]] = res[i][0]
					}
				})
			},
			confirm(e) {
				if (!JSON.parse(JSON.stringify(e))[0].label) {
					this.form.name = this.list[0].label
					this.text = this.list[0].label
				} else {
					this.form.name = JSON.parse(JSON.stringify(e))[0].label;
					this.text = JSON.parse(JSON.stringify(e))[0].label;
				}
			},
		}
	}
</script>

<style>
	.input_class {
		text-align: right;
		color: #959595;
		font-size: 22upx;
	}
</style>
