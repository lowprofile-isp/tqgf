<template>
	<view class="">
		<view v-if="!this.check_list">
			<u-empty text="暂无数据" mode="order" :margin-top="300"></u-empty>
		</view>
		<view v-else>
			<u-toast ref="uToast" />
			<!-- 编辑页面弹出框 -->
			<u-popup v-model="showEdit" :mask-close-able="false" border-radius="20" :negative-top="300" mode="center"
				:custom-style="popStyle" width="700px" height="520px">
				<template class="flex" v-if="this.form.title">
					<view class="flex-c">
						<view class="text-padding"><u-icon name="file-text-fill" color="#82e7df"
								size="70"></u-icon>{{form.title}}:</view>
						<u-input v-model="form.measure" type="text" input-align="right" height="30"
							:custom-style="customStyle" />
					</view>
					<view class="flex-c">
						<view class="text-padding"><u-icon name="account" color="#82e7df" size="70"></u-icon>测量人：</view>
						<u-input v-model="form.user" type="text" input-align="right" height="30"
							:custom-style="customStyle" />
					</view>
					<view class="key-list-box" v-show="this.searchUserFlag">
						<view class="keyword-entry" hover-class="keyword-entry-tap"
							v-for="(item,index) in matchuserList" :key="item.id" @click="selectUser(item)">
							{{item.name}}
						</view>
					</view>
					<view class="flex-c">
						<view class="text-padding"><u-icon name="edit-pen" color="#82e7df" size="70"></u-icon>测量工具：
						</view>
						<u-input v-model="form.tool" type="text" input-align="right" height="30"
							:custom-style="customStyle" />
					</view>
					<view class="key-list-box" v-show="this.searchToolFlag">
						<view class="keyword-entry" hover-class="keyword-entry-tap"
							v-for="(item,index) in matchToolList" :key="item.id" @click="selectTool(item)">
							{{item.display_name}}
						</view>
					</view>
					<view class="flex-c" style="margin-top: 180px;">
						<u-button :custom-style="cancelStyle" @click="cancel_edit">取消</u-button>
						<u-button :custom-style="editconfirmStyle" @click="confirm_edit">确认</u-button>
					</view>
				</template>

			</u-popup>

			<!-- 导航栏弹出框 -->
			<u-popup v-model="show" mode="top" border-radius="14">
				<view class="content">
					<!-- <scroll-view scroll-y="true" style="height: 800rpx;"> -->
					<view v-for="(item,index) in type_list" :key="index">
						<view class="pop-item" @click="editCheckList(item)">
							<view class="pop-text">测量{{item.type}}</view>
							<u-icon name="edit-pen" color="#82e7df" size="36"></u-icon>
						</view>
					</view>
					<!-- </scroll-view> -->
				</view>
			</u-popup>
			<!-- 顶部展示 -->
			<view class="product_title">
				<view class="top-list">
					<span>{{this.production_obj.product_id[1]}}</span>
					<span>产品批次：{{this.production_obj.batch_code}}</span>
				</view>
				<view class="top-list">
					<span>序列号：{{this.production_obj.complete_lot_num}}</span>
					<span v-if="this.production_obj.check_result">检验结果：{{this.production_obj.check_result}}</span>
				</view>
			</view>
			<!-- <view class="list-wrap">
				<u-cell-group title-bg-color="rgb(243, 244, 246)" :title="item[0].test_type_id[1]"
					v-for="(item, index) in check_list" :key="index">
					<u-cell-item :titleStyle="{fontWeight: 500}" :title="item1.title" :arrow="false"
						v-for="(item1, index1) in item" :key="item1.id">
						<view class="" v-if="item1.test_type_id[1] == 'Measure'">
							{{item1.measure}}{{item1.norm_unit}}
						</view>
						<view class="" v-else-if="item1.test_type_id[1] == 'Pass - Fail'">
							{{item1.quality_state}}
						</view>
						<image slot="icon" class="u-cell-icon" :src="getIcon(item1.quality_state)" mode="widthFix">
						</image>
					</u-cell-item>
				</u-cell-group>
			</view> -->
			<u-collapse :head-style=headStyle>
				<u-collapse-item :title="check_type_dict[item[0].test_type_id[1]]" :open="true"
					v-for="(item, index) in check_list" :key="index" ref="collapseHeight">
					<template v-if="item[0].test_type_id[1] == 'Measure'">
						<u-collapse :head-style=subheadStyle>
							<u-collapse-item :title="measureItem.type" @change="handleOpenChange"
								v-for="(measureItem, index) in type_list" :key="index">
								<view class="item">
									<view class="item-content" v-for="content in measureItem.content" :key="content.id">
										<u-image width="73%" height="70%"
											:src="getIcon(content.quality_state)"></u-image>
										<view class="">
											<text class="title">测量点位：{{ content.title }}</text>
										</view>
										<view class="">
											<text class="title">测量值：{{ content.measure }}{{content.norm_unit}}</text>
										</view>
										<view class="">
											<text class="title">测量工具：{{ content.measure_tool[1] }}</text>
										</view>
										<view class="">
											<text class="title">测量人：{{ content.user_id[1] }}</text>
										</view>
										<view class="">
											<u-button :custom-style="confirmStyle" class="confirm_button"
												@click="edit(content)">编辑</u-button>
										</view>
									</view>
								</view>
							</u-collapse-item>
						</u-collapse>
					</template>
				</u-collapse-item>
			</u-collapse>
			<u-button :custom-style="submitcustomStyle" @click="getResult">提交</u-button>
		</view>
	</view>
