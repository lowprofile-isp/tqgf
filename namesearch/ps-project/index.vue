<template>
	<view>
		<u-form-item label="加工项目" label-width="190">
			<u-input v-model="form.name" :border="border"  height="50" input-align="right"
				placeholder="请选择" @click="Search" />
			<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
		</u-form-item>
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
				sale_processing_items: {},
			}
		},
		methods: {
			Search() {
				this.show = true
				this.list = []
				const Model = api.env.model('sale.extense.attribute.value')
				Model.name_search({
					args: [
						['attribute_type_id', '=', 2]
					],
					name: '',
				}).then(res => {
					for (var i = 0; i < res.length; i++) {
						this.list.push({
							label: res[i][1],
							value: i
						})
						this.sale_processing_items[res[i][1]] = res[i][0]
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
