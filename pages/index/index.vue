<template>
  <view class="container">
    <view class="grid">
      <view
        v-for="(item, index) in grids"
        :key="index"
        class="grid-item"
        @click="goToSubPage(index + 1, item.name, item.path)"
      >
        <text class="menu-text">{{ item.name }}</text>
      </view>
    </view>
  </view>
</template>

<script>
	
	export default {
		data() {
			return {
				grids: [
				        { name: '货仓门控制', path: '/pages/index/gate' },
				        { name: '丝杆控制', path: '/pages/index/screwRod' }
				      ]
			}
		},
		onLoad() {

		},
		methods: {
			//子页面
			goToSubPage(index, name, itemPath) {
				console.log(index, name, itemPath)
				if(name == "N/A"){
					uni.showToast({
						title: '功能未开放'
					})
					return;
				}
				uni.navigateTo({
					url: itemPath + `?id=${index}&name=${encodeURIComponent(name)}`
				})
			}
		}
	}
</script>

<style>
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
	  justify-content: center;
	  align-items: center;
	  border-radius: 10rpx;
	  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
	  font-size: 28rpx;
	  color: #333;
	}
	
	.grid-item:hover {
	  background-color: #e0e0e0;
	}
	
	.menu-text {
	  text-align: center;
	  word-break: break-all;
	  padding: 10rpx;
	}
	
	.grid-item {
	  transition: background-color 0.3s;
	}
</style>
