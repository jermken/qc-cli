# qc-cli
this is a cli for front-end project
## 脚手架安装
npm install qc-cli -g
## 项目创建

```
qc create
```
run qc create and then you will complete a series of configurations according to your needs

## 命令
* 测试环境构建
```
qc dev
```
* 生产环境构建
```
qc build
```
## 注意

* 项目下的qc.config.json 文件中 lib 和 packer 字段不可修改
```
{
    "lib": "vue", // lib字段不可修改
    "packer": "parcel", // packer字段不可修改
    "openPage": "index" // 在开发环境下运行 qc dev 打开的页面
}
```
## 问题
* 遇到了一个webpack打包懒加载的问题
```
module parse failed: Unexpected token
you may need an appropriate loader to handle this file type.
|
| var Home = function Home() {
>   return import('../pages/home/home.vue')
|}
```
通过[https://github.com/webpack/webpack/issues/8656](https://github.com/webpack/webpack/issues/8656)找到解决的方案：
```
npm install acorn --save-dev
```