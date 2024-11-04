<template>
	<view></view>
</template>

<script>
	import scaninput from './scanInput.js'
	scaninput.initScan()
	scaninput.startScan()
	export default {
		name:"scan-listener",
		created() {
			scaninput.install(this.scanHandle)
			// uni.$on('scan_handle', this.scanHandle)
		},
		beforeDestroy() {
			scaninput.uninstall(this.scanHandle)
		},
		methods: {
			onEvent(event) {
				// console.log(event.key)
				if (event.key != 'Enter' && event.key != 'PrintScreen') { // 拼接输入的值，Enter与PrintScreen是物理按钮要排除
					this.inputVal = this.inputVal + event.key
				}
				if (event.key == 'Enter') {
					let reg = new RegExp('Shift', 'g') //g代表全部
					let reg2 = new RegExp('Unidentified', 'g') //排除‘Unidentified’字符
					let inputVal = this.inputVal
					inputVal = inputVal.replace(reg, "")
					inputVal = inputVal.replace(reg2, "")
					inputVal = inputVal.replace(/\s/g, "")
					inputVal = inputVal.replace(/\r\n/g, "")
					inputVal = inputVal.replace(/\n/g, "")
					if(this.inputVal) {
						// console.log('键盘监听模式')
						this.$emit('scan', this.inputVal)
					}
					this.inputVal = ''
				}
			},
			scanHandle(code) {
				// console.log('广播模式')
				this.$emit('scan', code)
			}
		},
		data() {
			return {
				inputVal: '',
			};
		}
	}
</script>
<script module="keyboard" lang="renderjs">
export default {
  mounted () {
    const onKey = (event) => {
      const keys1 = ['type', 'timeStamp']
      const keys2 = ['altKey', 'code', 'ctrlKey', 'isComposing', 'key', 'location', 'metaKey', 'repeat', 'shiftKey']
      const keys3 = ['char', 'charCode', 'keyCode', 'keyIdentifier', 'keyLocation', 'which']
      const data = {}
      keys1.concat(keys2, keys3).forEach(key => data[key] = event[key])
      this.$ownerInstance.callMethod('onEvent', data)
    }
    const names = ['keyup'] //'keydown', 
    names.forEach(name => {
      document.addEventListener(name, onKey, false)
    })
    this.$on('hook:beforeDestroy', () => {
      names.forEach(name => {
        document.removeEventListener(name, onKey, false)
      })
    })
  }
}
</script>

<style>

</style>