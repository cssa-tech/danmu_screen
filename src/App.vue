<!-- <script setup>
import { onMounted, ref, onUnmounted } from 'vue';
const danmuList = ref([]); // 存储弹幕数据
let watcher = null; // 将 watcher 定义在函数外部以便管理

// 随机分配动画类型和颜色
function getRandomAnimationClass() {
  const animations = ['slide-left', 'fade-center'];
  return animations[Math.floor(Math.random() * animations.length)];
}

function getRandomColor() {
  const colors = [
    '#000B58', '#003161', '#006A67', '#FFF4B7',
    '#FCF596', '#FBD288', '#FF9C73', '#FF4545'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 动态加载 CloudBase SDK
function loadCloudBaseSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = "https://imgcache.qq.com/qcloud/cloudbase-js-sdk/1.5.0/cloudbase.full.js";
    script.onload = () => resolve(window.cloudbase);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// 在组件销毁时关闭数据库监听
onUnmounted(() => {
  if (watcher) {
    watcher.close();
  }
});

// 初始化数据库监听
async function initDatabaseListener() {
  const cloudbase = await loadCloudBaseSDK(); // 等待 CloudBase SDK 加载完成

  if (!cloudbase) {
    console.error("Cloud SDK 未正确加载");
    return;
  }

  // 初始化 cloudbase 实例
  const app = cloudbase.init({
    env: 'danmu-6g41i88te98a9ba0' // 替换为你的云开发环境 ID
  });

  // 执行匿名登录
  await app.auth().anonymousAuthProvider().signIn();

  // 获取数据库引用
  const db = app.database();
  const danmuCollection = db.collection('danmu_2'); // 替换为你的弹幕集合名称

  // 实时监听集合变化
    watcher = danmuCollection.watch({
    onChange: (snapshot) => {
      const newDanmus = snapshot.docChanges
        .filter(change => change.dataType === 'add') // 筛选新增的弹幕数据
        .map(change => ({
          ...change.doc,
          animationClass: getRandomAnimationClass(), // 随机动画类
          topPosition: `${Math.random() * 40}vh`, // 随机顶部位置，避免遮挡
          textColor: getRandomColor() // 随机颜色
        }));

      // 将新弹幕追加到列表中
      danmuList.value = [...danmuList.value, ...newDanmus];
    },
    onError: (error) => {
      console.error("数据库监听错误:", error);
    }
  });
}

onMounted(() => {
  initDatabaseListener(); // 组件挂载时调用数据库监听
});
</script> -->

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';

const danmuList = ref([]); // 存储弹幕数据
const maxDanmuCount = 40; // 限制弹幕显示数量
const shownDanmuIds = new Set(); // ✅ 新增：记录已显示的弹幕

let socket;

// 随机分配动画类型和颜色
function getRandomAnimationClass() {
  const animations = ['slide-left', 'fade-center'];
  return animations[Math.floor(Math.random() * animations.length)];
}

function getRandomColor() {
  const colors = [
    '#000B58', '#003161', '#006A67', '#FFF4B7',
    '#FCF596', '#FBD288', '#FF9C73', '#FF4545'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 处理接收到的新弹幕
function handleNewDanmu(data) {
    // 为弹幕生成唯一 ID（假设 data 里有 clientId 和 timestamp）
  const danmuId = `${data.clientId}|${data.timestamp}`;

  // 如果已经展示过这条弹幕，跳过
  if (shownDanmuIds.has(danmuId)) return;
  shownDanmuIds.add(danmuId);

  const newDanmu = {
    ...data,
    animationClass: getRandomAnimationClass(),
    topPosition: `${Math.random() * 80}vh`,
    textColor: getRandomColor()
  };

  danmuList.value.push(newDanmu);

  if (danmuList.value.length > maxDanmuCount) {
    danmuList.value.shift();
  }

  // 限制 Set 的大小，防止内存无限增长
  if (shownDanmuIds.size > 1000) {
    shownDanmuIds.clear();
  }
}

// 初始化 WebSocket 连接
function initializeWebSocket() {
  socket = new WebSocket('ws://10.2.12.248:8080'); // 替换为 WebSocket 服务器地址

  socket.onopen = () => console.log('WebSocket 连接成功');
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleNewDanmu(data);
  };
  socket.onerror = (error) => console.error('WebSocket 错误:', error);
  socket.onclose = () => console.log('WebSocket 连接关闭');
}

// 在组件挂载和卸载时管理 WebSocket 连接
onMounted(() => {
  initializeWebSocket();
});

onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>

<template>
    <div>
      <div id="danmu-container">
        <div
          v-for="(danmu, index) in danmuList"
          :key="index"
          class="danmu-item"
          :class="danmu.animationClass"
          :style="{ top: danmu.topPosition }"
        >
          <span class="nickname">{{ danmu.nickName }}:</span>
          <span class="message" :style="{ color: danmu.textColor }">{{ danmu.text }}</span>
        </div>
      </div>
    </div>
</template>
  

<style scoped>
#danmu-container {
  height: 100vh;
  width: 100vw;

  position: relative;
  overflow: hidden;
  background-image: url(@/assets/background_web.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}

.danmu-item {
  position: absolute;
  padding: 8px;
  background-color: transparent;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 1;
}

.nickname {
    color: #333;
    font-weight: bold;
    font-size: 2rem;
    margin-right: 5px;
}

.message {
    font-size: 2rem;
}

/* 从右向左平移 */
.slide-left {
    animation: slideLeft 8s linear forwards;
}

@keyframes slideLeft {
  from {
    right: -100%;
  }
  to {
    right: 100vw;
  }
}

/* 中心淡入淡出 */
.fade-center {
  left: 50%;
  transform: translateX(-50%);
  animation: fadeInOut 4s ease forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10%,
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
