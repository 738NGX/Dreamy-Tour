# 梦·旅 Dreamy Tour
![logo](/LOGO2.png)
## 简介  
梦·旅是一款帮助您寻求旅行搭子，进行旅行规划与回顾的移动端应用，旨在帮助您实现梦想中的旅程！
## 开发者
##### 738NGX  Github主页：https://github.com/738NGX  
##### Franctoryer  Github主页：https://github.com/Franctoryer  
##### Choihyobin111  Github主页：https://github.com/Choihyobin111  
### 创意来源：
2013年上映的电影《白日梦想家》中，主角米蒂踩着滑板在一望无际的田野包裹住的宽阔公路上飞驰的画面，让无数观众在忙碌的生活中向往着一趟心灵的旅行。开发者团队成员们都对自由有着向往，并且想把这份美好的自由之感分享给他人，这是我们对项目进行开发的初衷。

### 产生背景：
项目负责人爱好旅游文化，常和朋友们经常远赴国外一同旅行，而旅行过程中做预算，做规划，统计消费，记录照片等任务都要在不同的笔记软件或媒介中进行。相册里存放的一张张照片让如梦的旅行被记录，而一个能够记录旅行足迹，编辑旅行方案，支持旅友分享所见所闻，寻找旅游搭子的软件能够让一场美好的旅行长期留存于用户的心中。

## 主要功能：
项目的主要功能设计均来自于开发者团队旅行当中切实发现的需求，一切需求均取材于生活，再经过构思精炼：

1. **公共旅行讨论区：** 用于方便用户交流分享旅程当中的所见所闻。具体功能：支持用户发帖，附加图片和文字，支持对其他用户的帖子进行点赞，评论和楼中楼回复（回复他人的评论，回复他人的回复）。  
2. **频道系统：** 用于方便用户寻找旅友。频道是一群具有共同旅行偏好或爱好的人集中的一个较大型的用户群体，往往有一个以地域/大型活动/爱好等为名的主题（例：上海历史古迹探险队、苏州美食发掘、上海天文爱好者抱团取暖区，由于部分用户有创建频道并自主确定频道名的权限，故实际频道名可能会五花八门，以上仅供参考）具体功能：用户可以创建新频道或加入已有的频道，在频道内会用地图可视化展示频道内所有的旅行足迹，而点击单条旅行足迹即可观看旅程结束后保存下来的的旅行规划和旅行报告（详见后续介绍）。每一个频道内部也有类似公共讨论区的讨论区。  
3. **群组系统：** 为参与一次具体行程的用户群体，是频道的子单位。进入群组后，用户可以查看群成员、群行程、群组微信群二维码，可以编辑群行程，由群组管理员决定是否要结束行程。  
4. **行程规划与编辑：** 用于规划行程和记录行程。行程划分为位置节点，交通节点，用户可添加删除或插入节点，进行编辑。具体功能：指定主辅货币（解决跨国旅行问题），实时获取汇率，添加具体的消费条目，指定关联用户与预算表扣除；添加对应位置的行程照片；编辑位置节点、交通安排的时间，消费额，内容等条目，切换时区和地图位置。除上述编辑功能以外，我们为行程设计了多版本功能和预算表功能，满足个人的定制需求以及灵活的记账需求。结束后的行程会作为旅行足迹保存在频道中，便于频道成员查看。  
5. **统计报告：** 根据不同行程版本，切换用户视图，灵活查看行程消费统计报告。具体功能：统计并图表可视化展示不同消费类别（住宿、交通、餐饮、门票等）、不同交通方式（公交、轨交、铁路、飞机等）的占比，总消费额，人均消费额，最高消费额的十条消费情况，全部的消费条目记录（类似微信、支付宝的消费记录）。可以切换行程版本，切换用户视图查看不同的统计报告。  
6. **智能行程规划：** 使用人工智能大语言模型和模型上下文协议技术，可以输入行程的大致信息（地点，持续时长等），在行程编辑界面智能生成行程规划。具体功能：使用Deepseek的API，结合高德地图的MCP接口服务，实现对话智能生成符合要求的行程信息格式，对接我们的行程编辑界面，完整行程规划功能，极大程度便利了用户的旅行规划。  
7. **智能交通规划：** 给定起点位置和终点位置，智能生成交通安排并生成对应的消费条目。具体功能：结合高德地图的API接口服务，实现了根据推荐、最低票价、最少换乘等判断逻辑下的交通安排智能规划，并将输出结果集成到了我们的交通节点编辑模式，为用户提供了更加便捷的行程规划功能。  
8. **用户系统：** 注册/登录系统，用户组和权限系统。具体功能：我们提供了邮箱注册功能，微信快捷登录（H5应用不支持），邮箱-密码登录，邮箱-验证码登录功能进行用户身份验证。在梦·旅中登录、发帖、完成行程等可以获得经验，提升用户等级，不同用户等级在建立频道、群组、智能交通规划等功能上具有不同的权限。    
9. **其他功能：** 个人信息展示、查看他人的个人信息、各页面功能的介绍、浅色深色主题切换，下拉刷新，旅行足迹时间筛选，数据库自动备份，加载条设定，密码加盐等。  

