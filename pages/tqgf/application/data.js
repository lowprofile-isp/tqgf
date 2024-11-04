module.exports = {
	check_state_list: [{
			label: '全部',
			value: null
		},
		{
			label: '待检验',
			value: '待检验',
			type: 'primary'
		},
		{
			label: '技术判定',
			value: '技术判定',
			type: 'warning'
		},
		{
			label: '合格',
			value: '合格',
			type: 'success'
		},
		{
			label: '隔离',
			value: '隔离',
			type: 'error'
		},
		{
			label: '让步放行',
			value: '让步放行',
			type: 'primary'
		},
		{
			label: '返修中',
			value: '返修中',
			type: 'info'
		},
		{
			label: '补齐数据',
			value: '补齐数据',
			type: 'info'
		},
	],
	check_type_list: [
		{
			label: '全部',
			value: null 
		},
		{
			label: '全检',
			value: 'all'
		},
		{
			label: '抽检',
			value: 'random'
		},
	],
	repair_state_list: [
		{
			label: '全部',
			value: null 
		},
		{
			label: '正常',
			value: 'none',
			type: 'success'
		},
		{
			label: '待修理',
			value: 'to_be_repaired',
			type: 'warning'
		},
		{
			label: '已修理',
			value: 'repaired',
			type: 'primary'
		},
	],
	workshop_list: [
		// {
		// 	label: '全部',
		// 	value: null,
		// },
		{
			label: '模具车间',
			value: 'mold_workshop',
		},
		{
			label: '直筒车间',
			value: 'cylinder_workshop',
		},
		{
			label: '针刺平板车间',
			value: 'needle_punched_flat_workshop',
		},
		{
			label: '网胎车间',
			value: 'net_tire_workshop',
		},
	]
}