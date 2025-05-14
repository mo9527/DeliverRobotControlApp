<template>
	<view class="container">
		<view class="menu-item" @click="toUploadPic">
			<image src="/static/screen-display.png" mode="widthFix"></image>
			<text>屏幕显示</text>
		</view>
		<view class="menu-item">
			<image src="/static/open-door.png" mode="widthFix"></image>
			<text>开舱门</text>
		</view>
		<view class="menu-item" @click="doGoodsManager">
			<image src="/static/goods-manager.png" mode="widthFix"></image>
			<text>货物管理</text>
		</view>
		<view class="menu-item">
			<image src="/static/self-checking.png" mode="widthFix"></image>
			<text>设备自检</text>
		</view>
		<view class="menu-item">
			<image src="/static/screen-display.png" mode="widthFix"></image>
			<text>绑定</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {

		},
		methods: {
			doGoodsManager() {
				uni.navigateTo({
					url: '/pages/index/goodsManager'
				})
			},
			toUploadPic() {
				uni.navigateTo({
					url: '/pages/index/uploadPic'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		align-items: center;
		height: 100vh;
		justify-content: center;
		gap: 40rpx;
		padding: 0 240rpx;

		.menu-item {
			font-size: 88rpx;
			text-align: center;
			flex: 1;

			image {
				width: 100%;
			}
		}
	}
</style>