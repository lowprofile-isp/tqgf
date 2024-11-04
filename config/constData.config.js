export default {
	// app应用名称
	appName: 'smart',

	// 验证码发送间隔
	sendCodeTime: 60,

	// 设置-设置中心
	setList: [
		{
			title: '修改密码',
			url: '/pages/public/password?type=1',
			content: ''
		},
		{
			title: '清除缓存',
			url: '',
			content: ''
		},
		{
			title: '关于我们',
			url: '',
			content: '',
			class: 'mT'
		},
		/*  #ifdef APP-PLUS  */
		{
			title: '检查更新',
			url: '',
			content: ''
		},
		/*  #endif  */
		{
			title: '账户注销',
			url: '',
			content: ''
		},
	],
};