## 应用目标：
本项目的名字叫做"梦·旅"，其寓意为“助你实现梦想中的旅程”。我们的核心任务就是帮助用户寻找志同道合的旅友，交流旅途中的所见所闻，记录行程中的点点滴滴。计算旅行中的各项费用和时间开销，帮助他们更好地规划行程并复盘旅行体验。为满足旅行需求群体对于旅行社交与行程规划记录的需求，我们计划未来持续维护项目，制定未来上线计划，争取将其做成一个实际可用的产品。

## 平台：
梦·旅目前支持微信小程序和H5应用双端。

## 技术架构
### 前端：
1. 小程序原生WXML（WeiXin Markup Language）：类似 HTML，用于定义页面结构，支持数据绑定（如 {{data}}）、条件渲染（如 wx:if）和列表渲染（如 wx:for）。  使用原因：开发需要。  
2. Typescript：JavaScript的超集，用于编写小程序逻辑，提供静态类型检查。  使用原因：提供类型检查，减少原生js的隐式类型转换。 
3. Less：CSS预处理器，支持变量、嵌套、混入等特性。使用原因：便于模块化调用CSS，减少冗余代码。  
4. Fly.js：封装wx.request，支持Promise的轻量级HTTP请求库；使用原因：便于集中处理HTTP请求的返回和错误调试，支持拦截器和wx.request，实现多端兼容。  
5. T-design组件库：用于前端开发。使用原因：美观、便捷。  
6. E-charts图表库：用于统计报告的可视化展示。使用原因：同上。  
7. 腾讯地图地图调起接口：实现旅行足迹的地图可视化。使用原因：功能需要。  
8. 微信http流式响应处理：用于智能行程规划功能的用户显示优化。使用原因：优化用户体验。  

### 后端：
1. Node.js：基于V8引擎，采用事件驱动、非阻塞式I/O的的模型，运行在服务端的JavaScript，构建高性能服务器。使用原因：便于js的后端开发。  
2. Express：Node.js的轻量级Web框架，构建RESTful API，支持路由、中间件和JSON数据处理。使用原因：其功能特性便于开发。  
3. SQLite3：嵌入式关系型数据库，支持SQL脚本初始化，持久化存储用户数据和地图相关记录。  
    使用原因：实现数据库持久化，支持拓展数据库自动备份功能。  
4. OAuth2.0授权、邮箱登录和JWT（JSON Web Token）的无感刷新：微信登录采用OAuth2.0的授权码方式获取用户openid进行用户管理；邮箱登录使用node-cache对验证码进行缓存并校验其合法性；JWT用于用户身份验证，生成加密令牌，包含用户数据和有效期，并定期刷新过期时间，实现无状态的会话保持。使用原因：身份验证重要技术。  
5. 中间件：全局身份验证，验证 API 请求中的 JWT 令牌；错误处理，捕获应用中的异常，返回统一错误响应；日志，记录 HTTP 请求和响应详情。使用原因：统一管理身份验证，捕获异常，日志输出，使开发更结构化，更加便捷调试、管理和拓展。  
6. 高德地图MCP服务：提供智能交通方案构建算法、智能行程规划方案构建算法。使用原因：结合高级算法，智能服务，便捷用户的使用。  
7. 腾讯云COS对象存储服务：实现（未来）大量数据的云存储。并开启极智压缩服务，减轻服务器带宽和图片加载时长  
8. axios：封装Promise的网络请求库，用于高德MCP服务的请求  
9. 采用控制层、业务层、持久层三层架构进行模块化开发，减少项目模块间耦合性  

