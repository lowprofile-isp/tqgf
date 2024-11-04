<template>
	<custom-bottom-popup ref="customBottomPopup" :title="title" mode="bottom" closeable @confirm="confirm"
		@close="close">
		<scroll-view scroll-y="true" style="height: 60vh;"
			:scroll-into-view="isScrollInto && currentUser.length > 0 ? 'userItem-'+currentUser[0] : ''">
			<empty v-if="list.length <= 0"></empty>
			<view v-else-if="tagStyle" class="tag-box">
				<u-tag class="tag-style ellipsis" :id="'userItem-'+item.id" v-for="(item, index) in list" :key="item.id"
					@click="checkChange(item)" :text="item.name" :mode="item.checked ? 'dark' : 'plain'" />
			</view>
			<view v-else class="item" :id="'userItem-'+item.id" v-for="(item, index) in list" @click="checkChange(item)"
				:key="item.id">
				<view>{{item.name}}</view>
				<u-checkbox v-model="item.checked" active-color="#6190e8"></u-checkbox>
			</view>
		</scroll-view>
	</custom-bottom-popup>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import customBottomPopup from '@/components/custom-bottom-popup/index.vue';
	export default {
		props: {
			defaultValue: {
				type: Array,
				default: () => []
			},
			title: {
				type: String,
				default: '库位选择'
			},
			multiple: {
				type: Boolean,
				default: false
			},
			isFooter: {
				type: Boolean,
				default: true
			},
			tagStyle: {
				type: Boolean,
				default: false
			},
			kw: {
				type: Object,
				default: () => {}
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
				currentUser: [],
				list: []
			}
		},
		watch: {
			'kw.barcode': {
				handler(val) {
					this.getList();
				},
			}
		},
		computed: {
			...mapGetters(['uid'])
		},
		methods: {
			async getList() {
				// const res = await api.web.dataset.call_kw({
				// 	model: 'res.users',
				// 	method: 'name_search',
				// 	args: [
				// 		[]
				// 	],
				// 	kwargs: {}
				// })
				let kw = this.kw || {}
				const res = await api.web.dataset.call_kw({
					model: 'stock.location',
					method: 'get_sub_production_locations',
					args: [
						[]
					],
					kwargs: {
						...kw
					}
				})
				if (res && res.length > 0) {
					let currentUser = [];
					this.list = res.map(r => {
						let item = {
							id: r.id,
							name: r.name
						}
						let default_arr = this.defaultValue?.length > 0 ? this.defaultValue : []
						let is_current = default_arr.length > 0 ? default_arr.indexOf(
							item.id) > -1 : false;
						// item.id === uni.getStorageSync('currentUser').uuid
						if (this.defaultValue?.indexOf(item.id) > -1) {
							currentUser.push(item.id);
						} else {
							if (is_current) {
								currentUser = [item.id];
							}
						}
						return {
							...item,
							checked: is_current
						}
					});
					this.currentUser = currentUser;
				} else {
					this.list = [];
				}
			},
			checkChange(item) {
				this.isScrollInto = false;
				let active = this.currentUser.indexOf(item.id);
				if (active > -1) {
					if (this.multiple) {
						this.currentUser.splice(active, 1);
						this.$set(item, 'checked', false);
					} else {
						this.$set(item, 'checked', true);
					}
				} else {
					if (this.multiple) {
						this.currentUser.push(item.id);
						this.$set(item, 'checked', true);
					} else {
						this.list.forEach(l => {
							if (l.id !== item.id) {
								this.$set(l, 'checked', false);
							} else {
								this.currentUser = [item.id];
								this.$set(l, 'checked', true);
								this.confirm();
							}
						});
					}
				}
				if (!this.isFooter) {
					this.confirm();
				}
				// if (this.currentUser.includes(item.id)) {
				// 	this.currentUser = this.currentUser.filter(c => c != item.id);
				// 	this.$set(item, 'checked', false);
				// } else {
				// 	this.currentUser.push(item.id);
				// 	this.$set(item, 'checked', true);
				// }
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
				let matchedUser = this.list.filter(item => this.currentUser.includes(item.id));
				this.$emit('confirm', matchedUser);
			}
		},
		created() {
			this.getList();
		}
	}
</script>

<style lang="scss" scoped>
	.custom-bottom-popup {
		.tag-box {
			padding: 30rpx;
			text-align: left;

			.tag-style {
				margin-bottom: 10rpx;
				font-size: 32rpx;
				max-width: 100%;

				&:not(:last-child) {
					margin-right: 20rpx;
				}
			}
		}
	}
</style>