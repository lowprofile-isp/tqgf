<template>
	<u-popup class="department-popup" v-model="show" mode="bottom" closeable @close="close">
		<view class="head">
			<text>{{title}}</text>
		</view>
		<view class="content">
			<scroll-view scroll-y="true" style="height: 600rpx;"
				:scroll-into-view="isScrollInto && current.length > 0 ? 'userItem-'+current[0] : ''">
				<view class="item" :id="'userItem-'+item.id" v-for="(item, index) in list" @click="checkChange(item)">
					<view>{{item.name}}</view>
					<u-checkbox v-model="item.checked" active-color="#6190e8"></u-checkbox>
				</view>
			</scroll-view>
		</view>
		<view class="footer">
			<u-button :custom-style="cancelStyle" size="medium" hover-class="none" :hair-line="false"
				@click="show = false">取消</u-button>
			<u-button :custom-style="customStyle" size="medium" hover-class="none" :hair-line="false"
				@click="confirm">确定</u-button>
		</view>
	</u-popup>
</template>

<script>
	import api from '@/odooapi';
	export default {
		props: {
			title: {
				type: String,
				default: '部门'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			require: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				show: false,
				isScrollInto: false,
				cancelStyle: {
					backgroundColor: '#F5F5F5',
					borderColor: '#F5F5F5',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				customStyle: {
					backgroundColor: '#6190e8',
					color: '#fff',
					borderColor: '#6190e8',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				current: [],
				list: []
			}
		},
		methods: {
			async getList() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.abnormal',
					method: 'get_departments',
					args: [
						[]
					],
					kwargs: {}
				})
				if (res && res.length > 0) {
					this.list = res.map(item => {
						return {
							...item,
							checked: false
						}
					})
				}
			},
			checkChange(item) {
				this.isScrollInto = false;
				let active = this.current.findIndex(c => c.name === item.name);
				if (active > -1) {
					this.current.splice(active, 1);
					this.$set(item, 'checked', false);
				} else {
					if (this.multiple) {
						this.current.push(item);
						this.$set(item, 'checked', true);
					} else {
						this.list.forEach(l => {
							if (l.name !== item.name) {
								this.$set(l, 'checked', false);
							} else {
								this.current = [item];
								this.$set(l, 'checked', true);
							}
						});
					}
				}
			},
			open() {
				this.isScrollInto = true;
				this.show = true;
			},
			close() {
				this.isScrollInto = false;
			},
			confirm() {
				if (this.require && this.current.length <= 0) {
					uni.showToast({
						title: '请选择部门',
						icon: 'none'
					})
					return
				}
				this.show = false;
				this.$emit('confirm', this.multiple ? this.current : this.current.length > 0 ? this.current[0] : null);
			}
		},
		created() {
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.department-popup {
		.head {
			padding: 25rpx 80rpx 20rpx;
			font-size: 32rpx;
			font-weight: bold;
			background-color: #fff;
			text-align: center;
		}

		.content {
			padding: 24rpx;
			text-align: center;
			background-color: $page-color-light;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: #fff;
				margin-bottom: 20rpx;
				padding: 20rpx 40rpx;
				font-weight: bold;
				box-shadow: 0px 0px 0px #ddd;

				/deep/ .u-checkbox {
					flex-direction: row-reverse;
				}
			}
		}

		.footer {
			background-color: #fff;
			padding: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>