import GoEasy from "@/js_sdk/GoEasy-IM/goeasy-2.8.8.min.js";
class GoEasySign {
	constructor() {
		this.goEasy = this.init();
	}
	init() {
		return GoEasy.getInstance({
			host: "hangzhou.goeasy.io", //应用所在的区域地址: 【hangzhou.goeasy.io |singapore.goeasy.io】
			appkey: "BC-03e140cdd7aa4f0cbc25e4d5fb23e8e0", // common key,
			modules: ["pubsub"],
			// true表示支持通知栏提醒，false则表示不需要通知栏提醒
			allowNotification: true //仅有效于app,小程序和H5将会被自动忽略
		});
	}
	connect() {
		this.goEasy.connect({
			// id: this.currentUser.uuid,
			// data: userData,
			onSuccess: function() {
				//连接成功
				console.log("GoEasy connect successfully.")
			},
			onFailed: function(error) {
				//连接失败
				console.log("Failed to connect GoEasy, code:" + error.code + ",error:" + error.content);
			},
			onProgress: function(attempts) { //连接或自动重连中
				console.log("GoEasy is connecting", attempts);
			}
		});
	}
	notification() {
		this.goEasy.onClickNotification((message) => {
			let currentUrl;
			const routes = getCurrentPages();

			if (routes && routes.length) {
				const curRoute = routes[routes.length - 1].route;
				const curParam = routes[routes.length - 1].options;
				currentUrl = '/' + curRoute + `?to=${curParam.to}`;
			}

			let newUrl;
			console.log(message)
			// switch (message.toType) {
			// 	// case GoEasy.IM_SCENE.PRIVATE:
			// 	// 	newUrl = '/pages/chat/privateChat/privateChat?to=' + message.senderId;
			// 	// 	break;
			// 	// case GoEasy.IM_SCENE.GROUP:
			// 	// 	newUrl = '/pages/chat/groupChat/groupChat?to=' + message.groupId;
			// 	// 	break;
			// 	// default:
			// 	// 	let content = JSON.parse(JSON.stringify(message.content))
			// 	// 	let res_id = eval('(' + content + ')')
			// 	// 	newUrl = '/pages/works/sales/salesinfo?id=' + res_id.res_id;
			// }

			// if (currentUrl !== newUrl) {
			// 	uni.navigateTo({
			// 		url: newUrl,
			// 	});
			// }

		});
	}
}

export default GoEasySign;