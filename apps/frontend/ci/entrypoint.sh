#!/bin/bash

# 基于环境变量动态替换 nginx 配置模板文件中变量，然后生成实际的 nginx 配置文件
envsubst '${API}' < /tmp/default.conf > /etc/nginx/conf.d/default.conf

# 通过环境变量替换 html 文件中的 meta 标签值
#cp /usr/share/nginx/html/index.html /usr/share/nginx/html/index.html.tpl
#envsubst '${SSO_URL}' < /usr/share/nginx/html/index.html.tpl > /usr/share/nginx/html/index.html

# 将实际生成的 nginx 配置文件打印一下，方便调试
# cat /etc/nginx/conf.d/default.conf

# 执行 dockerfile 中 CMD 命令
exec "$@"