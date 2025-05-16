<template>
	<view class="container">
		<view class="menu-item" @click="toUploadPic">
			<image src="/static/screen-display.png" mode="widthFix"></image>
			<text>屏幕显示</text>
		</view>
		<view class="menu-item" @click="openGate">
			<image src="/static/open-door.png" mode="widthFix"></image>
			<text>开舱门</text>
		</view>
		<view class="menu-item" @click="doGoodsManager">
			<image src="/static/goods-manager.png" mode="widthFix"></image>
			<text>货物管理</text>
		</view>
		<view class="menu-item" @click="doSelfChecking">
			<image src="/static/self-checking.png" mode="widthFix"></image>
			<text>设备自检</text>
		</view>
		<view class="menu-item">
			<image src="/static/screen-display.png" mode="widthFix"></image>
			<text>手机绑定</text>
		</view>
	</view>
	
	<!-- 设备自检弹窗 -->
	<u-popup round="48" v-model:show="showSelfCheckPopup" mode="center" @close="closeSelfCheckPopup" width="100%">
		<view class="self-check-popup">
			<view class="popup-title">设备自检</view>
			<view class="check-item" v-for="(item, index) in checkItems" :key="index">
				<text class="item-name">{{item.displayName}}</text>
				<text class="item-status" :class="item.status === 'NORMAL' ? 'status-normal' : 'status-error'">{{getStatus(item)}}</text>
			</view>
		</view>
	</u-popup>
</template>

<script>
	const wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
		data() {
			return {
				showSelfCheckPopup: false,
				checkItems: []
			}
		},
		onLoad() {

		},
		methods: {
			getStatus(item) {
				if (item.status === 'NORMAL') {
					return '正常'
				} else if (item.status === 'FAULT') {
					return item.faultReason
				} else if (item.status === 'DISCONNECTED') {
					return '设备未连接'
				}
			},
			async doSelfChecking() {
				uni.showLoading({
					title: '设备检测中',
					mask: true
				})
				await new Promise(resolve => setTimeout(resolve, 3000));
				wanyiPlugin.devicesCheck({}, (res) => {
					console.log('检查结果返回：', res.data)
					this.checkItems = res.data
					this.showSelfCheckPopup = true;
					
					uni.hideLoading();
				});
				
			},
			closeSelfCheckPopup() {
				this.showSelfCheckPopup = false;
			},
			openGate() {
				wanyiPlugin.openGate({
					"gate": 1
				}, (res) => {
					uni.showToast({
						title: res.message,
					});
				})
			},
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
	
	.self-check-popup {
		width: 1496rpx;
		padding: 88rpx;
		border-radius: 48rpx;
		
		.popup-title {
			font-size: 64rpx;
			text-align: center;
			font-weight: bold;
			margin-bottom: 30rpx;
		}
		
		.check-item {
			display: flex;
			justify-content: space-between;
			padding: 40rpx 0;
			border-bottom: 1px solid #eee;
			font-size: 48rpx;
			
			.item-name {
				font-size: 48rpx;
			}
			
			.item-status {
				
				&.status-normal {
					color: #07c160;
				}
				
				&.status-error {
					color: #fa3534;
				}
			}
		}
	}
</style>