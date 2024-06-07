FROM node:18 AS builder

WORKDIR /project

# 安装依赖
RUN npm i -g pnpm @vercel/ncc
COPY package.json pnpm-lock.yaml /project/
RUN pnpm install

# 构建
COPY . /project
RUN pnpm run build

# 打包
RUN ncc build dist/main.js -o app

# ------------------------------ #
FROM node:18-slim
EXPOSE 3000

# 设置时区
ENV TZ=Asia/Shanghai \
    DEBIAN_FRONTEND=noninteractive

RUN apt update \
    && apt install -y tzdata iproute2 dumb-init \
    && ln -fs /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone \
    && dpkg-reconfigure --frontend noninteractive tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

WORKDIR /app

COPY --from=builder /project/app/ ./

CMD ["dumb-init", "node", "index.js"]