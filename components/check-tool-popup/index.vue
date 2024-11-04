<template>
	<custom-bottom-popup ref="customBottomPopup" :title="title" clear-text="清除选择" mode="bottom" closeable @confirm="confirm"
		@clear="clear" @close="close">
		<scroll-view scroll-y="true" style="height: 800rpx;"
			:scroll-into-view="isScrollInto && currentUser.length > 0 ? 'userItem-'+currentUser[0] : ''">
			<u-loading v-if="loading" style="position: absolute; top: 40%; left: 50%;"
				:color="$mStore.state.themeColor.color" size="44" mode="circle"></u-loading>
			<template v-else-if="list.length">
				<view class="item" :id="'userItem-'+item.id" v-for="(item, index) in list" @click="checkChange(item)">
					<view>{{item.display_name}}</view>
					<u-checkbox v-model="item.checked" active-color="#6190e8"></u-checkbox>
				</view>
			</template>
			<empty v-else></empty>
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
				default: '工具选择'
			},
			multiple: {
				type: Boolean,
				default: false
			},
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
				loading: false,
				currentUser: [],
				list: []
			}
		},
		computed: {
			...mapGetters(['uid'])
		},
		methods: {
			async getList() {
				const Model = api.env.model('product.product')
				const company_id = uni.getStorageSync('company_id')
				const res = await Model.search_read({
					domain: [
						// ['company_id', '=', company_id],
						['categ_id.name', '=', '计量器具'],
						['department_id', '=', 3]
					],
					fields: ["id", "display_name"]
				})
				this.loading = false;
				if (res && res.length > 0) {
					let currentUser = [];
					console.log(this.defaultValue)
					this.list = res.map(r => {
						let default_arr = this.defaultValue?.length > 0 ? this.defaultValue : []
						let is_current = default_arr.length > 0 ? default_arr.indexOf(
							r.id) > -1 : false;
						if (is_current) {
							currentUser.push(r.id);
						}
						return {
							...r,
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
					this.currentUser.splice(active, 1);
					this.$set(item, 'checked', false);
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
				this.loading = true;
				setTimeout(() => {
					this.getList();
				}, 500)
			},
			close() {
				this.isScrollInto = false;
			},
			confirm() {
				this.$refs.customBottomPopup.show = false;
				let matchedUser = this.list.filter(item => this.currentUser.includes(item.id));
				this.$emit('confirm', matchedUser);
			},
			clear() {
				this.$emit('confirm');
			}
		},
		created() {
			// this.getList();
		}
	}
</script>

<style lang="scss" scoped>

</style>