<template>
	<view class="container">
		<view class="title" @click="back">
			<image src="/static/back.png" style="width: 120rpx;margin-right: 32rpx;" mode="widthFix"></image>
			<text>货物管理</text>
		</view>
		<view class="content">
			<view class="content-item" style="width: 60%;">
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
						<view class="btn-item" @tap="setCargoQuantity">重置货舱</view>
						<view class="btn-item" @tap="importCargoCode">导入取货码</view>
					</view>
				</view>
			</view>
			<view class="content-record">
				<view class="record-title">
					<view>取货记录</view>
					<view class="title-btn">
						<view class="refresh-btn" @click="doRefresh">刷新</view>
						<view class="clear-btn" @click="doClear">清空记录</view>
					</view>
				</view>
				<scroll-view @scrolltolower="doGetMore" :scroll-y="true" class="list-content" :style="{height: listHeight + 'px'}">
					<view class="list-item" :class="{'item-active': (index & 1) === 0}" v-for="(item, index) in infoList">
						<view>{{item.description}}</view>
						<view class="time">{{item.createTime}}</view>
					</view>
				</scroll-view>
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
	
	<!-- 导入取货码弹窗 -->
	<u-popup v-model:show="showImportPopup" mode="center" :round="10" :closeable="true">
		<view class="import-code-popup">
			<view class="popup-title">导入取货码</view>
			<view class="import-options">
				<view class="option-item option-change" @tap="handleImportOption(0)">
					<view class="option-name">重新导入</view>
					<view class="option-desc">更换取货码</view>
				</view>
				<view class="option-item option-add" @tap="handleImportOption(1)">
					<view class="option-name">追加导入</view>
					<view class="option-desc">增加取货码</view>
				</view>
				<view class="option-item option-clear" @tap="handleImportOption(2)">
					<view class="option-name">清空取货码</view>
				</view>
			</view>
			<view class="cancel-btn" @tap="showImportPopup = false">取消</view>
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
				pageNum: 1,
				infoList: [],
				showQuantityPopup: false,
				showImportPopup: false,
				cargoQuantity: 0,
				codeLeftTotal: 0,
				cargoLeftTotal: 0,
				cargoTookTotal: 0,
				listHeight: 0
			}
		},
		onLoad() {
			this.fetchCargoRecords()
			this.getCargoStock()
			let that = this
			uni.getSystemInfo({
				success(res) {
					console.log(res);
					that.listHeight = res.windowHeight - 390
					that.$forceUpdate()
				}
			})
		},
		methods: {
			// 导入取货码
			importCargoCode() {
				this.showImportPopup = true;
			},
			// 处理导入选项
			handleImportOption(index) {
				console.log('选中了第' + (index + 1) + '个按钮');
				if (index === 0) {
					this.$refs.XeUpload.upload('file', {});
				} else if (index === 1) {
					// 追加导入逻辑
					// 可以添加确认弹窗或直接调用上传
					this.$refs.XeUpload.upload('file', {append: true});
				} else if (index === 2) {
					// 清空取货码逻辑
					uni.showModal({
						title: '提示',
						content: '确定要清空所有取货码吗？',
						success: (res) => {
							if (res.confirm) {
								// 调用清空API
								wanyiPlugin.clearCargoCodes({}, (res) => {
									uni.showToast({
										title: '清空成功',
										icon: 'success'
									});
									this.getCargoStock();
								});
							}
						}
					});
				}
				this.showImportPopup = false;
			},
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
					this.getCargoStock()
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
			doClear() {
				
			},
			doRefresh() {
				this.pageNum = 1
				this.infoList = []
				this.fetchCargoRecords()
			},
			doGetMore() {
				this.pageNum++
				this.fetchCargoRecords()
			},
			fetchCargoRecords() {
				wanyiPlugin.getOperationLog({type: ["CARGO_TAKE", "OPEN_GATE"], pageNum: this.pageNum}, (res) => {
					console.log(res)
					this.infoList = this.infoList.concat(res.data || [])
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
	
	// 导入取货码弹窗样式
	.import-code-popup {
		// width: 1200rpx;
		padding: 20rpx;
		background-color: #fff;
		border-radius: 48rpx;
		
		.popup-title {
			font-size: 64rpx;
			text-align: center;
			font-weight: bold;
			margin-bottom: 60rpx;
		}
		
		.import-options {
			display: flex;
			justify-content: space-around;
			margin-bottom: 60rpx;
			
			.option-change {
				background: url('/static/add-import.png') no-repeat;
				background-size: 400rpx 340rpx;
			}
			
			.option-add {
				background: url('/static/import.png') no-repeat;
				background-size: 400rpx 340rpx;
			}
			
			.option-clear {
				background: url('/static/clear-code.png') no-repeat;
				background-size: 400rpx 340rpx;
			}
			
			.option-item {
				width: 400rpx;
				height: 340rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 40rpx;
				text-align: center;
				
				.option-name {
					font-size: 48rpx;
					margin-bottom: 10rpx;
				}
				
				.option-desc {
					font-size: 32rpx;
					color: #999;
				}
			}
		}
		
		.cancel-btn {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 48rpx;
			color: #07c160;
			border-top: 1px solid #eee;
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
			// margin: 88rpx 0;
			
			.content-record {
				width: 100%;
				// display: flex;
				background-color: #fff;
				border-radius: 64rpx;
				padding: 88rpx;
				height: calc(100% - 196rpx);
				
				.list-content {
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
				
				
				.record-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 56rpx;
					
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
				height: calc(100% - 196rpx);
				
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
							font-size: 48rpx;
							flex: 1;
						}
					}
				}
				
				.count-content {
					display: flex;
					align-items: center;
					gap: 50rpx;
					// margin-top: 88rpx;
					
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
