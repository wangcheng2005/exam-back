#!/bin/bash

# 编译打包
echo "Building..."
pnpm run build:prod

# 复制打包好的文件到远程服务器
echo "复制文件到远程服务器..."
ssh  -i ./ssh.pem root@106.55.158.26 << EOF
  cd /data/web
  rm -rf ./dist-prod
EOF
scp  -i ./ssh.pem -r ./dist-prod root@106.55.158.26:/data/web

# 远程执行脚本
echo "远程执行脚本..."
ssh  -i ./ssh.pem root@106.55.158.26 << EOF
  cd /data
  # 使用 Docker Compose 运行程序
  echo "使用 Docker Compose 运行程序..."
  docker-compose up -d --force-recreate nginx
EOF