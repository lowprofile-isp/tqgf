let main, receiver, filter, _codeQueryTag = false, temp = [], init = false, start = false;
export default {
	initScan() {
		if(init) return
		let _this = this;
		main = plus.android.runtimeMainActivity(); //获取activity
		var IntentFilter = plus.android.importClass('android.content.IntentFilter');
		filter = new IntentFilter();
		//android.intent.ACTION_DECODE_DATA
		filter.addAction(uni._qs_scanlistener_action || "android.intent.ACTION_DECODE_DATA"); // 换你的广播动作，你的pda设备里面看
		receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
			onReceive: function(context, intent) {
				//barcode_string
				plus.android.importClass(intent); 
				let code = intent.getStringExtra(uni._qs_scanlistener_label || "barcode_string"); // 换你的广播标签，你的pda设备里面看
				_this.queryCode(code);
			}
		});
		init = true
	},
	startScan() {
		if(!start) {
			start = true
			main.registerReceiver(receiver, filter);
		}
	},
	stopScan() {
		if(start) {
			start = false
			main.unregisterReceiver(receiver);
		}
	},
	install(fn) {
		if(typeof fn == 'function' && !~temp.indexOf(fn)) temp.push(fn)
	},
	uninstall(fn) {
		if(typeof fn == 'function') {
			const index = temp.find(i=>i == fn)
			if(~index) temp.splice(index, 1)
		}
	},
	queryCode: function(code) {
		//防重复
		// if (_codeQueryTag) return false;
		// _codeQueryTag = true;
		// setTimeout(function() {
		// 	_codeQueryTag = false;
		// }, 150);
		if(temp && temp.length) {
			temp[temp.length - 1](code)
		}
		uni.vibrateShort()
		uni.$emit("qs_scanlistener_handle", code);
	}
}
