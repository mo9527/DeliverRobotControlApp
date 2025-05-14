/**
 * WebSocket 连接管理工具
 * 提供与机器人建立WebSocket连接的功能
 */

import store from "../store";

// WebSocket连接实例
let socketTask = null;

// 连接状态
let isConnected = false;

// 重连次数
let reconnectCount = 0;

// 最大重连次数
const MAX_RECONNECT_COUNT = 5;

// 重连间隔(ms)
const RECONNECT_INTERVAL = 3000;

// 心跳间隔(ms)
const HEARTBEAT_INTERVAL = 30000;

// 心跳定时器
let heartbeatTimer = null;

// 消息回调函数
const messageCallbacks = new Map();

// 连接状态变化回调
let statusCallback = null;

/**
 * 初始化WebSocket连接
 * @param {number} port - WebSocket端口号，默认为1448
 * @returns {Promise} 返回连接结果的Promise
 */
export const initWebSocket = (ip = '192.168.30.171', port = 9527) => {
	return new Promise((resolve, reject) => {
		if (!ip) {
			reject(new Error('IP地址不能为空'));
			return;
		}
		// 如果已经连接，先关闭之前的连接
		if (socketTask) {
			closeWebSocket();
		}

		// 重置重连次数
		reconnectCount = 0;

		// 创建WebSocket连接
		connectWebSocket(ip, port)
			.then(() => {
				console.log('WebSocket连接成功');
				resolve();
			})
			.catch(err => {
				console.error('WebSocket连接失败:', err);
				reject(err);
			});
	});
};

/**
 * 创建WebSocket连接
 * @param {string} ip - IP地址
 * @param {number} port - WebSocket端口号
 * @returns {Promise} 返回连接结果的Promise
 */
const connectWebSocket = (ip, port) => {
	return new Promise((resolve, reject) => {
		try {
			const url = `ws://${ip}:${port}/api/ws`;
			console.log('正在连接WebSocket:', url);

			socketTask = uni.connectSocket({
				url: url,
				success: () => {
					console.log('WebSocket连接请求已发送');
				},
				fail: (err) => {
					console.error('WebSocket连接请求发送失败:', err);
					reject(err);
				}
			});

			// 监听WebSocket连接打开
			socketTask.onOpen(() => {
				console.log('WebSocket连接已打开');
				isConnected = true;

				// 启动心跳
				startHeartbeat();

				// 通知状态变化
				if (statusCallback) {
					statusCallback({
						connected: true,
						message: '连接成功'
					});
				}

				resolve();
			});

			// 监听WebSocket错误
			socketTask.onError((err) => {
				console.error('WebSocket连接错误:', err);
				isConnected = false;

				// 通知状态变化
				if (statusCallback) {
					statusCallback({
						connected: false,
						message: '连接错误',
						error: err
					});
				}

				// 尝试重连
				tryReconnect(ip, port);

				reject(err);
			});

			// 监听WebSocket关闭
			socketTask.onClose(() => {
				console.log('WebSocket连接已关闭');
				isConnected = false;

				// 清除心跳
				stopHeartbeat();

				// 通知状态变化
				if (statusCallback) {
					statusCallback({
						connected: false,
						message: '连接已关闭'
					});
				}

				// 尝试重连
				tryReconnect(ip, port);
			});

			// 监听WebSocket接收到服务器的消息
			socketTask.onMessage((res) => {
				try {
					const message = JSON.parse(res.data);
					console.log('收到WebSocket消息:', message);

					if (message.data.type && message.data.type === 'CARGO_STOCK_VO') {
						store.dispatch('changeCodeLeftTotal', message.data.codeLeftTotal)
						store.dispatch('changeCargoLeftTotal', message.data.cargoLeftTotal)
						store.dispatch('changeCodeLeftTotal', message.data.codeLeftTotal)
					}

					// 处理心跳响应
					if (message.type === 'heartbeat') {
						console.log('收到心跳响应');
						return;
					}

					// 根据消息类型分发到对应的回调
					if (message.type && messageCallbacks.has(message.type)) {
						messageCallbacks.get(message.type)(message);
					}

					// 如果有通用消息处理回调，也调用它
					if (messageCallbacks.has('*')) {
						messageCallbacks.get('*')(message);
					}
				} catch (err) {
					console.error('处理WebSocket消息失败:', err, res.data);
				}
			});

		} catch (err) {
			console.error('创建WebSocket连接失败:', err);
			reject(err);
		}
	});
};

/**
 * 尝试重新连接
 * @param {string} ip - IP地址
 * @param {number} port - WebSocket端口号
 */
const tryReconnect = (ip, port) => {
	if (reconnectCount >= MAX_RECONNECT_COUNT) {
		console.log('已达到最大重连次数，停止重连');
		return;
	}

	reconnectCount++;
	console.log(`尝试第${reconnectCount}次重连...`);

	setTimeout(() => {
		connectWebSocket(ip, port)
			.then(() => {
				console.log('重连成功');
				reconnectCount = 0;
			})
			.catch(err => {
				console.error('重连失败:', err);
			});
	}, RECONNECT_INTERVAL);
};

/**
 * 启动心跳
 */
const startHeartbeat = () => {
	stopHeartbeat();

	heartbeatTimer = setInterval(() => {
		if (isConnected) {
			sendMessage({
				type: 'heartbeat',
				timestamp: Date.now()
			});
		}
	}, HEARTBEAT_INTERVAL);
};

