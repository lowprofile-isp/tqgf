<template>
	<view class="content"></view>
</template>

<script>
var main, receiver;
var shakeIsShow = false;
export default {
	name:'monitorScanCode',
	data() {
		return {
		};
	},
	created(option) {
		this.monitorScan();
	},
	// 组件销毁
	destroyed(){
		this.cancelScan();
	},
	methods: {
		// 广播监听绑定
		monitorScan() {
			// PDA扫描必须设置广播模式
			main = plus.android.runtimeMainActivity(); //获取activity
			let IntentFilter = plus.android.importClass('android.content.IntentFilter');
			let filter = new IntentFilter();
			filter.addAction('android.intent.ACTION_DECODE_DATA'); //广播动作
			
			let that = this;
			let context = plus.android.importClass('android.content.Context');
			let Intent = plus.android.importClass('android.content.Intent');
			receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
				onReceive: function(context, intent) {
					plus.android.importClass(intent); //引入intent类
					let data = intent.getStringExtra('barcode_string'); //广播数据标签
					that.antiShake(data);
				}
			});
			main.registerReceiver(receiver, filter); //注册监听
		},
		//取消监听扫描头
		cancelScan() {
			main.unregisterReceiver(receiver);
		},
		//防重复
		antiShake: function(code) {
			if (shakeIsShow) return false;
			shakeIsShow = true;
			setTimeout(function() {
				shakeIsShow = false;
			}, 150);
			this.$emit("resultCode", code)
		}
	}
};
</script>

<style>
page {
	background-color: #efeff4;
}
.content {
	text-align: center;
}
</style>
