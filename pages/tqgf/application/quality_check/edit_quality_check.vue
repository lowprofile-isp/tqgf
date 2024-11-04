<template>
	<!-- <u-form :model="editobj" ref="uForm">
		<u-form-item :label="form.title" v-for="(form,index) in editobj.content" ><u-input v-model="form.measure" /></u-form-item>
		
	</u-form> -->
	<view class="">
		<u-toast ref="uToast" />
		<view class="user-tool">
			<view class="user">
				<view class="flex-c">
					<view class="text-padding"><u-icon name="account" color="#82e7df" size="75"></u-icon></view>
					<u-input v-model="form.user" type="text" input-align="left" height="130" placeholder="测量人"
						:custom-style="customStyle" />
				</view>
				<view class="key-list-box" v-show="this.searchUserFlag">
					<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="(item,index) in matchuserList"
						:key="item.id" @click="selectUser(item)">
						{{item.name}}
					</view>
				</view>
			</view>
			<view class="tool">
				<view class="flex-c">
					<view class="text-padding"><u-icon name="checkmark-circle" color="#82e7df" size="75"></u-icon>
					</view>
					<u-input v-model="form.tool" type="text" input-align="left" height="130" placeholder="测量工具"
						:custom-style="customStyle" />
				</view>
				<view class="key-list-box" v-show="this.searchToolFlag">
					<view class="keyword-entry" hover-class="keyword-entry-tap" v-for="(item,index) in matchtoolList"
						:key="item.id" @click="selectTool(item)">
						{{item.display_name}}
					</view>
				</view>
			</view>
		</view>
		<view class="" v-for="(item,index) in editobj.content" :key="index">
			<view class="flex">
				<span class="title">{{item.title}}:</span>
				<u-input v-model="item.measure" type="number" :placeholder=getPlaceholder(item.title) input-align="center"
					:border="border" />
			</view>
			<u-gap height="30" bg-color="#f2f2f2"></u-gap>
		</view>
		<view>
			<u-button :custom-style="cancelStyle" @click="cancel_edit">取消</u-button>
			<u-button :custom-style="confirmStyle" @click="confirm_edit">确认</u-button>
		</view>
	</view>
</template>

