<template>
	<view style="width: 100%;">
		<u-input v-model="label" :border="border" height="50" :placeholder="placeholder" type="select"
			@click="selectClick" />
		<u-select v-model="show" :default-value="default_value" :list="list" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mrp_loss_list
	} from '@/config/map.data.js';
	export default {
		props: {
			border: {
				type: Boolean,
				default: false
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			change: {
				type: Function,
				default: () => {}
			},
			defaultValue: {
				type: null
			}
		},
		data() {
			return {
				value: this.defaultValue,
				show: false,
				list: [],
				default_value: [0]
			}
		},
		computed: {
			label: {
				get() {
					return this.list.find(item => item.value == this.value)?.label || ''
				},
				set(newVal) {

				}

			}
		},
		created() {
			this.initData();
		},
		methods: {
			initData() {
				const Model = api.env.model('mrp.workcenter.productivity.loss');
				Model.name_search({
					args: [
						["manual", "=", true]
					],
					name: ''
				}).then(res => {
					if (res?.length) {
						// const result = res.reduce((prev, next) => {
						// 	const item = mrp_loss_list.find(i => i.value === next[1]);
						// 	if (item) {
						// 		prev.push({
						// 			...item,
						// 			value: next[0]
						// 		});
						// 	}
						// 	return prev;
						// }, []);
						this.list = res.map((item) => {
							return {
								label: item[1],
								value: item[0]
							}
						});
						this.default_value = [this.list.findIndex(item => item.value === this.defaultValue)];
					}
				})
			},
			selectClick() {
				this.show = true;
				this.initData();
			},
			confirm(e) {
				let loss = !e[0].value ? this.list[0] : e[0];
				this.value = loss.value;
				this.default_value = [this.list.findIndex(item => item.value == this.value)];
				this.$emit('change', loss);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.input_class {
		color: $uni-color-primary;
		font-size: 22upx;
	}
</style>