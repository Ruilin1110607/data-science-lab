@echo off
cd /d "%~dp0"
chcp 65001 >nul
color 0A
echo 正在启动 Data Science Lab...
echo 请打开浏览器访问: http://localhost:5173
npm run dev