<script>
	import api from '@/odooapi'
	export default {
		data() {
			return {
				rawobj: null,
				editobj: null,
				border: false,
				userList: [],
				matchuserList: [],
				toolList: [],
				matchtoolList: [],
				form: {
					user: '',
					tool: '',
				},
				searchUserFlag: false,
				searchToolFlag: false,
				cancelStyle: {
					marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					color: 'red',
				},
				confirmStyle: {
					marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					color: '#fff',
					backgroundColor: 'rgb(130, 231, 223)'
				},
				customStyle: {
					lineHeight: '100rpx',
					fontSize: '36rpx',
					padding: '20rpx',
					marginRight: '20rpx',
					boxShadow: '5rpx 5rpx 20rpx 5rpx #f2f2f2',
				},
			}
		},
		watch: {
			'form.user': function(newVal) {
				if (newVal === '') {
					this.matchuserList = []; // 当输入为空时清空匹配列表
					this.searchUserFlag = false; // 隐藏匹配结果
					return;
				}
				let flag = true
				// 在输入框值改变时，进行匹配操作
				this.matchuserList = this.userList.filter(item => item.name.toLowerCase().includes(newVal
					.toLowerCase()));
				if (this.matchuserList.length == 1) {
					if (this.matchuserList[0].name == this.form.user) {
						flag = false
					}
				}
				this.searchUserFlag = flag && this.matchuserList.length > 0; // 控制是否显示匹配结果
			},
			'form.tool': function(newVal) {
				if (newVal === '') {
					this.matchtoolList = []; // 当输入为空时清空匹配列表
					this.searchToolFlag = false; // 隐藏匹配结果
					return;
				}
				let flag = true
				// 在输入框值改变时，进行匹配操作
				this.matchtoolList = this.toolList.filter(item => item.display_name.toLowerCase().includes(newVal
					.toLowerCase()));
				if (this.matchuserList.length == 1) {
					if (this.matchtoolList[0].display_name == this.form.tool) {
						flag = false
					}
				}
				this.searchToolFlag = flag && this.matchtoolList.length > 0; // 控制是否显示匹配结果
			},
		},
		methods: {
			getPlaceholder(title) {
				return `请输入${title}`
			},
			async getUserList() {
				this.userList = []
				const Model = api.env.model('res.users')
				const company_id = uni.getStorageSync('company_id')
				const user = uni.getStorageSync('HCuname');
				const res = await Model.search_read({
					domain: [
						['company_id', '=', company_id],
					],
					fields: ["id", "login", "name"]
				})
				this.userList = res
				if (this.form.user == '') {
					const current_user = res.filter(item => item.login === user);
					this.form.user = current_user[0].name
				}
			},
			selectUser(user) {
				// 当点击匹配结果时，设置输入框的值为选中的用户的名字，并隐藏匹配结果
				this.form.user = user.name;
				this.searchUserFlag = false;
			},
			async getToolList() {
				this.toolList = []
				const Model = api.env.model('product.product')
				const company_id = uni.getStorageSync('company_id')
				const res = await Model.search_read({
					domain: [
						// ['company_id', '=', company_id],
					],
					fields: ["display_name", "id"]
				})
				this.toolList = res
			},
			selectTool(tool) {
				// 当点击匹配结果时，设置输入框的值为选中的用户的名字，并隐藏匹配结果
				this.form.tool = tool.display_name;
				this.searchToolFlag = false;
			},
			cancel_edit() {
				uni.navigateBack(1)
			},
			confirm_edit() {
				const Model = api.env.model('quality.check')
				const dataToUpdate = {}; // 创建一个对象来存储共同的更新数据
				// 如果存在 this.form.user
				if (this.form.user) {
					const userMatch = this.userList.find(user => user.name === this.form.user);
					if (userMatch) {
						dataToUpdate.user_id = userMatch.id;
					}
				}

				// 如果存在 this.form.tool
				if (this.form.tool) {
					const toolMatch = this.toolList.find(tool => tool.display_name === this.form.tool);
					if (toolMatch) {
						dataToUpdate.measure_tool = toolMatch.id;
					}
				}
				// 创建一个新数组来存储被修改的项
				const modifiedItems = [];
				// 遍历 this.editobj.content 数组
				this.editobj.content.forEach(editItem => {
					// 在 this.rawobj.content 数组中查找与当前 editItem 相同 id 的原始项
					const rawItem = this.rawobj.content.find(rawItem => rawItem.id === editItem.id);
					if (rawItem) {
						// 如果找到了相同 id 的原始项，比较它们的内容是否不同
						if (JSON.stringify(editItem) !== JSON.stringify(rawItem)) {
							// 如果内容不同，将当前 editItem 添加到 modifiedItems 数组
							modifiedItems.push(editItem);
						}
					}
				});
				// modifiedItems 数组现在包含了被修改的项
				modifiedItems.forEach(async (item, index) => {
					const res = await Model.write(item.id, {
						measure: item.measure,
						...dataToUpdate,
					})
				})
				this.$refs.uToast.show({
					title: `成功修改${modifiedItems.length}条数据`,
					type: 'success',
				})
				setTimeout(() => {
					uni.navigateBack({
						delta: 1,
					});
				}, 800);
			}
		},
		onLoad(options) {
			if ('params' in options) {
				this.editobj = JSON.parse(decodeURIComponent(options.params));
				this.rawobj = JSON.parse(decodeURIComponent(options.params));
			}
			this.form.tool = this.rawobj.content.length > 0 ? this.rawobj.content[0].measure_tool[1] : ''
			uni.setNavigationBarTitle({
				title: `测量${this.editobj.type}`
			})
			this.getUserList()
			this.getToolList()
		},
		// onNavigationBarButtonTap(e) {
		// 	// 扫码跳转
		// 	uni.scanCode({
		// 		success: (res) => {
		// 			// 携带参数跳转
		// 			let params = null
		// 			this.ProductionList.forEach(item => {
		// 				if (item.complete_lot_num == res.result) {
		// 					params = encodeURIComponent(JSON.stringify(item))
		// 					return
		// 				}
		// 			})
		// 			if (params) {
		// 				uni.navigateTo({
		// 					url: `/pages/tqgf/application/quality_check/quality_check?params=${params}`
		// 				})
		// 			} else {
		// 				this.$refs.uToast.show({
		// 					title: '未找到匹配项',
		// 					type: 'warning',
		// 				})
		// 			}

		// 		}
		// 	});

		// },
	}
</script>

<style>
	.u-form-item {
		padding: 20px;
	}

	.uni-button {
		/* width: 50%; */
	}

	.u-default-hover {
		color: #000 !important;
		background-color: #f2f2f2 !important;
	}
</style>

<style lang="scss">
	.title {
		height: 80rpx;
		line-height: 80rpx;
		color: #000;
		// padding-left: 20rpx;
		width: 20%;
		text-align: left;
	}

	.user-tool {
		display: flex;
	}

	.user,
	.tool {
		position: relative;
		width: 50%;
		height: 230rpx;
	}

	.key-list-box {
		position: absolute;
		z-index: 10086;
		width: 950rpx;
		margin: 0 30rpx;
		background-color: #f8f8f8;
		overflow-y: scroll;
		max-height: 800rpx;
	}

	.keyword-entry {
		line-height: 110rpx;
		height: 110rpx;
		font-size: 38rpx;
		color: #333;
		padding: 0 30rpx;
		border-bottom: solid 9rpx #fff;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.flex {
		display: flex;
		justify-content: space-between;
		margin: 5rpx 45rpx;
	}

	.text-padding {
		padding: 30rpx 20rpx;
		font-size: 36rpx;
	}

	.flex-c {
		display: flex;
	}

	.button-flex {
		display: flex;
		// margin-bottom: 30px;
	}
</style>