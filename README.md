# danmu_viewer
此项目为在大屏幕上显示弹幕，可连接websocket服务器或者微信云数据库
部署前检查App.vue第125行：
``` javascript
socket = new WebSocket('ws://10.2.12.248:8080'); // 替换为 WebSocket 服务器地址
```
是否符合websocket服务器网址
运行 `npm run build` 编译静态网页
运行 `npm run start` 在本地部署网页