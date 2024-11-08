/* eslint-disable */
import mRouter from '@/utils/router';
import mConstDataConfig from '@/config/constData.config';
import mStore from '@/store';
import appShare from '@/utils/share';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
// #ifdef H5
import jweixin from '@/common/jweixin';
// #endif
import {
	advView
} from '@/api/basic';

//常用方法集合
export default {
	/**
	 * toast提示
	 */
	toast(title, duration = 3000, mask = false, icon = 'none') {
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},
	/**
	 * 返回登录页面
	 */
	async backToLogin() {
		// 存当前页面的地址
		const currentPage = getCurrentPages()[getCurrentPages().length - 1];
		const params = {};
		// #ifdef H5
		params.route = `/${currentPage.$vm.route}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef MP
		params.route = `/${currentPage.$vm.__route__}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef APP-PLUS
		params.route = `/${currentPage.route}`;
		params.query = currentPage.options;
		// #endif
		uni.setStorageSync('backToPage', JSON.stringify(params));
		uni.removeTabBarBadge({
			index: mConstDataConfig.worksIndex
		});
		uni.removeTabBarBadge({
			index: mConstDataConfig.notifyIndex
		});
		await mStore.commit('logout');
		mRouter.push({
			route: '/pages/public/login'
		});
	},
	/**
	 * 返回上一页携带参数
	 */
	prePage(index) {
		let pages = getCurrentPages();
		let prePage = pages[pages.length - (index || 2)];
		// #ifdef H5
		return prePage;
		// #endif
		return prePage.$vm;
	},
	/**
	 * 开发环境全局打印日志
	 * @param {Object} title
	 */
	log(title) {
		if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
			console.log(JSON.stringify(title));
		}
	},
	/**
	 * 异步获取设备信息
	 */
	getInfoAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getInfo({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},
	/**
	 * 安卓10不支持IMEI,则获取OAID
	 */
	getOaidAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getOAID({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},
	/**
	 * 获取一个随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	random(min, max) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * min + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (max - min + 1) + min, 10);
				break;
			default:
				return 0;
				break;
		}
	},
	isNumber(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	/**
	 * 获取一个随机id
	 * @param {Number} n
	 */
	randomId(n) {
		let str = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
			'J', 'K',
			'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		];
		let res = '';
		for (let i = 0; i < n; i++) {
			let id = Math.ceil(Math.random() * 35);
			res += str[id];
		}
		return res;
	},
	/**
	 * 获取ios的IDFA
	 */
	getIdfa() {
		let idfa = '';
		try {
			if ('iOS' == plus.os.name) {
				let manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
				if (plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')) {
					let identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
					idfa = plus.ios.invoke(identifier, 'UUIDString');
					plus.ios.deleteObject(identifier);
				}
				plus.ios.deleteObject(manager);
			}
		} catch (e) {
			console.error('获取idfa失败');
		}
		return idfa;
	},
	/*
	 * obj 转 params字符串参数
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = '';
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},
	/*
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || '/';
		let paramsStr = '';
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += '?');
		url += paramsStr;
		return url;
	},
	/*
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || '';
		let theRequest = new Object();
		let str = href.split('?')[1];
		if (str != undefined) {
			let strs = str.split('&');
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		return theRequest;
	},
	/**
	 * 加密字符串
	 */
	strEncode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let a = key.split('');
		let s = '',
			b,
			b1,
			b2,
			b3;
		for (let i = 0; i < str.length; i++) {
			b = str.charCodeAt(i);
			b1 = b % l;
			b = (b - b1) / l;
			b2 = b % l;
			b = (b - b2) / l;
			b3 = b % l;
			s += a[b3] + a[b2] + a[b1];
		}
		return s;
	},
	/**
	 * 解密字符串
	 */
	strDecode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let b,
			b1,
			b2,
			b3,
			d = 0,
			s;
		s = new Array(Math.floor(str.length / 3));
		b = s.length;
		for (let i = 0; i < b; i++) {
			b1 = key.indexOf(str.charAt(d));
			d++;
			b2 = key.indexOf(str.charAt(d));
			d++;
			b3 = key.indexOf(str.charAt(d));
			d++;
			s[i] = b1 * l * l + b2 * l + b3;
		}
		b = eval('String.fromCharCode(' + s.join(',') + ')');
		return b;
	},
	/**
	 * 比较版本号
	 */
	compareVersion(reqV, curV) {
		if (curV && reqV) {
			let arr1 = curV.split('.'),
				arr2 = reqV.split('.');
			let minLength = Math.min(arr1.length, arr2.length),
				position = 0,
				diff = 0;
			while (
				position < minLength &&
				(diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
			) {
				position++;
			}
			diff = diff != 0 ? diff : arr1.length - arr2.length;
			if (diff > 0) {
				if (position == minLength - 1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	},
	/**
	 * H5复制
	 */
	h5Copy(content) {
		let textarea = document.createElement('textarea');
		textarea.value = content;
		textarea.readOnly = 'readOnly';
		document.body.appendChild(textarea);
		textarea.select(); // 选择对象
		textarea.setSelectionRange(0, content.length); //核心
		let result = document.execCommand('Copy'); // 执行浏览器复制命令
		textarea.remove();
		const msg = result ? '复制成功' : '复制失败';
		this.toast(msg);
	},
	/**
	 * app分享
	 */
	handleAppShare(shareUrl, shareTitle, shareContent, shareImg) {
		let shareData = {
			shareUrl,
			shareTitle,
			shareContent,
			shareImg
		};
		appShare(shareData, res => {});
	},



	// 去掉字符串中的空格
	trim(str) {
		if (!str) {
			return '';
		}
		return str.replace(/\s*/g, '');
	},

	// 判断两个对象是否相同
	isObjectValueEqual(x, y) {
		// 指向同一内存时
		if (x === y) {
			return true;
		} else if (
			typeof x == 'object' &&
			x != null &&
			typeof y == 'object' && y != null
		) {
			if (Object.keys(x).length != Object.keys(y).length) return false;

			for (var prop in x) {
				if (y.hasOwnProperty(prop)) {
					if (!this.isObjectValueEqual(x[prop], y[prop])) return false;
				} else return false;
			}

			return true;
		} else return false;
	},

	platformGroupFilter() {
		let platformGroup = 'wechat';
		// #ifdef H5
		platformGroup = 'h5';
		// #endif
		// #ifdef MP-QQ
		platformGroup = 'qqMp';
		// #endif
		// #ifdef MP-WEIXIN
		platformGroup = 'wechatMp';
		// #endif
		// #ifdef MP-ALIPAY
		platformGroup = 'aliMp';
		// #endif
		// #ifdef MP-QQ
		platformGroup = 'qqMp';
		// #endif
		// #ifdef MP-BAIDU
		platformGroup = 'baiduMp';
		// #endif
		// #ifdef APP-PLUS
		switch (uni.getSystemInfoSync().platform) {
			case 'android':
				platformGroup = 'android';
				break;
			case 'ios':
				platformGroup = 'ios';
				break;
		}
		// #endif
		return platformGroup;
	},
	// 数据映射处理
	mapValueHandle(arr, key) {
		if (arr instanceof Array) {
			let newArr = new Map(arr)
			return newArr.get(key)
		}
		return null
	},
	// 时间+8小时
	dateToUTC(date, format) {
		const utc = require('dayjs/plugin/utc')
		// const timezone = require('dayjs/plugin/timezone')
		dayjs.extend(utc)
		// dayjs.extend(timezone)
		if (date)
			return dayjs(date)?.utc(true)?.local()?.format(format || 'YYYY-MM-DD HH:mm:ss')
		return date
	},
	// 获取国际标准时间
	getDateUTC(format) {
		const utc = require('dayjs/plugin/utc')
		dayjs.extend(utc)
		return dayjs()?.utc(true)?.format(format || 'YYYY-MM-DD HH:mm:ss')
	},
	getDateWeek() {
		dayjs.locale('zh-cn');
		return dayjs().format('dddd');
	},
	// 数组分段
	arrSlice(arr, sliceNum) {
		if (sliceNum > 0) {
			const len = arr.length
			let result = []
			for (let i = 0; i < len / sliceNum; i++) {
				result.push(arr.slice(i * sliceNum, (i + 1) * sliceNum))
			}
			return result
		}
		return arr
	},
	// 扫码自动填充
	scanInputFill(barcode) {
		let str = barcode;
		let obj = {
			str,
			date: false
		}
		let formats = ['YYYY-MM-DD hh:mm', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD hh:mm:ss', 'YYYY-MM-DD HH:mm:ss',
			'YYYY-MM-DD', 'MM-DD',
			'hh:mm', 'HH:mm'
		]
		if (formats.indexOf(str) > -1) {
			obj.str = this.getDateUTC(str);
			// obj.date = true;
		}
		return obj;
	},
	// 文本复制
	copyText(text) {
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({
					title: '复制成功',
					icon: 'success',
					duration: 1500
				});
			},
			fail: () => {
				uni.showToast({
					title: '复制失败',
					icon: 'none'
				});
			}
		});
	}
};