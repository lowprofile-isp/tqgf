<template>
	<custom-bottom-popup ref="customBottomPopup" :title="title" mode="bottom" closeable @confirm="confirm"
		@close="close">
			<scroll-view scroll-y="true" style="height: 600rpx;"
				:scroll-into-view="isScrollInto && current.length > 0 ? 'userItem-'+current[0] : ''">
				<view class="item" :id="'userItem-'+item.id" v-for="(item, index) in list" @click="checkChange(item)">
					<view>{{item.name}}</view>
					<u-checkbox v-model="item.checked" active-color="#6190e8"></u-checkbox>
				</view>
			</scroll-view>
	</custom-bottom-popup>
</template>

<script>
	import api from '@/odooapi';
	import customBottomPopup from '@/components/custom-bottom-popup/index.vue';
	export default {
		props: {
			title: {
				type: String,
				default: '周转备注'
			},
			multiple: {
				type: Boolean,
				default: false
			}
		},
		components: {
			customBottomPopup
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
					model: 'stock.move',
					method: 'get_move_note',
					args: [
						[]
					],
					kwargs: {}
				})
				if (res && res.length > 0) {
					this.list = res.map(item => {
						return {
							name: item,
							checked: false
						}
					})
				}
			},
			checkChange(item) {
				this.isScrollInto = false;
				let active = this.current.indexOf(item.name);
				if (active > -1) {
					this.current.splice(active, 1);
					this.$set(item, 'checked', false);
				} else {
					if (this.multiple) {
						this.current.push(item.name);
						this.$set(item, 'checked', true);
					} else {
						this.list.forEach(l => {
							if (l.name !== item.name) {
								this.$set(l, 'checked', false);
							} else {
								this.current = [item.name];
								this.$set(l, 'checked', true);
								this.confirm();
							}
						});
					}
				}
			},
			open() {
				this.isScrollInto = true;
				this.$refs.customBottomPopup.show = true;
			},
			close() {
				this.isScrollInto = false;
				this.$emit('close');
			},
			confirm() {
				this.$refs.customBottomPopup.show = false;
				this.$emit('confirm', this.multiple ? this.current : this.current.length > 0 ? this.current[0] : null);
			}
		},
		created() {
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	
</style>