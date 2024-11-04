import {
	authCodes
} from '@/common/const.js';
const public_tabbar = [{
	"pagePath": "/pages/tqgf/workcenter/index",
	"text": "工作中心",
	"iconPath": "/static/tabbar/application.png",
	"selectedIconPath": "/static/tabbar/application-active.png"
},{
	"pagePath": "/pages/tqgf/message_notification/index",
	"text": "消息",
	"iconPath": "/static/tabbar/tz.png",
	"selectedIconPath": "/static/tabbar/tz-active.png"
},{
	"pagePath": "/pages/tqgf/user_info/index",
	"text": "我的",
	"iconPath": "/static/tabbar/user.png",
	"selectedIconPath": "/static/tabbar/user-active.png"
}]
// 质检员
const zj_tabbar = [
	// {
	// 	"pagePath": "/pages/tqgf/application/quality_check/check_record",
	// 	"text": "检测记录",
	// 	"iconPath": "/static/tabbar/check_record.png",
	// 	"selectedIconPath": "/static/tabbar/check_record-active.png",
	// },
	{
		"pagePath": "/pages/tqgf/application/quality_check/mrp_production",
		"text": "质量检测",
		"iconPath": "/static/tabbar/zl.png",
		"selectedIconPath": "/static/tabbar/zl-active.png",
		"midButton": true,
	}
]
// 生产报工
const sc_tabbar = [
	// {
	// 	"pagePath": "/pages/tqgf/application/production/reportedwork_record",
	// 	"text": "生产记录",
	// 	"iconPath": "/static/tabbar/check_record.png",
	// 	"selectedIconPath": "/static/tabbar/check_record-active.png",
	// },
	// {
	// 	"pagePath": "/pages/tqgf/application/production/repair",
	// 	"text": "维修工单",
	// 	"iconPath": "/static/tabbar/check_record.png",
	// 	"selectedIconPath": "/static/tabbar/check_record-active.png",
	// },
	{
		"pagePath": "/pages/tqgf/application/production/index",
		"text": "生产报工",
		"iconPath": "/static/tabbar/check_record.png",
		"selectedIconPath": "/static/tabbar/check_record-active.png",
		"midButton": true,
	}
]

export default {
	[authCodes.QI]: zj_tabbar,
	[authCodes.PR]: sc_tabbar,
	public_tabbar
}