<template>
	<u-dropdown-item :title="catetoryTitle || title || '产品分类'">
		<view class="slot-content">
			<scroll-view scroll-y="true" style="height: 400rpx;">
				<view class="item-box">
					<view v-for="(item, index) in catetoryList" :key="index"
						:class="['item', item.value === catetory ? 'active' : '']" @click="catetoryClick(item)">
						{{item.label}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="option-btn">
			<u-button class="btn" @click="catetorySelectClose">取消</u-button>
			<u-button class="btn" type="primary" @click="catetorySelect">确定</u-button>
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
				catetory: null,
				category_list: []
			}
		},
		watch: {
			value: {
				handler(val) {
					this.catetory = val;
				},
				immediate: true
			}
		},
		computed: {
			catetoryTitle() {
				return this.catetoryList.find(item => this.value != null && (item.value?.length > 0 ? item.value[0] : item
					.value) === this.value)?.label ?? ''
			},
			catetoryList() {
				let all = [{
					label: '全部',
					value: null
				}]
				let catetory_list = this.category_list.map((catetory) => {
					return {
						label: catetory.name,
						value: this.valueKey ? catetory[this.valueKey] : catetory.id
					}
				})
				return this.category_list.length > 0 ? [...all, ...catetory_list] : []
			},
		},
		methods: {
			catetoryClick(catetory) {
				this.catetory = catetory.value;
			},
			catetorySelect() {
				this.$emit('confirm', this.catetory);
			},
			catetorySelectClose() {
				this.catetory = this.value
				this.$emit('close');
			},
		},
		created() {
			const Model = api.env.model('product.category');
			let domain = [];
			if(this.name === 'incoming_check') {
				domain = [
					...domain,
					["incoming_check", "=", true]
				]
			}
			Model.search_read({
				domain,
				fields: []
			}).then((res) => {
				if (res?.length > 0) {
					this.category_list = res
				}
			})
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