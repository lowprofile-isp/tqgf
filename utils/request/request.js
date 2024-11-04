import store from '@/store';

const baseRequest = async (url, method, data = {}, loading = true) => {
	let header = {}
	return new Promise((reslove, reject) => {
		uni.request({
			// #ifdef H5
			url: '/api' + url,
			// #endif
			// #ifndef H5
			url: store.state.service.http_url + url,
			// #endif
			method: method || 'GET',
			header: header,
			timeout: 10000,
			data: data || {},
			success: (response) => {
				if (response.statusCode == 200) {
					// 业务逻辑
					if (response.data.error || response.data?.result?.state != 'ok') {
						uni.stopPullDownRefresh();
						uni.showModal({
							content: response.data.error?.data?.message || response
								.data?.result?.message || '请求失败',
							showCancel: false
						})
						reslove(false)
					} else {
						reslove(response.data)
					}
				} else {
					uni.stopPullDownRefresh();
					uni.showModal({
						// title: 'Error',
						content: `url: ${url}\n${'Service error ' + response.statusCode}`,
						showCancel: false,
					})
					reject(response.data)
				}
			},
			fail: (error) => {
				uni.showModal({
					title: 'Error',
					content: error.errMsg,
					showCancel: false,
				})
				uni.stopPullDownRefresh();
				reject(error)
			}
		})
	})
}

const request = {}
let methods = ['get', 'post', 'put', 'delete']
methods.forEach((method) => {
	request[method] = (api, data, loading) => baseRequest(api, method, data, loading)
})

export default request