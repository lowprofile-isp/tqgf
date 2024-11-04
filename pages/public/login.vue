<template>
	<view id="mount" class="login-page">
		<view data-reactroot="">
			<view class="_1RxfFVyy86UE1t7lqCDcGD">
				<view class="_3CkMCIo8-RsWtcLQqsuKBh">
					<view style="display: flex; align-items: center;justify-content: center;">
						<!-- #ifdef APP-PLUS -->
						<img src="～../../static/images/logo2.png" style="width: 320rpx;" />
						<!-- #endif -->
						<!-- #ifndef APP-PLUS -->
						<img src="../../static/images/logo2.png" style="width: 200rpx;" />
						<!-- #endif -->
						<!-- <view class="_3lr3h2hawOi8pO8fYLQcjI">天宜上佳</view> -->
					</view>
					<view class="_6vZdUKmPDGrrza0LnuXD9">
						<view>
							<view class="mobileIcon"></view>
							<input v-model="account" class="input" type="text" autocomplete="off" placeholder="请输入账号">
							<p class="_2nSTvdgBwioyepYsyeaVPN"></p>
						</view>
					</view>
					<view class="_6vZdUKmPDGrrza0LnuXD9">
						<view>
							<view class="passwordIcon"></view>
							<input v-model="password" class="input" type="password" autocomplete="off"
								placeholder="请输入密码">
							<p class="_2nSTvdgBwioyepYsyeaVPN"></p>
						</view>
					</view>
					<u-checkbox class="login_checkbox" v-model="rememberPsw">记住密码</u-checkbox>
					<u-button class="_6vZdUKmPDGrrza0LnuXD9" @click="login()" type="primary" :ripple="false"
						:loading="loginLoading" :disabled="loginLoading">登录</u-button>
					<!-- <view class="_6vZdUKmPDGrrza0LnuXD9">
						<view>
							<a href="" class="_3x9qBnGOvjSE2ZmDfi1w5g">忘记密码</a>
						</view>
					</view> -->
				</view>
			</view>
			<i v-if="env === 'development'" class="iconfont icon-wangluo" @click="serviceShow = true"></i>
			<u-modal v-model="serviceShow" title="网络配置" :show-cancel-button="true" cancel-text="重置"
				:title-style="{paddingTop: '20rpx', fontSize: 32}" @confirm="serviceConfirm" @cancel="serviceCancel">
				<view class="slot-content">
					<view class="service-modal">
						<u-field v-model="serviceInfo.http_url" label="IP/地址" placeholder="">
						</u-field>
						<u-field v-model="serviceInfo.db" :border-bottom="false" label="db" placeholder="">
						</u-field>
					</view>
				</view>
			</u-modal>
		</view>
		<!-- #ifdef APP-PLUS -->
		<u-no-network></u-no-network>
		<!-- #endif -->
	</view>

