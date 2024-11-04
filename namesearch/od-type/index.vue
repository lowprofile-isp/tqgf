<template>
	<view>
		<u-form-item label="订单类型" label-width="190">
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
				list: [{
					label: '新制',
					value: 'new'
				}, {
					label: '复投',
					value: 'repeat'
				}, {
					label: '维修',
					value: 'repair'
				}, {
					label: '代采',
					value: 'purchase'
				}],
				text: '请选择',
				sale_production_type: {
					新制: 'new',
					复投: 'repeat',
					维修: 'repair',
					代采: 'purchase',
				},
			}
		},
		methods: {
			Search() {
				this.show = true
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
		/* color: #959595; */
		font-size: 22upx;
	}
</style>
