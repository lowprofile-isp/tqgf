<template>
	<view class="quality-check-page">
		<!-- <mrp-production v-bind="$attrs"></mrp-production> -->
	</view>
</template>

<script>
	import mrpProduction from './mrp_production.vue'
	export default {
		props: {
			scrollTop: {
				type: Number,
				default: 0
			},
			refreshUp: {
				type: Boolean
			},
			refCallBack: {
				type: Function,
				default: () => {}
			},
			// 解决sticky组件切换页面报错问题
			stickyEnable: {
				type: Boolean
			}
		},
		components: { mrpProduction }
	}
</script>

<style>
	
</style>