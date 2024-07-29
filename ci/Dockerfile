FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /project

RUN npm i -g @vercel/ncc

COPY .. .
RUN pnpm install && pnpm run build

# 打包
RUN ncc build apps/backend/dist/main.js -o app

FROM node:20-slim
EXPOSE 3000

# 设置时区
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN apt update \
    && apt install -y tzdata openssl dumb-init \
    && ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 安装 prisma，用于数据库迁移
# RUN npm i -g prisma

WORKDIR /app

# 准备容器启动脚本
COPY --from=builder /project/app/ ./backend
# COPY --from=builder /project/apps/backend/prisma ./backend
COPY --from=builder /project/apps/frontend/dist/ ./frontend
# COPY ./ci/entrypoint.sh /
# RUN cp ./backend/client/* ./backend

# ENTRYPOINT ["sh", "/entrypoint.sh"]
CMD ["dumb-init", "node", "backend/index.js"]