<template>
	<view class="container">
		<view class="title" @click="back">
			<image src="/static/back.png" style="width: 120rpx;margin-right: 32rpx;" mode="widthFix"></image>
			<text>屏幕显示</text>
		</view>
		<view class="content">
			<view class="content-item" style="width: 60%;">
				<view>取货记录</view>
				<view class="count-content">
					<view class="count-item">
						<view class="count">{{cargoLeftTotal}}</view>
						<view class="count-tip">剩余货物</view>
					</view>
					<view class="count-item">
						<view class="count">{{codeLeftTotal}}</view>
						<view class="count-tip">剩余取货码</view>
					</view>
					<view class="count-item">
						<view class="count">{{cargoTookTotal}}</view>
						<view class="count-tip">已取货</view>
					</view>
				</view>
				<view class="footer-btn">
					<view class="footer-tip">导入货物后请务必保证货舱每行数量一致</view>
					<view class="btn-box">
						<view class="btn-item" @tap="setCargoQuantity">设置货物数量</view>
						<view class="btn-item">导入取货码</view>
					</view>
				</view>
			</view>
			<view class="content-record">
				<view class="record-title">
					<view>取货记录</view>
					<view class="title-btn">
						<view class="refresh-btn">刷新</view>
						<view class="clear-btn">清空记录</view>
					</view>
				</view>
				<view class="list-content">
					<view class="list-item" :class="{'item-active': (index & 1) === 0}" v-for="(item, index) in infoList">
						<view>{{item.description}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>
				</view>
				<view class="load-more">
					加载更多
				</view>
			</view>
		</view>
	</view>
	<!-- 设置货物数量弹窗 -->
	<u-popup v-model:show="showQuantityPopup" mode="center" :round="10" :closeable="true">
		<view class="popup-container">
			<view class="popup-title">设置货物数量</view>
			<view class="quantity-input">
				<input class="quantity-input-box" type="number" v-model="cargoQuantity" placeholder="请输入导入货舱每行的货物数量" />
			</view>
			<view class="popup-buttons">
				<view class="popup-btn cancel" @tap="showQuantityPopup = false">取消</view>
				<view class="popup-btn confirm" @tap="confirmQuantity">确认</view>
			</view>
		</view>
	</u-popup>
	<xe-upload ref="XeUpload" :options="{}" @callback="handleUploadCallback"></xe-upload>
</template>

<script>
	const wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	// import websocket from '@/utils/websocket.js';
	export default {
		data() {
			return {
				infoList: [],
				showQuantityPopup: false,
				cargoQuantity: 0,
				codeLeftTotal: 0,
				cargoLeftTotal: 0,
				cargoTookTotal: 0,
			}
		},
		onLoad() {
			this.fetchCargoRecords()
		},
		methods: {
			// 设置货物数量
			setCargoQuantity() {
				this.showQuantityPopup = true;
			},
			handleUploadCallback(res) {
				console.log(res);
				var path = plus.io.convertLocalFileSystemURL(res.data[0].tempFilePath)
				console.log(path)
				wanyiPlugin.readExcel({path: path}, (data) => {
					let codeData = JSON.stringify(data)
				})
			},
			// 确认设置货物数量
			confirmQuantity() {
				// 调用API设置货物数量
				uni.showLoading({
					title: '设置中...'
				});
				
				wanyiPlugin.restCargoStock({itemTotal: this.cargoQuantity}, (res) => {
					uni.hideLoading();
					uni.showToast({
						title: '设置成功',
						icon: 'success'
					});
					this.showQuantityPopup = false;
				})
			},
			back() {
				uni.navigateBack()
			},
			getCargoStock() {
				wanyiPlugin.getCargoStock({}, (res) => {
					console.log(res)
					this.codeLeftTotal = res.data.codeLeftTotal
					this.cargoLeftTotal = res.data.cargoLeftTotal
					this.cargoTookTotal = res.data.cargoTookTotal
				})
			},
			fetchCargoRecords() {
				wanyiPlugin.getOperationLog({type: ["CARGO_TAKE", "OPEN_GATE"], pageNum: 1}, (res) => {
					console.log(res)
					this.infoList = res.data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	// 弹窗样式
	.popup-container {
		width: 560rpx;
		padding: 88rpx;
		
		.popup-title {
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 40rpx;
		}
		
		.quantity-input {
			display: flex;
			justify-content: center;
			margin-bottom: 40rpx;
	
			.quantity-input-box {
				width: 100%;
				height: 80rpx;
				background-color: #F4F4F4;
				border-radius: 12rpx;
				padding: 8rpx 20rpx;
			}
		}
		
		.popup-buttons {
			display: flex;
			justify-content: space-between;
			
			.popup-btn {
				width: 45%;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 16rpx;
				font-size: 28rpx;
				font-weight: 500;
			}
			
			.cancel {
				color: #1CAA3B;
				border: 1px solid #1CAA3B;
			}
			
			.confirm {
				background-color:  #1CAA3B;
				color: #FFFFFF;
			}
		}
	}
	.container {
		font-size: 72rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 96rpx;
		height: calc(100vh - 192rpx);
		background: url('/static/page-bg.png') no-repeat;
		background-size: 100% 100%;
		
		.title {
			display: flex;
			align-items: center;
			margin-bottom: 88rpx;
		}
		
		.content {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 80rpx;
			margin: 88rpx 0;
			
			.content-record {
				width: 100%;
				display: flex;
				background-color: #fff;
				border-radius: 64rpx;
				padding: 88rpx;
				justify-content: space-between;
				height: 100%;
				flex-direction: column;
				
				.list-content {
					height: 1142rpx;
					overflow: auto;
					
					.item-active {
						background: #F4F4F4;
						border-radius: 24rpx;
					}
					
					.list-item {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 48rpx;
						padding: 40rpx 64rpx;
						
						
						.time {
							color: #999;
						}
					}
				}
				
				.load-more {
					align-self: center;
					background: #F2FAF3;
					border-radius: 32rpx;
					color: #1CAA3B;
					font-size: 56rpx;
					padding: 36rpx 180rpx;
				}
				
				.record-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					
					.title-btn {
						display: flex;
						gap: 32rpx;
						font-size: 48rpx;
						
						.refresh-btn {
							color: #1CAA3B;
							background-color: #F2FAF3;
							padding: 24rpx 50rpx;
							border-radius: 32rpx;
						}
						
						.clear-btn {
							background: #FFEAE8;
							padding: 24rpx 50rpx;
							border-radius: 32rpx;
							color: #FF472F;
						}
					}
				}
			}
			
			.content-item {
				position: relative;
				background-color: #fff;
				border-radius: 64rpx;
				width: 100%;
				padding: 88rpx;
				height: 100%;
				
				.footer-btn {
					position: absolute;
					bottom: 88rpx;
					width: calc(100% - 176rpx);
					
					.footer-tip {
						font-size: 40rpx;
						color: #FF472F;
						margin-bottom: 48rpx;
					}
					
					.btn-box {
						display: flex;
						gap: 48rpx;
						
						.btn-item {
							text-align: center;
							background: #1CAA3B;
							border-radius: 32rpx;
							padding: 36rpx;
							color: #fff;
							font-size: 56rpx;
							flex: 1;
						}
					}
				}
				
				.count-content {
					display: flex;
					align-items: center;
					gap: 50rpx;
					margin-top: 88rpx;
					
					.count-item {
						background: #F4F4F4;
						border-radius: 56rpx;
						text-align: center;
						flex: 1;
						padding: 64rpx 0;
						
						.count {
							font-size: 120rpx;
							font-weight: bold;
						}
						
						.count-tip {
							font-size: 40rpx;
							color: #999999;
						}
					}
					
					
				}
			}
		}
	}
</style>
