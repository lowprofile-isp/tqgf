<template>
	<u-dropdown-item :title="userTitle || title || '人员筛选'">
		<view class="slot-content">
			<scroll-view scroll-y="true" style="height: 200rpx;">
				<view class="item-box">
					<view v-for="(item, index) in userList" :key="index"
						:class="['item', item.value === user ? 'active' : '']" @click="userClick(item)">
						{{item.label}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="option-btn">
			<u-button class="btn" @click="userSelectClose">取消</u-button>
			<u-button class="btn" type="primary" @click="userSelect">确定</u-button>
		</view>
	</u-dropdown-item>
</template>

<script>
	export default {
		props: {
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
				user: null,
			}
		},
		watch: {
			value: {
				handler(val) {
					this.user = val;
				},
				immediate: true
			}
		},
		computed: {
			userTitle() {
				return this.userList.find(item => this.value != null && (item.value?.length > 0 ? item.value[0] : item
					.value) === this.value)?.label ?? ''
		}, 
		userList() {
			let all = [{
				label: '全部',
				value: null
			}]
			let user_list = this.$mStore.state.user.employeeList.map((user) => {
				return {
					label: user.name,
					value: this.valueKey ? user[this.valueKey] : user.id
				}
			})
			return this.$mStore.state.user.employeeList.length > 0 ? [...all, ...user_list] : []
		},
	},
	methods: {
			// 人员选择
			userClick(user) {
				this.user = user.value;
			},
			// 人员筛选
			userSelect() {
				this.$emit('confirm', this.user);
			},
			// 人员选择取消
			userSelectClose() {
				this.user = this.value
				this.$emit('close');
			},
		},
		created() {
			this.$mStore.dispatch('user/getEmployeeList');
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