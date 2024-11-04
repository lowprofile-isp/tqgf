<template>
	<view class="production-detail-page">
		<u-top-tips ref="uTips" :navbar-height="navBarHeight"></u-top-tips>
		<u-navbar :is-back="true" back-icon-color="#fff" :border-bottom="false" :title="navStyles.navTitle"
			:background="{background: navStyles.navBarBg}" :title-color="navStyles.textColor"
			:title-size="navStyles.navBarFontSize">
			<view slot="right" class="slot-right-wrap">
				<view v-if="typeof rowItem.name === 'string' && rowItem.name.includes('针刺')" class="right-item"
					@click="recordClick">
					层数使用记录
				</view>
			</view>
		</u-navbar>
		<!-- <view class="suspend-scan" @tap="scanClick">
			<u-icon size="48" name="plus"></u-icon>
		</view> -->
		<page-loading style="height: 100%;" :loadmore="loadmore" @refresh="refresh">
			<!-- <scroll-view scroll-y="true" style="height: 100%;"> -->
			<!-- <u-sticky :offset-top="navbarHeight">
					<card-tab :current="tabCurrent" :values="tabItems" @clickItem="(e) => tabCurrent = e"></card-tab>
				</u-sticky> -->
			<view class="sticky">
				<card-tab :current="tabCurrent" :values="tabItems" @clickItem="(e) => tabCurrent = e"></card-tab>
			</view>
			<view class="card-tab-content">
				<template v-if="tabCurrent === 0">
					<card-info v-if="typeof rowItem.name === 'string' && rowItem.name.includes('裁切')" title="裁切小批次录入" show-foot>
						<!-- <v-table :columns="columns" :list="tableList" td-width="100" is-auto empty-class="link"
								empty-text="请扫描层数标签"></v-table> -->
						<!-- <uni-table class="table-empty-link" border emptyText="请扫描层数标签" style="min-width: auto;">
								<uni-tr style="background-color: #f8f8ff;">
									<uni-th style="padding: 15rpx 20rpx;" align="center">录入层数</uni-th>
									<uni-th style="padding: 15rpx 20rpx;" align="center">实际层数</uni-th>
									<uni-th style="padding: 15rpx 20rpx;" align="center">备注</uni-th>
								</uni-tr>
								<uni-tr v-for="(item, index) in tableList" :key="index">
									<uni-td align="center">{{ item.name }}</uni-td>
									<uni-td align="center">
										<span :class="!item.value?'link':''">{{ item.value || '请扫描层数标签' }}</span>
									</uni-td>
									<uni-td>{{ item.remark }}</uni-td>
								</uni-tr>
							</uni-table> -->
						<template v-slot:foot>
							<span style="margin-right: 20rpx;" class="link" @click="batchLotSubmit">一键提交</span>
							<span style="margin-right: 20rpx;" class="link" @click="lotTableAdd">
								<uni-icons class="link" style="line-height: 1; vertical-align: -5rpx;" type="plusempty" size="18"></uni-icons>
								添加
							</span>
							<!-- <u-tag style="font-size: 28rpx;" text="添加" type="primary" @click="lotTableAdd" /> -->
						</template>
						<uni-table class="table-empty-link" border emptyText="请添加小批次号" style="min-width: auto;">
							<uni-tr style="background-color: #f8f8ff;">
								<uni-th style="padding: 15rpx 20rpx;" width="50" align="center">序号</uni-th>
								<uni-th style="padding: 15rpx 20rpx;" align="center">重量</uni-th>
								<uni-th style="padding: 15rpx 20rpx;" width="110" align="center">操作</uni-th>
							</uni-tr>
							<uni-tr v-for="(item, index) in lotTableList" :key="index">
								<uni-td align="center" style="padding: 12rpx 6rpx;">{{ item.name }}</uni-td>
								<uni-td align="center" style="padding: 12rpx 6rpx;">
									<uni-easyinput ref="lotInputRef" :value="item.value"
										:error-message="item.errorMessage" type="text" :disabled="item.is_submit"
										:placeholder="item.errorMessage ? '请填写小批次信息' : ''"
										:focus="currentIndex === index" @input="(e) => inputChange(e, index)" clearable
										@blur="(event) => inputBlur2(event, index)"></uni-easyinput>
								</uni-td>
								<uni-td align="center" style="padding: 12rpx 6rpx;">
									<!-- <u-tag style="font-size: 28rpx;" text="提交" type="primary"
											@click="lotTableSubmit(index)" />
										<u-tag style="margin-left: 10rpx; font-size: 28rpx;" text="删除" type="error"
											@click="lotTableDel(index)" /> -->
									<view
										style="display: flex; justify-content: center; align-items: center; width: 100%;">
										<u-button
											style="font-size: 28rpx; margin: 0 0 0 10rpx; width: 110rpx; height: 65rpx; line-height: 65rpx;"
											size="mini" :type="item.is_submit ? 'info' : 'primary'"
											:disabled="item.is_submit" :throttle-time="0"
											@click="lotTableSubmit(index)">{{item.is_submit ? '已提交' : `提交`}}</u-button>
										<span style="width: 80rpx;" class="item-close" @click="lotTableDel(index)">
											<uni-icons type="trash" size="22" color="#FF7878"></uni-icons>
										</span>
									</view>

									<!-- <u-button style="margin-left: 10rpx; font-size: 28rpx;" size="mini" type="error"
											:throttle-time="0" @click="lotTableDel(index)">删除</u-button> -->
								</uni-td>
							</uni-tr>
						</uni-table>
						<!-- <uni-forms class="content-form">
								<uni-forms-item class="content-item" label="层数" :border-bottom="false">
									<span
										:class="!barcode ? 'link' : abnormal ? 'error-text' : ''">{{barcode || '请扫描层数标签'}}</span>
								</uni-forms-item>
							</uni-forms> -->
					</card-info>
					<card-info v-if="typeof rowItem.name === 'string' && rowItem.name.includes('针刺')" title="针刺信息录入">
						<template v-if="zc_serial" v-slot:head-right>
							<u-tag style="font-size: 28rpx; margin-left: 20rpx;" text="提交" type="primary"
								@click="lotTableZcSubimt" />
						</template>
						<view v-if="!zc_serial" class="link" style="text-align: center;" @click="scanClick">请扫描物料批次
						</view>
						<template v-else>
							<uni-forms class="content-form" style="margin-bottom: 20rpx;">
								<uni-forms-item class="content-item" label="物料批次" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">{{zc_serial}}</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="小批次号" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value" style="width: 100%;">
										<uni-easyinput ref="lotInputRef" v-model="llot" type="text"
											placeholder="请输入裁切小批次号" :error-message="llotErrorMessage"
											@input="inputChange" clearable
											@blur="(event) => inputBlur3(event)"></uni-easyinput>
										<!-- <u-tag style="font-size: 28rpx; margin-left: 20rpx;" text="提交"
												type="primary" @click="lotTableZcSubimt" /> -->
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="当前层" label-width="100" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{Array.isArray(tableList) && tableList.length > 0 ? tableList[0].name : ''}}
										<span class="link" style="margin-left: 30rpx;">扫码录入</span>
									</view>
								</uni-forms-item>
								<!-- <uni-forms-item class="content-item" label="实际层" label-width="100"
										label-align="left" :border-bottom="false">
										<view class="value">
											<span class="link" style="margin-left: 10rpx;">扫码录入实际层</span>
										</view>
									</uni-forms-item> -->
							</uni-forms>

							<!-- <uni-table class="table-empty-link" border emptyText="请添加小批次号" style="min-width: auto;">
									<uni-tr style="background-color: #f8f8ff;">
										<uni-th style="padding: 15rpx 20rpx;" width="50" align="center">序号</uni-th>
										<uni-th style="padding: 15rpx 20rpx;" align="center">小批次号</uni-th>
										<uni-th style="padding: 15rpx 20rpx;" width="70" align="center">操作</uni-th>
									</uni-tr>
									<uni-tr v-for="(item, index) in lotTableList" :key="index">
										<uni-td align="center" style="padding: 12rpx 6rpx;">{{ item.name }}</uni-td>
										<uni-td align="center" style="padding: 12rpx 6rpx;">
											<uni-easyinput ref="lotInputRef" :value="item.value" type="text"
												placeholder="" :focus="currentIndex === index" @input="inputChange"
												clearable @blur="(event) => inputBlur2(event, index)"></uni-easyinput>
										</uni-td>
										<uni-td align="center" style="padding: 12rpx 6rpx;">
											<u-tag style="font-size: 28rpx;" text="提交" type="primary"
												@click="lotTableZcSubimt(index)" />
										</uni-td>
									</uni-tr>
								</uni-table> -->
							<!-- <uni-table class="table-empty-link" border emptyText="请扫描层数标签" style="min-width: auto;">
									<uni-tr style="background-color: #f8f8ff;">
										<uni-th style="padding: 15rpx 20rpx;" align="center">录入层数</uni-th>
										<uni-th style="padding: 15rpx 20rpx;" align="center">实际层数</uni-th>
										<uni-th style="padding: 15rpx 20rpx;" align="center">备注</uni-th>
									</uni-tr>
									<uni-tr v-for="(item, index) in tableList" :key="index">
										<uni-td align="center">{{ item.name }}</uni-td>
										<uni-td align="center">
											<span :class="!item.value?'link':''">{{ item.value || '请扫描层数标签' }}</span>
										</uni-td>
										<uni-td>{{ item.remark }}</uni-td>
									</uni-tr>
								</uni-table> -->
						</template>
					</card-info>
					<card-info title="基本信息">
						<template v-slot:head-right>
							<u-tag :text="rowItem.state | stateInfoFilter('state', stateList)"
								:type="rowItem.state | stateInfoFilter('type', stateList)" />
						</template>
						<uni-forms class="content-form">
							<!-- <uni-forms-item class="content-item" label="工序" label-width="100" label-align="center"
									:border-bottom="false">
									<view class="value">{{rowItem.name || ''}}</view>
								</uni-forms-item> -->
							<uni-forms-item v-for="(item, index) in formList" :key="index" class="content-item"
								:label="item.label" label-width="100" label-align="left" :border-bottom="false">
								<view class="value">
									{{detailInfo[item['valueKey']] || '--'}}
									<span v-if="item.valueKey == 'production_name'" class="copy-text link"
										@click="$mHelper.copyText(detailInfo[item['valueKey']])">
										<i class="iconfont icon-copy-template"></i>复制
									</span>
								</view>
							</uni-forms-item>
							<uni-forms-item class="content-item" label="关联设备" label-width="100" label-align="left"
								:border-bottom="false">
								<view class="value">
									{{Array.isArray(detailInfo.workcenter_id) && detailInfo.workcenter_id.length > 1 ? detailInfo.workcenter_id[1] : '--'}}
								</view>
							</uni-forms-item>
							<uni-forms-item class="content-item" label="作业员" label-width="100" label-align="left"
								:border-bottom="false">
								<view class="value">
									{{Array.isArray(detailInfo.employee_assigned_ids) && detailInfo.employee_assigned_ids.length > 0 ? detailInfo.employee_assigned_ids.join(', ') : '--'}}
								</view>
							</uni-forms-item>
							<uni-forms-item v-if="rowItem.state != 'done' && rowItem.state != 'progress'"
								class="content-item" label="计划开工时间" label-width="100" label-align="left"
								:border-bottom="false">
								<view class="value">{{$mHelper.dateToUTC(rowItem.date_start) || '--'}}</view>
							</uni-forms-item>
							<uni-forms-item v-else class="content-item" label="开工时间" label-width="100"
								label-align="left" :border-bottom="false">
								<view class="value">{{$mHelper.dateToUTC(rowItem.date_start) || '--'}}</view>
							</uni-forms-item>
							<uni-forms-item v-if="rowItem.state != 'done'" class="content-item" label="计划完工时间"
								label-width="100" label-align="left" :border-bottom="false">
								<view class="value">{{$mHelper.dateToUTC(rowItem.date_finished) || '--'}}</view>
							</uni-forms-item>
							<uni-forms-item v-else class="content-item" label="完工时间" label-width="100"
								label-align="left" :border-bottom="false">
								<view class="value">{{$mHelper.dateToUTC(rowItem.date_finished) || '--'}}</view>
							</uni-forms-item>
							<view class="row-group" v-if="detailInfo.state == 'ready'">
								<uni-forms-item style="width: 45%;" class="content-item" label="领料状态" label-width="80"
									label-align="left" :border-bottom="false">
									<view class="value" :class="!detailInfo.is_picking ? 'link-warning' : 'link'">
										{{detailInfo.is_picking ? '已领料' : '未领料'}}
									</view>
								</uni-forms-item>
								<uni-forms-item style="width: 45%;" class="content-item" label="核料状态" label-width="80"
									label-align="left" :border-bottom="false">
									<view class="value" :class="!detailInfo.is_verify ? 'link-warning' : 'link'">
										{{detailInfo.is_verify ? '已核料' : '未核料'}}
									</view>
								</uni-forms-item>
							</view>
							<view class="row-group">
								<uni-forms-item style="width: 45%;" class="content-item" label="需求数量" label-width="80"
									label-align="left" :border-bottom="false">
									<view class="value">
										{{detailInfo.product_qty ? detailInfo.product_qty.toFixed(2) : '0'}}
										<span class="unit">{{detailInfo.product_uom_id | findValueDec }}</span>
									</view>
								</uni-forms-item>
								<uni-forms-item style="width: 45%;" class="content-item" label="已生产数量" label-width="80"
									label-align="left" :border-bottom="false">
									<view class="value">
										{{detailInfo.qty_producing ? detailInfo.qty_producing.toFixed(2) : '0'}}
										<span class="unit">{{detailInfo.product_uom_id | findValueDec }}</span>
									</view>
								</uni-forms-item>
							</view>
							<view v-if="viewSizeInfo(rowItem.product_id)" class="row-group">
								<!-- <uni-forms-item class="content-item" label="米数" label-width="60" label-align="left"
										:border-bottom="false">
										<view class="value">
											{{rowItem.product_qty ? rowItem.product_qty.toFixed(2) : ''}}
											<span class="unit">m</span>
										</view>
									</uni-forms-item> -->
								<uni-forms-item class="content-item" label="重量" label-width="60" label-align="left"
									:border-bottom="false">
									<view class="value">
										{{rowItem.weight ? rowItem.weight.toFixed(2) : ''}}
										<span class="unit">kg</span>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="幅宽" label-width="60" label-align="left"
									:border-bottom="false">
									<view class="value">{{rowItem.width ? rowItem.width.toFixed(2) : ''}}
										<span class="unit">mm</span>
									</view>
								</uni-forms-item>
								<uni-forms-item class="content-item" label="面密度" label-width="60" label-align="left"
									:border-bottom="false">
									<view class="value">{{rowItem.density ? rowItem.density.toFixed(2) : ''}}
										<span class="unit">g/m²</span>
									</view>
								</uni-forms-item>
							</view>
						</uni-forms>
					</card-info>
					<view class="cell-item" v-if="stepsList && stepsList.length">
						<view class="title">当前工序</view>
						<view class="steps">
							<u-steps mode="number" :list="stepsList" :current="stepCurrent"
								:active-color="$mStore.state.themeColor.color"></u-steps>
						</view>
					</view>
				</template>
				<template v-if="tabCurrent === 1">
					<scroll-view scroll-y="true">
						<view v-if="material_list.length > 0">
							<card-info v-for="(info, index) in material_list" :key="index" :title="info.product_name"
								:head-border-bottom="false" :line-icon="false">
								<uni-forms class="content-form">
									<uni-forms-item class="content-item" label=" " label-width="0" label-align="center"
										:border-bottom="false">
										<view class="value" style="color: initial">{{info.lot_name || ''}}</view>
									</uni-forms-item>
									<view class="row-group">
										<uni-forms-item style="width: 45%;" class="content-item" label="需求数量"
											label-width="150rpx" label-align="left" :border-bottom="false">
											<view class="value">
												{{info.product_uom_qty || ''}}
												<span class="unit">{{info.product_uom}}</span>
											</view>
										</uni-forms-item>
										<uni-forms-item style="width: 45%;" class="content-item" label="实际领用"
											label-width="150rpx" label-align="left" :border-bottom="false">
											<view class="value">
												{{info.quantity || ''}}
												<span class="unit">{{info.product_uom}}</span>
											</view>
										</uni-forms-item>
									</view>
								</uni-forms>
							</card-info>
						</view>
						<empty v-else text="暂无可用物料" mode="favor"></empty>
					</scroll-view>
				</template>
				<template v-if="tabCurrent === 2">
					<card-info title="质检数据">
						<view class="cell-content">
							<view class="group">
								<view class="row-title">检验标准</view>
								<view class="row-content">
									<u-field v-for="(item, index) in checkForm(true)" v-model="item.value"
										style="padding: 6rpx 0rpx;" :key="index" :label="item.label" :disabled="true"
										:border-bottom="false" label-width="180"></u-field>
								</view>
							</view>
							<view class="group">
								<view class="row-title">质检结果 <u-tag v-if="production.state == 'done'"
										style="margin-left: 20rpx;font-size: 22rpx;line-height: 1.2;border-radius: 4rpx;"
										:text="production.check_result || ''"
										:type="production.check_result | checkResultFilter" mode="dark" size="mini" />
								</view>
								<view class="row-content">
									<u-field v-for="(item, index) in checkForm(false)" v-model="item.value"
										style="padding: 6rpx 0rpx;" :key="index" :label="item.label" :disabled="true"
										:border-bottom="false" label-width="180"></u-field>
								</view>
							</view>
						</view>
					</card-info>
				</template>
				<template v-if="tabCurrent === 3">
					<card-info title="模具/工装绑定" style="overflow: initial;">
						<uni-forms class="content-form">
							<uni-forms-item class="content-item not-width-form-item" label="" :label-width="0"
								label-align="left" :border-bottom="false">
								<view class="value" style="width: 100%;">
									<uni-combox style="flex: 1;" :candidates="usable_mould_name_list"
										placeholder="请选择模具/工装" v-model="usable_mould_name"></uni-combox>
									<u-button style="margin-left: 20rpx; height: 76rpx; line-height: 76rpx;"
										type="primary" @click="bindMould">绑定</u-button>
								</view>
							</uni-forms-item>
						</uni-forms>
					</card-info>
					<card-info title="已绑定模具/工装" v-if="using_mould_list.length > 0">
						<card-info v-for="(info, index) in using_mould_list" :key="index" :body-style="{paddingTop: 0}"
							:title="`${info.name}`" :head-border-bottom="false" :line-icon="false">
							<uni-forms class="content-form">
								<uni-forms-item class="content-item not-width-form-item" label=" " label-width="0"
									label-align="left" :border-bottom="false">
									<view class="value">
										{{info.product_type || ''}}
									</view>
								</uni-forms-item>
								<view class="row-group">
									<uni-forms-item class="content-item" label="周长" label-width="40" label-align="left"
										:border-bottom="false">
										<view class="value">
											{{info.circumference || ''}}
										</view>
									</uni-forms-item>
									<uni-forms-item class="content-item" label="直径" label-width="40" label-align="left"
										:border-bottom="false">
										<view class="value">
											{{info.diameter || ''}}
										</view>
									</uni-forms-item>
									<uni-forms-item class="content-item" label="直径" label-width="40" label-align="left"
										:border-bottom="false">
										<view class="value">
											{{info.height || ''}}
										</view>
									</uni-forms-item>
								</view>
							</uni-forms>
							<template v-slot:head-right>
								<span class="item-close" @click="unBindMould(index)">
									<!-- <uni-icons type="trash" size="20" color="#FF7878"></uni-icons> -->
									<text style="color: #FF7878; display: inline-block; width: 60rpx;">解绑</text>
								</span>
							</template>
						</card-info>
					</card-info>
				</template>
			</view>
			<!-- </scroll-view> -->
			<view class="product-btn-box">
				<u-button class="option-btn" v-for="(menu, index) in renderOptionMenu(rowItem, menu_list)"
					:key="menu.value" size="mini" :type="menu.type" :loading="btnLoading" :disabled="menu.disabled"
					@click.stop="menuChange(menu, rowItem)">{{menu.label}}</u-button>
				<view class="other-menu-btn" @click.stop="(event) => otherBtnClick()">
					<span>更多</span>
					<u-icon name="more-dot-fill" size="32"></u-icon>
					<template v-if="otherMenuShow">
						<view class="mask" @click.stop="otherMenuShow = false"></view>
						<view class="menu-box" :class="menuPlacement">
							<view class="menu-content">
								<view class="menu-item" v-for="(menu, m_index) in otherList" :key="m_index"
									@click.stop="menuItemClick(menu)">
									<text>{{menu.title}}</text>
								</view>
							</view>
						</view>
					</template>
				</view>
			</view>
		</page-loading>
		<u-popup class="select-popup" v-model="hl_show" mode="bottom" closeable @close="hl_list = []">
			<view class="head">
				<text>核料</text>
			</view>
			<view class="content">
				<scroll-view scroll-y="true" style="height: 60vh; padding: 20rpx;">
					<view v-if="hl_list.length > 0" class="wuliao_list">
						<card-info v-for="(info, index) in hl_list" :key="index" :id="'scroll--' + info.lot_name"
							:title="`[${info.lot_name}]${info.product_name}`" :head-border-bottom="false"
							:line-icon="false">
							<uni-forms class="content-form">
								<!-- <uni-forms-item class="content-item" label=" " label-width="0" label-align="center"
									:border-bottom="false">
									<view class="value" style="color: initial">{{info.lot_name || ''}}</view>
								</uni-forms-item> -->
								<!-- <uni-forms-item class="content-item" label="需求数量" label-width="150rpx"
									label-align="left" :border-bottom="false">
									<view class="value">
										{{info.to_be_consumed || ''}}
										<span class="unit">{{info.product_uom}}</span>
									</view>
								</uni-forms-item> -->
								<uni-forms-item class="content-item" label="核料数量" label-width="150rpx"
									label-align="left" :border-bottom="false">
									<view class="value">
										<uni-easyinput :value="info.quantity" type="number" :styles="easyinputStyles"
											placeholder="" @input="inputChange"
											@blur="(event) => inputBlur(event, index)"></uni-easyinput>
										<span class="unit">{{info.product_uom}}</span>
									</view>
								</uni-forms-item>
							</uni-forms>
							<template v-slot:head-right>
								<span class="item-close" @click="hl_del(index)">
									<uni-icons type="trash" size="20" color="#FF7878"></uni-icons>
								</span>
							</template>
						</card-info>
					</view>
					<view v-else class="link" style="margin-top: 100rpx;">请扫描二维码</view>
				</scroll-view>
			</view>
			<view class="footer">
				<u-button :custom-style="customStyle" :loading="btnLoading" size="medium" hover-class="none"
					:hair-line="false" @click="hl_confirm">核料完成</u-button>
			</view>
		</u-popup>
		<u-action-sheet :list="ll_sheet" v-model="ll_sheet_show" :cancel-btn="false"
			@click="ll_sheet_click"></u-action-sheet>
		<u-modal v-model="abnormalShow" :title="'当前层数与实际层数不一致'" :title-style="{color: 'red'}" show-cancel-button
			confirm-text="确认提交" cancel-text="重新扫码" @confirm="modalConfirm">
			<view style="padding: 30rpx;">
				<view>当前层：{{tableList.length > 0 ? tableList[0].name : ''}}</view>
				<view>实际层：<span style="color: red">{{currentLayer || ''}}</span></view>
			</view>
		</u-modal>
		<clog-popup v-model="clogShow" :rowItem="rowItem" @confirm="clogConfirm"></clog-popup>
		<printer ref="printer" @print="print"></printer>
	</view>
