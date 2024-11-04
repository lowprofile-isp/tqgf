<template>
	<view>
		<u-popup title="请连接打印机" v-model="showModel" mode="bottom" height="80%" @close="close">
			<view class="content">
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-title text-orange"></text>
						蓝牙列表
						<u-loading mode="flower" :show="searching" size="36"></u-loading>
					</view>
					<view class="action">
						<u-button @click="searchDevice" v-if="!searching">搜索</u-button>
						<u-button @click="stopSearch" v-if="searching">停止搜索</u-button>
					</view>
				</view>
				<view class="cu-list menu sm-border">
					<view class="cu-item" v-for="(item, index) in bleDevices" :key="index"
						@click="connect(item.deviceId)">
						<view class="content">{{ item.name }}</view>
					</view>
				</view>
				<view class="cu-footer">
					<span>打印数量：</span>
					<u-number-box v-model="print_num" :min="1" :max="99" size="32" input-height="60"></u-number-box>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import printKit from '@/common/print/kit/print/printKit.js';
	import bleKit from '@/common/print/kit/bluetoothKit.js';
	import {
		labelCommand
	} from '@/common/print/kit/print/labelCommand.js';
	export default {
		props: {
			canvasWidth: {
				type: Number,
				default: 70
			},
			canvasHeight: {
				type: Number,
				default: 130
			}
		},
		data() {
			return {
				searching: false,
				showModel: false,
				printing: false,
				bleDevices: [],
				deviceId: '',
				isFlag: false,
				print_content: null,
				print_num: 1
			};
		},
		computed: {
			canvasStyle() {
				return {
					width: this.canvasWidth,
					height: this.canvasHeight
				};
			}
		},
		watch: {
			showModel(val) {
				if (val) {
					this.isFlag = false
				}
			}
		},
		methods: {
			//展示搜索的蓝牙列表
			showBluetoothList() {
				this.showModel = true;
				this.searchDevice();
			},
			async resetBlue() {
				await bleKit.closeConnect(this.deviceId);
				this.deviceId = '';
			},
			// async print(width, height, callback) {
			// 	try {
			// 		await this.toPrint(() => {
			// 			// let command = new labelCommand(width, height);
			// 			// command.setGap(2);
			// 			// callback(command);
			// 			// command.setPagePrint();
			// 			// console.log(command.getData())
			// 			// printKit.sendData(command.getData());
			// 			printKit.sendData(bytes);
			// 			setTimeout(() => {
			// 				printKit.reset();
			// 				uni.hideLoading();
			// 			}, 2000);
			// 		});
			// 	} catch (e) {
			// 		console.log(e)
			// 		//TODO handle the exception
			// 	}
			// },
			printStart(strs) {
				// #ifdef H5
				uni.showToast({
					title: '暂不支持打印',
					icon: 'none'
				})
				// #endif
				// #ifndef H5
				let isInited = printKit.isInited();
				if (!isInited) {
					this.$u.toast('请连接蓝牙打印机');
					this.showModel = true;
					this.searchDevice();
					return
				}
				let newArr = [];
				for (let i = 0; i < strs.length; i++) {
					let str = strs[i];
					let arr = [];
					for (let j = 0; j < this.print_num; j++) {
						arr.push(str);
					}
					newArr.push(arr);
				}
				this.bluetoothBatchPrint(newArr)
				// #endif
			},
			// 批量打印
			bluetoothBatchPrint(arr) {
				if (arr.length === 0) return false
				this.toPrint(async () => {
					let promises = [];
					for (let i = 0; i < arr.length; i++) {
						let arr2 = arr[i];
						for (let j = 0; j < arr2.length; j++) {
							let bytes = plus.android.invoke(arr2[j], "getBytes", "gbk")
							await printKit.sendData(bytes);
							if (i === arr.length - 1 && j === arr2.length - 1) {
								setTimeout(() => {
									printKit.reset();
									uni.hideLoading();
								}, 2000);
							}
						}
					}
				});
			},
			async printCPCL(str) {
				let bytes = plus.android.invoke(str, "getBytes", "gbk")
				await printKit.sendData(bytes);
				// try {
				// 	let isInited = printKit.isInited();
				// 	if (!isInited) {
				// 		this.$u.toast('请连接蓝牙打印机');
				// 		this.showModel = true;
				// 		this.searchDevice();
				// 		return
				// 	}
				// 	await this.toPrint(async () => {
				// 		let bytes = plus.android.invoke(str, "getBytes", "gbk")
				// 		await printKit.sendData(bytes);
				// 		// setTimeout(() => {
				// 		// 	printKit.reset();
				// 		// 	uni.hideLoading();
				// 		// }, 2000);
				// 	});
				// } catch (e) {
				// 	uni.hideLoading()
				// 	console.log(e)
				// 	//TODO handle the exception
				// }
			},
			async toPrint(callback, tips = "打印中...") {
				// await this.printInited();
				uni.showLoading({
					title: tips,
					mask: true
				});
				setTimeout(() => {
					callback();
				}, 300);
			},
			printInited() {
				return new Promise((reslove, reject) => {
					let i = 0;
					let intervalId = setInterval(() => {
						if (printKit.isInited()) {
							clearInterval(intervalId);
							reslove();
							return;
						}
						// 防止死循环
						if (i++ > 1000) {
							clearInterval(intervalId);
							reject('打印机连接超时');
						}
					}, 500);
				});
			},
			async connect(deviceId) {
				try {
					await printKit.init(deviceId, () => {
						this.$emit('print');
					});
					// 缓存连接
					this.showModel = false;
					this.deviceId = deviceId;
				} catch (err) {
					this.deviceId = '';
					console.error(err);
					this.$u.toast('打印机连接失败');
				} finally {
					uni.hideLoading();
				}
			},
			async searchDevice() {
				this.searching = true;
				// 10s后自动关闭搜索
				setTimeout(() => {
					this.searching = false;
					bleKit.stopSearch();
				}, 10000);
				try {
					await bleKit.open();
					await bleKit.startSearch(devices => (this.bleDevices = devices));
				} finally {
					this.searching = false;
				}
			},
			stopSearch() {
				this.searching = false;
				bleKit.stopSearch();
			},
			async tryAutoConnect() {
				// 自动连接蓝牙
				let deviceId = this.deviceId;
				if (!deviceId) {
					return;
				}
				await bleKit.open();
				await this.searchDevice();
				// 用户已经操作选择了其它蓝牙
				if (this.deviceId != deviceId) {
					return;
				}
				// 当前能搜索到指定的设备
				if (this.bleDevices.some(e => e.deviceId == deviceId)) {
					this.connect(this.deviceId);
				}
			},
			close() {}
		},
		async created() {
			this.tryAutoConnect();
		}
	};
</script>

<style lang="scss">
	.cu-footer {
		width: 100%;
		border-top: 2rpx solid $border-color-base;
		padding: 30rpx;
		font-size: 32rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.cu-list {
		padding-bottom: 112rpx;
	}
</style>