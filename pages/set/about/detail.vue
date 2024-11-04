<template>
	<view class="about">
		<view class="shop-info " v-if="title === '关于我们'">
			<view class="about-content" v-if="detail.about_me">
				<oa-parser lazy-load :html="detail.about_me"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.about_me "></oa-empty>
		</view>
		<view class="shop-info " v-if="title === '注册协议'">
			<view class="about-content" v-if="detail.protocol_register">
				<oa-parser lazy-load :html="detail.protocol_register"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.protocol_register "></oa-empty>
		</view>
		<view class="shop-info" v-if="title === '隐私协议'">
			<view class="about-content" v-if="detail.protocol_privacy">
				<oa-parser lazy-load :html="detail.protocol_privacy"></oa-parser>
			</view>
			<oa-empty :info="`暂无${title}`" v-if="!detail.protocol_privacy "></oa-empty>
		</view>

	</view>
</template>

<script>
	import oaParser from '@/components/oa-parser';
	import oaEmpty from '@/components/oa-empty';
	export default {
		components: {
			oaParser,
			oaEmpty
		},
		data() {
			return {
				detail: {
					"about_me": "<p></p><p>本系统主要为其他提供销售管理、采购管理、生产准备、客供点料、异常上报、生产执行、库存管理、人员管理等功能模块。</p><p><br/></p>"
				},
				title: null,
			};
		},
		onShow() {
			uni.setNavigationBarColor({
				frontColor: '#ffffff',
				backgroundColor: this.themeColor.color,
				animation: {
					duration: 400,
					timingFunc: 'easeIn'
				}
			})
		},
		onLoad(options) {
			this.title = options.title;
			uni.setNavigationBarTitle({
				title: options.title
			});
		},

	};
</script>
<style lang="scss">
	page {
		background-color: $page-color-base;
		position: relative;

		.about {
			.shop-info {
				.about-content {
					padding: $spacing-lg;
				}

				text-align: left;

				image {
					margin-top: 100upx;
					width: 240upx;
					height: 240upx;
					border-radius: 50%;
				}
			}
		}
	}
</style>
