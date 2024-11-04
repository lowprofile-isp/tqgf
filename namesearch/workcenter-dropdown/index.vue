<template>
	<u-dropdown-item :title="workcenterTitle || title || '工序'">
		<view class="slot-content">
			<scroll-view scroll-y="true" style="height: 400rpx;">
				<view class="item-box">
					<view v-for="(item, index) in workcenterList" :key="index"
						:class="['item', item.value === workcenter ? 'active' : '']" @click="workcenterClick(item)">
						{{item.label}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="option-btn">
			<u-button class="btn" @click="workcenterSelectClose">取消</u-button>
			<u-button class="btn" type="primary" @click="workcenterSelect">确定</u-button>
		</view>
	</u-dropdown-item>
</template>

<script>
	import api from '@/odooapi';
	export default {
		props: {
			name: {
				default: ''
			},
			value: {
				default: null
			},
			title: {
				type: String,
				default: ''
			},
			valueKey: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				workcenter: null,
				workcenter_list: []
			}
		},
		watch: {
			value: {
				handler(val) {
					this.workcenter = val;
				},
				immediate: true
			}
		},
		computed: {
			workcenterTitle() {
				return this.workcenterList.find(item => this.value != null && (item.value?.length > 0 ? item.value[0] : item
					.value) === this.value)?.label ?? ''
			},
			workcenterList() {
				let all = [{
					label: '全部',
					value: null
				}]
				let workcenter_list = this.workcenter_list.map((workcenter) => {
					return {
						label: workcenter.name,
						value: this.valueKey ? workcenter[this.valueKey] : workcenter.value
					}
				})
				return this.workcenter_list.length > 0 ? [...all, ...workcenter_list] : []
			},
		},
		methods: {
			workcenterClick(workcenter) {
				this.workcenter = workcenter.value;
			},
			workcenterSelect() {
				this.$emit('confirm', this.workcenter);
			},
			workcenterSelectClose() {
				this.workcenter = this.value
				this.$emit('close');
			},
		},
		async created() {
			const res = await api.web.dataset.call_kw({
				model: 'mrp.process',
				method: 'get_operation_list',
				args: [],
				kwargs: {}
			})
			if (res?.length > 0) {
				let list = res.map((w) => ({
					name: w.process_name,
					value: w.process_id
				}))
				this.workcenter_list = [...list];
			}
		},
	}
</script>

<style lang="scss" scoped>
	.slot-content {
		background-color: #fff;
		padding: 16rpx;

		.item-box {
			margin-bottom: 36rpx;
			display: flex;
			flex-wrap: wrap;

			.item {
				border: 1px solid #ccc;
				color: #666;
				padding: 8rpx 28rpx;
				border-radius: 72rpx;
				margin: 20rpx 10rpx 0;

				&.active {
					color: #fff;
					background-color: $uni-color-primary;
					border-color: $uni-color-primary;
				}
			}
		}
	}

	.option-btn {
		display: flex;
		background-color: #fff;

		.btn {
			flex: 1;
			border-radius: 0;

			&::after {
				border-radius: 0;
				border: none;
				border-top: 1px solid $border-color-base;
			}

			&:last-child {
				&::after {
					border-left: 1px solid;
					border-color: $uni-color-primary;
				}
			}
		}
	}
</style>