</template>

<script>
	import api from '@/odooapi'
	export default {
		data() {
			return {
				production_obj: {},
				check_result_dict: {
					'none': '待处理',
					'pass': '通过',
					'fail': '失败'
				},
				check_type_dict: {
					'Instructions': '指令',
					'Take a Picture': '拍照',
					'Pass - Fail': '合格/不合格',
					'Measure': '测量',
				},
				check_list: null,
				userList: null,
				matchUserList: null,
				toolList: null,
				matchToolList: null,
				form: {
					'title': '',
					'measure': '',
					'user': '',
					'tool': '',
				},
				edit_content: null,
				type_list: null,
				show: false,
				showEdit: false,
				searchUserFlag: false,
				searchToolFlag: false,
				cancelStyle: {
					height: '110rpx',
					width: '40%',
					color: '#000',
					backgroundColor: '#f2f2f2'
				},
				confirmStyle: {
					height: '110rpx',
					width: '130px',
					color: '#fff',
					marginLeft: '0',
					backgroundColor: 'rgb(130, 231, 223)'
				},
				editconfirmStyle: {
					height: '110rpx',
					width: '40%',
					color: '#fff',
					backgroundColor: 'rgb(130, 231, 223)'
				},
				headStyle: {
					height: '120rpx',
					padding: '0 30rpx',
					border: '2px solid #ccc'
				},
				subheadStyle: {
					height: '120rpx',
					padding: '0 50rpx',
					border: '2px solid #f2f2f2'
				},
				popStyle: {
					padding: '30rpx'
				},
				customStyle: {
					height: '90rpx',
					lineHeight: '90rpx',
					paddingRight: '20px',
					fontSize: '36px'
				},
				submitcustomStyle: {
					height: '110rpx',
					lineHeight: '110rpx',
					paddingRight: '20px',
					fontSize: '36px',
					marginTop: '20rpx',
					backgroundColor: '#67fcf2'
				}
				// measurebodyStyle: {
				// 	height: '120rpx',
				// 	padding: '0 60rpx',
				// 	display: 'flex',
				// 	flexDirection: 'column'
				// }
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
				// this.searchUserFlag = this.matchuserList.length > 0; // 控制是否显示匹配结果
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
				this.matchToolList = this.toolList.filter(item => item.display_name.toLowerCase().includes(newVal
					.toLowerCase()));
				if (this.matchuserList.length == 1) {
					if (this.matchToolList[0].display_name == this.form.tool) {
						flag = false
					}
				}
				this.searchToolFlag = flag && this.matchToolList.length > 0; // 控制是否显示匹配结果
			},
		},
		methods: {
			// 检验列表
			async getCheckList() {
				const Model = api.env.model('quality.check')
				const ids = this.production_obj.check_ids
				const company_id = uni.getStorageSync('company_id')
				const res = await Model.search_read({
					domain: [
						['id', 'in', ids],
						['company_id', '=', company_id],
					],
					fields: ["batch_id", "control_date", "default_code", "display_name", "employee_id",
						"finished_lot_id", "id", "is_deleted", "lot_id", "measure", "measure_tool",
						"name", "norm_unit", "point_id", "product_id", "quality_state", "team_id",
						"test_type_id", "title", "tolerance_max", "tolerance_min", "user_id",
					]
				})
				if (res.length > 0) {
					this.check_list = null
					const groupedArray = {};
					res.forEach(item => {
						const typeId = item.test_type_id[0];
						if (!groupedArray[typeId]) {
							groupedArray[typeId] = [];
						}
						groupedArray[typeId].push(item);
					});
					this.check_list = Object.values(groupedArray);
					const result = {}
					let measureArray = []
					this.check_list.forEach(item => {
						measureArray = item.filter(function(i) {
							return i.test_type_id[1] === "Measure";
						});
						// 遍历 measureArray，根据 title 分类
						measureArray.forEach(item => {
							const title = item.title;
							const type = title.replace(/[0-9]/g, ''); // 提取类型，如 "高度"、"重量"、"内径"
							// 如果该类型还没有在结果对象中创建对应的项，就创建一个
							if (!result[type]) {
								result[type] = {
									type: type,
									content: []
								};
							}
							item.show = false; // 添加show键并赋值为false
							// 添加原始对象到结果对象的 content 数组中
							result[type].content.push(item);
						});
					})
					this.type_list = Object.values(result);
				}
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
			// 工具列表
			async getToolList() {
				this.toolList = []
				const Model = api.env.model('product.product')
				const company_id = uni.getStorageSync('company_id')
				const res = await Model.search_read({
					domain: [
						// ['company_id', '=', company_id],
					],
					fields: ["id", "display_name"]
				})
				this.toolList = res
			},
			selectTool(tool) {
				// 当点击匹配结果时，设置输入框的值为选中的用户的名字，并隐藏匹配结果
				this.form.tool = tool.display_name;
				this.searchToolFlag = false;
			},
			getIcon(context) {
				if (context == 'pass') {
					return '../../../../static/application/quality_pass.png'
				} else if (context == 'fail') {
					return '../../../../static/application/qualit_fail.png'
				} else {
					return '../../../../static/application/quality_none.png'
				}
			},
			getPlaceholder(title) {
				return `请输入${title}`
			},
			editCheckList(item) {
				this.show = false
				const params = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: `/pages/tqgf/application/quality_check/edit_quality_check?params=${params}`
				})
			},
			handleOpenChange() {
				setTimeout(() => {
					const collapseItems = this.$refs.collapseHeight;
					collapseItems.forEach(collapseItem => {
						collapseItem.queryRect(); // 计算高度
					});
				}, 200); // 适当的延时，确保内容展开完成
			},
			edit(content) {
				this.edit_content = content
				this.form.title = content.title
				this.form.measure = content.measure
				this.form.user = content.user_id[1] || this.form.user // edit
				this.form.tool = content.measure_tool[1] || '' // edit
				this.showEdit = true
			},
			cancel_edit() {
				this.showEdit = false
			},
			// 保存
			async confirm_edit() {
				const Model = api.env.model('quality.check')
				const {
					id
				} = this.edit_content
				const {
					measure,
					user
				} = this.form
				const dataToUpdate = {}
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
				const res = await Model.write(id, {
					measure: measure,
					...dataToUpdate
				})
				if (res) {
					this.$refs.uToast.show({
						title: `修改成功`,
						type: 'success',
					})
				}
				this.getCheckList()
				this.showEdit = false
			},
			// 调用模型方法
			async getResult() {
				const model = 'mrp.production'
				const method = 'get_result'
				const {
					id
				} = this.production_obj
				const args = [id]
				const kwargs = {}
				api.web.dataset.call_kw({
					model,
					method,
					args,
					kwargs
				}).then(res => {
					this.$refs.uToast.show({
						title: `提交成功`,
						type: 'success',
					})
				}).catch(function(e) {
					if (e.code == 200) {
						uni.showToast({
							title: e.data.arguments[0],
							icon: 'none'
						});
					}
				})
			}
		},
		onLoad(options) {
			if ('params' in options) {
				this.production_obj = JSON.parse(decodeURIComponent(options.params));
			}
			this.getCheckList()
			this.getUserList()
			this.getToolList()
		},
		onShow() {
			this.getCheckList()
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
			// 显示弹出框
			this.show = true
		},
		onPullDownRefresh() {
			this.getCheckList()
			uni.stopPullDownRefresh();
		},
	}