</template>

<script>
	import api from '@/odooapi';
	import {
		mapGetters
	} from 'vuex';
	import {
		isFalse
	} from '@/common/checker.js';
	import pageLoading from '@/components/pageLoading/index.vue';
	import cardInfo from '@/components/card-info/index.vue';
	import cardTab from '@/components/card-tab/index.vue';
	import vTable from '@/components/no-bad-table/table.vue';
	import printer from '@/components/printer/index.vue';
	import {
		printLotCPCL
	} from '@/common/print/print/labelPrinter.js';
	import clogPopup from './clogPopup.vue';
	import {
		menu_list
	} from './data.js';
	import {
		renderOptionMenu
	} from './utils.js';
	export default {
		data() {
			return {
				navStyles: {
					navTitle: '工单详情',
					navBarFontSize: 32,
					rightIconSize: 44,
					navBarBg: '#6190e8',
					textColor: this.$mStore.getters.theme.navBar.frontColor,
				},
				customStyle: {
					width: '100%',
					backgroundColor: '#6190e8',
					color: '#fff',
					borderColor: '#6190e8',
					borderRadius: '60rpx',
					margin: 'initial'
				},
				easyinputStyles: {
					borderColor: '#a7a7a7',
				},
				id: null,
				production_id: null,
				rowItem: {},
				detailInfo: {},
				production: {},
				stateList: [{
						label: '全部',
						value: null
					},
					{
						label: '准备就绪',
						value: 'ready',
						type: 'primary'
					},
					{
						label: '进行中',
						value: 'progress',
						type: 'warning'
					},
					{
						label: '已完成',
						value: 'done',
						type: 'success'
					},
					{
						label: '已取消',
						value: 'cancel',
						type: 'info'
					},
					{
						label: '已等待另一工单',
						value: 'pending',
						type: 'success'
					},
					{
						label: '等待组件',
						value: 'waiting',
						type: 'warning'
					},
					// {
					// 	label: '待定',
					// 	value: 'pending',
					// 	type: 'error'
					// },
				],
				formList: [{
					label: '订单编号',
					valueKey: 'order',
					disabled: true,
				}, {
					label: '型号',
					valueKey: 'model_name',
					disabled: true,
				}, {
					label: '生产单号',
					valueKey: 'production_name',
					disabled: true,
				}, {
					label: '产品名称',
					valueKey: 'product_name',
					disabled: true,
				}, {
					label: '批次/序号',
					valueKey: 'finished_lot_id',
					disabled: true,
				}, {
					label: '下一单号',
					valueKey: 'next_order',
					disabled: true,
				}],
				stepCurrent: 0,
				stepsList: [],
				tabCurrent: 0,
				tabItems: ['基本信息', '物料清单', '质检信息', '模具工装'],
				tabList: [{
					name: '质检数据',
				}],
				columns: [{
						title: "录入层数",
						key: "name"
					},
					{
						title: '实际层数',
						key: 'value'
					},
					{
						title: '备注',
						key: 'remark'
					}
				],
				tableList: [],
				lotTableList: [],
				lot_group_id: null,
				currentIndex: null,
				fieldOption: {
					labelWidth: 240,
					borderBottom: false,
				},
				loadmore: 'loadmore',
				btnLoading: false,
				menu_list: menu_list,
				clogShow: false,
				barcode: '',
				updateLayer: {},
				abnormalShow: false,
				zc_serial: '',
				llot: '',
				llotErrorMessage: false,
				layerList: [],
				hl_show: false,
				hl_list: [],
				ll_sheet_show: false,
				ll_sheet: [{
					text: '库房领料'
				}, {
					text: '现场用料'
				}],
				material_list: [],
				using_mould_list: [],
				usable_mould_list: [],
				usable_mould_name: '',
				scrollTop: 0,
				otherMenuShow: false,
				menuPlacement: 'bottom',
				otherList: [{
						title: '领料',
						value: 5
					},
					{
						title: '废料入库',
						value: 3
					},
					{
						title: '废料使用',
						value: 7
					},
					// {
					// 	title: '核料',
					// 	value: 4
					// },

					// {
					// 	title: '生产上报',
					// 	value: 1
					// },
					{
						title: '生产记录',
						value: 2
					},
					{
						title: '打印标签',
						value: 6
					},
					// {
					// 	title: '自检',
					// 	value: 2
					// }
				],
				isFirst: true,
			}
		},
		components: {
			pageLoading,
			clogPopup,
			cardInfo,
			cardTab,
			vTable,
			printer,
		},
		computed: {
			...mapGetters(['navBarHeight']),
			checkForm() {
				return (isNorm) => {
					let publicArr = isNorm ? [{
						label: '标准重量',
						value: this.production['norm_weight']
					}] : [{
							label: '重量',
							value: this.production['weight']
						},
						{
							label: '体积',
							value: this.production['volume']
						},
						{
							label: '密度',
							value: this.production['density']
						},
					]
					let arr = this.$mStore.state.industryCustomFields.filter(item => {
						let real = isNorm ? item.cname.includes('norm') : !item.cname.includes('norm');
						return real && item.categ_ids.includes(this.production.categ_id?.length > 0 ? this
							.production.categ_id[
								0] : null);
					})
					return [...publicArr, ...arr.map((item) => {
						return {
							label: item.name,
							value: !isFalse(this.production[item.cname]) ? this.production[item.cname] : ''
						}
					})]
				}
			},
			navbarHeight() {
				let topHeight = 0;
				// #ifdef APP-PLUS
				topHeight = this.$store.getters.navBarHeight;
				// #endif
				return topHeight * (Math.floor(750 / this.$store.state.sysInfo.windowWidth))
			},
			usable_mould_name_list() {
				return this.usable_mould_list.map(m => m.name)
			},
			currentLayer() {
				let layer = this.barcode.split('layer:').length > 1 ? this.barcode.split('layer:')[1] : this.barcode.split(
					'layer:')[0]
				return layer
			}
		},
		watch: {
			tabCurrent: {
				handler(newVal) {
					if (newVal == 1) {
						this.get_hl_list();
					}
				},
				immediate: true
			},
			scrollTop() {
				this.otherMenuShow = false;
			},
		},
		filters: {
			findValueDec(data) {
				return data?.length > 0 ? data[1] : '--'
			},
			stateInfoFilter(state, type, stateList) {
				let findItem = stateList.find(item => item.value === state);
				let state_info = {
					label: findItem?.label || '--',
					type: findItem?.type || '--'
				}
				return type === 'state' ? state_info.label : state_info.type;
			},
			checkResultFilter(value) {
				let type = '';
				switch (value) {
					case '合格':
					case '让步放行':
						type = 'success';
						break;
					case '隔离':
						type = 'error';
						break;
					case '待检验':
					case '技术判定':
						type = 'warning';
						break;
					default:
						type = 'info';
				}
				return type;
			},
		},
		methods: {
			async refresh(part_refresh) {
				this.initData(part_refresh);
			},
			async initData(part_refresh) {
				await this.getData();
				this.isFirst = false;
				this.get_usable_mould_list();
				this.get_using_mould_list();
				if (!part_refresh) {
					this.get_lot_list();
				}
				await this.getWorker();
				await this.getIndustryCustomFields();
				await this.getProduction();
				if (typeof this.rowItem.name === 'string' && (this.rowItem.name.includes('裁切') || this.rowItem.name
						.includes('针刺'))) {
					this.getLayer()
				}
				if (this.tabCurrent == 1) {
					this.get_hl_list();
				}

			},
			async getIndustryCustomFields() {
				await this.$mStore.dispatch('getIndustryCustomFields');
			},
			async getProduction() {
				const Model = api.env.model('mrp.production');
				const res = await Model.read(this.production_id);
				if (res?.length > 0) {
					let row = res[0];
					this.production = row;
					this.detailInfo.qty_producing = this.production.qty_producing;
					this.detailInfo.product_qty = this.production.product_qty;
					this.detailInfo.product_uom_id = this.production.product_uom_id;
				}
			},
			async getData() {
				if (this.isFirst)
					this.loadmore = 'loadmore';
				// const Model = api.env.model('mrp.workorder');
				// const res = await Model.read(this.id);
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_workorders_with_attr',
					args: [],
					kwargs: {
						order: "date_start",
						domain: [
							['id', '=', this.id]
						],
					}
				});
				if (!res) {
					this.loadmore = 'error';
					return
				}
				if (res?.length > 0) {
					let row = res[0];
					this.rowItem = {
						...row
					};
					this.llotErrorMessage = false;
					this.llot = this.rowItem.llot || '';
					this.zc_serial = this.rowItem.serial || '';
					this.detailInfo = {
						...row,
						order: row.order,
						workcenter_id: row.workcenter_id,
						production_name: this.findName(row.production_id),
						qty_producing: null,
						product_qty: null,
						partner: row.partner || '',
						product_name: this.findName(row.product_id),
						finished_lot_id: this.findName(row.finished_lot_id),
						employee_assigned_ids: row.employee_assigned_ids,
						employee_ids: this.findEmployeeName(row.employee_ids, this.$mStore),
						date_start: this.$mHelper.dateToUTC(row.date_start) || '',
						date_finish: this.$mHelper.dateToUTC(row.date_finish) || '',
					}
					this.loadmore = 'more';
				} else {
					this.loadmore = 'nomore';
				}
				uni.stopPullDownRefresh();
			},
			getDetail(barcode) {
				this.abnormalShow = false;
				// let reg = /^[0-9\-]+$/;
				let reg = barcode.includes('layer:');
				if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('裁切') && reg) {
					this.barcode = barcode;
					// this.updateCaiqieLayer();
				} else if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('针刺')) {
					if (reg) {
						if (!this.zc_serial) {
							uni.showToast({
								title: '请先扫描物料批次',
								icon: 'none',
								mask: true
							})
							return
						} else {
							this.barcode = barcode;
							this.updateZhenciLayer();
						}
					} else {
						this.zc_serial = barcode
					}
				}
			},
			async getWorker() {
				const Model = api.env.model('mrp.workorder');
				const res = await Model.search_read({
					domain: [
						['production_id', '=', 14]
					]
				})
				if (res?.length) {
					this.stepsList = res;
					this.stepCurrent = this.stepsList.findIndex((item) => item.workcenter_id[0] === this.rowItem
						.workcenter_id[0]);
				}
			},
			async getLayer() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_layer_data',
					args: [],
					kwargs: {
						"workorder_id": this.id, // 工单id 
					}
				});
				if (res?.length > 0) {
					if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('裁切')) {
						this.layerList = res[0]?.data ?? [];
						let layer = this.layerList[0] || {};
						this.tableList = [{
							name: layer.next_layer || '',
							value: '',
							remark: ''
						}]
					} else if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('针刺')) {
						let l_data = res.find(item => item.serial === this.zc_serial) || {};
						this.layerList = l_data.data || [];
						let layer = this.layerList[0] || {};
						this.tableList = [{
							name: l_data.next_layer || '',
							value: '',
							remark: ''
						}]
					}
				} else {
					this.tableList = [{
						name: this.layerList.length + 1,
						value: '',
						remark: ''
					}]
				}
			},
			async updateCaiqieLayer(manual) {
				if (!manual && this.currentLayer != this.tableList[0].name) {
					this.abnormalShow = true;
					return
				}
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_caiqie_layer',
					args: [],
					kwargs: {
						"workorder_id": this.id, // 工单id 
						"layer": this.currentLayer, // 层数
						// "rewrite": false, // 是否重写该层, 在层数录入错误需要重新录入时会用 
					}
				});
				uni.hideLoading();
				if (res?.length > 0) {
					// this.tableList = res;
					this.updateLayer = res[0];
					// this.abnormalShow = !!this.updateLayer.abnormal_id;
					this.getLayer();
				}
			},
			async updateZhenciLayer(manual) {
				if (!manual && this.currentLayer != this.tableList[0].name) {
					this.abnormalShow = true;
					return
				}
				uni.showLoading();
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_zhenci_layer',
					args: [],
					kwargs: {
						"workorder_id": this.id, // 工单id 
						"layer": this.currentLayer, // 层数
						"serial": this.zc_serial,
						// "rewrite": false, // 是否重写该层, 在层数录入错误需要重新录入时会用 
					}
				});
				uni.hideLoading();
				if (res?.length > 0) {
					// this.tableList = res;
					this.updateLayer = res[0];
					this.abnormalShow = !!this.updateLayer.abnormal_id;
					this.getLayer();
				}
			},
			modalConfirm() {
				if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('裁切')) this.updateCaiqieLayer(
					true);
				if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('针刺')) this.updateZhenciLayer(
					true);
			},
			recordClick() {
				uni.navigateTo({
					url: `/pages/tqgf/application/production/use_record?id=${this.id}`
				})
			},
			renderOptionMenu(listItem, prevList) {
				return renderOptionMenu(listItem, prevList);
			},
			findEmployeeName(val, store) {
				return val?.length > 0 ? store.state.user.employeeList.find(em => em.id === val[0])?.name || '' : ''
			},
			findName(data) {
				return data?.length > 0 ? data[1] : ''
			},
			menuChange(menu, row) {
				this.rowItem = row;
				if (menu.value === 'production_done') return
				if (menu.value === 'button_block') {
					this.clogShow = true;
					return
				}
				if (menu.value === 'button_accept') {
					uni.showModal({
						title: '提示',
						content: '是否接收？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_start') {
					uni.showModal({
						title: '提示',
						content: '是否开工？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_finish') {
					uni.showModal({
						title: '提示',
						content: '是否完工？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_mark_done') {
					uni.showModal({
						title: '提示',
						content: '是否完工送检？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value === 'button_unblock') {
					uni.showModal({
						title: '提示',
						content: '是否解除阻塞？',
						success: (res) => {
							if (res.confirm) {
								this.callButton(menu.value, row);
							}
						}
					});
					return;
				}
				if (menu.value == 'll') {
					// this.ll_sheet_show = true;
					this.ll_sheet_click(0);
					return
				}
				if (menu.value == 'hl') {
					// this.hl_show = true;
					// this.get_hl_list();
					this.ll_sheet_click(1);
					return
				}
				if (menu.value == 'scsb') {
					let item = {
						res_model: 'mrp.workorder',
						// res_id: production_id,
						res_id: row.id,
						record_type: '生产记录'
					}
					let param = item ? JSON.stringify(item) : '';
					let url =
						`/pages/tqgf/application/dataReport/detail?param=${param}`;
					uni.navigateTo({
						url
					})
					return
				}
				if (menu.value === 'button_continue') {
					this.callButton('button_start', row);
					return;
				}
				this.callButton(menu.value, row);
			},
			async callButton(buttonType, row) {
				this.btnLoading = true;
				let id = buttonType === 'button_mark_done' && row.production_id?.length > 0 ? row.production_id[0] :
					row.id;
				const Model = buttonType === 'button_mark_done' ? api.env.model('mrp.production') : api.env.model(
					'mrp.workorder');
				try {
					let res = await Model.call_button(buttonType, [id], {
						context: {
							"auto_backorder": true
						}
					});
					if (res === false) {
						if (buttonType === 'button_finish') {
							// this.$refs.uTips.show({
							// 	title: '已完工',
							// 	type: 'success',
							// 	duration: '1500'
							// })
							uni.showToast({
								title: '已完工',
								icon: 'success'
							})
						} else if (buttonType === 'button_mark_done') {
							// this.$refs.uTips.show({
							// 	title: '已送检',
							// 	type: 'primary',
							// 	duration: '1500'
							// })
							uni.showToast({
								title: '已送检',
								icon: 'success'
							})
						}
						this.refresh();
					}
				} catch (e) {}
				this.btnLoading = false;
			},
			async get_material_info() {

			},
			async update_workcenter(barcode) {
				let res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_workcenter_id',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
						workcenter_barcode: barcode
					}
				})
				if (res) {
					uni.showToast({
						title: '设备绑定成功'
					})
					this.getData();
				}
			},
			async get_hl_list() {
				let res = await api.web.dataset.call_kw({
					model: 'stock.picking',
					method: 'picking_material_detail',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id
					}
				})
				if (res?.length) {
					let arr = [];
					res.forEach((r) => {
						if (Array.isArray(r.move_info)) {
							r.move_info.forEach((m) => {
								if (Array.isArray(m.batches)) {
									m.batches.forEach((b) => {
										arr.push({
											...m,
											...b
										})
									})
								}
							})
						}

					});
					// this.hl_list = arr;
					this.material_list = arr;
				}
			},
			async hl_add(barcode) {
				const product = await this.getLotUom(barcode);
				if (product) {
					this.hl_list.push({
						...product,
						quantity: ''
					})
				}
			},
			hl_del(index) {
				this.hl_list.splice(index, 1)
			},
			async ll_sheet_click(index) {
				let production_name = this.rowItem.production_id?.length > 1 ? this.rowItem.production_id[1] : null;
				let production_id = this.rowItem.production_id?.length > 0 ? this.rowItem.production_id[0] : null;
				let workcenter_id = this.rowItem.workcenter_id?.length > 0 ? this.rowItem.workcenter_id[0] : null;
				let scheduled_date = this.rowItem.date_start || '';
				let date_deadline = this.rowItem.date_finished || '';
				uni.showLoading({
					mask: true
				})
				let res = await api.web.dataset.call_kw({
					model: 'stock.location',
					method: 'get_location_by_workcenter_id',
					args: [
						[]
					],
					kwargs: {
						production_id,
						workcenter_id
					}
				})
				uni.hideLoading();
				if (res) {
					let picking_id = res?.picking_id ?? '';
					let location = JSON.stringify({
						id: res?.id ?? null,
						name: res?.name ?? ''
					})
					// if (index == 1) {
					// 	let url =
					// 		`/pages/tqgf/application/getMaterials/scene_detail?production_name=${production_name}&id=${picking_id}&location=${location}&from=${index == 1 ? '现场用料' : '库房领料'}`;
					// 	uni.navigateTo({
					// 		url
					// 	})
					// } else {
					let url =
						`/pages/tqgf/application/getMaterials/detail?production_name=${production_name}&production_id=${production_id}&id=${picking_id}&workorder_id=${this.rowItem.id}&location=${location}&scheduled_date=${scheduled_date}&date_deadline=${date_deadline}&from=${index == 1 ? '现场用料' : '库房领料'}`;
					uni.navigateTo({
						url
					})
					// }
				}
			},
			async hl_confirm() {
				let param = {
					workorder_id: this.rowItem.id,
					scan_move_data: this.hl_list.map((item) => ({
						...item,
						quantity: item.quantity ? item.quantity - 0 : 0
					}))
				}
				this.btnLoading = true;
				uni.showLoading({
					mask: true
				});
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'action_verify',
					args: [
						[]
					],
					kwargs: param
				})
				this.btnLoading = false;
				uni.hideLoading();
				if (res) {
					uni.showToast({
						title: '核料完成',
						icon: 'none'
					})
					this.hl_list = [];
					this.hl_show = false;
					this.refresh();
				}
			},
			async get_usable_mould_list() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_usable_mould_lot_list',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
						word: this.usable_mould_name
					}
				})
				if (res?.mould_lot_list?.length) {
					this.usable_mould_list = res.mould_lot_list;
				}
			},
			async get_using_mould_list() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'get_using_mould_lot_list',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
					}
				})
				if (res?.mould_lot_list?.length) {
					this.using_mould_list = res.mould_lot_list;
				} else {
					this.using_mould_list = [];
				}
			},
			async get_lot_list() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'get_or_create_little_serial',
					args: [
						[]
					],
					kwargs: {
						res_id: this.rowItem.id,
					}
				})
				if (res) {
					this.lot_group_id = res.group_id;
					if (Array.isArray(res.params)) {
						this.lotTableList = res.params.map(p => {
							return {
								...p,
								is_submit: true,
								errorMessage: false
							}
						});
					}
				}

			},
			async bindMould() {
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_mould_lot',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
						serial: this.usable_mould_name
					}
				})
				if (res) {
					this.usable_mould_name = '';
					this.get_using_mould_list();
				}
			},
			async unBindMould(index) {
				uni.showModal({
					title: '提示',
					content: '是否解绑？',
					success: async (res) => {
						if (res.confirm) {
							let serial = this.using_mould_list[index].name;
							const res = await api.web.dataset.call_kw({
								model: 'mrp.workorder',
								method: 'remove_mould_lot',
								args: [
									[]
								],
								kwargs: {
									workorder_id: this.rowItem.id,
									serial
								}
							})
							if (res) {
								this.get_using_mould_list();
							}
						}
					}
				});

			},
			lotTableAdd() {
				this.lotTableList.push({
					name: this.lotTableList.length + 1,
					value: '',
					errorMessage: false
				})
				this.currentIndex = this.lotTableList.length - 1
			},
			async lotTableZcSubimt() {
				if (!this.zc_serial) {
					uni.showToast({
						title: '请先扫描物料批次',
						icon: 'none',
						mask: true
					})
					return
				}
				if (!this.llot) {
					this.llotErrorMessage = true;
					return
				}
				uni.showLoading({
					mask: true
				})
				const res = await api.web.dataset.call_kw({
					model: 'mrp.workorder',
					method: 'update_llot',
					args: [
						[]
					],
					kwargs: {
						workorder_id: this.rowItem.id,
						serial: this.zc_serial,
						llot: this.llot
					}
				})
				uni.hideLoading();
				if (res) {
					this.$refs.uTips.show({
						title: '提交成功',
						type: 'success',
						duration: '1000'
					})
					// if (res.params?.length)
					// 	this.$set(this.lotTableList, index, res.params[0])
				}
			},
			async lotTableSubmit(index) {
				if (!this.lotTableList[index].value) {
					this.$set(this.lotTableList[index], 'errorMessage', true);
					return
				}
				uni.showLoading({
					mask: true
				})
				const res = await api.web.dataset.call_kw({
					model: 'mrp.params.group',
					method: 'create_or_update_params',
					args: [
						[]
					],
					kwargs: {
						group_id: this.lot_group_id,
						params: [this.lotTableList[index]].map(lot => {
							let {
								is_submit,
								errorMessage,
								...item
							} = lot;
							return item
						})
					}
				})
				uni.hideLoading();
				if (res) {
					this.$refs.uTips.show({
						title: '提交成功',
						type: 'success',
						duration: '1000'
					})
					if (res.params?.length) {
						let params = {
							...res.params[0],
							is_submit: true,
							errorMessage: false
						}
						this.$set(this.lotTableList, index, params);
					}
				}
			},
			async batchLotSubmit() {
				if (this.lotTableList.length <= 0) {
					uni.showToast({
						title: '请添加小批次',
						icon: 'none'
					})
					return
				}
				this.lotTableList.forEach((lot, index) => {
					if (!lot.value)
						this.$set(this.lotTableList[index], 'errorMessage', true);
				})
				let lotTableList = this.lotTableList.filter(lot => lot.value && !lot.is_submit);
				if (lotTableList.length) {
					uni.showLoading({
						mask: true
					})
					const res = await api.web.dataset.call_kw({
						model: 'mrp.params.group',
						method: 'create_or_update_params',
						args: [
							[]
						],
						kwargs: {
							group_id: this.lot_group_id,
							params: lotTableList.map(lot => {
								let {
									is_submit,
									errorMessage,
									...item
								} = lot;
								return item
							})
						}
					})
					uni.hideLoading();
					if (res) {
						this.$refs.uTips.show({
							title: '提交成功',
							type: 'success',
							duration: '1000'
						})
						if (res.params?.length) {
							res.params.forEach(r => {
								let findIndex = this.lotTableList.findIndex(lot => lot.name == r.name);
								if (findIndex > -1) {
									this.$set(this.lotTableList, findIndex, {
										...r,
										is_submit: true,
										errorMessage: false
									});
								}
							})
						}
					}
				} else {
					uni.showToast({
						title: '暂无可提交的小批次',
						icon: 'none'
					})
				}
			},
			lotTableDel(index) {
				uni.showModal({
					title: '提示',
					content: '是否删除？',
					success: async (res) => {
						if (res.confirm) {
							let id = this.lotTableList[index].id;
							if (!id) {
								this.lotTableList.splice(index, 1);
								return
							}
							if (id) {
								const res = await api.web.dataset.call_kw({
									model: 'mrp.params.group',
									method: 'delete_param',
									args: [
										[]
									],
									kwargs: {
										param_id: id
									}
								})
								if (res) {
									this.lotTableList.splice(index, 1);
								}
							}
						}
					}
				})
			},
			async getLotUom(barcode) {
				uni.showLoading({
					mask: true
				})
				let res = await api.web.dataset.call_kw({
					model: 'stock.lot',
					method: 'get_lot_uom',
					args: [
						[]
					],
					kwargs: {
						barcode
					}
				})
				uni.hideLoading();
				if (res) return res;
				else return null
			},
			print() {
				let lot_list = this.rowItem.finished_lot_id?.length > 1 ? [this.rowItem] : [];
				if (!lot_list?.length) {
					uni.showToast({
						title: '没有要打印的批次',
						icon: 'none'
					});
					return
				}
				printLotCPCL(this.$refs.printer, lot_list.map((lot) => {
					let product_code = Array.isArray(lot.product_code) && lot.product_code?.length > 0 ? lot
						.product_code[0] : lot.product_code || '';
					let product_name = lot.product_id?.length > 1 ? lot.product_id[1] : '';
					// let name = product_name?.length > 1 ? product_name[1].trim() : product_name[0];
					return {
						product_code,
						barcode: lot.finished_lot_id[1] || '',
						name: product_name,
						quantity: lot.product_qty + ' ' + lot.uom_name,
						order: lot.order || '',
						next_order: lot.next_order || '',
						model_name: lot.model_name || '',
						user: Array.isArray(lot.employee_assigned_ids) && lot.employee_assigned_ids.length >
							0 ? lot.employee_assigned_ids.join(', ') : ''
					}
				}))
			},
			otherBtnClick() {
				this.menuPlacement = 'top';
				this.otherMenuShow = true;
			},
			menuItemClick(menu) {
				this.otherMenuShow = false;
				this.menuItemChange(menu);
			},
			menuItemChange(e) {
				let production_id = this.rowItem.production_id?.length > 0 ? this.rowItem.production_id[0] : null;
				let production_name = this.rowItem.production_id?.length > 1 ? this.rowItem.production_id[1] : null;
				let item = {
					res_model: 'mrp.workorder',
					// res_id: production_id,
					res_id: this.rowItem.id,
					record_type: '生产记录'
				}
				let param = item ? JSON.stringify(item) : '';
				if (e.value == 1) {
					let url =
						`/pages/tqgf/application/dataReport/detail?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 2) {
					let url =
						`/pages/tqgf/application/dataReport/params_list?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 3) {
					let url =
						`/pages/tqgf/application/feiliaoPage/index?param=${param}`;
					uni.navigateTo({
						url
					})
				} else if (e.value == 4) {
					this.hl_show = true;
					this.get_hl_list();
				} else if (e.value == 5) {
					// this.ll_sheet_show = true;
					this.ll_sheet_click(0);
				} else if (e.value == 6) {
					this.print();
				} else if (e.value == 7) {
					let url =
						`/pages/tqgf/application/feiliaoPage/use?param=${param}`;
					uni.navigateTo({
						url
					})
				}
			},
			viewSizeInfo(product) {
				let charArray = ['复合布', '网胎', '碳布'];
				let product_name = product?.length > 1 ? product[1] : '';
				let isView = charArray.some(char => product_name.includes(char));
				return isView
			},
			inputChange(event, index) {
				if (typeof this.rowItem.name === 'string' && this.rowItem.name.includes('针刺')) {
					if (event) {
						this.llotErrorMessage = false;
					}
				} else {
					if (!isFalse(index)) {
						this.$set(this.lotTableList[index], 'value', event);
						if (event) {
							this.$set(this.lotTableList[index], 'errorMessage', false);
						}
					}
				}
				return event
			},
			inputBlur(event, index) {
				this.hl_list[index].quantity = event.detail.value
			},
			inputBlur2(event, index) {
				this.lotTableList[index].value = event.detail.value
				this.currentIndex = null;
			},
			inputBlur3(event) {
				this.llot = event.detail.value;
				this.currentIndex = null;
			},
			clogConfirm() {
				this.refresh();
			},
			scanStart() {
				if (uni.getSystemInfoSync().platform == 'android') {
					//PDA设备扫描监听
					uni.$on('qs_scanlistener_handle', code => {
						if (typeof code === 'string') {
							let scanCode = code.trim();
							if (this.hl_show) {
								this.get_material_info();
							} else if (scanCode.includes('mrp.workcenter:')) {
								this.update_workcenter(scanCode);
							} else {
								this.getDetail(scanCode);
							}
						} else {
							uni.showToast({
								title: '无效的条码：' + code,
								icon: 'none',
								duration: 3000
							})
						}
					})
				}
			},
			scanClick() {
				// // #ifdef H5
				// this.search_word = 'B240812001'
				// this.fullLoading = true;
				// this.getList('scan');
				// ['A2409230006'].forEach((lot) => {
				// 	this.hl_add(lot)
				// })
				// // #endif
				// this.barcode = '1';
				// this.getDetail('layer:1');
				// let scanCode = 'mrp.workcenter:513:123';
				// if (this.hl_show) {
				// 	this.get_material_info();
				// } else if (scanCode.includes('mrp.workcenter:')) {
				// 	this.update_workcenter(scanCode);
				// } else {
				// 	this.getDetail(scanCode);
				// }
				// setTimeout(() => {
				// 	this.getDetail('5');
				// }, 2000)
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		onPullDownRefresh() {
			this.otherMenuShow = false;
			this.isFirst = true;
			this.refresh();
		},
		onLoad(options) {
			if (options?.id) {
				this.id = Number(options.id);
				this.production_id = Number(options.production_id);
				this.initData();
			}
		},
		onShow() {
			if (!this.isFirst) {
				this.refresh(true);
			}
		},
		onReady() {
			setTimeout(() => {
				this.scanStart();
			}, 300)
		},
		onUnload() {
			if (uni.getSystemInfoSync().platform == 'android') {
				uni.$off('qs_scanlistener_handle');
			}
		},
	}
