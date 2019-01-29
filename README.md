# 励志班个人信息采集简单页面

图片存储在七牛云服务器上，调用了七牛云服务上的go api，前端部分直接是应用七牛js api上传图片到七牛后台。

使用beego创建api，计算七牛上传所需要用到的Token。

部署时直接使用docker，生成docker仓库，在服务器上直接运行这个docker镜像。

在生成容器时先需要使用godep工具将依赖打包

```bash
dodep save
docker build -t lizhi .
```

部署服务器时配置好nginx则可。