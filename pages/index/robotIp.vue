<template>
  <view class="subpage">
		<view class="qrcode">
		   <text>使用手机端扫码绑定</text>
		   <uqrcode ref="qrcode" canvas-id="qrcode" :value="qrValue" style="width: 200px; height: 200px;"></uqrcode>
		</view>
  </view>
</template>


<script>
	var wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
	  data() {
			return {
				gridId: '',
				menuName: '未知',
				qrValue: ''
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
			this.showIpQrCode()
	  },
	  methods: {
			showIpQrCode() {
			wanyiPlugin.getRobotIp({}, (res) => {
				console.log(res)
				this.qrValue = JSON.stringify(res);
			})
			// this.$refs.qrcode.make(
			// 	{
			// 		canvasId: 'qrcode',
			// 		value: "dddddddddd",
			// 		size: 200,
			// 		success: () => {
			// 			console.log('生成成功');
			// 		},
			// 		fail: err => {
			// 			console.log(err)
			// 		}
			// 	}
					
				// );
				
				
			}
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
	
	.qrcode {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
</style>