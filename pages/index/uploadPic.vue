<template>
	<view class="container">
		<template v-if="!isInApplication">
			<view class="title" @click="back">
				<image src="/static/back.png" style="width: 120rpx;margin-right: 32rpx;" mode="widthFix"></image>
				<text>屏幕显示</text>
			</view>
			<view class="content">
				<view class="content-item">
					<view>上屏显示</view>
					<view class="upload">
						<view @click="doUpload('up')">
							<view class="upload-icon">
								<u-icon size="120" color="#1CAA3B" name="plus"></u-icon>
							</view>
							<view style="margin-top: 32rpx;">建议尺寸：1920*1080</view>
						</view>
						<image style="margin-left: 64rpx;" mode="aspectFill" :src="upPic"></image>
					</view>
				</view>
				<view class="content-item">
					<view>下屏显示</view>
					<view class="upload">
						<view @click="doUpload('down')">
							<view class="upload-icon">
								<u-icon size="120" color="#1CAA3B" name="plus"></u-icon>
							</view>
							<view style="margin-top: 32rpx;">建议尺寸：1920*1080</view>
						</view>
						<image style="margin-left: 64rpx;" mode="aspectFill" :src="downPic"></image>
					</view>
				</view>
			</view>
			<view class="footer-btn" @click="isInApplication = true">应用</view>
		</template>
		<view v-if="isInApplication" class="application-screen">
			<image @click="closeImage" :src="upPic"></image>
			<view class="close" v-if="closeIcon" @click="isInApplication = false">
				<u-icon name="close-circle" size="88"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				upPic: '',
				downPic: '',
				isInApplication: false,
				closeIcon: false
			}
		},
		methods: {
			back() {
				uni.navigateBack()
			},
			closeImage() {
				this.closeIcon = true
				setTimeout(() => {
					this.closeIcon = false
				}, 3000)
			},
			doUpload(type) {
				let that = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						// let path = plus.io.convertLocalFileSystemURL(res.tempFilePaths[0])
						if (type === 'up') {
							that.upPic = res.tempFilePaths[0]
						} else {
							that.downPic = res.tempFilePaths[0]
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.application-screen {
		margin: -96rpx;
		
		image {
			width: 100vw;
			height: 100vh;
		}
		
		.close {
			position: fixed;
			top: 88rpx;
			right: 88rpx;
		}
	}
	
	.container {
		font-size: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 96rpx;
		height: calc(100vh - 192rpx);
		background: url('/static/page-bg.png') no-repeat;
		background-size: 100% 100%;
		
		.footer-btn {
			padding: 36rpx 180rpx;
			background-color: #1CAA3B;
			border-radius: 32rpx;
			color: #fff;
			align-self: center;
			margin-top: 88rpx;
		}
		
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
			
			.content-item {
				background-color: #fff;
				border-radius: 64rpx;
				width: 100%;
				padding: 88rpx;
				height: 100%;
				
				.upload {
					display: flex;
					align-items: center;
					font-size: 56rpx;
					color: #999;
					text-align: center;
					
					.upload-icon {
						margin-top: 88rpx;
						border: 8rpx solid #77CC89;
						width: 600rpx;
						height: 600rpx;
						border-radius: 56rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						
						.plus-icon {
							
						}
					}
					
					image {
						height: 600rpx;
						border-radius: 56rpx;
					}
				}
			}
		}
	}
</style>
