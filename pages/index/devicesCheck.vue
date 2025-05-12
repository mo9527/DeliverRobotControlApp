<template>
  <view class="subpage">
		<view class="uni-form-item uni-column">
			<button
			      class="center-button" 
			      :disabled="isFetching" 
			      @click="beginDevicesCheck"
			      :style="{ opacity: isFetching ? 0.6 : 1 }"
			    >
			      {{ isFetching ? '检查中...' : '开始自检' }}
			</button>
			<scroll-view class="data-item">
				<view v-for="(item, index) in dataList" :key="index" class="data-item">
				    <text>{{ item }}</text>
				</view>
				<view v-if="!isFetching && dataList.length === 0" class="empty">暂无数据</view>
			</scroll-view>
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
				dataList: [],
				buttonName: '开始自检',
				isFetching: false
			}
	  },
	  mounted() {

	  },
	  created() {
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
			beginDevicesCheck() {
				console.log("开始自检。。。。")
				this.isFetching = true;
				this.dataList = [];
				wanyiPlugin.devicesCheck({}, (res) => {
					console.log('检查结果返回：', res.data)
					this.dataList.push(res.data)
					this.isFetching = false;
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
	.data-item {
	  display: flex;
	  justify-content: space-between;
	  padding: 20rpx;
	  margin-bottom: 10rpx;
	  background-color: #f8f8f8;
	  border-radius: 10rpx;
	}
	
	.empty {
		text-align: center;
		padding: 20rpx;
		color: #999;
	}
</style>