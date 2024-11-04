export const menu_list = [{
		label: '接收',
		value: 'button_accept',
		type: 'primary'
	}, {
		label: '开工',
		value: 'button_start',
		type: 'success'
	},
	{
		label: '暂停',
		value: 'button_pending',
		type: 'warning'
	},
	{
		label: '继续',
		value: 'button_continue',
		type: 'warning'
	},
	{
		label: '完成',
		value: 'button_finish',
		type: 'success'
	},
	{
		label: '异常',
		value: 'button_block',
		type: 'error'
	},
	{
		label: '解除异常',
		value: 'button_unblock',
		type: 'error'
	},
	{
		label: '完工',
		value: 'button_mark_done',
		type: 'primary'
	},
	{
		label: '已送检',
		value: 'production_done',
		type: 'primary',
		disabled: true
	},
	// {
	// 	label: '领料',
	// 	value: 'll',
	// 	type: 'primary'
	// },
	{
		label: '核料',
		value: 'hl',
		type: 'primary'
	},
	{
		label: '生产上报',
		value: 'scsb',
		type: 'error'
	}
]
export const repair_menu_list = [{
	label: '修理完成',
	value: 'do_repaired',
	type: 'primary'
}, {
	label: '已修理',
	value: 'repaired',
	type: 'primary',
	disabled: true
},{
	label: '二次送检',
	value: 'button_recheck',
	type: 'primary'
}]