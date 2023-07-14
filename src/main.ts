import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import router from './router'
import '@/styles/index.scss'
import App from './App.vue'

createApp(App).use(router).use(ElementPlus, { locale: zhCn }).mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))
