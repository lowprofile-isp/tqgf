export default {
	uid: (state) => state.uid,
	tabBarList: (state) => state.tabbar.tabBarList,
	userAuth: (state) => state.user.userAuth,
	auths: (state) => state.user.auths,
	theme: (state) => state.theme.theme,
	isPad: (state) => state.isPad,
	navBarHeight: (state) => state.navBarHeight,
	errorNoticeList: (state) => state.errorNoticeList,
	msgCount: (state) => state.notification.count,
	msgList: (state) => state.notification.msgList,
	msgSumCount: (state) => state.notification.sumCount,
	repairCount: (state) => state.tabbar.repairCount,
}