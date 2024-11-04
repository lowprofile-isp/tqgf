import {
	authCodes
} from '@/common/const.js';
export const authPageTo = (authCode) => {
	let url = '';
	switch (authCode) {
		case authCodes.TASK:
			url = '/pages/tqgf/application/taskScan/index'
			break;
		case authCodes.PS:
			url = '/pages/tqgf/application/productSearchScan/index'
			break;
		case authCodes.ST:
			url = '/pages/tqgf/application/sortingScan/index'
			break;
		case authCodes.ZY:
			url = '/pages/tqgf/application/materialManagementScan/index'
			break;
		case authCodes.ER:
			url = '/pages/tqgf/application/errorPush/index'
			break;
		case authCodes.YCCL:
			url = '/pages/tqgf/application/errorAccept/index'
			break;
		case authCodes.KG:
			url = '/pages/tqgf/application/equipmentOperationScan/index'
			break;
		case authCodes.EPA:
			url = '/pages/tqgf/application/safeEpa/index'
			break;
		case authCodes.TAKE:
			url = '/pages/tqgf/application/takeStockScan/index'
			break;
		case authCodes.CPRK:
			url = '/pages/tqgf/application/finishedEnterProductScan/index'
			break;
		case authCodes.CPCK:
			url = '/pages/tqgf/application/finishedOutProductScan/index'
			break;
		case authCodes.CGRK:
			url = '/pages/tqgf/application/procurementStock/index'
			break;
		case authCodes.SCLL:
			url = '/pages/tqgf/application/getMaterials/index'
			break;
		case authCodes.SJSB:
			url = '/pages/tqgf/application/dataReport/index'
			break;
		case authCodes.NOTICE:
			url = '/pages/tqgf/message_notification/index'
			break;
	}
	return url
}