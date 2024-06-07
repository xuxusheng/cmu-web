FROM nginx:alpine
MAINTAINER xusheng:20691718@qq.com
EXPOSE 8080

# 准备静态资源
COPY dist /usr/share/nginx/html
# 准备 Nginx 配置文件
COPY ./ci/default.conf /tmp/default.conf
# 准备容器启动脚本
COPY ./ci/entrypoint.sh /

# 启动命令
ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
