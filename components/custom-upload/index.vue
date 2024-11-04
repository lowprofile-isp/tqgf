<template>
	<u-upload class="upload-wrap" :custom-btn="true" :action="baseUrl" :file-list="fileList"
		:before-upload="beforeUpload" :before-remove="beforeRemove" :sizeType="sizeType" multiple :show-tips="false"
		:max-size="fileMaxSize">
		<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
			<u-icon name="camera-fill" size="100" color="#c0c4cc"></u-icon>
		</view>
	</u-upload>
</template>
<script>
	import api from '@/odooapi';
	import {
		compressImg,
		fileToBase64
	} from '@/common/upload.js'
	export default {
		data() {
			return {
				baseUrl: '',
				fileList: [],
				sizeType: ['compressed'],
				fileMaxSize: 2 * 1024 * 1024, // 默认最大为2M
			}
		},
		methods: {
			getCompressionRatio(fileSize) {
				const multiple = (fileSize / this.fileMaxSize).toFixed(2) // 获取文件大小倍数，生成质量比
				let compressionRatio = 1
				if (multiple > 5) {
					compressionRatio = 0.5
				} else if (multiple > 4) {
					compressionRatio = 0.6
				} else if (multiple > 3) {
					compressionRatio = 0.7
				} else if (multiple > 2) {
					compressionRatio = 0.8
				} else if (multiple > 1) {
					compressionRatio = 0.9
				} else {
					compressionRatio = 2
				}
				return compressionRatio;
			},
			beforeRemove(index, lists) {
				console.log(index, lists)
			},
			async beforeUpload(index, lists) {
				this.fileList = [];
				let fileListLen = this.fileList.length
				this.fileList = lists.map((file) => {
					return {
						...file,
						status: 'uploading',
						message: '上传中'
					}
				})
				console.log(this.fileList)
				for (let i = 0; i < this.fileList.length; i++) {
					const result = await this.uploadFilePromise(this.fileList[i])
					// 垃圾回收
					window.URL.revokeObjectURL(this.fileList[i].url)
					console.log('上传结果', result)
					if (result) {
						let item = this.fileList[fileListLen]
						this.fileList.splice(fileListLen, 1, Object.assign(item, {
							status: 'success',
							message: '上传成功',
							url: result
						}))
						fileListLen++
						return true
					} else {
						return false
					}
				}
				// list.map(async item => {
				// 	this.fileList.push({
				// 		url: item.url
				// 	})
				// 	let result = await this.uploadFilePromise(item.url);
				// 	console.log(result);
				// })
				// console.log('照片列表', this.fileList);
			},
			// 上传图片
			uploadFilePromise(file) {
				let {
					url,
					name
				} = file;
				let params = new FormData();
				params.append('ufile', file);
				return new Promise(async (resolve, reject) => {
					let modal_key = 'mrp.workcenter.productivity'
					const Model = api.env.model('ir.model');
					const modelRes = await Model.search_read({
						domain: [
							['model', 'in', [modal_key]]
						]
					})
					console.log(modelRes)
					if (modelRes?.length > 0) {
						let modal_id = modelRes[0].id;
						let res = await api.web.binary.upload_attachment({
							ufile: file.file,
							model: modal_key,
							id: modal_id
						})
						// uni.uploadFile({
						// 	url: '/api/web/binary/upload_attachment',
						// 	filePath: file.url,
						// 	formData: {
						// 		ufile: file.file,
						// 		model: modal_key,
						// 		id: modal_id
						// 	},
						// 	success: (uploadFileRes) => {
						// 		console.log(uploadFileRes.data);
						// 	}
						// });
						
						// let params = new FormData();
						// params.append('ufile', file.file);
						// let data = {
						// 	ufile: new Blob([params]),
						// 	model: modal_key,
						// 	id: modal_id
						// }
						// resolve(true)
					} else {
						// resolve(false)
					}
				});
			},
			compressImg(source, compressionRatio) {
				return new Promise((resolve, reject) => {
					compressImg(source.url, compressionRatio, source.type, compressRes => {
						resolve(compressRes);
					})
				}).then((res) => {
					source.size = res.size
					// window.URL.revokeObjectURL(source.url) // 删除被压缩的缓存文件,这里注意，如果是相册选择上传，可能会删除相册的图片
					source.url = res.source
					source.thumb = res.source
					return source
				}).catch(err => {
					console.log('图片压缩失败', err)
				})
			},
		}
	}
</script>
<style lang="scss" scoped>
	.slot-btn {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
	}

	.slot-btn__hover {
		background-color: rgb(235, 236, 238);
	}
</style>