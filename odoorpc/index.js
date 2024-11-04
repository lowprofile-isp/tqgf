import { Environment } from './env'

import { JsonRequest } from './request'
import controller from './controllers'
// const { web, rerport, web_editor } = controller

export class RPC {
  constructor() {}

  static init({ baseURL, timeout }) {
    JsonRequest.baseURL = baseURL
    JsonRequest.timeout = timeout || 300000
  }

  static get env() {
	let context = {
		allowed_company_ids: [uni.getStorageSync('company_id')],
		// bin_size: true,
		current_company_id: uni.getStorageSync('company_id'),
		lang: "zh_CN",
		// tz: "Asia/Shanghai",
		uid: uni.getStorageSync('currentUser')?.uuid || null,
	}
    return new Environment({context})
  }
}

Object.keys(controller).forEach(item => {
  RPC[item] = controller[item]
})

const rpc = RPC

export default rpc
