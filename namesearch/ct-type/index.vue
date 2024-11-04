<template>
	<view>
		<u-form-item label="成本类型" label-width="190">
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
				chengbenleixing: {},
			}
		},
		methods: {
			Search() {
				this.show = true
				this.list = []
				const Model = api.env.model('chengben.leixing')
				const company_id = uni.getStorageSync('company_id')
				Model.search_read({
					domain: [
						['company_id', '=', company_id]
					],
					fields: ['name'],
				}).then(res => {
					console.log(res)
					for (var i = 0; i < res.length; i++) {
						this.list.push({
							label: res[i].name,
							value: i
						})
						this.chengbenleixing[res[i].name] = res[i].id
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
