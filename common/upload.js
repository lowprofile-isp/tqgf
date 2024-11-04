import api from '@/odooapi';
import {
	pathToBase64,   
	base64ToPath
} from 'image-tools';
async function file2Base64(file) {
	const result = await new Promise(function(resolve, reject) {
		// // #ifdef APP-PLUS
		// plus.io.resolveLocalFileSystemURL(file.url, (entry) => {
		// 	// 可通过entry对象操作test.html文件 
		// 	entry.file((file) => {
		// 		let fileReader = new plus.io.FileReader();
		// 		fileReader.onloadend = (evt) => {
		// 			const base64 = evt.target.result.substr(22);
		// 			resolve(base64);
		// 		}
		// 		fileReader.readAsDataURL(file);
		// 	});
		// }, (e) => {
		// 	reject("Resolve file URL failed: " + e.message)
		// 	console.log("Resolve file URL failed: " + e.message);
		// });
		// // #endif
		// // #ifdef H5
		// const reader = new FileReader()
		// let imgResult = ''
		// reader.readAsDataURL(file)
		// reader.onload = function() {
		// 	imgResult = reader.result
		// }
		// reader.onerror = function(error) {
		// 	reject(error)
		// }
		// reader.onloadend = function() {
		// 	resolve(imgResult)
		// }
		// // #endif
		pathToBase64(file.url).then(data => {
			resolve(data.slice(23))
		})
	})
	return result
}
export function uploadFilePromise(file) {
	return new Promise(async (resolve, reject) => {
		try{
			const datas = await pathToBase64(file.url);
			let name = '';
			// #ifdef APP-PLUS
			let strArr = file?.url?.split('/') ?? [];
			name = strArr[strArr.length - 1] || '';
			// #endif
			// #ifndef APP-PLUS
			name = file?.file?.name ?? '';
			// #endif
			const vals = {
				name,
				type: 'binary',
				res_model: file.res_model,
				res_id: file.res_id,
				public: true,
				datas: datas?.slice(23) || ''
			}
			const attach_id = api.web.dataset.call_kw({
				model: 'ir.attachment',
				method: 'create',
				args: [vals],
				kwargs: {}
			});
			if (attach_id) {
				resolve(true)
			} else {
				resolve(false)
			}
		}catch(e){
			console.log(e)
			resolve(false)
			//TODO handle the exception
		}
		
	});
}
// 图片压缩
/**
 * imgSrc 地址
 * scale 压缩质量 0-1
 * type 文件类型
 */
export function compressImg(imgSrc, scale, type, callback) {
	// uni.$u.toast('压缩中')
	var img = new Image();
	img.src = imgSrc;
	img.onload = function() {
		var that = this;
		var h = (img.height * scale).toFixed(0); // 默认按质量比例压缩
		var w = (img.width * scale).toFixed(0);
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var width = document.createAttribute("width");
		width.nodeValue = w;
		var height = document.createAttribute("height");
		height.nodeValue = h;
		canvas.setAttributeNode(width);
		canvas.setAttributeNode(height);
		ctx.drawImage(that, 0, 0, w, h);
		var base64 = canvas.toDataURL('image/jpeg', scale); //压缩比例
		canvas = null;
		if (type == 'base64') {
			let data = {
				size: getBase64Size(base64),
				type: type,
				source: base64
			}
			callback(base64);
		} else {
			let blob = base64ToBlob(base64);
			// console.log('压缩后的大小', blob, blob.size, blob.type)
			const blobUrl = window.URL.createObjectURL(blob); //blob地址
			blob.source = blobUrl
			callback(blob);
		}
	}
}

export const fileToBase64 = (url, cb) => {
	// #ifdef MP-WEIXIN
	uni.getFileSystemManager().readFile({
		filePath: url, //选择图片返回的相对路径
		encoding: 'base64', //编码格式
		success: res => { //成功的回调
			let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
			console.log("res.data", res.data)
			/** 在这里处理base64结果 **/
			cb(base64);
		},
		fail: (e) => {
			console.log("图片转换失败");
		}
	})
	// #endif
	// #ifdef H5
	uni.request({
		url: url,
		method: 'GET',
		responseType: 'arraybuffer',
		success: ress => {
			let base64 = uni.arrayBufferToBase64(ress.data); //把arraybuffer转成base64
			base64 = 'data:image/jpeg;base64,' + base64;
			cb(base64);
		},
		fail: (e) => {
			console.log("图片转换失败");
		}
	})
	// #endif
	// #ifdef APP-PLUS
	plus.io.resolveLocalFileSystemURL(url, (entry) => {
		// 可通过entry对象操作test.html文件 
		entry.file((file) => {
			let fileReader = new plus.io.FileReader();
			fileReader.onloadend = (evt) => {
				const base64 = evt.target.result.substr(22);
				cb(base64);
			}
			fileReader.readAsDataURL(file);
		});
	}, (e) => {
		alert("Resolve file URL failed: " + e.message);
	});
	// #endif
}
// base转Blob
export function base64ToBlob(base64) {
	var arr = base64.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: mime
	});
}

// 获取base64的文件大小
export function getBase64Size(base64Str) {
	let size = 0;
	if (base64Str) { // 获取base64图片byte大小
		const equalIndex = base64Str.indexOf('='); // 获取=号下标
		if (equalIndex > 0) {
			const str = base64Str.substring(0, equalIndex); // 去除=号
			const strLength = str.length;
			const fileLength = strLength - (strLength / 8) * 2; // 真实的图片byte大小
			size = Math.floor(fileLength); // 向下取整
		} else {
			const strLength = base64Str.length;
			const fileLength = strLength - (strLength / 8) * 2;
			size = Math.floor(fileLength); // 向下取整
		}
	} else {
		size = null;
	}
	return size
}