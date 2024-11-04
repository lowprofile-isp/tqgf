/**
 * 列表操作按钮菜单渲染处理
 * @param {Object} listItem 当前列数据
 * @param {Array} prevList 处理前的数据
 * @return {Array} 处理后的数据
 */
export const renderOptionMenu = (listItem = {}, prevList = [], isRepair) => {
	let menuList = [];
	let working_state = listItem?.working_state || null
	let state = listItem?.state || null
	let is_user_working = listItem.is_user_working
	if (state === 'ready') {
		menuList = prevList.filter(menu => menu.value === 'button_start');
		// if (listItem.is_picking && !listItem.is_verify) {
	} else if (listItem.state === 'waiting') {
		menuList = prevList.filter(menu => menu.value === 'button_accept' || menu.value === '');
	} else if (state === 'progress' && (working_state === 'done' || working_state === 'normal')) {
		if (is_user_working === false) {
			menuList = prevList.filter(menu => menu.value === 'button_continue' || menu.value === 'scsb');
		} else {
			menuList = prevList.filter(menu => menu.value === 'button_pending' || menu.value ===
				'button_finish' || menu.value === 'scsb');
		}
		// } else if (listItem.workcenter_id && listItem.workcenter_id[0] == 4) {
	} else {
		if (listItem.production_state === 'to_close') {
			menuList = prevList.filter(menu => menu.value === 'button_mark_done');
		} else {
			// menuList = prevList.filter(menu => menu.value === 'production_done');
		}
	}
	if (state === 'ready' || state === 'progress') {
		if (!listItem.is_verify) {
			menuList = [...prevList.filter(menu => menu.value === 'hl'), ...menuList];
		} else if (!listItem.is_picking) {
			// menuList = [...menuList, ...prevList.filter(menu => menu.value === 'll')];
		}
	}

	// if (working_state === 'blocked') {
	// 	menuList = [...menuList, ...prevList.filter(menu => menu.value === 'button_unblock')];
	// } else {
	// 	menuList = [...menuList, ...prevList.filter(menu => menu.value === 'button_block')];
	// }
	if (isRepair) {
		if (listItem.repair_state === 'to_be_repaired') {
			menuList = prevList.filter(menu => menu.value === 'do_repaired');
		}
		// else if (listItem.repair_state === 'repaired' && listItem.state === 'done' && listItem.check_result === '返修中') {
		// 	menuList = prevList.filter(menu => menu.value === 'button_recheck');
		// }
		else {
			menuList = prevList.filter(menu => menu.value === 'repaired');
		}
	} else {
		// let production_record = prevList.find(menu => menu.value === 'production_record')
		// if (production_record)
		// 	menuList.push(production_record)
	}
	return menuList;
}