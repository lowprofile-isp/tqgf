<template>
	<view class="content">
		<view style="text-align: center;">
			<image src="../../static/log.png" style="width: 300upx;height: 300upx; margin-top:220upx"></image>
		</view>
		<view class="login_from">
			<view class="login_from_input">
				<view class="login_from_name">账号:</view>
				<view class="login_from_fun"><input type="text" v-model="account" placeholder="请输入账号"></view>
			</view>

			<view class="login_from_input">
				<view class="login_from_name">密码:</view>
				<view class="login_from_fun"><input type="digit" v-model="password" password="true"
						placeholder="请输入登录密码"></view>
			</view>

			<view class="login_from_input">
				<view class="login_from_name">确认密码:</view>
				<view class="login_from_fun"><input type="digit" v-model="passwordQueren" password="true"
						placeholder="请输入登录密码"></view>
			</view>

			<!-- <view class="login_from_input">
				<view class="login_from_name">验证码</view>
				<view class="login_from_fun">
					<input style="width: 40%; text-align: left" type="digit" maxlength="6" placeholder="验证码">
					<label class="regFrom_tom_yzlabel" :style="{ color : QzyzmStare?'#cccccc':'#2ebbfe'}"
						@click="Qzyzm">{{Qztime}}{{Qztext}}</label>
				</view>
			</view> -->

			<view class="login_from_dl">
				<button @click="denglu">注册</button>
			</view>

			<view class="logo_xieyi">
				<u-checkbox v-model="gouxSta" @click="moutcl"></u-checkbox>
				<view class="logo_text" @click="showDetail">请勾选并阅读<text>《注册协议及隐私协议》</text></view>
			</view>

		</view>
		<u-toast ref="uToast" />
		<u-popup mode="bottom" v-model="showInfo" height="1000upx" :mask-close-able="maskCloseAble">
			<view class="content" style="padding: 20upx;">
				<scroll-view scroll-y="true">
					<view>
						<p style="text-align: center; font-size: 34upx; color:rgb(0, 0, 0)">用户注册及使用APP隐私协议</p>
						<view style="text-indent:30px;">在此特别提醒您（用户）在注册成为用户之前，请认真阅读本《用户协议》（以下简称“协议”），确保您充分理解本协议中各条款。请您审慎阅读并选择接受或不接受本协议。您的注册、登录、使用等行为将视为对本协议的接受，并同意接受本协议各项条款的约束。本协议约定航天智融信息技术（珠海）有限责任公司（以下简称“航天智融”）与用户之间关于“智融ERP”软件服务（以下简称“服务“）的权利义务。“用户”是指注册、登录、使用本服务的个人。本协议可由航天智融随时更新，更新后的协议条款一旦公布即代替原来的协议条款，恕不再另行通知。在修改协议条款后，如果用户不接受修改后的条款，请立即停止使用智课堂平台提供的服务，用户继续使用服务将被视为接受修改后的协议。
						</view>
						<p style="font-size: 34upx; color:rgb(0, 0, 0); margin:9upx 0">一、用户个人隐私信息保护</p>
						<view style="text-indent:30px;">1.
						如果航天智融发现或收到他人举报或投诉用户违反本协议约定的，航天智融有权不经通知随时对相关内容，包括但不限于用户资料、发贴记录进行审查、删除，并视情节轻重对违规账号处以包括但不限于警告、账号封禁
						、设备封禁 、功能封禁 的处罚，且通知用户处理结果。</view>
						<view style="text-indent:30px;">2.
						因违反用户协议被封禁的用户，可以自行与航天智融联系。其中，被实施功能封禁的用户会在封禁期届满后自动恢复被封禁功能。被封禁用户可提交申诉，航天智融将对申诉进行审查，并自行合理判断决定是否变更处罚措施。</view>
						<view style="text-indent:30px;">3.
						用户理解并同意，航天智融有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应承担由此而产生的一切法律责任。</view>
						<view style="text-indent:30px;">4. 用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失，包括合理的律师费，用户应当赔偿航天智融与合作公司、关联公司，并使之免受损害。</view>

						<p style="font-size: 34upx; color:rgb(0, 0, 0); margin:9upx 0">二、用户发布内容规范</p>
						<view style="text-indent:30px;">1.
						本条所述内容是指用户使用服务的过程中所制作、上载、复制、发布、传播的任何内容，包括但不限于账号头像、名称、用户说明等注册信息及认证资料，或文字、语音、图片、视频、图文等发送、回复或自动回复消息和相关链接页面，以及其他使用账号或本服务所产生的内容。</view>
						<view style="text-indent:15px;">2. 用户不得利用“航天智融”账号或本服务制作、上载、复制、发布、传播如下法律、法规和政策禁止的内容：</view>
						<view style="text-indent:15px;">(1) 反对宪法所确定的基本原则的；</view>
						<view style="text-indent:15px;">(2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</view>
						<view style="text-indent:15px;">(3) 损害国家荣誉和利益的；</view>
						<view style="text-indent:15px;">(4) 煽动民族仇恨、民族歧视，破坏民族团结的；</view>
						<view style="text-indent:15px;">(5) 破坏国家宗教政策，宣扬邪教和封建迷信的；</view>
						<view style="text-indent:15px;">(6) 散布谣言，扰乱社会秩序，破坏社会稳定的；</view>
						<view style="text-indent:15px;">(7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</view>
						<view style="text-indent:15px;">(8) 侮辱或者诽谤他人，侵害他人合法权益的；</view>
						<view style="text-indent:15px;">(9) 含有法律、行政法规禁止的其他内容的信息；</view>
						<view style="text-indent:30px;">3. 用户不得利用“航天智融”账号或本服务制作、上载、复制、发布、传播如下干扰“服务”正常运营，以及侵犯其他用户或第三方合法权益的内容：</view>
						<view style="text-indent:15px;">(1) 含有任何性或性暗示的；</view>
						<view style="text-indent:15px;">(2) 含有辱骂、恐吓、威胁内容的；</view>
						<view style="text-indent:15px;">(3) 含有骚扰、垃圾广告、恶意信息、诱骗信息的；</view>
						<view style="text-indent:15px;">(4) 涉及他人隐私、个人信息或资料的；</view>
						<view style="text-indent:15px;">(5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利的；</view>
						<view style="text-indent:15px;">(6) 含有其他干扰本服务正常运营和侵犯其他用户或第三方合法权益内容的信息；</view>
						<p style="font-size: 34upx; color:rgb(0, 0, 0); margin:9upx 0">三、使用规则</p>
						<view style="text-indent:30px;">1. 用户在本服务中或通过本服务所传送、发布的任何内容并不反映或代表，也不得被视为反映或代表航天智融的观点、立场或政策，航天智融对此不承担任何责任。</view>
						<view style="text-indent:30px;">2. 用户不得利用“航天智融”账号或本服务进行如下行为：</view>
						<view style="text-indent:15px;">(1) 提交、发布虚假信息，或盗用他人头像或资料，冒充、利用他人名义的；</view>
						<view style="text-indent:15px;">(2) 强制、诱导其他用户关注、点击链接页面或分享信息的；</view>
						<view style="text-indent:15px;">(3) 虚构事实、隐瞒真相以误导、欺骗他人的；</view>
						<view style="text-indent:15px;">(4) 利用技术手段批量建立虚假账号的；</view>
						<view style="text-indent:15px;">(5) 利用“航天智融”账号或本服务从事任何违法犯罪活动的；</view>
						<view style="text-indent:15px;">(6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播，无论这些行为是否为商业目的；</view>
						<view style="text-indent:15px;">(7) 其他违反法律法规规定、侵犯其他用户合法权益、干扰“航天智融”正常运营或服务未明示授权的行为。</view>
						<view style="text-indent:30px;">3. 用户须对利用“智课堂”账号或本服务传送信息的真实性、合法性、无害性、准确性、有效性等全权负责，与用户所传播的信息相关的任何法律责任由用户自行承担，与航天智融无关。
						如因此给航天智融或第三方造成损害的，用户应当依法予以赔偿。</view>
						<view style="text-indent:30px;">4.航天智融提供的服务中可能包括广告，用户同意在使用过程中显示航天智融和第三方供应商、合作伙伴提供的广告。除法律法规明确规定外，用户应自行对依该广告信息进行的交易负责，
						对用户因依该广告信息进行的交易或前述广告商提供的内容而遭受的损失或损害，航天智融不承担任何责任。
						本《协议》版权由航天智融所有，航天智融保留一切对本《协议》解释的权利。</view>
						<p style="font-size: 34upx; color:rgb(0, 0, 0); margin:9upx 0">四、其他</p>
						<view style="text-indent:30px;">1.本《协议》版权由航天智融所有，航天智融保留一切对本《协议》解释的权利。</view>
						<view style="text-indent:30px;">2.
						本协议的效力、解释及纠纷的解决，适用于中华人民共和国法律。若用户和航天智融之间发生任何纠纷或争议，首先应友好协商解决，协商不成的，用户同意将纠纷或争议提交航天智融住所地有管辖权的人民法院管辖。</view>
						<view style="text-indent:30px;">3. 本协议的任何条款无论因何种原因无效或不具可执行性，其余条款仍有效，对双方具有约束力。
						本《协议》版权由航天智融所有，航天智融保留一切对本《协议》解释的权利。</view>
					</view>
					<button style="background-color: rgb(22, 130, 252); color:#fff" @click="closeDateil">我已阅读并知晓</button>
				</scroll-view>
			</view>
		</u-popup>
	</view>
</template>
<script>
	export default {

		data() {
			return {
				account: '',
				kongge:'    ',
				password: '',
				passwordQueren: '',
				maskCloseAble:true,
				showInfo: false,
				gouxSta: true,
				Qztime: '',
				QzyzmStare: false,
				// Qztext: '获取验证码'
			}
		},
		onLoad() {},
		onReady() {
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
			showDetail() {
				this.showInfo = true;
				this.maskCloseAble = false;
			},
			closeDateil(){
				this.showInfo = false;
			},
			moutcl() {
				if (this.gouxSta == true) {
					this.gouxSta = false
				} else {
					this.gouxSta = false
				}
			},
			denglu() {
				if (this.gouxSta == false) {
					uni.showToast({
						"title": "请阅读并勾选用户协议",
						"icon": 'none'
					})
				} else {
					if (this.account != '' && this.password != '' && this.passwordQueren != '') {
						if (this.password != this.passwordQueren) {
							this.$refs.uToast.show({
								title: '密码不一致,请重新输入',
								type: 'error',
							})
						} else {
							this.$refs.uToast.show({
								title: '注册成功,即将返回登录页面',
								type: 'success',
							})
							setTimeout(() => {
								this.$mRouter.reLaunch({
									route: '/pages/public/login'
								});
							}, 1000)
						}
					} else {
						this.$refs.uToast.show({
							title: '输入不能为空',
							type: 'warning',
						})
					}
				}
			},
			Qzyzm() {
				var num = 60;
				if (this.QzyzmStare == false) {
					this.Qztime = '60';
					this.Qztext = 's后获取';
					this.QzyzmStare = true;
					var interval = setInterval(() => {
						--this.Qztime
					}, 1000)
					setTimeout(() => {
						clearInterval(interval)
						this.Qztext = '获取验证码'
						this.Qztime = ''
						this.QzyzmStare = false
					}, 60000)
				}
			},
		}
	}
</script>
<style>
	page {
		background: #fff;
	}

	.login_img {
		width: 100%;
		height: auto;
		margin-top: 90upx;
	}

	.login_img image {
		width: 170upx;
		height: 170upx;
		display: block;
		margin: 0px auto;
		border-radius: 50%;
	}

	.login_from {
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 20upx 8%;
	}

	.login_from_input {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px #eee solid;
		padding: 40upx 0px;
		margin: 0px auto;
	}

	.login_from_name {
		width: 30%;
		font-size: 32upx;
	}

	.login_from_fun {
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		align-items: center;
	}

	.login_from_fun input {
		width: 100%;
		text-align: left;
		font-size: 14px;
	}


	.login_from_dl {
		width: 100%;
		height: 50px;
		line-height: 50px;
		margin-top: 150upx;
	}

	.login_from_dl button {
		width: 100%;
		height: 50px;
		line-height: 50px;
		background: rgb(22, 130, 252);
		color: #fff;
		border-radius: 50px;
	}

	.logo_xieyi {
		width: 100%;
		height: 40px;
		line-height: 40px;
		display: flex;
		flex-direction: row;
		margin-top: 30upx;
		align-items: center;
		color: #444;
		font-size: 14px;
		justify-content: center;
	}

	.logo_xieyi label {
		font-size: 18px;
		margin-right: 1%;
		display: block;
		width: 15px;
		height: 15px;
	}

	.cuIcon-squarecheckfill {
		color: #FF3B00;
	}

	.logo_text text {
		color: #FF3B00;
	}

	.getyzm {
		width: 60%;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
		color: #FF3B00;
	}

	.cuicon {
		font-size: 18px;
	}

	.regFrom_tom_yzlabel {
		width: 60%;
		text-align: right;
	}

	.cuIcon-squarecheckfill {
		background: #FF3B00;
		position: relative;
		border: 2px #ccc solid;
		box-sizing: border-box;
		border-radius: 3px;
	}

	.cuIcon-square {
		background: #fff;
		border: 2px #ccc solid;
		box-sizing: border-box;
		border-radius: 3px;
	}
</style>
