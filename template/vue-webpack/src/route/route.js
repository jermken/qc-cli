import VueRouter from 'vue-router'

const Home = () => import(/* webpackChunkName: "homePage" */ '../pages/home/home.vue')

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: Home }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router