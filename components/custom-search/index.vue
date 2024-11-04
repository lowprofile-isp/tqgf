<template>
	<view class="search-container">
		<template v-if="isPad">
			<u-search ref="search_sign" class="search-sign" :placeholder="placeholder" :value="value" height="80"
				:bg-color="$mStore.state.themeColor.dark ? '#fff' : '#fff'"
				:border-color="$mStore.state.themeColor.dark ? 'transparent' : $mStore.getters.themeColor.color"
				action-text="查询" search-icon="" :show-action="false" @change="searchChange">
			</u-search>
			<!-- #ifndef H5 -->
			<view class="search-scan" @tap="scanClick">
				<u-icon size="44" name="scan" margin-right="10rpx" label="扫码"></u-icon>
			</view>
			<!-- #endif -->
		</template>
		<template v-else>
			<u-search ref="search_sign" class="search-sign phone" :placeholder="placeholder" :value="value" height="70"
				:bg-color="$mStore.state.themeColor.dark ? '#fff' : '#fff'"
				:border-color="$mStore.state.themeColor.dark ? 'transparent' : $mStore.getters.themeColor.color"
				action-text="查询" search-icon="" :show-action="false" @change="searchChange">
			</u-search>
		</template>
		<view class="right-icons" v-if="isFilter">
			<i class="iconfont icon-shaixuan" :class="filterAcitve ? 'active' : ''" @click="filterShow = true"></i>
		</view>
		<u-popup class="custom-search-filter" v-model="filterShow" width="60%" mode="right" @close="close">
			<view class="filter-content">
				<slot name="filter"></slot>
			</view>
			<view class="bottom">
				<u-button style="flex: 1;" type="default" @click="reset">重置</u-button>
				<!-- <u-button type="primary" @click="confirm">确定</u-button> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		props: {
			placeholder: {
				type: String,
				default: '请输入搜索内容'
			},
			value: {
				type: String,
				default: ""
			},
			isFilter: {
				type: Boolean,
				default: false
			},
			filterAcitve: {
				type: Boolean,
				default: false
			},
			filterInfo: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {
				filterShow: false,
			}
		},
		computed: {
			...mapGetters(['isPad']),
		},
		methods: {
			searchChange(e) {
				this.$emit('searchChange');
				this.$emit("input", e);
			},
			scanClick() {
				this.$emit('scanClick')
			},
			confirm() {
				this.filterShow = false;
				this.$emit('filterConfirm');
			},
			reset() {
				this.filterShow = false;
				this.$emit('filterReset');
			},
			close() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-container {
		position: relative;
		height: 80rpx;
		// margin: 0 30rpx;
		margin: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.right-icons {
			color: $font-color-light;
			line-height: 1;

			.iconfont {
				font-size: 40rpx;
				margin-left: 20rpx;

				&.active {
					color: $uni-color-primary;
				}
			}
		}

		.search-scan {
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 200rpx;
			height: 100%;
			text-align: center;
			border-right: 1px solid $uni-color-primary;
			font-size: 34rpx;
			color: $uni-color-primary;

			/deep/ .u-icon__label {
				font-size: 36rpx !important;
				color: $uni-color-primary !important;
			}
		}

		.search-sign {
			&.phone {
				/deep/ .u-content {
					padding-left: 18rpx;
				}
			}

			// #ifndef H5
			/deep/ .u-content {
				padding-left: 240rpx;
			}

			// #endif

			/deep/ .u-icon__icon {
				font-size: 40rpx !important;
				padding-right: 10rpx;
			}

			/deep/ .u-input {
				font-size: 32rpx;
			}
		}

		.custom-search-filter {
			.filter-content {
				height: 100%;
				// #ifdef H5
				padding: 146rpx 22rpx 330rpx;
				// #endif
				// #ifndef H5
				padding: 146rpx 22rpx 230rpx;
				// #endif
				box-sizing: border-box;

				/deep/.filter-item {
					.head {
						font-weight: bold;
						margin-bottom: 20rpx;
					}

					.content {
						margin-bottom: 30rpx;

						.u-btn {
							margin-bottom: 20rpx;
							font-size: 26rpx;

							&:not(:last-child) {
								margin-right: 20rpx;
							}
						}

						.u-dropdown {
							&.active {
								.u-dropdown__menu__item__text {
									color: $uni-color-primary !important;
								}
							}

							.u-dropdown__menu__item {
								flex: none;
								padding-left: 10rpx;
								padding-right: 10rpx;
								min-width: 200rpx;
								max-width: 100%;
								border-radius: 10rpx;
								border: 1px solid $border-color-dark;
							}
						}

					}
				}
			}

			.bottom {
				position: absolute;
				// #ifdef H5
				bottom: 200rpx;
				// #endif
				// #ifndef H5
				bottom: 100rpx;
				// #endif
				left: 0;
				padding: 22rpx;
				border-top: 1px solid $border-color-light;
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
		}
	}
</style>