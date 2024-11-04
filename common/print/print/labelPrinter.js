import {
	isFalse
} from "../../checker";

export async function printLotBatch(printer, contents) {
	if (contents?.length === 0) {
		return
	}
	const content = contents.shift();
	await printer.print(70, 50, command => {
		// 创建盒子
		// command.setBox(1, 1, 91, 98);
		// 第一行
		command.setVerticalText(2, 55, '物料名称：' + content.name, {
			xScale: 1,
			yScale: 1,
			font: 'TSS24.BF2'
		});
		command.setVerticalText(2, 65, '物料编码：' + content.product_code, {
			xScale: 1,
			yScale: 1,
			font: 'TSS24.BF2'
		});
		command.setVerticalText(2, 75, '批次：' + content.barcode, {
			xScale: 1,
			yScale: 1,
			font: 'TSS24.BF2'
		});
		command.setVerticalText(2, 85, '数量：' + content.quantity, {
			xScale: 1,
			yScale: 1,
			font: 'TSS24.BF2'
		});
		// command.setBarCode(1, 35, '128', 95, 1, 2, 1, 'GJ240726ZC01/GJ36TJB-24-0730-016')
		command.setQrCode(32, 5, content.barcode, 5)
		// 分割线
		// command.setBarHeng(1, 18, 50);
		// // 第二行
		// command.setVerticalText(10, 20, '住院号');
		// command.setVerticalText(50, 20, content.hospitalNumber);
		// // 分割线
		// command.setBarHeng(5, 27, 60);
		// // 二维码
		// command.setQrCode(19, 30, content.qrcodeContent, 14);
		// command.setVerticalText(10, 95, '日期');
		// command.setVerticalText(25, 95, content.uploadTime);
	});
	printLotBatch(printer, contents)
}
export async function printLot(printer, content) {
	await printer.print(50, 30, command => {
		// 创建盒子
		// command.setBox(1, 1, 91, 98);
		// 第一行
		command.setVerticalText(5, 45, content.name, {
			xScale: 1,
			yScale: 1,
			font: 'TSS24.BF2'
		});
		command.setVerticalText(5, 65, content.barcode, {
			xScale: 1,
			yScale: 1,
			font: '2'
		});
		// command.setBarCode(1, 35, '128', 95, 1, 2, 1, 'GJ240726ZC01/GJ36TJB-24-0730-016')
		command.setQrCode(55, 20, content.barcode, 5)
		// 分割线
		// command.setBarHeng(1, 18, 50);
		// // 第二行
		// command.setVerticalText(10, 20, '住院号');
		// command.setVerticalText(50, 20, content.hospitalNumber);
		// // 分割线
		// command.setBarHeng(5, 27, 60);
		// // 二维码
		// command.setQrCode(19, 30, content.qrcodeContent, 14);
		// command.setVerticalText(10, 95, '日期');
		// command.setVerticalText(25, 95, content.uploadTime);
	});
}
export async function printLotCPCL(printer, contents) {
	let strs = contents.map((data) => {
		let str = " ! 0 200 250 400 1 " + '\r\n';
		// 设置打印纸张宽度
		str += "PAGE-WIDTH 600" + '\r\n';
		// 标签内容
		// 文本 {command} {font} {size} {x} {y} {data}
		// str += "TEXT 24 0 30 50 " + "物料名称: " + "弹丝[A247483294782394]" + "\r\n";
		// 二维码 {command} {type} {x} {y} [M n] [U n] {data}
		str += "B QR 380 170 M 2 U 6" + '\r\n';
		str += "MA," + data.barcode + "\r\n";
		str += "ENDQR" + '\r\n';

		str += "TEXT 24 0 30 30 订单编号: " + data.order + "\r\n";
		str += "TEXT 24 0 30 80 物料名称: " + data.name + "\r\n";
		str += "TEXT 24 0 30 130 批次: " + data.barcode + "\r\n";
		// if (!isFalse(data.quantity)) {
		str += "TEXT 24 0 30 180 数量: " + data.quantity + "\r\n";
		// }
		str += "TEXT 24 0 30 230 型号: " + data.model_name + "\r\n";
		str += "TEXT 24 0 30 280 作业员: " + data.user + "\r\n";
		str += "TEXT 24 0 30 330 下一单号: " + data.next_order + "\r\n";
		// 标签结束
		str += "GAP-SENSE" + '\r\n';
		str += "FORM " + '\r\n';
		str += "PRINT " + '\r\n';
		return str;
	})
	printer.printStart(strs)
}
export async function printCGRKLotCPCL(printer, contents) {
	let strs = contents.map((data) => {
		let str = " ! 0 200 250 450 1 " + '\r\n';
		// 设置打印纸张宽度
		str += "PAGE-WIDTH 600" + '\r\n';
		// 标签内容
		// 文本 {command} {font} {size} {x} {y} {data}
		// str += "TEXT 24 0 30 50 " + "物料名称: " + "弹丝[A247483294782394]" + "\r\n";
		// 二维码 {command} {type} {x} {y} [M n] [U n] {data}
		str += "B QR 360 260 M 2 U 8" + '\r\n';
		str += "MA," + data.barcode + "\r\n";
		str += "ENDQR" + '\r\n';
		str += "SETMAG 2 2" + '\r\n';
		str += "TEXT 24 0 30 50 " + data.name + "\r\n";
		str += "TEXT 24 0 30 120 " + data.product_code + "\r\n";
		str += "TEXT 24 0 30 190 " + data.barcode + "\r\n";
		// if (!isFalse(data.quantity)) {
		str += "TEXT 24 0 30 260 " + data.quantity + "\r\n";
		// }
		// 标签结束
		str += "GAP-SENSE" + '\r\n';
		str += "FORM " + '\r\n';
		str += "PRINT " + '\r\n';
		return str;
	})
	printer.printStart(strs)
}
export async function printMaCPCL(printer, data) {
	let str = " ! 0 200 200 400 1 " + '\r\n';
	// 设置打印纸张宽度
	str += "PAGE-WIDTH 600" + '\r\n';
	// 标签内容
	// 文本 {command} {font} {size} {x} {y} {data}
	// str += "TEXT 24 0 30 50 " + "物料名称: " + "弹丝[A247483294782394]" + "\r\n";
	// 二维码 {command} {type} {x} {y} [M n] [U n] {data}
	str += "B QR 350 220 M 2 U 6" + '\r\n';
	str += "MA," + data.barcode + "\r\n";
	str += "ENDQR" + '\r\n';

	str += "TEXT 24 0 30 40 送检单号: " + data.order_name + "\r\n";
	str += "TEXT 24 0 30 80 物料名称: " + data.name + "\r\n";
	str += "TEXT 24 0 30 120 送检批次: " + data.barcode + "\r\n";
	str += "TEXT 24 0 30 160 送检日期: " + data.date + "\r\n";
	if (!isFalse(data.quantity)) {
		str += "TEXT 24 0 30 200 送检数量: " + data.quantity + "\r\n";
	}
	// 标签结束
	str += "GAP-SENSE" + '\r\n';
	str += "FORM " + '\r\n';
	str += "PRINT " + '\r\n';
	printer.printStart([str])
}