<template>
	<u-button class="print-btn" hover-class="none" @click="print">打印</u-button>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			print() {
				this.$emit('print')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.print-btn {
		// flex: none !important;
		// width: 200rpx !important;
		background-color: #fff !important;
		border-color: #c0c4cc !important;
	}
</style>