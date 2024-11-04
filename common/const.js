export const authCodes = {
	QI: 'QI', //质量检验
	PR: 'PR', //生产
	// WL: 'WL', //仓储物流
	KG: 'KG', //设备上下工
	ZY: 'ZY', //物料周转
	ST: 'ST', //称重分拣
	EPA: 'EPA', //安环巡检
	ER: 'ER', //异常上报
	YCCL: 'YCCL', //异常处理
	TASK: 'TASK', //任务待办
	PS: 'PS', //信息查询
	TAKE: 'TAKE', //库房盘点
	CPRK: 'CPRK', //产品入库
	CPCK: 'CPCK', //产品出库
	CGRK: 'CGRK', //采购入库
	SCLL: 'SCLL', //生产领料
	SJSB: 'SJSB', //生产记录
	NOTICE: 'NOTICE', //消息通知
}

export const authCodeArr = [authCodes.TASK, authCodes.PS, authCodes.ST, authCodes.ZY, authCodes.ER, authCodes.KG,
	authCodes.EPA, authCodes.CPRK, authCodes.CPCK, authCodes.CGRK, authCodes.SCLL,
	authCodes.SJSB, authCodes.YCCL, authCodes.NOTICE, authCodes.TAKE
]

export const groupSigns = {
	'JISHU': 'mrp_plm.group_plm_user'
}