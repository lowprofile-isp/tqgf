<template>
	<u-empty class="global_empty" v-bind="$attrs"></u-empty>
</template>
<style lang="scss" scoped>
	.global_empty {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>