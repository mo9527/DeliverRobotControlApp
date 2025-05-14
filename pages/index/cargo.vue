<template>
  <view class="subpage">
		<view class="uni-form-item uni-column">
			<view class="center-button" @click="importPickupCode">导入取货码</view>
			<xe-upload ref="XeUpload" :options="{}" @callback="handleUploadCallback"></xe-upload>
		</view>
  </view>
</template>


<script>
	var wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
	  data() {
			return {
				
			}
	  },
	  mounted() {
	  },
	  onLoad(options) {
			// 获取格子 ID 和菜单名字
			this.gridId = options.id || '未知'
			this.menuName = decodeURIComponent(options.name || '未知')
			// 动态设置导航栏标题
			uni.setNavigationBarTitle({
				title: this.menuName
			})
	  },
	  methods: {
			handleUploadCallback(res) {
				console.log(res);
				var path = plus.io.convertLocalFileSystemURL(res.data[0].tempFilePath)
				wanyiPlugin.readExcel({
					"path": path
				}, (data) => {
					console.log(JSON.stringify(data));
				})
			},
			importPickupCode() {
				let that = this;
			
				uni.showActionSheet({
					itemList: ['重新导入，更换取货码', '追加导入，增加取货码', '清空取货码'],
					itemColor: '#3978E8',
					success: function(res) {
						let index = res.tapIndex + 1;
						console.log('选中了第' + (index) + '个按钮');
						if (res.tapIndex === 0) {
							that.$refs.XeUpload.upload('file', {index});
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
			},

	  }
	}
</script>

<style>
	.subpage {
	  height: 100vh;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  background-color: #f5f5f5;
	}

	.center-button {
	  width: 300rpx;
	  height: 100rpx;
	  font-size: 32rpx;
	  background-color: #007aff;
	  color: #fff;
	  border-radius: 10rpx;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	}
	.grid-item {
	  transition: background-color 0.3s;
	}
	
	.status-label {
	  font-size: 32rpx;
	  color: #000000;
	}
</style>