<template>
	<view class="user-page">
		<!-- <empty text="尚未开放" mode="permission"></empty> -->
		<view class="usre-container">
			<view class="user-content">
				<u-cell-group>
					<u-cell-item v-for="(menu, index) in userMenus" :key="index" :icon="menu.icon" :title="menu.title"
						:arrow="menu.arrow" :value="menu.value || ''" @click="menuClick(menu)"></u-cell-item>
				</u-cell-group>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: {
			isTabbar: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				userMenus: [
					// {
					// 	title: '修改密码',
					// 	icon: 'edit-pen',
					// },

					{
						title: '当前账号',
						icon: 'error-circle',
						arrow: false,
						value: uni.getStorageSync('HCuname')
					},
					// #ifdef APP-PLUS
					{
						title: '当前版本',
						icon: 'error-circle',
						arrow: false,
						value: plus.runtime.version
					},
					// #endif
					{
						title: '清除缓存',
						icon: 'close-circle',
						arrow: true,
					},
					{
						title: '退出登录',
						icon: 'minus-circle',
						arrow: true,
					}
				]
			}
		},
		methods: {
			menuClick(menu) {
				if (menu.title === '退出登录') {
					this.log_out()
				} else if (menu.title === '清除缓存') {
					uni.showModal({
						content: '确定要清除所有缓存数据吗？',
						success: e => {
							if (e.confirm) {
								// 如果没有缓存账号/密码
								// if (!uni.getStorageSync('rememberPsw')) {
								uni.removeStorageSync('HCuname');
								uni.removeStorageSync('HCpassw');
								uni.removeStorageSync('currentUser');
								uni.removeStorageSync('userName');
								uni.removeStorageSync('tabbar');
								uni.removeStorageSync('auths');
								uni.removeStorageSync('userAuth');
								uni.removeStorageSync('rememberPsw');
								uni.removeStorageSync('initAuths');
								// }
								uni.reLaunch({
									url: '/pages/public/login'
								});
							}
						}
					});
				}
			},
			// 退出登录
			log_out() {
				uni.showModal({
					content: '确定要退出登录吗？',
					success: e => {
						if (e.confirm) {
							// 如果没有缓存账号/密码
							if (!uni.getStorageSync('rememberPsw')) {
								uni.removeStorageSync('HCuname');
								uni.removeStorageSync('HCpassw');
								// uni.removeStorageSync('currentUser');
								// uni.removeStorageSync('userName');
								// uni.removeStorageSync('tabbar');
								// uni.removeStorageSync('rememberPsw');
							}
							uni.removeStorageSync('currentUser');
							uni.removeStorageSync('auths');
							uni.removeStorageSync('userAuth');
							uni.removeStorageSync('tabbar');
							uni.reLaunch({
								url: '/pages/public/login'
							});
						}
					}
				});
			}
		},
		onReady() {
			// 设置导航条
			uni.setNavigationBarColor(this.$mStore.getters.theme.navBar);
			// 设置tabbar
			uni.setTabBarStyle(this.$mStore.getters.theme.tabBar);
		},
		onUnload() {
			this.$mStore.dispatch('tabbar/clear_timer')
		}
	}
</script>

<style>
</style>