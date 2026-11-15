# danmu_viewer
此项目为在大屏幕上显示弹幕的网页

## 连接后端
网页默认连接**当前网站的 `/ws`** 路径：
- 线上：由 nginx 转发到后端，部署方法见 [danmu_backend/deploy/README.md](https://github.com/cssa-tech/danmu_backend/blob/main/deploy/README.md)
- 本地开发：`npm run dev` 启动后，vite 会把 `/ws` 转发到 `127.0.0.1:8080`，先在 danmu_backend 里运行 `node index.js`（不需要 Redis）

如果后端在别的地址，打包时用环境变量指定：
``` bash
VITE_WS_URL=wss://你的域名/ws npm run build
```

## 常用命令
- `npm install` 安装依赖
- `npm run dev` 本地开发
- `npm run build` 打包静态网页到 `dist` 文件夹
