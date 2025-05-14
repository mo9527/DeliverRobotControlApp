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
						<view class="count">0</view>
						<view class="count-tip">剩余货物</view>
					</view>
					<view class="count-item">
						<view class="count">0</view>
						<view class="count-tip">剩余取货码</view>
					</view>
					<view class="count-item">
						<view class="count">0</view>
						<view class="count-tip">已取货</view>
					</view>
				</view>
				<view class="footer-btn">
					<view class="footer-tip">导入货物后请务必保证货舱每行数量一致</view>
					<view class="btn-box">
						<view class="btn-item">设置货物数量</view>
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
						<view>打开舱门</view>
						<view class="time">2023-03-01 17:10:45</view>
					</view>
				</view>
				<view class="load-more">
					加载更多
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
		data() {
			return {
				infoList: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
			}
		},
		onLoad() {
			this.fetchCargoRecords()
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			fetchCargoRecords() {
				wanyiPlugin.getOperationLog({type: ["CARGO_TAKE", "OPEN_GATE"], pageNum: 1}, (res) => {
					console.log(res)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