</script>

<style scoped>
	.u-cell-box {
		box-shadow: 5px 5px 20px 5px #ccc;
		border-radius: 10rpx;
	}

	.u-cell {
		box-shadow: 5px 5px 10px #f2f2f2;
		margin: 5rpx 0;
	}

	/deep/ .u-collapse-body {
		/* overflow: auto !important; */
	}

	.u-collapse-title[data-v-31fbc7f8] {
		font-size: 28px;
	}

	.u-image {
		position: absolute;
		opacity: 0.4 !important;
		bottom: 100rpx;
		left: 20rpx;
	}
</style>
<style lang="scss">
	.u-cell-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}

	.product_title {
		height: 120rpx;
		line-height: 100rpx;
		padding: 0 30rpx;
		margin: 20rpx 0;
		font-weight: 520;
		font-size: 34rpx;
		box-shadow: 5px 5px 20px 5px #ccc;
		border-radius: 15rpx;

	}

	.top-list {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 10rpx;
	}

	.pop-item {
		width: 100%;
		height: auto;
		border: 1rpx solid #ccc;
		box-shadow: 5px 5px 20px 5px #f2f2f2;
		;
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}

	.pop-text {
		font-size: 36rpx;
		line-height: 80rpx;
		margin-right: 30rpx;
	}

	.item {
		box-shadow: 5px 5px 20px 5px #f2f2f2;
		display: flex;
		justify-content: space-between;
		padding: 20rpx;
		// padding: 0 70px;
	}

	.item-content {
		height: 300rpx;
		position: relative;
		display: flex;
		flex-direction: column;
		// align-items: center;
		justify-content: space-around;
		// background-image: url('../../../../static/application/quality_pass.png');
		// background-size: contain;
		// opacity: 0.5;
	}

	.key-list-box {
		// width: 700rpx;
		margin: 0 20rpx;
		background-color: #f2f2f2;
		// z-index: 1;
	}

	.keyword-entry-tap {
		background-color: #eee;
	}

	.keyword-entry {
		line-height: 110rpx;
		height: 110rpx;
		font-size: 38rpx;
		color: #333;
		padding: 0 30rpx;
		border-bottom: solid 9rpx #fff;
	}

	.title {
		text-align: left;
		height: 70rpx;
		font-size: 28rpx;
		color: $u-content-color;
	}

	.flex {
		padding: 10rpx;
		height: 400px;
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
	}

	.text-padding {
		padding: 20rpx;
		font-size: 36px;
	}

	.flex-c {
		display: flex;
	}

	// .show-pop {
	// 	z-index: 10086;
	// 	width: 120rpx;
	// 	height: 120rpx;
	// 	position: absolute;
	// 	right: 10px;
	// }
</style>