<template>
	<view>
		<view class="tabBar_css">
			<u-tabbar :value="currentPagePath" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true">
				<u-tabbar-item v-for="(item,index) in tabBarList" :key="index" :text="item.text" :icon="item.iconPath"
					:name="item.pagePath" @click="click_page">
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		props: {
			currentPagePath: String,
		},
		computed: {
			...mapGetters(['tabBarList'])
		},
		methods: {
			click_page(arg) {
				console.log('arg', arg);
				let page = '/' + arg
				uni.switchTab({
					url: page,
					success: function(res) {
						console.log(res);
						console.log('succcess');
					},
					fail: function(res) {
						console.log('fail');
						console.log(res);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.tabBar_css {
		// position: fixed;
		// bottom: 0;
		// background-color: red;
		// z-index: 9999;
		// width: 100%;
	}
</style>