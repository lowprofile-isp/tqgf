<template>
	<u-tr >
		<!-- <u-td><u-input type="text" disabled input-align="center" placeholder="*" /></u-td> -->
		<u-td :width="!isBespread ? '300rpx' : 'auto'" class="category-cell" v-for="(i,index2) in inspection_list_item" :key="index2">
			<template v-if="!i.isInput">
				<text @click="showInput(index2)">{{i[i.type]}}</text>
			</template>
			<template>
				<uv-input v-if="i.type_value === 'Measure'" :value="i[i.type]" @blur="(event) => inputBlur(event, index2)" :type="'number'"
					input-align="center" :clearable="false" :placeholder="i[i.type] === null ? '*' : ''" :disabled="
												i[i.type] === null ||
												!isEdit ||
												i.title === '密度'" />
				<uv-input v-else :value="i[i.type]" @blur="(event) => inputBlur(event, index2)" type="text" input-align="center"
					:clearable="false" :placeholder="i[i.type] === null ? '*' : ''"
					:disabled="i[i.type] === null || !isEdit" />
			</template>
		</u-td>
	</u-tr>

</template>

<script>
	export default {
		props: {
			value: {
				type: Number | Number,
				default: ''
			},
			inspection_list_item: {
				type: Array,
				default: () => []
			},
			type: {
				type: String,
				default: 'text'
			},
			title: {
				type: String,
				default: ''
			},
			isEdit: {
				type: Boolean
			},
			isBespread: {
				type: Boolean
			}
		},
		data() {
			return {

			}
		},
		methods: {
			inputBlur(event, index2) {
				this.$emit('inputBlur', event, index2)
			},
			inputTextBlur(event) {
				this.$emit('inputTextBlur', event)
			},
			showInput(index2) {
				this.$emit('showInput', index2)
			},
			hideInput() {}
		}
	}
</script>

<style>
</style>