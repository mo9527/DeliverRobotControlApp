<script>
	var wanyiPlugin = uni.requireNativePlugin('WanyiUniappPlugins')
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// wanyiPlugin.startRemoteServer();
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
