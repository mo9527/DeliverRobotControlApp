<template>
	<view class="container">
		<view class="grid">
			<view v-for="(item, index) in grids" :key="index" class="grid-item"
				@click="goToSubPage(index + 1, item.name, item.path)">
				<text class="menu-text">{{ item.name }}</text>
			</view>
		<view class="menu-item" @click="toUploadPic">
			<image src="/static/screen-display.png" mode="widthFix"></image>
			<text>屏幕显示</text>
		</view>
		<xe-upload ref="XeUpload" :options="{}" @callback="handleUploadCallback"></xe-upload>
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
	var wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
		data() {
			return {
				grids: [{
						name: '导入',
						path: '/pages/index/gate'
					}, {
						name: '货仓门控制',
						path: '/pages/index/gate'
					},
					{
						name: '丝杆控制',
						path: '/pages/index/screwRod'
					},
					{
						name: '手机端绑定',
						path: '/pages/index/robotIp'
					},
					{
						name: '设备自检',
						path: '/pages/index/devicesCheck'
					}
				]
























			}
		},
		onLoad() {

		},
		methods: {
			handleUploadCallback(res) {
				console.log(res);
				wanyiPlugin.readExcel({
					"path": res.data.tempFilePath
				}, (data) => {
					console.log(data);
			doGoodsManager() {
				uni.navigateTo({
					url: '/pages/index/goodsManager'




				})
			},
			importCargoCode() {
				let that = this;

				uni.showActionSheet({
					itemList: ['重新导入，更换取货码', '追加导入，增加取货码', '清空取货码'],
					itemColor: '#3978E8',
					success: function(res) {
						console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
						if (res.tapIndex === 0) {
							that.$refs.XeUpload.upload('file', {});
						} else if (res.tapIndex === 1) {
							that.showConfirmPopup = true;
						} else if (res.tapIndex === 2) {
							that.showConfirmPopup = true;
						}
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				});
			}
			//子页面
			goToSubPage(index, name, itemPath) {
				console.log(index, name, itemPath)
				if (name == "N/A") {
					uni.showToast({
						title: '功能未开放'
					})
					return;
				}
			toUploadPic() {





























				uni.navigateTo({
					url: itemPath + `?id=${index}&name=${encodeURIComponent(name)}`
					url: '/pages/index/uploadPic'
				})
			}
		}
	}
</script>

<style>
<style lang="scss" scoped>
	.container {
		padding: 20rpx;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20rpx;
	}

	.grid-item {
		background-color: #f0f0f0;
		height: 200rpx;
		display: flex;
		align-items: center;
		height: 100vh;
		justify-content: center;
		align-items: center;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
		font-size: 28rpx;
		color: #333;
	}
		gap: 40rpx;
		padding: 0 240rpx;

	.grid-item:hover {
		background-color: #e0e0e0;
	}
		.menu-item {
			font-size: 88rpx;
			text-align: center;
			flex: 1;

	.menu-text {
		text-align: center;
		word-break: break-all;
		padding: 10rpx;
			image {
				width: 100%;
			}
		}
	}

	.grid-item {
		transition: background-color 0.3s;
	}
</style>