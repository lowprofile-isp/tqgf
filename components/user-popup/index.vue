<template>
	<custom-bottom-popup ref="customBottomPopup" :title="title" mode="bottom" closeable @confirm="confirm"
		@close="close">
		<scroll-view scroll-y style="height: 800rpx;"
			:scroll-into-view="isScrollInto && currentUser.length > 0 ? scrollView : ''">
			<u-loading v-if="loading" style="position: absolute; top: 40%; left: 50%;"
				:color="$mStore.state.themeColor.color" size="44" mode="circle"></u-loading>
			<template v-else-if="list.length">
				<view class="item" :id="'userItem-'+item.id" v-for="(item, index) in list" @click="checkChange(item)">
					<view>{{item.name}}</view>
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
				default: '人员选择'
			},
			multiple: {
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
				loading: false,
				currentUser: [],
				list: [],
				scrollView: ''
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
				this.loading = true;
				const res = await api.web.dataset.call_kw({
					model: 'hr.employee',
					method: 'get_employees',
					args: [
						[]
					],
					kwargs: {
						...kw,
						user_id: this.uid
					}
				})
				if (res && res.length > 0) {
					let currentUser = [];
					this.list = res.map(r => {
						let default_id = r.user_id === this.uid ? r.id : null;
						let item = {
							id: r.id,
							name: r.name,
							user_id: r.user_id
						}
						let default_arr = this.defaultValue?.length > 0 ? this.defaultValue : [default_id]
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
					this.$nextTick(() => {
						this.scrollView = 'userItem-' + this.currentUser[0];
					})
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
				this.getList();
			},
			close() {
				this.isScrollInto = false;
				this.scrollView = '';
			},
			confirm() {
				this.$refs.customBottomPopup.show = false;
				let matchedUser = this.list.filter(item => this.currentUser.includes(item.id));
				this.$emit('confirm', matchedUser);
			},
		},
		created() {
			// this.getList();
		}
	}
</script>

<style lang="scss" scoped>

</style>