import {createRouter, createWebHistory} from 'vue-router'
import Chat from "@/views/Chat.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/',
            name: 'chat',
            component: Chat,
        },
    ],
})

router.beforeEach((to, from, next) => {
    let token = window.sessionStorage.getItem('x-token')
    if (!token && to.path !== '/login') {
        next({path: '/login'})
        return
    }
    if ((token && to.path === '/login') || !to.matched.length) {
        next({path: '/'})
        return
    }
    next()
})

export default router
