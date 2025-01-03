# CMU-WEB - 更新日志 


### [0.0.7](https://github.com/xuxusheng/cmu-web/compare/v0.0.6...v0.0.7) (2025-01-03)


### ✨ Features | 新功能

* 传感器输入框宽度调整 ([766d478](https://github.com/xuxusheng/cmu-web/commit/766d4789b6d10928f4bb793c63afe16c716e6c65))
* 加入 Collector 版本信息展示功能 ([9f9fe42](https://github.com/xuxusheng/cmu-web/commit/9f9fe42b36f2b2ba840978def56e8a51c0d1feb1))
* 实时数据页面加入设备描述查询功能 ([75256a0](https://github.com/xuxusheng/cmu-web/commit/75256a0023529dec2b4bde27c0cbb46be172c61d))
* 实时数据页面加入通过描述信息前缀分组来进行筛选功能 ([1977588](https://github.com/xuxusheng/cmu-web/commit/19775880cc2266d46bc75cd3e08a34add135182c))
* 总览页面展示无状态设备，同时加入相应筛选条件 ([f6fdce3](https://github.com/xuxusheng/cmu-web/commit/f6fdce396cf9ef106843440964d68aecba1d4fa0))
* 指定配置文件时，改用 linux 命令创建相对路径软链接 ([7e9e01c](https://github.com/xuxusheng/cmu-web/commit/7e9e01cc9b42a4df50eb4692b951b28958ac8a68))
* 文案调整 && 列表按照短地址升序排列 ([f5f048c](https://github.com/xuxusheng/cmu-web/commit/f5f048c06997f1a8f29c3836a55c441ce6eb1371))
* 进程信息改为从 /mnt/nand/log/proc_state 文件中读取 ([d6edf75](https://github.com/xuxusheng/cmu-web/commit/d6edf75725b2e107df9591c7170b4ae5d2c82fcc))

### [0.0.6](https://github.com/xuxusheng/cmu-web/compare/v0.0.5...v0.0.6) (2024-12-24)


### 📦 Chores | 其他更新

* 优化日志打印规则 ([e2e4a8d](https://github.com/xuxusheng/cmu-web/commit/e2e4a8d747a90f9d40391b98d32057a79bee81e2))


### ✨ Features | 新功能

* 一键备份功能加入调试日志 ([1a87803](https://github.com/xuxusheng/cmu-web/commit/1a87803911ffd233a5bfe1de9fe7c7c51b7aba5d))
* 加入更新日志请求接口 ([5c62ec9](https://github.com/xuxusheng/cmu-web/commit/5c62ec98b4c395238bb76ec4db04d5088856cccb))
* 调整一键备份逻辑 ([638c17f](https://github.com/xuxusheng/cmu-web/commit/638c17fb03d1044953faa1b718b7e6d7f86a2775))
* 通用设置页面加入更新日志展示功能 ([ffee63a](https://github.com/xuxusheng/cmu-web/commit/ffee63a415140412bbf16a2ab109ea451a1a02c7))


### 🐛 Bug Fixes | Bug 修复

* 一键备份功能兼容软链接绝对路径 ([1918ba8](https://github.com/xuxusheng/cmu-web/commit/1918ba83651367b9428548c98d3d7ce09e1d964a))
* 指定配置文件时回退回使用相对路径 ([8864aa9](https://github.com/xuxusheng/cmu-web/commit/8864aa9365301034f3286cefdb4c1db43ea20e3c))

### [0.0.5](https://github.com/xuxusheng/cmu-web/compare/v0.0.4...v0.0.5) (2024-12-23)


### 📦 Chores | 其他更新

* cli 包加入 eslint 配置 ([32cc00a](https://github.com/xuxusheng/cmu-web/commit/32cc00a74dd18500893f85cf487afddab45e83dc))
* 修改测试用 sqlite3 文件软链接指向 ([3bc51b7](https://github.com/xuxusheng/cmu-web/commit/3bc51b7040db7f22a55e6cd11fefc08acb7728d2))
* 前端代码加入 eslint 相关配置 ([769f9a2](https://github.com/xuxusheng/cmu-web/commit/769f9a240f3a58a19ca7f936bbe4929d9a51b5a8))
* 升级 react-router 到 v7 ([32fd322](https://github.com/xuxusheng/cmu-web/commit/32fd32256f4898e401ea8b376ad5c0ef8358efd2))
* 后端代码加入 eslint 相关配置 ([9a2fa91](https://github.com/xuxusheng/cmu-web/commit/9a2fa9100d04385256988a27973019a8b7ab30aa))
* 更新依赖版本 ([35b01df](https://github.com/xuxusheng/cmu-web/commit/35b01df841978de33492148d9ee454f9291ead5b))
* 更新依赖版本 ([1385f8a](https://github.com/xuxusheng/cmu-web/commit/1385f8a4efebe24d82184cd9b39a4729919074b4))
* 移除无用的项目包 ([88038f2](https://github.com/xuxusheng/cmu-web/commit/88038f2623946c7613f5d3fc23a46dde1e878137))


### ✨ Features | 新功能

* 加入一键备份功能 ([78726d2](https://github.com/xuxusheng/cmu-web/commit/78726d2f40b4399b1fdcf8302cc641700669f643))
* 加入应用版本号展示功能 ([db32ab3](https://github.com/xuxusheng/cmu-web/commit/db32ab3f413ae0c2ea9e86bdc0dcb73ccb693cfd))
* 调整一键备份接口 sleep 代码位置到最后 ([0195b32](https://github.com/xuxusheng/cmu-web/commit/0195b329fb06c9a8ff0696a12a2e8cc32fa222bb))

### [0.0.4](https://github.com/xuxusheng/cmu-web/compare/v0.0.3...v0.0.4) (2024-09-06)


### 📦 Chores | 其他更新

* host 默认使用 0.0.0.0 ([39aa08e](https://github.com/xuxusheng/cmu-web/commit/39aa08e12496f0ca0a8965dd7c5f58fe461feb4b))


### ✨ Features | 新功能

* 应用配置文件时先删除已有的 ([6f265bb](https://github.com/xuxusheng/cmu-web/commit/6f265bbc6671b582cbf563f9fb739eb764431f00))

### [0.0.3](https://github.com/xuxusheng/cmu-web/compare/v0.0.2...v0.0.3) (2024-07-29)


### 👷‍ Build System | 构建

* 补全依赖 ([674b2c6](https://github.com/xuxusheng/cmu-web/commit/674b2c6488951cd8bfe87708ba585a0ab5740a4a))


### ✨ Features | 新功能

* 修改 changelog 标题 ([831aa9c](https://github.com/xuxusheng/cmu-web/commit/831aa9c5dc76d39a972757485015890aaa614e86))

### 0.0.2 (2024-07-29)


### ♻ Code Refactoring | 代码重构

* 重命名 cmu-be 为 backend ([c0a462d](https://github.com/xuxusheng/cmu-web/commit/c0a462d2d4dcbaebe1e53860067868068b7b2781))


### 🔧 Continuous Integration | CI 配置

* 修改 pnpm 版本 ([eec9a0d](https://github.com/xuxusheng/cmu-web/commit/eec9a0d2f89b21a871b1c11d138d3316705b9bf5))
* 删除多余配置项 ([b7b9535](https://github.com/xuxusheng/cmu-web/commit/b7b953572bcb0318f0735075c1543ed4f19b7158))
* 加入 Dockerfile 文件 ([13b9aed](https://github.com/xuxusheng/cmu-web/commit/13b9aed8e2792eea9146844318b1130f3a67d550))
* 加入 release 相关配置 ([c743c8e](https://github.com/xuxusheng/cmu-web/commit/c743c8e10b3f96c0ed552e7a3fd641107bef87e9))
* 加入 turbo cache 配置 ([eaf7f26](https://github.com/xuxusheng/cmu-web/commit/eaf7f2618f0f817f510b74b880a4842ec547f349))
* 加入开发环境 ci 配置文件 ([6e9e5fd](https://github.com/xuxusheng/cmu-web/commit/6e9e5fdd3ffc8fb5b158b4318e74eebd350f385e))
* 移除 yaml 文件中 pnpm 版本 ([cdf50ca](https://github.com/xuxusheng/cmu-web/commit/cdf50ca47997561a3ac69668eca5aaf2882eb603))


### ✨ Features | 新功能

* **create-turbo:** apply official-starter transform ([109338a](https://github.com/xuxusheng/cmu-web/commit/109338a199bf6c777c0f3e598a44ab486a52b789))
* **create-turbo:** apply pnpm-eslint transform ([4bc2c36](https://github.com/xuxusheng/cmu-web/commit/4bc2c36c64e0a3b3102adef2d7a89f35f1fb53a6))
* **create-turbo:** create basic ([ace7a70](https://github.com/xuxusheng/cmu-web/commit/ace7a70e431bbd6cb45e136f6325770edd68f2c3))
* **create-turbo:** install dependencies ([fd6e107](https://github.com/xuxusheng/cmu-web/commit/fd6e107cdd5a6d75821af7b3802cec6104aa2817))
* 修复 backend 问题 ([9643899](https://github.com/xuxusheng/cmu-web/commit/96438990e12c280171a8415f684b63bc1a7c5986))
* 加入 cmu-be ([efe9bae](https://github.com/xuxusheng/cmu-web/commit/efe9bae24db599bd5ea808fb72e7b849f4057cb4))
* 加入 cmu-cli ([95336ff](https://github.com/xuxusheng/cmu-web/commit/95336ffefd703db1f8de4e84a8f4af49141390dc))
* 加入 cmu-fe ([3d291ba](https://github.com/xuxusheng/cmu-web/commit/3d291baf26e8ad89e04105802b490f063188e692))
* 加入 HOSTNAME 环境变量 ([8a036c8](https://github.com/xuxusheng/cmu-web/commit/8a036c807c0e9794827fb19daf5634665bbe42af))
* 加入版本号 ([7a40558](https://github.com/xuxusheng/cmu-web/commit/7a40558394527831dba9be906797b4e5f57c0cad))


### 📦 Chores | 其他更新

* cmu-fe 重命名为 frontend ([d607dfe](https://github.com/xuxusheng/cmu-web/commit/d607dfe9a2d3657348b8b7af6541fcea7375318d))
* **release:** 0.0.1 ([5dc46e7](https://github.com/xuxusheng/cmu-web/commit/5dc46e7f31e16198b3443130ecacb9e881bdb2ff))
* 修改 turbo 配置 ([8d84fb2](https://github.com/xuxusheng/cmu-web/commit/8d84fb2a15ea496accb6a484082bfacc2e40e58b))
* 删除多余文件 ([6b066bc](https://github.com/xuxusheng/cmu-web/commit/6b066bc90c1a934ba25f01edd0b56e0c89719f55))
* 尝试使用 backend 类型 ([7949f60](https://github.com/xuxusheng/cmu-web/commit/7949f6057bb8bce38b61f23a0cb198ec8dbd56ce))
* 更新依赖版本 ([893dada](https://github.com/xuxusheng/cmu-web/commit/893dadaee897623a3e42e3f0d81f48a653174fc3))
* 更新依赖版本 ([4031339](https://github.com/xuxusheng/cmu-web/commit/40313396d4a5a1aa8a782cb5a49c50f55b247084))
* 移除 eslint ([1514c72](https://github.com/xuxusheng/cmu-web/commit/1514c725d78b03486b4872fe8784ec7906f75187))
* 移除多余依赖 ([0ba4527](https://github.com/xuxusheng/cmu-web/commit/0ba45274a9dfc23207fa2e3b8bee475c301f8699))
* 补全依赖 ([bb3b7ec](https://github.com/xuxusheng/cmu-web/commit/bb3b7ec84bbdf09420ce87abe3042614034153cc))
* 配置 husky 和 commintlint ([741a890](https://github.com/xuxusheng/cmu-web/commit/741a890da6b0e2725bbfc7efd081f8677a4f9dbd))


### 👷‍ Build System | 构建

* 指定静态文件目录 ([9e08241](https://github.com/xuxusheng/cmu-web/commit/9e08241013b5878c37cb721edfbdc2deff1ff5b9))
* 构建时不再支持 arm/v7 ([79261b5](https://github.com/xuxusheng/cmu-web/commit/79261b56a71a802b29548c6bc9be478d33d8d7e6))
* 构建时忽略 cli 包 ([3e0d39e](https://github.com/xuxusheng/cmu-web/commit/3e0d39eb74a4e51feb767f9e6961ea6716853eb2))
* 设置 npm 镜像源 ([9c3f6ea](https://github.com/xuxusheng/cmu-web/commit/9c3f6ea58345229a2d60a4966e1bff9dfc614b0d))

### 0.0.1 (2024-07-29)


### ♻ Code Refactoring | 代码重构

* 重命名 cmu-be 为 backend ([c0a462d](https://github.com/xuxusheng/cmu-web/commit/c0a462d2d4dcbaebe1e53860067868068b7b2781))


### 👷‍ Build System | 构建

* 指定静态文件目录 ([9e08241](https://github.com/xuxusheng/cmu-web/commit/9e08241013b5878c37cb721edfbdc2deff1ff5b9))
* 构建时忽略 cli 包 ([3e0d39e](https://github.com/xuxusheng/cmu-web/commit/3e0d39eb74a4e51feb767f9e6961ea6716853eb2))
* 设置 npm 镜像源 ([9c3f6ea](https://github.com/xuxusheng/cmu-web/commit/9c3f6ea58345229a2d60a4966e1bff9dfc614b0d))


### 📦 Chores | 其他更新

* cmu-fe 重命名为 frontend ([d607dfe](https://github.com/xuxusheng/cmu-web/commit/d607dfe9a2d3657348b8b7af6541fcea7375318d))
* 修改 turbo 配置 ([8d84fb2](https://github.com/xuxusheng/cmu-web/commit/8d84fb2a15ea496accb6a484082bfacc2e40e58b))
* 删除多余文件 ([6b066bc](https://github.com/xuxusheng/cmu-web/commit/6b066bc90c1a934ba25f01edd0b56e0c89719f55))
* 尝试使用 backend 类型 ([7949f60](https://github.com/xuxusheng/cmu-web/commit/7949f6057bb8bce38b61f23a0cb198ec8dbd56ce))
* 更新依赖版本 ([893dada](https://github.com/xuxusheng/cmu-web/commit/893dadaee897623a3e42e3f0d81f48a653174fc3))
* 更新依赖版本 ([4031339](https://github.com/xuxusheng/cmu-web/commit/40313396d4a5a1aa8a782cb5a49c50f55b247084))
* 移除 eslint ([1514c72](https://github.com/xuxusheng/cmu-web/commit/1514c725d78b03486b4872fe8784ec7906f75187))
* 移除多余依赖 ([0ba4527](https://github.com/xuxusheng/cmu-web/commit/0ba45274a9dfc23207fa2e3b8bee475c301f8699))
* 补全依赖 ([bb3b7ec](https://github.com/xuxusheng/cmu-web/commit/bb3b7ec84bbdf09420ce87abe3042614034153cc))
* 配置 husky 和 commintlint ([741a890](https://github.com/xuxusheng/cmu-web/commit/741a890da6b0e2725bbfc7efd081f8677a4f9dbd))


### 🔧 Continuous Integration | CI 配置

* 修改 pnpm 版本 ([eec9a0d](https://github.com/xuxusheng/cmu-web/commit/eec9a0d2f89b21a871b1c11d138d3316705b9bf5))
* 删除多余配置项 ([b7b9535](https://github.com/xuxusheng/cmu-web/commit/b7b953572bcb0318f0735075c1543ed4f19b7158))
* 加入 Dockerfile 文件 ([13b9aed](https://github.com/xuxusheng/cmu-web/commit/13b9aed8e2792eea9146844318b1130f3a67d550))
* 加入 release 相关配置 ([c743c8e](https://github.com/xuxusheng/cmu-web/commit/c743c8e10b3f96c0ed552e7a3fd641107bef87e9))
* 加入 turbo cache 配置 ([eaf7f26](https://github.com/xuxusheng/cmu-web/commit/eaf7f2618f0f817f510b74b880a4842ec547f349))
* 加入开发环境 ci 配置文件 ([6e9e5fd](https://github.com/xuxusheng/cmu-web/commit/6e9e5fdd3ffc8fb5b158b4318e74eebd350f385e))
* 移除 yaml 文件中 pnpm 版本 ([cdf50ca](https://github.com/xuxusheng/cmu-web/commit/cdf50ca47997561a3ac69668eca5aaf2882eb603))


### ✨ Features | 新功能

* **create-turbo:** apply official-starter transform ([109338a](https://github.com/xuxusheng/cmu-web/commit/109338a199bf6c777c0f3e598a44ab486a52b789))
* **create-turbo:** apply pnpm-eslint transform ([4bc2c36](https://github.com/xuxusheng/cmu-web/commit/4bc2c36c64e0a3b3102adef2d7a89f35f1fb53a6))
* **create-turbo:** create basic ([ace7a70](https://github.com/xuxusheng/cmu-web/commit/ace7a70e431bbd6cb45e136f6325770edd68f2c3))
* **create-turbo:** install dependencies ([fd6e107](https://github.com/xuxusheng/cmu-web/commit/fd6e107cdd5a6d75821af7b3802cec6104aa2817))
* 修复 backend 问题 ([9643899](https://github.com/xuxusheng/cmu-web/commit/96438990e12c280171a8415f684b63bc1a7c5986))
* 加入 cmu-be ([efe9bae](https://github.com/xuxusheng/cmu-web/commit/efe9bae24db599bd5ea808fb72e7b849f4057cb4))
* 加入 cmu-cli ([95336ff](https://github.com/xuxusheng/cmu-web/commit/95336ffefd703db1f8de4e84a8f4af49141390dc))
* 加入 cmu-fe ([3d291ba](https://github.com/xuxusheng/cmu-web/commit/3d291baf26e8ad89e04105802b490f063188e692))
* 加入 HOSTNAME 环境变量 ([8a036c8](https://github.com/xuxusheng/cmu-web/commit/8a036c807c0e9794827fb19daf5634665bbe42af))
* 加入版本号 ([7a40558](https://github.com/xuxusheng/cmu-web/commit/7a40558394527831dba9be906797b4e5f57c0cad))
