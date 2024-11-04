<template>
	<view class="user-name-sign" @click="userClick">
		<u-icon name="account" :color="navStyles.textColor" :size="navStyles.rightIconSize"></u-icon>
		<span class="user-name">{{user_name}}</span>
		<u-popup v-model="userPopupShow" width="70%" mode="right">
			<user-page :isTabbar="false"></user-page>
		</u-popup>
	</view>
</template>

<script>
	import userPage from '@/pages/tqgf/user_info/index.vue';
	export default {
		props: {
			showPopup: {
				type: Boolean,
				default: true
			}
		},
		components: {
			userPage
		},
		data() {
			return {
				userPopupShow: false,
				navStyles: {
					navTitle: '',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
			}
		},
		computed: {
			user_name() {
				return uni.getStorageSync('HCuname')
			},
		},
		methods: {
			userClick() {
				if (this.showPopup) {
					this.userPopupShow = true
				}
			}
		}
	}
</script>

<style lang="scss">
</style>