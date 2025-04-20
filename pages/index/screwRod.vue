<template>
  <view class="subpage">
		<view class="uni-form-item uni-column">
			<view class="title">去往的层数</view>
			<view>
				<input class="uni-input" type="number" v-model="floor" placeholder="输入要去往的层数" />
			</view>
			<view class="center-button" @click="moveTo">Go</view>
			<view class="title">去往的层数</view>
			<view class="center-button" @click="cargoMove">货道1开始移动</view>
		</view>
  </view>
</template>


<script>
	var wanyiPlugin = uni.requireNativePlugin("WanyiUniappPlugins");
	export default {
	  data() {
			return {
				floor: 0
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
			moveTo(floor) {
				wanyiPlugin.screwRodMoveTo({
					"floor": this.floor
				}, (res) => {
					uni.showToast({
						title: res.message,
					});
				})
			},
			
			cargoMove(floor) {
				wanyiPlugin.cargoMove({
					"floor": this.floor
				}, (res) => {
					uni.showToast({
						title: res.message,
					});
				})
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