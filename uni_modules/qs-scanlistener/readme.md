## qs-scanlistener PDA扫码
## 支持广播和键盘
---
### 广播动作可在main.js设置uni._qs_scanlistener_action = 你的广播动作名称, 默认android.intent.ACTION_DECODE_DATA
### 广播标签可在main.js设置uni._qs_scanlistener_label = 你的广播标签名称, 默认barcode_string
---
### 扫码结果也可以uni.$on('qs_scanlistener_handle', code=>{}) 中获取
---
Template
```html
<qs-scanlistener @scan="scan"></qs-scanlistener>
```
js
```javascript
methods: {
	scan(code) {
		console.log(code)
	}
}
```