import $request from '@/utils/request/request.js'

export const getEquipmentInfoAPI = (data = {}) => {
	return $request.post('/mrp/workcenter-productivity', data)
}

export const getPersonInfoAPI = (data = {}) => {
	return $request.post('/mrp/employee-productivity', data)
}
