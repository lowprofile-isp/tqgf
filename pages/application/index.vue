<template>
	<view class="u-wrap">
		<!-- <view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view> -->
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view v-for="(item,index) in meunList" :key="index" class="u-tab-item"
					:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
					@tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>
			<block v-for="(item,index) in meunList" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{item.name}}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item1, index1) in item.foods" :key="index1">
									<image class="item-menu-image" :src="item1.icon" mode=""
										@tap.stop="navTo(item1.url)"></image>
									<view class="item-menu-name">{{item1.name}}</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	import classifyData from "@/config/classify.data.js";
	import api from '@/odooapi'
	export default {
		data() {
			return {
				tabbar: classifyData,
				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				meunList: [],
				meun: [],
			}
		},
		computed: {

		},
		onReady() {
			this.initData();
		},
		
		methods: {
			trimSpace(array) {
				for (var i = 0; i < array.length; i++) {
					for (var j = 0; j < array[i].foods.length; j++) {
						if (array[i].foods[j].name === undefined) {
							array[i].foods.splice(j, 1)
							j = j - 1
						}
					}

				}
				return array
			},
			// 统一跳转接口,拦截未登录路由
			navTo(route) {
				if (!route) return;
				if (!this.hasLogin) {
					uni.removeStorageSync('backToPage');
					this.$mRouter.push({
						route: '/pages/public/login'
					});
				} else {
					this.$mRouter.push({
						route
					});
				}
			},
			arrayToObject(arr) {
				let obj = {}

				for (let i = 0; i < arr.length; i++) {
					obj = arr[i]
				}
				return obj
			},
			// 数据初始化
			async initData() {
				//根据权限动态获取菜单
				let menus = await api.web.dataset.call_kw({
					model: 'ir.ui.menu',
					method: 'load_menus',
					args: [1],
					kwargs: {}
				})
				menus = Object.values(menus)
				for (let i = 0; i < menus.length; i++) {
					if (menus[i].name == '销售管理') {
						this.meunList.push({
							name: '销售管理',
							foods: menus[i].children
						})
						menus[i].children.push({
							cat: 10,
							icon: "/static/images/procurement.png",
							key: "代采订单",
							name: "代采订单",
							url: "/pages/works/sales/daicai"
						})
					}
					// else if (menus[i].name == 'Quality') {
					// 	this.meunList.push({
					// 		name: '质量检验',
					// 		foods: menus[i].children
					// 	})
					// }
					else if (menus[i].name == '生产准备') {
						this.meunList.push({
							name: '生产准备',
							foods: menus[i].children
						})
					}
					else if (menus[i].name == '库存管理') {
						this.meunList.push({
							name: '库存管理',
							foods: menus[i].children
						})
						menus[i].children.push({
							cat: 11,
							icon: "/static/images/workshop.png",
							key: "库房管理",
							name: "库房管理",
							url: "/pages/works/warehouse/index"
						})
						
					} 
					else if (menus[i].name == '生产执行') {
						this.meunList.push({
							name: '生产执行',
							foods: menus[i].children
						})
					} 
					else if (menus[i].name == '采购管理') {
						this.meunList.push({
							name: '采购管理',
							foods: menus[i].children
						})
					} 
					else if (menus[i].name == '客供点料') {
						this.meunList.push({
							name: '客供点料',
							foods: [{
								name: "客供点料",
								key: "客供点料",
								icon: "/static/images/inventory.png",
								cat: 10,
								url: "/pages/works/material/index",
							}]
						})
					} else if (menus[i].name == '异常上报') {
						this.meunList.push({
							name: '异常上报',
							foods: [{
								name: "异常上报",
								key: "异常上报",
								icon: "/static/images/abnormal.png",
								cat: 10,
								url: "/pages/works/abnormal/index",
							}]
						})
					}
					// else if (menus[i].name == '考勤管理') {
					// 	this.meunList.push({
					// 		name: '考勤管理',
					// 		foods: menus[i].children
					// 	})
					// }
				}
				console.log(this.meunList)
				for (let i = 0; i < this.meunList.length; i++) {
					for (var j = 0; j < this.meunList[i].foods.length; j++) {
						if (this.meunList[i].foods[j].name == '销售订单') {
							this.meunList[i].foods[j] = {
								name: "销售订单",
								key: "销售订单",
								icon: "/static/images/saleOrder.png",
								cat: 10,
								url: "/pages/works/sales/index",
							}
						}
						else if (this.meunList[i].foods[j].name == '代采订单') {
							this.meunList[i].foods[j] = {
								name: "代采订单",
								key: "代采订单",
								icon: "/static/images/procurement.png",
								cat: 10,
								url: "/pages/works/sales/daicai",
							}
						} 
						else if (this.meunList[i].foods[j].name == '客户管理') {
							this.meunList[i].foods[j] = {
								name: "客户管理",
								key: "客户管理",
								icon: "/static/images/customer.png",
								cat: 10,
								url: "/pages/works/sales/customer",
							}
						} 
						else if ( this.meunList[i].name == '采购管理' && this.meunList[i].foods[j].name == '订单') {
							this.meunList[i].foods[0] = {
								name: "采购管理",
								key: "采购管理",
								icon: "/static/images/pmt.png",
								cat: 10,
								url: "/pages/works/purchase/buy",
							}
						} 
						else if (this.meunList[i].foods[j].name == '生产计划') {
							this.meunList[i].foods[0] = {
								name: "生产计划",
								key: "生产计划",
								icon: "/static/images/sdingdan.png",
								cat: 10,
								url: "/pages/works/plan/index",
							}
						} 
						else if (this.meunList[i].foods[j].name == '核料单') {
							this.meunList[i].foods[j] = {
								name: "核料单",
								key: "核料单",
								icon: "/static/images/material.png",
								cat: 10,
								url: "/pages/works/materialRt/index",
							}
						} 
						else if (this.meunList[i].foods[j].name == '尾板管理') {
							this.meunList[i].foods[j] = {
								name: "尾板管理",
								key: "尾板管理",
								icon: "/static/images/weiban.png",
								cat: 10,
								url: "/pages/works/plan/tailplate",
							}
						} 
						else if (this.meunList[i].foods[j].name == '工艺路线') {
							this.meunList[i].foods[j] = {
								name: "工艺路线",
								key: "工艺路线",
								icon: "/static/images/process.png",
								cat: 10,
								url: "/pages/works/process/index",
							}
						} 
						else if (this.meunList[i].foods[j].name == '库房核料') {
							this.meunList[i].foods[j] = {
								name: "库房核料",
								key: "库房核料",
								icon: "/static/images/warehouse.png",
								cat: 10,
								url: "/pages/works/inventory/index",
							}
						}
						else if (this.meunList[i].foods[j].name == '库房管理') {
							this.meunList[i].foods[j] = {
								name: "库房管理",
								key: "库房管理",
								icon: "/static/images/workshop.png",
								cat: 10,
								url: "/pages/works/warehouse/index",
							}
						}
						// // else if (this.meunList[i].foods[j].name == '车间管理') {
						// // 	this.meunList[i].foods[j] = {
						// // 		name: "车间管理",
						// // 		key: "车间管理",
						// // 		icon: "/static/images/workshop.png",
						// // 		cat: 10,
						// // 		url: "/pages/works/plan/tailplate",
						// // 	}
						// // } 
						// // else if (this.meunList[i].foods[j].name == '成本设置') {
						// // 	this.meunList[i].foods[j] = {
						// // 		name: "成本设置",
						// // 		key: "成本设置",
						// // 		icon: "/static/images/costof.png",
						// // 		cat: 10,
						// // 		url: "/pages/works/plan/tailplate",
						// // 	}
						// // } else if (this.meunList[i].foods[j].name == 'Work Centers') {
						// // 	this.meunList[i].foods[j] = {
						// // 		name: "工作中心",
						// // 		key: "工作中心",
						// // 		icon: "/static/images/workcenter.png",
						// // 		cat: 10,
						// // 		url: "/pages/works/plan/tailplate",
						// // 	}
						// // } 
						else if (this.meunList[i].foods[j].name == '工单') {
							this.meunList[i].foods[j] = {
								name: "工单",
								key: "工单",
								icon: "/static/images/perform.png",
								cat: 10,
								url: "/pages/works/perform/index",
							}
						}
						// // else if (this.meunList[i].foods[j].name == '维修工单') {
						// // 	this.meunList[i].foods[j] = {
						// // 		name: "维修工单",
						// // 		key: "维修工单",
						// // 		icon: "/static/images/perform.png",
						// // 		cat: 10,
						// // 		url: "/pages/works/perform/selectTask",
						// // 	}
						// // } 
						else if (this.meunList[i].foods[j].name == '客供点料') {
							this.meunList[i].foods[j] = {
								name: "客供点料",
								key: "客供点料",
								icon: "/static/images/inventory.png",
								cat: 10,
								url: "/pages/works/material/index",
							}
						} else if (this.meunList[i].foods[j].name == '异常上报') {
							this.meunList[i].foods[j] = {
								name: "异常上报",
								key: "异常上报",
								icon: "/static/images/abnormal.png",
								cat: 10,
								url: "/pages/works/abnormal/index",
							}
						} else {
							// this.meunList[i].foods {}
							this.meunList[i].foods[j] = {}
						}

					}
				}
				this.meunList = this.trimSpace(this.meunList)
				console.log(this.meunList, 333)
				// this.meun = this.trimSpace(this.meunList)
				this.hasLogin = true;
				uni.setNavigationBarColor({
					frontColor: '#ffffff',
					backgroundColor: this.themeColor.color,
					animation: {
						duration: 400,
						timingFunc: 'easeIn'
					}
				})
			},
			getImg() {
				return Math.floor(Math.random() * 35);
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (index == this.current) return;
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.u-tab-view {
		height: 100%;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-weight: normal;
		font-size: 24rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 33.333333%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}
</style>
