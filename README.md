# qc-cli
this is a cli for front-end project
## 脚手架安装
npm install @jermken/qc-cli -g
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

* 项目下的config.js 文件中 lib 和 packer 字段不可修改
```
{
    "lib": "vue", // lib字段不可修改
    "packer": "parcel", // packer字段不可修改
    "openPage": "index" // 在开发环境下运行 qc dev 打开的页面
}
```

* vue-ts项目中类型为了避免ide报错需要将类型声明文件放在src目录下，且declare module 与 declare global 模块需放在单独的文件中如下：
```
    -src
        -vue-shims.m.ts // 放置模块声明
        -vue-shims.g.ts // 放置全局声明
```

* 自定义配置在config.js文件中，分为 dev和prod 模式，其中配置项根据使用的打包工具而定，使用webpack构建的需要按照webpack的配置格式，
  使用parcel构建的需要按照parcel的配置格式

* 可使用silent模式来去掉构建时的日志打印，eg:
```
qc dev --silent true
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