### 开发与部署工具：
1. Git：分布式版本控制系统，用于代码管理和协作。使用原因：合理协作。  
2. Postman：API 测试工具，用于验证 RESTful API。使用原因：测试需要。  
3. Docker：容器化平台，打包应用及其依赖，构建镜像。使用原因：项目打包。  
4. ts-node：支持 TypeScript 开发后端逻辑。使用原因：支持ts。  
5. Shell脚本：实现服务端自动备份数据库和数据库恢复机制。使用原因：实现自动备份数据库。6.微信开发者工具：用于开发调试，展示前端界面效果。  

### 通信与安全：
1. HTTPS：使用SSL证书，实现小程序与后端的加密传输。使用原因：安全传输。  
2. CORS：实现跨域资源共享。使用原因：解决跨域问题。  
3. 参数化SQL：避免了直接的字符串拼接导致的SQL注入问题  
4. JWT（JSON Web Token）：运用 JWT 技术，其具有天然免疫 CSRF（跨站请求伪造）攻击的特性。由于 JWT 不会像传统的 Cookie 那样自动在请求中携带，而是需要开发者在请求中显式地包含。  
5. 密码哈希加盐存储：用户密码采用哈希 + 加盐的方式进行存储，避免了直接的密码暴露和彩虹表爆破风险  
6. 隐私数据脱敏：对响应数据中的隐私数据（邮箱、手机号等）统一拦截脱敏，保护用户隐私  
7. API密钥、小程序密钥等只在服务端进行持久化，避免密钥泄露
8. SMTP：邮箱登录采用SMTP协议，并使用验证码校验其是否为合法用户  

## 部署
### 前端部署（开发者适用）
下载源代码以后，进入根目录，进入`\Src\miniprogram\  `

在终端执行`npm i`或`npm install`（如报错则视情况安装新版node.js）生成node_modules依赖文件  

打开微信开发者工具，导入“项目根目录\Src”，进入项目后选择左上角-工具-构建npm，生成miniprogram_npm（小程序可解析的依赖包），后编译进入调试即可。  

### 后端部署（开发者适用）
在已经安装Docker的Linux服务器中，新建一个文件夹作为后端容器的持久化目录，比如`/home/dreamy-tour`，创建文件`dreamy-tour-config.json`并写入以下内容 
```json
{  
  "projectName": "梦·旅",  
  "appId": "微信小程序ID，在微信公众平台获得",  
  "appSecret": "微信小程序密钥，在微信公众平台获得",  
  "cosSecretId": "腾讯云COS服务ID",  
  "cosSecretKey": "腾讯云COS服务密钥",  
  "cosBucketName": "腾讯云COS服务Bucket名",  
  "cosRegion": "腾讯云COS服务地区",  
  "cosBaseUrl": "腾讯云COS服务默认链接",  
  "deepseekApiKey": "Deepseek API key",  
  "gaodeApiKey": "高德API key",  
  "email": "邮箱服务地址",    
  "emailPass": "邮箱服务密钥"  
}  
```
使用以下命令拉取并运行后端镜像：  
```sh
docker run \   
-d --name dreamy-tour 738ngx/dreamy-tour:latest \  
-p 1919:8080 \  
-v /home/dreamy-tour:/app/database  
```
`1919`可以改成其他想要映射的端口，配置防火墙放行策略后可以使用服务器域名:映射端口对后端api进行访问，可以使用Nginx配置反向代理来实现域名访问。  

`/home/dreamy-tour`需要改成之间建立的持久化目录的路径。  