</script>
<style lang="scss">
	page {
		background-color: $page-color-light;
	}
</style>
<style lang="scss" scoped>
	.production-detail-page {
		height: calc(100vh - 100rpx);
		padding-bottom: 100rpx;

		.cell-item {
			padding: 40rpx 20rpx;
		}

		.cell-content {
			// padding: 20rpx;
			// background-color: #f5f5f5;
			display: flex;
			flex-wrap: wrap;

			.group {
				flex: 0 0 100%;
			}

			@media (min-width: 481px) {
				& {
					flex-wrap: nowrap;

					.group {
						flex: 0 0 50%;
					}
				}
			}
		}

		.title {
			font-weight: bold;
			font-size: 32rpx;
			margin: 20rpx 0;
		}

		.group {
			.row-title {
				display: flex;
				align-items: center;
				margin: 20rpx 0;
				font-weight: bold;
			}
		}

		.product-btn-box {
			display: flex;
			justify-content: flex-end;
			padding: 20rpx;
			position: fixed;
			width: 100%;
			bottom: 0;
			left: 0;
			z-index: 99;
			border-top: 2rpx solid $border-color-base;
			background-color: #fff;

			/deep/ .option-btn {
				margin-right: 0;
				margin-left: 0;
				border-radius: 4rpx;
				font-size: 30rpx;
				height: 60rpx;
				line-height: 60rpx;
				padding: 0 32rpx;

				&:not(:first-child) {
					margin-left: 20rpx;
				}
			}
		}

		.other-menu-btn {
			height: 60rpx;
			min-width: 65rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-left: 30rpx;
			position: relative;

			/deep/ .u-icon {
				transform: rotate(90deg);
			}

			.mask {
				position: fixed;
				top: 0;
				bottom: 0;
				right: 0;
				left: 0;
				background-color: rgba(0, 0, 0, .2);
				z-index: 999;
			}

			.menu-box {
				box-sizing: border-box;
				position: absolute;
				left: 0;
				width: 100%;
				background-color: #fff;
				border: 1px solid #ebeef5;
				border-radius: 6px;
				box-shadow: 0 5rpx 25rpx 0 rgba(0, 0, 0, .1);
				z-index: 1000;
				padding: 10rpx 0;
				width: 200rpx;
				left: auto;
				right: 0;
				top: 62rpx;

				&.top {
					top: auto;
					bottom: 62rpx;
				}

				.menu-content {
					.menu-item {
						display: flex;
						cursor: pointer;
						line-height: 70rpx;
						font-size: 30rpx;
						text-align: center;
						padding: 0 20rpx;
					}
				}
			}
		}

		.card-tab-content {
			position: relative;
			padding: 135rpx 20rpx 100rpx;

			.u-empty {
				position: fixed;
			}

			/deep/ .is-disabled {
				background-color: #f8f8f8;
				color: #6a6a6a;
			}
		}

		.select-popup {
			uni-view {
				font-size: 32rpx;
			}

			.content {
				padding: 0;
			}

			.wuliao_list {
				width: 100%;
				border-radius: 15rpx;
				overflow: hidden;
				text-align: left;
				overflow: hidden;

				.list-title {
					background-color: #e5efff;
					padding: 22rpx 22rpx 0;
					color: #8399bd;

					.sign {
						display: inline-block;
						width: 24rpx;
						height: 24rpx;
						border-radius: 50%;
						margin-right: 12rpx;
						background-color: #8399bd;

						&.primary {
							background-color: $uni-color-primary;
							// animation: breathing 2s infinite;
						}

						&.success {
							background-color: $uni-color-success;
							// animation: breathing 2s infinite;
						}

						&.error {
							background-color: $uni-color-error;
						}

						&.warning {
							background-color: $uni-color-warning;
						}

						&.info {
							background-color: #dcdcdc;
						}
					}
				}

				.list-item {
					background-color: #e5efff;
					margin-bottom: 0;
					padding: 0;

					&:not(:last-child) {
						border-bottom: 2rpx solid #c1d9ff;
					}

					.item-cell {
						display: flex;
						align-items: center;
						padding: 22rpx;
						word-break: break-all;
						overflow-wrap: break-word;
						position: relative;

						&:not(:last-child) {
							padding-bottom: 10rpx;
						}

						.label {
							width: 122rpx;
							color: #6190e8;
							font-size: 30rpx;
							margin-right: 20rpx;
						}

						.value {
							flex: 1;
							font-size: 30rpx;
							display: flex;
							align-items: center;
						}

						.box-container {
							display: flex;
							align-items: center;
							flex: 1;

							.item-add {
								padding: 0 15rpx;
								height: 42rpx;
								line-height: 42rpx;
							}

							.box-item {
								position: relative;
								padding: 22rpx 40rpx;
								background-color: #fcfdfe;

								&:not(:last-child) {
									margin-bottom: 10rpx;
								}

								&.active {
									background-color: #cdffff;
									animation: flicker 1s;
									animation-iteration-count: 2
								}

								@keyframes flicker {
									0% {
										background-color: #cdffff;
									}

									50% {
										background-color: #fff;
									}

									100% {
										background-color: #cdffff;
									}
								}

								.quantity {
									color: $uni-color-primary;
								}

								.item-cell {
									padding: 0;

									&:not(:last-child) {
										padding-bottom: 10rpx;
									}
								}

								// .label {
								// 	width: 106rpx;
								// }

								.item-close {
									position: absolute;
									right: 0rpx;
									top: 10rpx;
									line-height: 32rpx;
									text-align: center;
								}
							}
						}
					}
				}
			}
		}

		/deep/ .slot-right-wrap {
			display: flex;
			align-items: center;

			.right-item {
				padding-right: 20rpx;
				position: relative;
				display: flex;
				align-items: center;
				color: #fff;
			}
		}
	}
</style>