<template>
    <div class="home">
        <img class="home-logo" src="../../img/qc_logo.png"/>
        <div class="home-title"><a href="https://github.com/jermken/qc-cli" target="_blank">qc全家桶脚手架使用手册</a></div>
        <div class="home-main">
            <div class="home-desc">
                <div class="home-desc__title">集成</div>
                <div class="home-desc__info">qc集成对多个框架及打包工具的支持，免去多个脚手架的安装，针对技术选型选择合适的框架及构建工具</div>
            </div>
            <div class="home-desc">
                <div class="home-desc__title">易用</div>
                <div class="home-desc__info">脚手架使用简单，一键生成项目。项目构建灵活，针对熟悉的框架而配置</div>
            </div>
            <div class="home-desc">
                <div class="home-desc__title">扩展</div>
                <div class="home-desc__info">较好的扩展性，满足特定的配置，集成到工程化中，保证构建的灵活性。</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Home',
    data() {
        return {

        }
    }
}
</script>
<style lang="scss">
.home {
    font-size: 24px;
    &-logo {
        width: 160px;
        height: 160px;
        display: block;
        margin: 40px auto;
    }
    &-title {
        text-align: center;
        margin: 40px 0;
        a {
            color: yellowgreen;
            font-size: 22px;
        }
    }
    &-main {
        text-align: center;
    }
    .home-desc {
        margin-left: 40px;
        vertical-align: top;
        display: inline-block;
        width: 220px;
        &__title {
            color: yellowgreen;
            font-weight: bold;
            margin: 20px 0;
        }
        &__info {
            text-align: left;
            font-size: 16px;
        }
    }
}
</style>