/**
 * 停止心跳
 */
const stopHeartbeat = () => {
	if (heartbeatTimer) {
		clearInterval(heartbeatTimer);
		heartbeatTimer = null;
	}
};

/**
 * 发送WebSocket消息
 * @param {Object} message - 要发送的消息对象
 * @returns {Promise} 返回发送结果的Promise
 */
export const sendMessage = (message) => {
	return new Promise((resolve, reject) => {
		if (!isConnected || !socketTask) {
			reject(new Error('WebSocket未连接'));
			return;
		}

		try {
			const messageStr = typeof message === 'string' ? message : JSON.stringify(message);

			socketTask.send({
				data: messageStr,
				success: () => {
					console.log('WebSocket消息发送成功:', message);
					resolve();
				},
				fail: (err) => {
					console.error('WebSocket消息发送失败:', err, message);
					reject(err);
				}
			});
		} catch (err) {
			console.error('准备WebSocket消息失败:', err);
			reject(err);
		}
	});
};

/**
 * 发送图片通过WebSocket
 * @param {string} filePath - 图片文件路径
 * @param {Object} options - 可选参数，如图片类型、压缩等
 * @returns {Promise} 返回发送结果的Promise
 */
export const sendImage = (filePath, options = {}) => {
	return new Promise((resolve, reject) => {
		if (!isConnected || !socketTask) {
			reject(new Error('WebSocket未连接'));
			return;
		}

		if (!filePath) {
			reject(new Error('文件路径不能为空'));
			return;
		}

		// 读取图片文件
		readImageFile(filePath)
			.then(imageData => {
				// 构建消息对象
				const message = {
					command: 'image_save',
					payload: {
						format: options.format || getImageFormat(filePath),
						data: imageData,
					}
				}

				// 发送消息
				return sendMessage(message);
			})
			.then(() => {
				console.log('图片发送成功:', filePath);
				resolve();
			})
			.catch(err => {
				console.error('图片发送失败:', err);
				reject(err);
			});
	});
};

/**
 * 读取图片文件
 * @param {string} filePath - 图片文件路径
 * @returns {Promise<string>} 返回Base64编码的图片数据
 */
const readImageFile = (filePath) => {
	return new Promise((resolve, reject) => {
		// #ifdef APP-PLUS
		plus.io.resolveLocalFileSystemURL(filePath, entry => {
			entry.file(file => {
				const reader = new plus.io.FileReader();

				reader.onloadend = function(e) {
					// 获取Base64编码的图片数据
					// console.log(e);
					const base64Data = e.target.result;
					// 如果结果是以data:开头的完整Base64字符串，提取实际的Base64部分
					const base64Content = base64Data.indexOf('base64,') >= 0 ?
						base64Data.split('base64,')[1] :
						base64Data;

					resolve(base64Content);
				};

				reader.onerror = function(err) {
					console.error('读取文件失败:', err);
					reject(err);
				};

				// 以Base64格式读取文件
				reader.readAsDataURL(file);
			}, err => {
				console.error('获取文件对象失败:', err);
				reject(err);
			});
		}, err => {
			console.error('解析文件URL失败:', err);
			reject(err);
		});
		// #endif
	});
};

/**
 * 获取图片格式
 * @param {string} filePath - 图片文件路径
 * @returns {string} 图片格式，如'jpg', 'png'等
 */
const getImageFormat = (filePath) => {
	const ext = filePath.split('.').pop().toLowerCase();
	return ext || 'jpg';
};

/**
 * 关闭WebSocket连接
 */
export const closeWebSocket = () => {
	if (socketTask) {
		try {
			// 停止心跳
			stopHeartbeat();

			// 关闭连接
			socketTask.close({
				success: () => {
					console.log('WebSocket连接已关闭');
				},
				fail: (err) => {
					console.error('关闭WebSocket连接失败:', err);
				}
			});

			// 重置状态
			socketTask = null;
			isConnected = false;

		} catch (err) {
			console.error('关闭WebSocket连接时发生错误:', err);
		}
	}
};

/**
 * 注册消息处理回调
 * @param {string} messageType - 消息类型，使用'*'注册通用处理函数
 * @param {Function} callback - 回调函数
 */
export const registerMessageHandler = (messageType, callback) => {
	if (typeof callback === 'function') {
		messageCallbacks.set(messageType, callback);
	}
};

/**
 * 注销消息处理回调
 * @param {string} messageType - 消息类型
 */
export const unregisterMessageHandler = (messageType) => {
	messageCallbacks.delete(messageType);
};

/**
 * 注册连接状态变化回调
 * @param {Function} callback - 状态变化回调函数
 */
export const registerStatusCallback = (callback) => {
	if (typeof callback === 'function') {
		statusCallback = callback;
	}
};

/**
 * 获取当前连接状态
 * @returns {boolean} 是否已连接
 */
export const isSocketConnected = () => {
	return isConnected;
};

/**
 * 获取WebSocket实例
 * @returns {Object|null} WebSocket实例
 */
export const getSocketTask = () => {
	return socketTask;
};

export default {
	initWebSocket,
	sendMessage,
	sendImage,
	closeWebSocket,
	registerMessageHandler,
	unregisterMessageHandler,
	registerStatusCallback,
	isSocketConnected,
	getSocketTask
};