<template>
  <view class="subpage">
		<!-- 仓门状态 -->
		<view>
			<view class="status-label">仓门状态：{{ doorStatus }}</view>
			</br>
			</br>
			</br>
			</br>
			<view class="center-button" @click="openGate">开仓门</view>
		</view>
  </view>
</template>


<script>
	var wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
	  data() {
			return {
				gridId: '',
				menuName: '',
				doorStatus: '' //仓门状态
			}
	  },
	  mounted() {
		  // this.updateGateStatus();
	  },
	  created() {
		  this.updateGateStatus();
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
			openGate() {
				wanyiPlugin.openGate({
					"gate": 1
				}, (res) => {
					uni.showToast({
						title: res.message,
					});
					if (res.data === 'open'){
						this.doorStatus = "开启"
					}else {
						this.doorStatus = "关闭";
					}
				})
			},
			updateGateStatus(){
				wanyiPlugin.gateStatus({}, (res) => {
					console.log("查询门状态：", res)
					
					if(res.status == 0){
						this.doorStatus = res.data === 'open' ? '开启' : '关闭';
					}else{
						this.doorStatus = res.message;
					}
					
				});
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
	
	.status-label {
	  font-size: 32rpx;
	  color: #000000;
	}
</style>