# CMU 变电控制系统后端 - 更新日志 


### [0.4.1](https://github.com/xuxusheng/cmu-be/compare/v0.4.0...v0.4.1) (2024-04-09)


### ✨ Features | 新功能

* openapi 查询检测数据库 key 进行一次转换 ([9924114](https://github.com/xuxusheng/cmu-be/commit/99241145a61fa9f1592c6337491ce339312584de))


### 👷‍ Build System | 构建

* 更新依赖版本 ([876e023](https://github.com/xuxusheng/cmu-be/commit/876e023e6def700600d0f7b92075c11562cc6b12))


### 📦 Chores | 其他更新

* 更新 husky 版本 ([6b196d1](https://github.com/xuxusheng/cmu-be/commit/6b196d1cffcef839bee2df396e472d7980849ebc))

## [0.4.0](https://github.com/xuxusheng/cmu-be/compare/v0.3.13...v0.4.0) (2024-04-03)


### ✨ Features | 新功能

* openapi 分页查询传感器监测数据接口支持开始和结束时间 ([94d83b9](https://github.com/xuxusheng/cmu-be/commit/94d83b9c28ef21accdbc8adf2933319debf9a9a4))
* 加入 openapi 分页查询传感器列表接口 ([c8e2fa0](https://github.com/xuxusheng/cmu-be/commit/c8e2fa022dab438f496db8d840257649afd471fe))
* 加入 openapi 分页查询传感器监测数据接口 ([dc50ad9](https://github.com/xuxusheng/cmu-be/commit/dc50ad920528986af30e4766fbe3f9c107176a5f))
* 加入 openapi 模块及客户端认证接口 ([7610ea7](https://github.com/xuxusheng/cmu-be/commit/7610ea78b7677002b86a0e1e43fd7b0f3fda5419))
* 加入新增用户接口 ([4875bfc](https://github.com/xuxusheng/cmu-be/commit/4875bfcf0895e076100f4d0bcc1ab98b7128c469))


### 🐛 Bug Fixes | Bug 修复

* 客户端登录接口改为 public ([244442b](https://github.com/xuxusheng/cmu-be/commit/244442bc1429397e61ae3a8ca9b5d8742102b671))


### 🔧 Continuous Integration | CI 配置

* 更新 action 版本 ([6d3f1bf](https://github.com/xuxusheng/cmu-be/commit/6d3f1bf4f419488241328029ad87189760b485be))

### [0.3.13](https://github.com/xuxusheng/cmu-be/compare/v0.3.12...v0.3.13) (2024-03-27)


### ✨ Features | 新功能

* 允许修改南向、北向配置文件 ([d10faa4](https://github.com/xuxusheng/cmu-be/commit/d10faa470cc2c02b843cc877478676073b034038))
* 加入 icd 文件内容查询接口 ([640e7f5](https://github.com/xuxusheng/cmu-be/commit/640e7f561d64653ba26d4324a2c8be83c8d0d6d6))
* 加入日志文件删除接口 ([4cc1aa4](https://github.com/xuxusheng/cmu-be/commit/4cc1aa494a662508b49f0efb3d94e84feee29231))
* 加入配置文件上传接口 ([4b55993](https://github.com/xuxusheng/cmu-be/commit/4b55993340d91238fb21da7ff5dd3ec99a34b7d4))

### [0.3.12](https://github.com/xuxusheng/cmu-be/compare/v0.3.11...v0.3.12) (2024-03-24)


### 🐛 Bug Fixes | Bug 修复

* 修复历史数据导出时为空的问题 ([6c36d25](https://github.com/xuxusheng/cmu-be/commit/6c36d25b3ee2c2a5a4e891a89151c517c4ab9c25))

### [0.3.11](https://github.com/xuxusheng/cmu-be/compare/v0.3.10...v0.3.11) (2024-03-23)


### 🐛 Bug Fixes | Bug 修复

* 修复历史数据查询时时间问题 ([55b79e1](https://github.com/xuxusheng/cmu-be/commit/55b79e1e660f9523f8495281ce1471d05a2d3df4))


### 🔧 Continuous Integration | CI 配置

* 构建时设置时区 ([81921e9](https://github.com/xuxusheng/cmu-be/commit/81921e912232be97a6b4dd8a579fa1bf54d124df))


### 📦 Chores | 其他更新

* 更新依赖版本 ([92f73f4](https://github.com/xuxusheng/cmu-be/commit/92f73f46308368b6b30de194eafbb2fe066d48ab))

### [0.3.10](https://github.com/xuxusheng/cmu-be/compare/v0.3.9...v0.3.10) (2024-01-25)


### ✨ Features | 新功能

* 引入日志组件，日志存入文件中 ([42b5751](https://github.com/xuxusheng/cmu-be/commit/42b575130c47468a3f0e77984e75edb55a99ab18))


### 📦 Chores | 其他更新

* 更新依赖版本 ([19c9a9e](https://github.com/xuxusheng/cmu-be/commit/19c9a9ef71c125bbda73e1826046b13ed2a377e4))

### [0.3.9](https://github.com/xuxusheng/cmu-be/compare/v0.3.8...v0.3.9) (2023-12-19)


### 🔧 Continuous Integration | CI 配置

* 加入 dumb-init ([139cb37](https://github.com/xuxusheng/cmu-be/commit/139cb3730e48e8b6cef07a4dfc0549119fca7db1))

### [0.3.8](https://github.com/xuxusheng/cmu-be/compare/v0.3.7...v0.3.8) (2023-12-18)


### 🐛 Bug Fixes | Bug 修复

* 不同设备类型下设备号允许重复 ([965b1fb](https://github.com/xuxusheng/cmu-be/commit/965b1fbb65a178163e20234a934cd2990aa3adb5))


### ✨ Features | 新功能

* 修改 i2 log 日志地址 ([befce64](https://github.com/xuxusheng/cmu-be/commit/befce64aaca681c32ac73d41155cde092ae5a35e))

### [0.3.7](https://github.com/xuxusheng/cmu-be/compare/v0.3.6...v0.3.7) (2023-12-16)


### ✨ Features | 新功能

* token 有效期改为 2 小时 ([63a133d](https://github.com/xuxusheng/cmu-be/commit/63a133d82fc6d737d0ad7de485b9100a94f3d319))

### [0.3.6](https://github.com/xuxusheng/cmu-be/compare/v0.3.5...v0.3.6) (2023-12-12)


### ✨ Features | 新功能

* 移除 netplan try 命令调用 && 补全 docker-compose 配置文件 ([e911b1b](https://github.com/xuxusheng/cmu-be/commit/e911b1bce3855ab939a4dfd42dc4c073209e10bb))

### [0.3.5](https://github.com/xuxusheng/cmu-be/compare/v0.3.3...v0.3.5) (2023-12-12)


### 📦 Chores | 其他更新

* **release:** 0.3.4 ([fc0626f](https://github.com/xuxusheng/cmu-be/commit/fc0626fd2b5dd14e5fb0cf32e7d4e60136d5cbdd))


### ✨ Features | 新功能

* 修改时间命令发送到 cmu-runner 执行 ([a7c4984](https://github.com/xuxusheng/cmu-be/commit/a7c4984016960a423892b5f057df8decf73f17f7))
* 加入 netplan try 命令调用 ([ffdee44](https://github.com/xuxusheng/cmu-be/commit/ffdee44b06ec72f3b4dbc552b5c68467354cea83))

### [0.3.4](https://github.com/xuxusheng/cmu-be/compare/v0.3.3...v0.3.4) (2023-12-12)


### ✨ Features | 新功能

* 修改时间命令发送到 cmu-runner 执行 ([a7c4984](https://github.com/xuxusheng/cmu-be/commit/a7c4984016960a423892b5f057df8decf73f17f7))

### [0.3.3](https://github.com/xuxusheng/cmu-be/compare/v0.3.2...v0.3.3) (2023-12-07)


### ✨ Features | 新功能

* 修改进程号读取方式 ([8275b92](https://github.com/xuxusheng/cmu-be/commit/8275b9225ba4ec60c2a0e26f17df84e4a3291c28))


### 🐛 Bug Fixes | Bug 修复

* 修复进程状态查询接口返回错误 ([146ad92](https://github.com/xuxusheng/cmu-be/commit/146ad92ff0f6d1e6a5c1d37cfc2dcf1e5bc150ee))

### [0.3.2](https://github.com/xuxusheng/cmu-be/compare/v0.3.1...v0.3.2) (2023-12-06)


### ✨ Features | 新功能

* 重启系统时，不抛出 socket hang up 错误 ([fc008dd](https://github.com/xuxusheng/cmu-be/commit/fc008dd48745eff710151e25bd9371a33831af22))

### [0.3.1](https://github.com/xuxusheng/cmu-be/compare/v0.3.0...v0.3.1) (2023-12-05)


### 🐛 Bug Fixes | Bug 修复

* axios 设为忽略请求错误 ([8884407](https://github.com/xuxusheng/cmu-be/commit/8884407d553ded545c7939445680ac7fb268bda5))


### ✨ Features | 新功能

* cmdRun 接口返回命令执行结果 ([ad06ba3](https://github.com/xuxusheng/cmu-be/commit/ad06ba3d2cace822f81f8f5a4eedb04bf2b0c43d))


### 📦 Chores | 其他更新

* 更新依赖版本 ([6f8e181](https://github.com/xuxusheng/cmu-be/commit/6f8e181c629de186f0ee31a9a649282d598a49a9))

## [0.3.0](https://github.com/xuxusheng/cmu-be/compare/v0.2.0...v0.3.0) (2023-12-05)


### ✨ Features | 新功能

* 修改网卡信息后通过 runner 执行 netplan apply 命令 ([050994c](https://github.com/xuxusheng/cmu-be/commit/050994ce1c81368830ecdafb6b488dcc834919df))
* 加入重启接口 ([05ef369](https://github.com/xuxusheng/cmu-be/commit/05ef369677df9a47d31f5edb26b41ad0b421c970))
* 完善 kill 进程接口 ([91c5020](https://github.com/xuxusheng/cmu-be/commit/91c5020471c84f3a2a2a22a1351e8155e8fdf087))


### 📦 Chores | 其他更新

* 更新依赖版本 ([0a4a9c7](https://github.com/xuxusheng/cmu-be/commit/0a4a9c751e76721adf4b1392049f875494d68dd1))


### 🐛 Bug Fixes | Bug 修复

* 修复 json 序列化问题 ([2ec52db](https://github.com/xuxusheng/cmu-be/commit/2ec52dbb5334979c6b471819e81b891c81dd6d9a))
* 修复重启未启动进程时报错 ([86a12ac](https://github.com/xuxusheng/cmu-be/commit/86a12acf4f16c52fdea019092e3693210d38bc8b))

## [0.2.0](https://github.com/xuxusheng/cmu-be/compare/v0.1.1...v0.2.0) (2023-11-23)


### ♻ Code Refactoring | 代码重构

* sqlite3 替换为 better-sqlite3 ([691e458](https://github.com/xuxusheng/cmu-be/commit/691e45850935a499ff8cb15be92d654fcec7e220))


### ✨ Features | 新功能

* i2 设备查询时返回设备描述 ([5ddad96](https://github.com/xuxusheng/cmu-be/commit/5ddad9687e85d645cbecffee5a7406bc5ebe7949))
* 修复历史数据查询时时间条件匹配问题 ([105ebd6](https://github.com/xuxusheng/cmu-be/commit/105ebd688e9e218bf68167bbac3a559084507d8b))
* 登录成功再删除验证码缓存 ([ed8bcf9](https://github.com/xuxusheng/cmu-be/commit/ed8bcf907a720e59e2832aec6187f6bba7de224a))
* 登录接口加入验证码校验逻辑 ([a2c8f8b](https://github.com/xuxusheng/cmu-be/commit/a2c8f8b458a625be0d7e5c794607ec2eefd1a13b))
* 验证码改为不区分大小写 ([702a361](https://github.com/xuxusheng/cmu-be/commit/702a3616e392bdcc2294751d431becb65e9b8bc4))
* 验证码改为彩色 && 缓存时间缩减为 1 天 ([bd8b16a](https://github.com/xuxusheng/cmu-be/commit/bd8b16a44405c45cc4239441a811fdb811fa7777))
* 验证码改回灰色 ([4ad1138](https://github.com/xuxusheng/cmu-be/commit/4ad1138e0b873ce2187a7b10b4245a435966c13c))


### 📦 Chores | 其他更新

* 更新依赖版本 ([de60e48](https://github.com/xuxusheng/cmu-be/commit/de60e48470da61b7c24d51e9dfff0366f9ea126c))
* 更新依赖版本 ([2970ad6](https://github.com/xuxusheng/cmu-be/commit/2970ad647588020be7a0ed1a76ba8a8b3567e31b))


### 🔧 Continuous Integration | CI 配置

* node 缓存改为 pnpm ([b3f280a](https://github.com/xuxusheng/cmu-be/commit/b3f280a720b3c85bc573686dfa5b21437be60f2d))
* 不构建 arm64 镜像 ([a618271](https://github.com/xuxusheng/cmu-be/commit/a618271491883c9ecbc3edd44cd365d55adcc49e))
* 修复多架构构建问题 ([91b9e43](https://github.com/xuxusheng/cmu-be/commit/91b9e43e0c7b81eb29358e4afb1010105d705683))
* 加入架构构建步骤 ([f9e31ed](https://github.com/xuxusheng/cmu-be/commit/f9e31ed73e0c6e9bb776abc9c103273a924c3c76))
* 暂时移除 node 缓存 ([0860af1](https://github.com/xuxusheng/cmu-be/commit/0860af135efa155ec3baf260bcdb07ff5300fd3a))
* 生产环境构建全架构镜像 ([c040bcd](https://github.com/xuxusheng/cmu-be/commit/c040bcd8ac5eebf8dc7612e7f9d6e46ce40e9704))

### [0.1.1](https://github.com/xuxusheng/cmu-be/compare/v0.1.0...v0.1.1) (2023-10-18)


### 🔧 Continuous Integration | CI 配置

* set node version to 18 ([fcfb87b](https://github.com/xuxusheng/cmu-be/commit/fcfb87b703920b9a2f7204616939e45c16ab4356))
* 优化 changelog 格式 ([51675e3](https://github.com/xuxusheng/cmu-be/commit/51675e36ed23b308210158a1718a63416f250681))
* 构建多种架构镜像 ([2ff9cae](https://github.com/xuxusheng/cmu-be/commit/2ff9cae8da5861c6339db86f6a551e2b84d1f163))

### 0.0.1 (2023-10-18)

### ♻ Code Refactoring | 代码重构

- lodash-es 改为 lodash ([90344b6](https://github.com/xuxusheng/cmu-be/commit/90344b6090bf2b48a4c6ba2512de67c4128cd73a))
- 优化 ts 类型 ([9cfb135](https://github.com/xuxusheng/cmu-be/commit/9cfb13515327a78470b7620a9730108261eeae66))
- 简化接口路径 ([e33d014](https://github.com/xuxusheng/cmu-be/commit/e33d014a9fed6e33c803d1cb003249f1b47e06af))
- 降级依赖版本 ([67d44ac](https://github.com/xuxusheng/cmu-be/commit/67d44ac68d9ada474f62edc9fc1827be5f8bcc93))

### 🐛 Bug Fixes | Bug 修复

- 修复 c2s 方法 ([81a655c](https://github.com/xuxusheng/cmu-be/commit/81a655ca8ead4bae0e5ffed1211aa8129362f24c))
- 修复 commType 查询表名 ([bfbb382](https://github.com/xuxusheng/cmu-be/commit/bfbb382a61638a09bd6f84f4975b80e0d12d2feb))
- 修复 DoAttrModule 未导入问题 ([b7687ee](https://github.com/xuxusheng/cmu-be/commit/b7687eee6e96e563ea1002d221cbb7a78c864e7e))
- 修复 Dockerfile 中路径错误 ([5082a14](https://github.com/xuxusheng/cmu-be/commit/5082a148d9b16f567d32c7fa940054bd02108542))
- 修复 fs 导入相关问题 ([a16b6c3](https://github.com/xuxusheng/cmu-be/commit/a16b6c384fe717163c6eb10260223f70681f0215))
- 修复 fs 问题 ([07c9ef6](https://github.com/xuxusheng/cmu-be/commit/07c9ef6f7db063a36741610064a5b457240069f6))
- 修复 ini 导入问题 ([529176f](https://github.com/xuxusheng/cmu-be/commit/529176f8304ca1ba86fb7ebf912b49e312a3af11))
- 修复 license hash 查询方式 ([f1a13cc](https://github.com/xuxusheng/cmu-be/commit/f1a13ccff12dd638c1099dfc9affae3c3b93ff77))
- 修复 license_hash 执行权限问题 ([3b6b2a8](https://github.com/xuxusheng/cmu-be/commit/3b6b2a8bc7e90aa3aa87fc290b51d66bc170b477))
- 修复 license_hash 执行权限问题 ([576f494](https://github.com/xuxusheng/cmu-be/commit/576f49414b54377b77789c8c32dc5282cd4bf3ea))
- 修复 s2c、c2s 函数问题 ([286c0b5](https://github.com/xuxusheng/cmu-be/commit/286c0b54639baf9cf79188f28719f7c29d90ffb2))
- 修复传感器 create、update 方法 ([a511a32](https://github.com/xuxusheng/cmu-be/commit/a511a3213c21e957bc878ccae33a32c57465c503))
- 修复判断用户名是否存在方法 ([2e67ca1](https://github.com/xuxusheng/cmu-be/commit/2e67ca1d73b5f3aa1a2be11e65188b7abdecd233))
- 修复字段类型 ([0333812](https://github.com/xuxusheng/cmu-be/commit/0333812927533409967b74943305a2e4ba27bc74))
- 修复导入问题 ([f4d4c2b](https://github.com/xuxusheng/cmu-be/commit/f4d4c2b5c0d0b9faae019b371b8d5b1af6f0f6e1))
- 修复引用错误 ([233f793](https://github.com/xuxusheng/cmu-be/commit/233f7939ec3aee002595c0f73b4752566ba082ac))
- 修复接口字段类型校验规则 ([069c1a9](https://github.com/xuxusheng/cmu-be/commit/069c1a9dcaf108a87d26ac8b969fded4a1f32b27))
- 修复接口错误 ([03f958d](https://github.com/xuxusheng/cmu-be/commit/03f958d089155a5eb7f7007a1d70c9ec8fce08d6))
- 修复日志配置 ([915b884](https://github.com/xuxusheng/cmu-be/commit/915b8843e5282bc7d6087f461b5aece05fe9bb6f))
- 修复构建错误 ([7bd8be5](https://github.com/xuxusheng/cmu-be/commit/7bd8be5e35962210c6767aed6e92a36ea81566db))
- 修复构建错误 ([0d78df4](https://github.com/xuxusheng/cmu-be/commit/0d78df4382b6c311b496c1bedb41d61b7e0edb11))
- 修复查询最新上报数据时字段问题 ([9ee9710](https://github.com/xuxusheng/cmu-be/commit/9ee97102d14c19fe94fed144e94a4970715c77d7))
- 修复登录接口问题 ([91f85f9](https://github.com/xuxusheng/cmu-be/commit/91f85f954d563373145d188927e6b34210a0fed7))
- 修复网卡信息接口返回格式 ([ea5359b](https://github.com/xuxusheng/cmu-be/commit/ea5359b9bae08b0f29a67d4fde32f80f8fc12555))
- 修复请求参数位置 ([ee47fc6](https://github.com/xuxusheng/cmu-be/commit/ee47fc6f7ac55bae5662063a52cd2e12fe545430))
- 修复错误类型 ([1bab533](https://github.com/xuxusheng/cmu-be/commit/1bab533ae2408c024c038387e93e318a4acbc16e))
- 修复验证码生成逻辑 ([0bde976](https://github.com/xuxusheng/cmu-be/commit/0bde976157d25d97f7a44167fd1f9407fa27ea97))
- 修改判断表是否存在逻辑 ([c600225](https://github.com/xuxusheng/cmu-be/commit/c600225807b4ecafb40db7e5e1db7dc9d1c842c8))
- 修正 datetime 字段类型 ([d50af37](https://github.com/xuxusheng/cmu-be/commit/d50af37740557938a3180eb7f6d653e364aa40b6))
- 引入缺失依赖 ([e6fe045](https://github.com/xuxusheng/cmu-be/commit/e6fe045b67f65e63d1e078a72d0b2508390a610c))
- 补全依赖引入 ([b4a97fe](https://github.com/xuxusheng/cmu-be/commit/b4a97fe8fdc685a19bba2433861cbd9486a31db9))
- 采集参数更新时补齐 memoryTh 参数 ([25d7864](https://github.com/xuxusheng/cmu-be/commit/25d7864b015333bf47ad2ef9f5a9a6f4125f3a54))

### ✨ Features | 新功能

- i2 传感器配置查询加入 groupName 和 phaseName 字段 ([0d4516f](https://github.com/xuxusheng/cmu-be/commit/0d4516fe0bdb5c891a8e709f9671d9d6ede209a7))
- i2 分组返回 lnClass 字段 ([1d92c7e](https://github.com/xuxusheng/cmu-be/commit/1d92c7ebba502e59c13703025970c2b2da722d5a))
- sensor list 接口加入查询条件 ([00b9d0c](https://github.com/xuxusheng/cmu-be/commit/00b9d0c9b425c9b82b30d371684c47d1d6099002))
- 中间件忽略健康检查接口 ([8cbeb11](https://github.com/xuxusheng/cmu-be/commit/8cbeb11ecaf632f3ae030b086cf160d26cf2578d))
- 优化 I2 传感器接口返回字段 ([26d9bb2](https://github.com/xuxusheng/cmu-be/commit/26d9bb2bfd766ac04e7e4bd1eba0b6ab3795bda1))
- 优化 NtpConfig 字段类型 ([c2b4e1b](https://github.com/xuxusheng/cmu-be/commit/c2b4e1bbf989d931fdc9c28aa31811e9f1736391))
- 优化传感器数据查询接口 url ([c7ad053](https://github.com/xuxusheng/cmu-be/commit/c7ad0534db968c37d87a7c53dd8d1932ec4eed85))
- 优化传感器状态查询接口 ([d608cd0](https://github.com/xuxusheng/cmu-be/commit/d608cd01cb78944654437ae7556cea25e7f0476a))
- 优化历史数据文件下载逻辑 ([168ef31](https://github.com/xuxusheng/cmu-be/commit/168ef312965b9de3eadbf345bf0e6f8f9ee4103b))
- 优化接口返回 ([828da9b](https://github.com/xuxusheng/cmu-be/commit/828da9b2adaf94798e363ed30c61f68bee93e088))
- 优化文件列表排序逻辑 ([1a90918](https://github.com/xuxusheng/cmu-be/commit/1a9091899c3410d0c2b5780b099e5278a0618f05))
- 优化获取进程状态方法 ([38642b2](https://github.com/xuxusheng/cmu-be/commit/38642b27a57559f2f0dd27158c642ee3c9f3b7bc))
- 传感器下发指令时加入参数 ([d69dc18](https://github.com/xuxusheng/cmu-be/commit/d69dc18c6907f9a3409aa2980a38f4746aa4daf5))
- 传感器查询接口返回格式规范化 ([009a49c](https://github.com/xuxusheng/cmu-be/commit/009a49cf21c9611272545dd490a840a650a8cea0))
- 修复登录接口错误 ([e19efc5](https://github.com/xuxusheng/cmu-be/commit/e19efc5f78a3c9d03ad9556c577b0f1fca00d9e0))
- 修改 netplan 配置字段 ([a731178](https://github.com/xuxusheng/cmu-be/commit/a7311789a33aacc3660907215e3bc11dc1e7aafa))
- 修改 socket 通信端口 ([f728239](https://github.com/xuxusheng/cmu-be/commit/f728239c659b27b728aa739a2bdd5c4cc7e9e127))
- 修改 websocket 监控日志路径 ([bb89489](https://github.com/xuxusheng/cmu-be/commit/bb894891cd00e9a6270e26cebb9aa16a82b8668e))
- 修改传感器属性查询接口入参规范 ([ae71ba5](https://github.com/xuxusheng/cmu-be/commit/ae71ba5be4df96da2276f5156120a1e3e4c17e8a))
- 修改健康检查接口路径 ([3191036](https://github.com/xuxusheng/cmu-be/commit/3191036f2edcaa2b2359935abea2ab4f6f088037))
- 修改数据库路径 ([ecad4f4](https://github.com/xuxusheng/cmu-be/commit/ecad4f4c5e4d9911b7956a8a535971fabb2084b7))
- 修改登录接口路径 ([da84eb3](https://github.com/xuxusheng/cmu-be/commit/da84eb35541e0b0cf8c31011dd42fc6ee343c321))
- 分页接口改为 Get 请求 ([1258b21](https://github.com/xuxusheng/cmu-be/commit/1258b21063bb5a21b7a311858a2362b1ff74315d))
- 加入 cag 配置查询接口 ([f9a0c82](https://github.com/xuxusheng/cmu-be/commit/f9a0c821ccc231ba152e20cef7470afb10e9393f))
- 加入 config 模块 ([02f8736](https://github.com/xuxusheng/cmu-be/commit/02f87366b9fc006ce415e54b10267f0c2a27de61))
- 加入 config、icd 文件查询接口 ([d9096e2](https://github.com/xuxusheng/cmu-be/commit/d9096e2398dc94854d672b57357378df35277dc4))
- 加入 CoreModule 和基础中间件 ([23ce2d7](https://github.com/xuxusheng/cmu-be/commit/23ce2d7e638cdc15b9627b345651b2c013ac9df4))
- 加入 i2 cac、cag 相关接口 ([785c720](https://github.com/xuxusheng/cmu-be/commit/785c720c3933459ef27e19549d70f74d7b0d52a0))
- 加入 i2 sensor 分页查询接口 ([5b67089](https://github.com/xuxusheng/cmu-be/commit/5b670891cd23d57254dea63ec4c3c2ae4342843c))
- 加入 I2 sensor 列表查询接口 ([bd96eb8](https://github.com/xuxusheng/cmu-be/commit/bd96eb8618c76f99a5cf8a8641267708cb8d7460))
- 加入 I2 调试相关接口 ([1846348](https://github.com/xuxusheng/cmu-be/commit/18463480bfe4d7cdc4250405e91a3a4112ce125c))
- 加入 icd 文件上传接口 ([f1430b5](https://github.com/xuxusheng/cmu-be/commit/f1430b5bca3cf0a391a33dfe5dfe0dabb5b149b0))
- 加入 ip-route 接口 ([c4b42d3](https://github.com/xuxusheng/cmu-be/commit/c4b42d3c9b165cf2607974919139f6a703281d1c))
- 加入 iproute ([6329695](https://github.com/xuxusheng/cmu-be/commit/6329695e3188fcda7cdf2137b6cb29fffb495689))
- 加入 knex service ([978b257](https://github.com/xuxusheng/cmu-be/commit/978b2577ecb989232e0668ddffff19a7adf76141))
- 加入 license 相关函数 ([c022212](https://github.com/xuxusheng/cmu-be/commit/c02221249f8f6c962890103a31897a66277584e1))
- 加入 log config 相关接口 ([bc39090](https://github.com/xuxusheng/cmu-be/commit/bc390904dc8b5bbfda51f81f52e72b5a47570e24))
- 加入 mms config 相关接口 ([075b42a](https://github.com/xuxusheng/cmu-be/commit/075b42ab13ae30bf7ce81051e47387bec0f68d9f))
- 加入 ntp config 相关接口 ([319b9e3](https://github.com/xuxusheng/cmu-be/commit/319b9e34e7431cfc824dd2a8c91c73bdd07146cf))
- 加入 Result 类 ([bb300a0](https://github.com/xuxusheng/cmu-be/commit/bb300a0dd0d912c6c817d7849ac108f8f6f1f992))
- 加入 websocket 监控日志内容 ([780b63a](https://github.com/xuxusheng/cmu-be/commit/780b63a6e61851aeff36e0a8a8da5e045d1f108f))
- 加入从 ICD 文件中获取 IED 名称和 AP 名称的接口 ([6544a37](https://github.com/xuxusheng/cmu-be/commit/6544a37103fab58b88a9c04562a5b29f6d8cbf50))
- 加入传感器分页查询接口 ([6d4d119](https://github.com/xuxusheng/cmu-be/commit/6d4d11969dad3833835e2edfa29258e744cb0800))
- 加入传感器列表接口 ([c1e7c2b](https://github.com/xuxusheng/cmu-be/commit/c1e7c2b9c99886901c5ebc6dd9d975e0050f4ffe))
- 加入传感器相别、分组查询接口 ([ac8d355](https://github.com/xuxusheng/cmu-be/commit/ac8d355f4aadd59e63ea803516d687308336a8bc))
- 加入传感器类型可选项接口 ([f76b4c9](https://github.com/xuxusheng/cmu-be/commit/f76b4c924327f1697d092bef05ad497fa7448795))
- 加入传感器调试接口 ([4e784cb](https://github.com/xuxusheng/cmu-be/commit/4e784cb664ef287cc14073b623d7449f82b0e5bf))
- 加入使用 iproute 获取的网络信息接口 ([3a6d2cd](https://github.com/xuxusheng/cmu-be/commit/3a6d2cd727a79f596f9ed1ec71726cfe94420746))
- 加入修改用户信息接口 ([7b53f4d](https://github.com/xuxusheng/cmu-be/commit/7b53f4dda047b06b3cd0b69cb69ccb9e9c18404d))
- 加入健康检查接口 ([af6d2e9](https://github.com/xuxusheng/cmu-be/commit/af6d2e92190f68bfedfcd2be6be1d2c0ff0aeacf))
- 加入入参校验逻辑 ([ad71599](https://github.com/xuxusheng/cmu-be/commit/ad71599e279af5d240165c5c69b3906ceb827d01))
- 加入删除 I2 传感器配置接口 ([0f6eeb4](https://github.com/xuxusheng/cmu-be/commit/0f6eeb4860b91eae0701e32f9a98ce545bbc8f4f))
- 加入单个文件下载接口 ([a4a8cc8](https://github.com/xuxusheng/cmu-be/commit/a4a8cc85a78a536d2009b8cd1e51957cf9fa04a9))
- 加入历史数据导出接口 ([702f9e1](https://github.com/xuxusheng/cmu-be/commit/702f9e1d4d61c9133e481f531b91acd954fcc2db))
- 加入历史数据相关接口 ([19439ca](https://github.com/xuxusheng/cmu-be/commit/19439cabc69751292811a10648f452a0f693a2f5))
- 加入异常处理、认证相关逻辑 ([ff78b29](https://github.com/xuxusheng/cmu-be/commit/ff78b2909eeabf85ee7c3da3db2dbf77b46527c7))
- 加入数据库 Entity 定义 ([73242cc](https://github.com/xuxusheng/cmu-be/commit/73242cc0a770306964945b191288c23298ee3334))
- 加入文件列表排序逻辑 ([d10755a](https://github.com/xuxusheng/cmu-be/commit/d10755adb7e19cb9ea1930770c9e0d46b9728c23))
- 加入日志 ([d11a05a](https://github.com/xuxusheng/cmu-be/commit/d11a05a2bd670b129a3807a6462d0150e6114658))
- 加入更新网卡信息接口 ([0e765ec](https://github.com/xuxusheng/cmu-be/commit/0e765ec5e33dd4106353dae413acae968a0f9359))
- 加入查询 license 接口 ([60e91f0](https://github.com/xuxusheng/cmu-be/commit/60e91f0a01834d05d48143866396554b7ee4644d))
- 加入查询传感器信息接口及驼峰化方法 ([89fef17](https://github.com/xuxusheng/cmu-be/commit/89fef17603d2e6d3f0255b2385cd73b385562520))
- 加入查询传感器最新上报数据接口 ([8477582](https://github.com/xuxusheng/cmu-be/commit/8477582e3cb362f1847054769334faf25c3e9f11))
- 加入查询传感器状态接口 ([e2b02db](https://github.com/xuxusheng/cmu-be/commit/e2b02db464cb45fb3fc66c86bdb08fc6123502a1))
- 加入查询单个 I2 传感器配置接口 ([0fedfca](https://github.com/xuxusheng/cmu-be/commit/0fedfca5489fcff83bf3330a60ea7eed636bfa68))
- 加入查询所有 I2 传感器接口 ([0647c3f](https://github.com/xuxusheng/cmu-be/commit/0647c3f27608e8c893769cd2cb01fd68f8d82452))
- 加入模拟日志文件 ([e947957](https://github.com/xuxusheng/cmu-be/commit/e947957b1ef9efe081bc214cc2e816b966fcc5ce))
- 加入登录用户信息查询接口 ([f151ea0](https://github.com/xuxusheng/cmu-be/commit/f151ea06de1bf256e744ff64784cec3189b08276))
- 加入监听 i2 log 方法 ([943a4c8](https://github.com/xuxusheng/cmu-be/commit/943a4c8c94ac1acab3eaf0a4ba75cff221010a5f))
- 加入系统时间设置日志 ([993df30](https://github.com/xuxusheng/cmu-be/commit/993df3025ca9f622d83798146333060499bad4ab))
- 加入网卡信息获取接口 ([754d04a](https://github.com/xuxusheng/cmu-be/commit/754d04ac8626d0b5bbf9277a7f462ed5d1768163))
- 加入获取系统运行时间接口 ([9a64b87](https://github.com/xuxusheng/cmu-be/commit/9a64b877094f2b3b7f64f0ed27160d28ecc2e106))
- 加入进程状态接口 ([cd7781f](https://github.com/xuxusheng/cmu-be/commit/cd7781f4bf606254c9305ac9233fcb0410646603))
- 加入通过 sensorId 查询上报数据字段接口 ([f610da0](https://github.com/xuxusheng/cmu-be/commit/f610da0b26a931ac2487c4e764ab112de285bc18))
- 加入通过网卡名称查询信息接口 ([083a5b9](https://github.com/xuxusheng/cmu-be/commit/083a5b960d71248038a4e0190ed993221c81ea06))
- 加入采集参数相关接口 ([e06cc01](https://github.com/xuxusheng/cmu-be/commit/e06cc0144f5a45df136b8c4184883ac06b3e2bee))
- 加入错误日志 ([33cba0e](https://github.com/xuxusheng/cmu-be/commit/33cba0e1a4172acab9533e6dec10576ad3dbf595))
- 加入静态资源托管代码 ([485c31b](https://github.com/xuxusheng/cmu-be/commit/485c31be3f0f26c1478c11d1fbc12f28db0c90c3))
- 历史数据导出接口改为 public ([e1d3a89](https://github.com/xuxusheng/cmu-be/commit/e1d3a892d1dec926688c59604b4521d575850aad))
- 增加查询 cpu、memory 接口 ([5ad53f9](https://github.com/xuxusheng/cmu-be/commit/5ad53f9f90b597c038388e275172bff738b751a3))
- 完善新建、更新 I2 传感器配置参数校验 ([c4d80f3](https://github.com/xuxusheng/cmu-be/commit/c4d80f346bf69c678765983757a31967c54cb262))
- 完善部分接口返回格式 ([cb58f85](https://github.com/xuxusheng/cmu-be/commit/cb58f850c951970d32456c1aad8ff01d3b914ac1))
- 接口路径加入 api 前缀 ([2658a2b](https://github.com/xuxusheng/cmu-be/commit/2658a2b644afb14ff77deb8889bbc77da686b0ca))
- 操作 xml 时加入部分参数 ([e046451](https://github.com/xuxusheng/cmu-be/commit/e04645186d79509c9bb9dade03de08c2e6ef243d))
- 数据库查询加入驼峰和蛇形转换处理 ([d4a0c95](https://github.com/xuxusheng/cmu-be/commit/d4a0c9516220f61140ee6e5d05f74a3171b26d9a))
- 文件下载接口移除验证 ([c3243a5](https://github.com/xuxusheng/cmu-be/commit/c3243a539a59d9291ec1d34484a153e39753094a))
- 新建和更新传感器时加入短地址、设备号是否重复的判断 ([82bed48](https://github.com/xuxusheng/cmu-be/commit/82bed485d58d784420881a895827202c6b53fa0f))
- 更改传感器接口 url ([122d84b](https://github.com/xuxusheng/cmu-be/commit/122d84bbf2c3e48107351d8c6b5dc5b6d2ab138d))
- 更改登录逻辑 ([db2d534](https://github.com/xuxusheng/cmu-be/commit/db2d5347b8d284fc8f915f8268136215400b4e60))
- 构建时使用 npm ([905831f](https://github.com/xuxusheng/cmu-be/commit/905831fe93da5d9bb05c04e4f24ae54847d58571))
- 查询所有传感器时增加设备类型和设备型号中文名字段 ([2872b43](https://github.com/xuxusheng/cmu-be/commit/2872b4350c1cfc5c812c8027cc8489148436d190))
- 查询设备型号可选项时支持指定设备类型 ([e37ada7](https://github.com/xuxusheng/cmu-be/commit/e37ada700d61a539e8c58d0b3d40d5b681e65e8f))
- 查询设备数据时判断表是否存在 ([91f1d22](https://github.com/xuxusheng/cmu-be/commit/91f1d222b989273c693cd18bb7f962212bc67207))
- 注释静态服务器 ([a9f0816](https://github.com/xuxusheng/cmu-be/commit/a9f0816720b7fcdfe8fbd071cdfd5b5276d5f855))
- 移除 netplan 相关多余代码 ([d9df714](https://github.com/xuxusheng/cmu-be/commit/d9df71430e94b5883581581cf96857a61c22e908))
- 移除判断表是否存在逻辑 ([3c896d5](https://github.com/xuxusheng/cmu-be/commit/3c896d597d41b4543c52fc87822dd83c4d40231f))
- 简化容器构建 ([25489e2](https://github.com/xuxusheng/cmu-be/commit/25489e2fd04a9feb777bcbf50f51357d1e3feebb))
- 类型定义驼峰改为蛇形 ([a7f5b3c](https://github.com/xuxusheng/cmu-be/commit/a7f5b3c19d006653311e77b782872e8c5bf6b62d))
- 补全系统相关调试文件 ([9fce29b](https://github.com/xuxusheng/cmu-be/commit/9fce29be363437ce3e80b03c68ea2227de6fb14b))
- 规范接口方法 ([b67531c](https://github.com/xuxusheng/cmu-be/commit/b67531cdd6c74d8d0dab2c22d5f0728f3f739c1c))
- 规范接口返回字段名 ([86f33af](https://github.com/xuxusheng/cmu-be/commit/86f33afd53f8963ef48d08e94aee782991b6f4b0))
- 调整传感器详情接口 ([d37a38f](https://github.com/xuxusheng/cmu-be/commit/d37a38fde1a3d17a068522d815ae98045abe678d))
- 迁移所有的 service 代码 ([122de4a](https://github.com/xuxusheng/cmu-be/commit/122de4a72187c67b477cbd98c1accd55240cb4f2))
- 迁移所有的路由代码 ([beb8c08](https://github.com/xuxusheng/cmu-be/commit/beb8c081240121d6a533ee200d55ecee6cded85a))
- 迁移系统状态查询接口 ([035bec0](https://github.com/xuxusheng/cmu-be/commit/035bec01f048cd8a377ea793ed3a84678d1d47a0))
- 迁移重启进程接口 ([7ec0b87](https://github.com/xuxusheng/cmu-be/commit/7ec0b8757f17a596151be7f0165ea7e8780f5a19))
- 通过环境变量指定服务端口 ([d27e4ba](https://github.com/xuxusheng/cmu-be/commit/d27e4ba16ef7f58adff33ca228b590f5f6d9c06d))
- 重写系统时间操作方法 ([b042b27](https://github.com/xuxusheng/cmu-be/commit/b042b2777bb179abdcc8b588f7589759a1c56f72))

### 🔧 Continuous Integration | CI 配置

- node 镜像改为 slim ([3e1a4e7](https://github.com/xuxusheng/cmu-be/commit/3e1a4e7875f0475a8ee97815fd793bc4aea9bc00))
- 优化 Dockerfile ([0a5f6fa](https://github.com/xuxusheng/cmu-be/commit/0a5f6fab8c36cb05e1d09513e6a3ea07b029741e))
- 修复 ncc 打包路径 ([8be486c](https://github.com/xuxusheng/cmu-be/commit/8be486c0971fc59dc6282828b7527a230f02db00))
- 修改文件拷贝路径 ([fe57d5a](https://github.com/xuxusheng/cmu-be/commit/fe57d5a3da8dee403a0fe16496836d490f4e64c9))
- 修改文件权限 ([a5e53d2](https://github.com/xuxusheng/cmu-be/commit/a5e53d2556d02f8e44ca393dcc7b58de96429492))
- 加入 Dockerfile ([6db49fa](https://github.com/xuxusheng/cmu-be/commit/6db49fa520ed5fe76baebbbe4c188437596e6efe))
- 加入 github action 配置 ([7c74235](https://github.com/xuxusheng/cmu-be/commit/7c74235a36da42ec4df90b6ea7d38eab60d8d216))
- 加入发版相关工作流 ([6936753](https://github.com/xuxusheng/cmu-be/commit/69367538e847e7d2486f75c134372249eaa00d99))
- 增加 ncc 打包流程 ([1b4d99d](https://github.com/xuxusheng/cmu-be/commit/1b4d99dca71aea967a14a7cd8cd22874ccdab49d))
- 增加镜像编译平台 ([04deaf7](https://github.com/xuxusheng/cmu-be/commit/04deaf75439de8f35a449b1ac2c24b434a54473e))
- 安装 vim ([ce8da58](https://github.com/xuxusheng/cmu-be/commit/ce8da58a33559c641ecedc62d192e44bb20e6967))
- 容器中安装 dbus ([6b12aa3](https://github.com/xuxusheng/cmu-be/commit/6b12aa3b6bc7e6219da291396c5b177f73f4d4eb))
- 容器中安装 netplan ([32b0b43](https://github.com/xuxusheng/cmu-be/commit/32b0b433cdb2c9c5c416bf690475862b5e891329))
- 构建镜像时安装 iproute2 ([8d75353](https://github.com/xuxusheng/cmu-be/commit/8d753539c8eb2736833a7e6e5310b6139de1aa7f))
- 用户切为 root ([68e647b](https://github.com/xuxusheng/cmu-be/commit/68e647b10d64d70ac3aee368bb1742a9869a446b))

### 📦 Chores | 其他更新

- init ([e9a79fb](https://github.com/xuxusheng/cmu-be/commit/e9a79fb4f54cc1b23c92fe860321b1a1c4bcb090))
- 包管理器切换为 yarn ([31e103d](https://github.com/xuxusheng/cmu-be/commit/31e103d058304f8d9def432190dc3a142d53f5dc))
- 更新依赖 ([ef863d9](https://github.com/xuxusheng/cmu-be/commit/ef863d9085aadc93f53b081330c9f2a4e8d6065d))
- 更新依赖 ([8ab333f](https://github.com/xuxusheng/cmu-be/commit/8ab333f687f7aea46b3dc459e74916b19f874de0))
- 更新依赖版本 ([8fbda9c](https://github.com/xuxusheng/cmu-be/commit/8fbda9c67b7efda4539a93333ec8026605b7fd09))
- 更新依赖版本 ([cbd1124](https://github.com/xuxusheng/cmu-be/commit/cbd1124393aa522d5045620d3bc2dfa1b9365748))
- 更新依赖版本 ([35dbf91](https://github.com/xuxusheng/cmu-be/commit/35dbf91111308efe76ceaaaae9f57632c2b27d75))
- 更新依赖版本 ([8def5df](https://github.com/xuxusheng/cmu-be/commit/8def5df7f7e9ea7e5283a8f04a3ab4b8afc2d39d))
- 更新依赖版本 ([42fe3cb](https://github.com/xuxusheng/cmu-be/commit/42fe3cb14343afe109f2d6af618e81e180b3e4db))
- 更新依赖版本 ([58170ee](https://github.com/xuxusheng/cmu-be/commit/58170ee9aa867aecb546bd924a58474f1606cd5e))
- 调整目录结构 & 加入示例代码 ([0e1055a](https://github.com/xuxusheng/cmu-be/commit/0e1055a45162ee788ad02228123bfe636d74c353))
- 配置 prettier、husky 等基础工具 ([2230f2b](https://github.com/xuxusheng/cmu-be/commit/2230f2b54018b91bbf8d9efd3505f41a1d93c175))
