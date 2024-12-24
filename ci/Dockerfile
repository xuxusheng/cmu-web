FROM node:22-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /project

RUN corepack enable && \
    npm i -g @vercel/ncc

COPY .. .
# 打包
RUN pnpm install && \
    pnpm run build && \
    ncc build apps/backend/dist/main.js -o app

FROM node:22-slim
EXPOSE 3000

# 设置时区
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN apt update \
    && apt install -y dumb-init iproute2 openssl tzdata \
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
COPY --from=builder /project/CHANGELOG.md ./

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ENV NODE_ENV=production

CMD ["dumb-init", "node", "backend/index.js"]