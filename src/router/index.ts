import { createRouter, createWebHashHistory } from 'vue-router'

let router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/pills'
        },
        {
            path: '/pills',
            component: () => import('@/views/PillsView.vue'),
            name: 'pills'
        },
        {
            path: '/setting',
            component: () => import('@/views/SettingView.vue'),
            name: 'setting'
        },
    ]
})

export default router