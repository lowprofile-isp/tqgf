<template>
	<view class="upgrade-popup">
		<!-- #ifdef APP-PLUS -->
		<image class="header-bg" src="~../../static/images/upgrade/upgrade_bg.png" mode="widthFix"></image>
		<!-- #endif -->
		<!-- #ifndef APP-PLUS -->
		<image class="header-bg" src="../../static/images/upgrade/upgrade_bg.png" mode="widthFix"></image>
		<!-- #endif -->
		<view class="main">
			<view class="version">{{versionInfo.versionTitle || '版本更新'}}</view>
			<view class="content">
				<!-- <text class="title">更新内容</text> -->
				<view class="desc" v-html="versionInfo.versionDesc"></view>
			</view>
			<!--下载状态-进度条显示 -->
			<view class="footer" v-if="isStartDownload">
				<view class="progress-view" :class="{'active':!hasProgress}" @click="handleInstallApp">
					<!-- 进度条 -->
					<view v-if="hasProgress" style="height: 100%;">
						<view class="txt">{{percentText}}</view>
						<view class="progress" :style="setProStyle"></view>
					</view>
					<view v-else>
						<view class="btn upgrade force">{{ isDownloadFinish  ? '立即安装' :'下载中...'}}</view>
					</view>
				</view>
			</view>
			<!-- 强制更新 -->
			<view class="footer" v-else-if="versionInfo.isForceUpdate">
				<view class="btn upgrade force" @click="handleUpgrade">立即更新</view>
			</view>
			<!-- 可选择更新 -->
			<view class="footer" v-else>
				<view class="btn close" @click="handleClose">以后再说</view>
				<view class="btn upgrade" @click="handleUpgrade">立即更新</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		downloadApp,
		installApp
	} from '@/common/upgrade.js'
	export default {
		data() {
			return {
				isDownloadFinish: false, //是否下载完成
				hasProgress: false, //是否能显示进度条
				currentPercent: 0, //当前下载百分比
				isStartDownload: false, //是否开始下载
				fileName: '', //下载后app本地路径名称
			}
		},
		computed: {
			versionInfo() {
				return this.$mStore.state.versionInfo;
			},
			//设置进度条样式，实时更新进度位置
			setProStyle() {
				return {
					width: (510 * this.currentPercent / 100) + 'rpx' //510：按钮进度条宽度
				}
			},
			//百分比文字
			percentText() {
				let percent = this.currentPercent;
				if (typeof percent !== 'number' || isNaN(percent)) return '下载中...'
				if (percent < 100) return `下载中${percent}%`
				return '立即安装'
			}
		},
		onLoad() {},
		onBackPress(options) {
			// 禁用返回
			if (options.from == 'backbutton') {
				return true;
			}
		},
		methods: {
			//更新
			handleUpgrade() {
				if (this.versionInfo.downloadUrl) {
					this.isStartDownload = true
					//开始下载App
					downloadApp(this.versionInfo.downloadUrl, current => {
						//下载进度监听
						this.hasProgress = true
						this.currentPercent = current

					}).then(fileName => {
						if (!uni.getStorageSync('rememberPsw')) {
							uni.removeStorageSync('HCuname');
							uni.removeStorageSync('HCpassw');
						}
						uni.removeStorageSync('currentUser');
						uni.removeStorageSync('userName');
						uni.removeStorageSync('tabbar');
						uni.removeStorageSync('auths');
						uni.removeStorageSync('userAuth');
						uni.removeStorageSync('rememberPsw');
						uni.removeStorageSync('initAuths');
						//下载完成
						this.isDownloadFinish = true
						this.fileName = fileName
						if (fileName) {
							//自动安装App
							this.handleInstallApp()
						}
					}).catch(e => {
						console.log(e, 'e')
					})
				} else {
					uni.showToast({
						title: '下载链接不存在',
						icon: 'none'
					})
				}
			},
			//安装app
			handleInstallApp() {
				//下载完成才能安装，防止下载过程中点击
				if (this.isDownloadFinish && this.fileName) {
					installApp(this.fileName, () => {
						//安装成功,关闭升级弹窗
						uni.navigateBack()
					})
				}
			},
			//关闭返回
			handleClose() {
				uni.navigateBack()
			},
		}
	}
</script>

<style>
	page {
		background: rgba(0, 0, 0, 0.5);
		/**设置窗口背景半透明*/
	}
</style>
<style lang="scss" scoped>
	.upgrade-popup {
		width: 580rpx;
		height: auto;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		border: 1px solid #eee;
	}

	.header-bg {
		width: 100%;
		margin-top: -112rpx;
	}

	.main {
		padding: 10rpx 44rpx 30rpx;
		box-sizing: border-box;

		.version {
			font-size: 36rpx;
			color: #026DF7;
			font-weight: 700;
			width: 100%;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: 1px;
		}

		.content {
			margin-top: 40rpx;

			.title {
				font-size: 28rpx;
				font-weight: 700;
				color: #000000;
			}

			.desc {
				box-sizing: border-box;
				// margin-top: 20rpx;
				font-size: 28rpx;
				// color: #6A6A6A;
				color: #000000;
				max-height: 80vh;
				overflow-y: auto;
			}
		}

		.footer {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			position: relative;
			flex-shrink: 0;
			margin-top: 100rpx;

			.btn {
				width: 246rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				z-index: 999;
				height: 96rpx;
				box-sizing: border-box;
				font-size: 32rpx;
				border-radius: 10rpx;
				letter-spacing: 2rpx;

				&.force {
					width: 500rpx;
				}

				&.close {
					border: 1px solid #E0E0E0;
					margin-right: 25rpx;
					color: #000;
				}

				&.upgrade {
					background-color: #026DF7;
					color: white;
				}
			}

			.progress-view {
				width: 510rpx;
				height: 90rpx;
				display: flex;
				position: relative;
				align-items: center;
				border-radius: 6rpx;
				background-color: #dcdcdc;
				display: flex;
				justify-content: flex-start;
				padding: 0px;
				box-sizing: border-box;
				border: none;
				overflow: hidden;

				&.active {
					background-color: #026DF7;
				}

				.progress {
					height: 100%;
					background-color: #026DF7;
					padding: 0px;
					box-sizing: border-box;
					border: none;
					border-top-left-radius: 10rpx;
					border-bottom-left-radius: 10rpx;

				}

				.txt {
					font-size: 28rpx;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					color: #fff;
				}
			}
		}
	}
</style>