</template>
<script>
	import api from '@/odooapi';
	import {
		authCodeArr,
		authCodes
	} from '@/common/const.js';
	import baseConfig from '@/config/index.config.js';
	import {
		mapGetters,
		mapMutations
	} from 'vuex';
	import {
		authPageTo
	} from '@/pages/tqgf/application/handler';
	export default {
		data() {
			return {
				account: '',
				password: '',
				smsCodeBtnDisabled: false,
				title: '',
				rememberPsw: uni.getStorageSync('rememberPsw') || false,
				loginLoading: false,
				env: process.env.NODE_ENV,
				serviceShow: false,
				serviceInfo: {
					http_url: this.$mStore.state.service.http_url,
					db: this.$mStore.state.service.db
				}
			};
		},
		computed: {
			...mapGetters(['auths', 'userAuth'])
		},
		mounted() {
			//缓存的账号
			const HCuname = uni.getStorageSync('HCuname');
			//缓存的密码
			const HCpassw = uni.getStorageSync('HCpassw');
			//有缓存就赋值给文本没有就清空
			if (HCuname && HCpassw) {
				this.account = HCuname;
				this.password = HCpassw;
			} else {
				this.account = '';
				this.password = '';
			}
			uni.setNavigationBarColor({
				// frontColor: '#ffffff',
				backgroundColor: this.themeColor.color,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		methods: {
			...mapMutations(['user/SET_USER_AUTH', 'service/SET_SERVICE', 'service/RESET_SERVICE']),
			zhuce() {
				this.$mRouter.reLaunch({
					route: '/pages/public/zhuce'
				});
			},
			back() {
				this.$mRouter.reLaunch({
					route: '/pages/welcome/index'
				});
			},
			//复选框
			checkboxChange: function(e) {
				if (e.detail.value.length == 1) {
					//获取缓存的账号
					uni.getStorageSync('HCuname', this.account);
					uni.getStorageSync('HCpassw', this.password);
				} else {
					uni.removeStorageSync('HCuname');
					uni.removeStorageSync('HCpassw');
				}
			},
			login() {
				if (this.account.length <= 0 || this.password.length <= 0) {
					uni.showToast({
						title: '账号或密码不能为空',
						icon: 'none'
					});
					return;
				} else {
					this.loginLoading = true;
					this.$store.dispatch('user/login', {
						account: this.account,
						password: this.password,
						rememberPsw: this.rememberPsw
					}).then((res) => {
						if (res) {
							this.$store.dispatch('user/toRoutePage');
						}
					}).finally(() => {
						this.loginLoading = false;
					})
				}
			},
			serviceConfirm() {
				this['service/SET_SERVICE']({
					http_url: this.serviceInfo.http_url,
					db: this.serviceInfo.db
				})
			},
			serviceCancel() {
				this.serviceInfo.http_url = baseConfig.baseUrl;
				this.serviceInfo.db = baseConfig.db;
				this.serviceConfirm();
			}
		}
	}
</script>
<style lang="scss">
	/****************************************************************
	 *																*		
	 * 						      代码库							*
	 *                        www.dmaku.com							*
	 *       		  努力创建完善、持续更新插件以及模板			*
	 * 																*
	****************************************************************/
	.login-page {
		height: 100vh;
		background-color: $uni-color-primary;
		position: relative;

		.icon-wangluo {
			position: absolute;
			right: 22rpx;
			top: 50rpx;
			color: #1c6ac2;
			font-size: 40rpx;
		}

		.service-modal {
			padding: 20rpx;

			/deep/ .u-label-text {
				font-size: 30rpx;
				font-weight: 600;
			}
		}
	}

	._1RxfFVyy86UE1t7lqCDcGD {
		width: 100%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	._3CkMCIo8-RsWtcLQqsuKBh {
		position: relative;
		margin: 0 auto;
		width: 50%;
		padding: 100rpx;
		box-shadow: 0 0 8rpx #9e9e9e;
		border-radius: 20rpx;
		background-color: #fff;

		.login_checkbox {
			margin-top: 36rpx;
		}

		._6vZdUKmPDGrrza0LnuXD9 {
			width: 100%;
			margin-top: 60rpx;
			height: 100rpx;
			font-size: 40rpx;
			border-radius: 20rpx;
			position: relative;

			.input {
				outline: none;
				box-sizing: border-box;
				width: 100%;
				vertical-align: middle;
				font-size: 40rpx;
				height: 116rpx;
				line-height: 116rpx;
				border: 1px solid #0081ff;
				border-radius: 20rpx;
				background-color: #fff;
				padding-left: 78px;
			}
		}

		@media (max-width: 480px) {
			& {
				width: 94%;
				padding: 50rpx 40rpx;
			}

			._6vZdUKmPDGrrza0LnuXD9 .input {
				font-size: 28rpx;
				height: 100rpx;
				line-height: 100rpx;
			}
		}
	}

	.OluSxPLBgQl3ev_JCspYT {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1;
		background-color: #f6fafc;
		border-bottom: 1px solid #dfe0e1;
		min-width: 1024px
	}

	.OluSxPLBgQl3ev_JCspYT ._2xPlqVUQGxI4on157tjnnj {
		width: 87.5%;
		margin: 0 auto;
		position: relative
	}

	._2xPlqVUQGxI4on157tjnnj {
		display: inline-block;
		vertical-align: middle;
		height: 100%;
		width: 100%;
		list-style-type: none;
		width: 87.5%;
		margin: 0 auto;
		position: relative;
		padding: 0;
		display: block
	}

	._2xPlqVUQGxI4on157tjnnj>li {
		display: inline-block;
		cursor: pointer;
		position: relative;
		list-style-type: none
	}

	._1Gd1V4un7pSNNjk-w2AkyH {
		margin-right: 50px;
		line-height: 69px;
		padding: 0 20px
	}

	._1Gd1V4un7pSNNjk-w2AkyH>a {
		font-size: 18px;
		font-weight: 700;
		color: #5e6166;
		height: 100%;
		display: inline-block
	}

	._1Gd1V4un7pSNNjk-w2AkyH._1egm4X6mNVJT4GPkva8yTs {
		float: right
	}

	._1Gd1V4un7pSNNjk-w2AkyH ._13nXs0mNGycrkvZGbShdlL {
		position: absolute;
		width: 100%;
		height: 3px;
		background-color: #64dcdc;
		bottom: -1px;
		left: 0;
		display: none
	}

	._1Gd1V4un7pSNNjk-w2AkyH._24NFVcQ5uZ3XCpto40EglI ._13nXs0mNGycrkvZGbShdlL,
	._1Gd1V4un7pSNNjk-w2AkyH:hover ._13nXs0mNGycrkvZGbShdlL {
		display: block
	}

	@media screen and (max-width:1366px) {
		._1Gd1V4un7pSNNjk-w2AkyH {
			margin-right: 30px
		}
	}

	@media screen and (max-width:1024px) {
		._1Gd1V4un7pSNNjk-w2AkyH {
			margin-right: 10px;
			padding: 0 10px
		}
	}

	._1_x_akNXPJr3mvGx2SdFry {
		height: 69px;
		width: 146px;
		float: left;
		margin-right: 90px
	}

	._1_x_akNXPJr3mvGx2SdFry a {
		height: 100%;
		width: 146px;
		display: inline-block
	}

	@media screen and (max-width:1024px) {
		._1_x_akNXPJr3mvGx2SdFry {
			margin-right: 50px
		}
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 {
		float: right;
		line-height: 69px
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 {
		position: relative
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._14YYHatAX-RcqSAb-IpUgz {
		font-size: 18px;
		color: #64dcdc;
		font-weight: 700;
		cursor: pointer
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS {
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		position: relative;
		position: absolute;
		right: 0;
		top: 69px;
		box-shadow: 0 0 10px #ecf4f8;
		line-height: normal
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS view {
		text-align: center
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS view a {
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		cursor: pointer
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS view a>span {
		text-align: center;
		font-size: 14px;
		color: #9ea0a3;
		display: block;
		margin-top: 10px
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS view a:hover span {
		color: #64dcdc
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._7oRu_7vJOHKvUvT7qnpQS ._22QfBxz2wI-uk5au7JR7W_ {
		margin-top: 40px
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._2P3n2ON_z1a1iycTy85axN {
		display: inline-block;
		width: 1px;
		height: 54px;
		background-color: #dfe0e1;
		margin: 0 23px;
		vertical-align: middle
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._2aCBwAJN9gmHHB58uEVZoB {
		width: 0;
		height: 0;
		border-left: 12.5px solid transparent;
		border-right: 12.5px solid transparent;
		border-bottom: 15px solid #fff;
		position: absolute;
		top: -15px;
		right: 34px
	}

	._2UKXTC4ocM_2Eoq2SHR7w5 ._1iok1Q_PAjkBCva9jhz6t5 ._36WvT7bsYM-xakxIh2zTV_ {
		margin-bottom: 30px
	}

	.pJiR8CNa6mK8DooGiKkMF {
		line-height: normal
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH {
		display: inline-block;
		position: fixed;
		width: 980px;
		height: 595px;
		background-color: #fff;
		border-radius: 10px;
		top: 50%;
		font-size: 0;
		left: 50%;
		z-index: 1001;
		margin-top: -275px;
		margin-left: -490px
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table {
		margin-top: 90px;
		width: 100%
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table td {
		text-align: center
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table td>p {
		font-size: 28px;
		color: #787878;
		margin-bottom: 40px;
		line-height: normal
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table td .uSandcMgQCqssOL2FqoLL {
		width: 78.8%
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2Gge_0NdPM8H5knmTWMJfn {
		width: 43.9%
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM {
		width: 100%;
		text-align: center;
		padding: 25px 0
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a {
		height: 80px;
		line-height: 80px;
		width: 81.6%;
		border-radius: 10px;
		border: 2px solid #64dcdc;
		display: inline-block;
		font-size: 24px;
		color: #64dcdc;
		cursor: pointer
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a._1XJAupUx-WzXMVKgC6EkI_,
	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a._3I-_fjtZA1D3fYE9wPI09J {
		margin-top: 60px
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a._13sLX5KBxISUOQrbZiswDo {
		margin-top: 20px
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a ._39F29_wq29MaGUU8NKkUof {
		display: inline-block;
		padding-left: 12.6%
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a ._2iqgUXik2Ku0SmFY0OwYGD {
		display: inline-block;
		padding-left: 12.6%
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active {
		background-color: #64dcdc;
		color: #fff
	}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active ._39F29_wq29MaGUU8NKkUof {}

	.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active ._2iqgUXik2Ku0SmFY0OwYGD {}

	.pJiR8CNa6mK8DooGiKkMF ._2UGwk6Y9x3giXuvs01ALit {
		width: 30px;
		height: 30px;
		display: inline-block;
		position: absolute;
		right: 20px;
		top: 20px;
		cursor: pointer;
		width: 3.07%;
		background-size: contain
	}

	.pJiR8CNa6mK8DooGiKkMF ._3XklkkBFQxShByuOCEQ5E4 {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		filter: alpha(opacity=40);
		-moz-opacity: .4;
		-khtml-opacity: .4;
		opacity: .4;
		background-color: #000;
		z-index: 999
	}

	@media (max-width:1366px) {
		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH {
			width: 698px;
			height: 450px;
			margin-top: -225px;
			margin-left: -349px
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table {
			margin-top: 60px
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM {
			padding: 15px 0
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a {
			height: 65px;
			line-height: 65px
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a._1XJAupUx-WzXMVKgC6EkI_ {
			margin-top: 30px
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a ._2iqgUXik2Ku0SmFY0OwYGD,
		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a ._39F29_wq29MaGUU8NKkUof {
			background-size: 25px
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active {
			background-color: #64dcdc;
			color: #fff
		}

		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active ._2iqgUXik2Ku0SmFY0OwYGD,
		.pJiR8CNa6mK8DooGiKkMF ._3DtbDDqrMTmJGt7ObjVaIH table ._2AuY9YqskMawROm9NtRHJM>a:active ._39F29_wq29MaGUU8NKkUof {
			background-size: 25px
		}
	}

	._3UXpE907iHrdGDSqyiVOpZ {
		position: fixed;
		height: 461px;
		width: 1318px;
		top: 50%;
		left: 50%;
		margin-top: -230.5px;
		margin-left: -659px
	}

	.wr6PJaadoh5DnTQDGywAJ {
		position: relative;
		margin: 0 auto;
		width: 410px;
		padding: 50px;
		box-shadow: 0 0 20px #ecf4f8;
		background-color: #fff
	}

	.wr6PJaadoh5DnTQDGywAJ ._2jsu-vVMYiS6K-ACKoKT29 {
		font-size: 30px;
		color: #5e6166;
		text-align: center;
		margin-bottom: 10px
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 {
		width: 100%;
		margin-top: 30px;
		position: relative
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7>view {
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		position: relative
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7>view ._1OxXlPPAWJdlWVTC5x4Rs1 {
		color: #de1c1c;
		position: absolute;
		font-size: 16px;
		padding-left: 78px;
		bottom: -20px
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7>view .mobileIcon {
		height: 100%;
		width: 78px;
		position: absolute;
		z-index: 100
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7>view .passwordIcon {
		height: 100%;
		width: 78px;
		position: absolute;
		z-index: 100
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7>view input {
		outline: none;
		box-sizing: border-box;
		width: 100%;
		vertical-align: middle;
		font-size: 20px;
		height: 58px;
		line-height: 58px;
		border: 1px solid #64dcdc;
		border-radius: 10px;
		background-color: #fff;
		padding-left: 78px
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 ._35WEaEe9upyVPjuCAKsRwO {
		height: 60px;
		line-height: 60px;
		background-color: #64dcdc;
		text-align: center;
		width: 100%;
		display: inline-block;
		border-radius: 10px;
		font-size: 24px;
		color: #fff;
		cursor: pointer
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 ._3f4Rdg3esTbRQqcKrMKq4o {
		display: inline-block
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 ._3f4Rdg3esTbRQqcKrMKq4o>a {
		color: #64dcdc;
		font-size: 20px
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 ._3f4Rdg3esTbRQqcKrMKq4o>span {
		font-size: 14px;
		color: #9ea0a3
	}

	.wr6PJaadoh5DnTQDGywAJ ._3fO-bi5F795rWsWbyK-ov7 ._8RR9S-RYIjn4y5HBe1BJz {
		float: right;
		font-size: 20px;
		color: #64dcdc
	}

	:-moz-placeholder,
	::-moz-placeholder {
		color: #dfe0e1
	}

	input:-ms-input-placeholder,
	textarea:-ms-input-placeholder {
		color: #dfe0e1
	}

	input::-webkit-input-placeholder,
	textarea::-webkit-input-placeholder {
		color: #dfe0e1
	}

	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 1000px #fff inset !important
	}

	._3-EBm8B6yCUoddpTDmFAo- {
		position: fixed;
		bottom: 22px;
		width: 100%
	}

	._3-EBm8B6yCUoddpTDmFAo->p {
		font-size: 14px;
		color: #9ea0a3;
		width: 100%;
		text-align: center
	}

	body,
	html {
		color: #5e6166;
		font-size: 16px;
		font-family: \\5FAE\8F6F\96C5\9ED1, Microsoft Yahei, arial;
		background: #fff;
		cursor: default;
		user-select: none;
		-moz-user-select: -moz-none;
		-moz-user-select: none;
		-o-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		-webkit-text-size-adjust: 100%;
		-ms-text-size-adjust: 100%;
		text-size-adjust: 100%;
		overflow-scrolling: touch;
		tap-highlight-color: transparent;
		-webkit-font-smoothing: subpixel-antialiased;
		-webkit-tap-highlight-color: rgba(0, 0, 0, 0)
	}

	*,
	body,
	html {
		margin: 0;
		padding: 0
	}

	a {
		text-decoration: none
	}

	a,
	a:active,
	a:hover,
	a:link,
	a:visited {
		color: #5e6166
	}

	._3xEWUPJtqU5GsIDzKvyXDY {
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 1;
		background-color: #f6fafc;
		border-bottom: 1px solid #dfe0e1;
		min-width: 1024px
	}

	._3xEWUPJtqU5GsIDzKvyXDY .fQJFxz0NVBYJjxCK6aVo4 {
		width: 87.5%;
		margin: 0 auto;
		position: relative
	}

	._6hIJMs2My3xFa2OBWqv89 {
		position: fixed;
		bottom: 22px;
		width: 100%
	}

	._6hIJMs2My3xFa2OBWqv89>p {
		font-size: 14px;
		color: #9ea0a3;
		width: 100%;
		text-align: center
	}

	._1qaXWjZN7UvEokSI18PWqR {
		display: inline-block;
		vertical-align: middle;
		height: 100%;
		width: 100%;
		list-style-type: none;
		width: 87.5%;
		margin: 0 auto;
		position: relative;
		padding: 0;
		display: block
	}

	._1qaXWjZN7UvEokSI18PWqR>li {
		display: inline-block;
		cursor: pointer;
		position: relative;
		list-style-type: none
	}

	.UgVQYc_moP9Q3lpKgHhYb {
		margin-right: 50px;
		line-height: 69px;
		padding: 0 20px
	}

	.UgVQYc_moP9Q3lpKgHhYb>a {
		font-size: 18px;
		font-weight: 700;
		color: #5e6166;
		height: 100%;
		display: inline-block
	}

	.UgVQYc_moP9Q3lpKgHhYb._1jJQvNZXPHCvNl37dXaQp2 {
		float: right
	}

	.UgVQYc_moP9Q3lpKgHhYb .e7-j_peYFawMOtFO0e5EK {
		position: absolute;
		width: 100%;
		height: 3px;
		background-color: #64dcdc;
		bottom: -1px;
		left: 0;
		display: none
	}

	.UgVQYc_moP9Q3lpKgHhYb._16lIi5oKGm8JXO9GzGx3p5 .e7-j_peYFawMOtFO0e5EK,
	.UgVQYc_moP9Q3lpKgHhYb:hover .e7-j_peYFawMOtFO0e5EK {
		display: block
	}

	@media screen and (max-width:1366px) {
		.UgVQYc_moP9Q3lpKgHhYb {
			margin-right: 30px
		}
	}

	@media screen and (max-width:1024px) {
		.UgVQYc_moP9Q3lpKgHhYb {
			margin-right: 10px;
			padding: 0 10px
		}
	}

	._3wYoct-6EyTK3rUrBbARcN {
		height: 69px;
		width: 146px;
		float: left;
		margin-right: 90px
	}

	._3wYoct-6EyTK3rUrBbARcN a {
		height: 100%;
		width: 146px;
		display: inline-block
	}

	@media screen and (max-width:1024px) {
		._3wYoct-6EyTK3rUrBbARcN {
			margin-right: 50px
		}
	}

	._2ML-fOhi5-QyuDaC2l7yyy {
		padding-left: 30px
	}

	._1DU56wBPfdfPIkc97NrFin {
		line-height: normal
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo {
		display: inline-block;
		position: fixed;
		width: 980px;
		height: 595px;
		background-color: #fff;
		border-radius: 10px;
		top: 50%;
		font-size: 0;
		left: 50%;
		z-index: 1001;
		margin-top: -275px;
		margin-left: -490px
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table {
		margin-top: 90px;
		width: 100%
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table td {
		text-align: center
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table td>p {
		font-size: 28px;
		color: #787878;
		margin-bottom: 40px;
		line-height: normal
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table td ._3Q4feTOPpQ4c_p1Flj8ROi {
		width: 78.8%
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1QnTKnlG6QIr3tdjazZHWo {
		width: 43.9%
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a {
		width: 100%;
		text-align: center;
		padding: 25px 0
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a {
		height: 80px;
		line-height: 80px;
		width: 81.6%;
		border-radius: 10px;
		border: 2px solid #64dcdc;
		display: inline-block;
		font-size: 24px;
		color: #64dcdc;
		cursor: pointer
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a._2z6mMVl6Vx0fcjaCEdjYX8,
	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a._10W0arS4bNkmIySjAeCApT {
		margin-top: 60px
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a._24454BeDYQ79A8ozgOzKwZ {
		margin-top: 20px
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a ._1sbKhdgUsl3CKESiZvjlU4 {
		display: inline-block;
		padding-left: 12.6%
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a ._1KX71O3GAm3TPVeE10G2pP {
		display: inline-block;
		padding-left: 12.6%
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active {
		background-color: #64dcdc;
		color: #fff
	}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active ._1sbKhdgUsl3CKESiZvjlU4 {}

	._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active ._1KX71O3GAm3TPVeE10G2pP {}

	._1DU56wBPfdfPIkc97NrFin .voMvYxBJmCF55jIxZPonW {
		width: 30px;
		height: 30px;
		display: inline-block;
		position: absolute;
		right: 20px;
		top: 20px;
		cursor: pointer;
		width: 3.07%;
		background-size: contain
	}

	._1DU56wBPfdfPIkc97NrFin ._3-C2I3fgbRPXcHnb4bdzL8 {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
		filter: alpha(opacity=40);
		-moz-opacity: .4;
		-khtml-opacity: .4;
		opacity: .4;
		background-color: #000;
		z-index: 999
	}

	@media (max-width:1366px) {
		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo {
			width: 698px;
			height: 450px;
			margin-top: -225px;
			margin-left: -349px
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table {
			margin-top: 60px
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a {
			padding: 15px 0
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a {
			height: 65px;
			line-height: 65px
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a._2z6mMVl6Vx0fcjaCEdjYX8 {
			margin-top: 30px
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a ._1KX71O3GAm3TPVeE10G2pP,
		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a ._1sbKhdgUsl3CKESiZvjlU4 {
			background-size: 25px
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active {
			background-color: #64dcdc;
			color: #fff
		}

		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active ._1KX71O3GAm3TPVeE10G2pP,
		._1DU56wBPfdfPIkc97NrFin ._3m6nJNQ8EKuohN69KaXnwo table ._1pYrw20jRspzC5vXdtad3a>a:active ._1sbKhdgUsl3CKESiZvjlU4 {
			background-size: 25px
		}
	}

	._3RPczLcq0BEbX_kaTE160L {
		float: right;
		line-height: 69px
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S {
		position: relative
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._1cwBesvqKiil7hwtU5PUE9 {
		font-size: 18px;
		color: #64dcdc;
		font-weight: 700;
		cursor: pointer
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo {
		background-color: #fff;
		padding: 30px;
		border-radius: 10px;
		position: relative;
		position: absolute;
		right: 0;
		top: 69px;
		box-shadow: 0 0 10px #ecf4f8;
		line-height: normal
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo view {
		text-align: center
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo view a {
		display: inline-block;
		text-align: center;
		vertical-align: middle;
		cursor: pointer
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo view a>span {
		text-align: center;
		font-size: 14px;
		color: #9ea0a3;
		display: block;
		margin-top: 10px
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo view a:hover span {
		color: #64dcdc
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._17Hz5rtfrXSGiTXB2aPUJo ._-BezEYRwJ_uWNo30r439B {
		margin-top: 40px
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S ._2SLAP1Pj1Vnp_66fND2Zc_ {
		display: inline-block;
		width: 1px;
		height: 54px;
		background-color: #dfe0e1;
		margin: 0 23px;
		vertical-align: middle
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S .iPuAmDy6im1tswl7YncPP {
		width: 0;
		height: 0;
		border-left: 12.5px solid transparent;
		border-right: 12.5px solid transparent;
		border-bottom: 15px solid #fff;
		position: absolute;
		top: -15px;
		right: 34px
	}

	._3RPczLcq0BEbX_kaTE160L ._2rjGbw-rF8zkwLyuZez68S .Uqx5Jqg0o7-q_j7rERYwF {
		margin-bottom: 30px
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._3lr3h2hawOi8pO8fYLQcjI {
		font-size: 30px;
		color: #5e6166;
		text-align: center;
	}



	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9>view {
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		position: relative;
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9>view ._2nSTvdgBwioyepYsyeaVPN {
		color: #de1c1c;
		position: absolute;
		font-size: 16px;
		padding-left: 78px;
		bottom: -20px;
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9>view .mobileIcon {
		background: url('../../static/images/58c38ccd7649b3bd12e00a5f97987a1e.png') no-repeat 50%;
		height: 100%;
		width: 78px;
		position: absolute;
		z-index: 100;
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9>view .passwordIcon {
		background: url('../../static/images/443aac86619299d3bc62a6ca45d1c8d8.png') no-repeat 50%;
		height: 100%;
		width: 78px;
		position: absolute;
		z-index: 100;
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9 ._2ZggRBvDTyawWaQQ6ambu4 {
		height: 60px;
		line-height: 60px;
		background-color: #0081ff;
		text-align: center;
		width: 100%;
		display: inline-block;
		border-radius: 10px;
		font-size: 24px;
		color: #fff;
		cursor: pointer;
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9 ._2owYBOfa1UIX-AfegSAhj7 {
		display: inline-block
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9 ._2owYBOfa1UIX-AfegSAhj7>a {
		color: #0081ff;
		font-size: 20px
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9 ._2owYBOfa1UIX-AfegSAhj7>span {
		font-size: 14px;
		color: #9ea0a3
	}

	._3CkMCIo8-RsWtcLQqsuKBh ._6vZdUKmPDGrrza0LnuXD9 ._3x9qBnGOvjSE2ZmDfi1w5g {
		float: right;
		font-size: 20px;
		color: #64dcdc
	}

	:-moz-placeholder,
	::-moz-placeholder {
		color: #dfe0e1
	}

	input:-ms-input-placeholder,
	textarea:-ms-input-placeholder {
		color: #dfe0e1
	}

	input::-webkit-input-placeholder,
	textarea::-webkit-input-placeholder {
		color: #dfe0e1
	}

	input:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 1000px #fff inset !important
	}
</style>