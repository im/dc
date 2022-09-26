import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Write from './pages/Write.vue'
import Add from './pages/Add.vue'
import Login from './pages/Login.vue'
import Remember from './pages/Remember.vue'
import MD5 from 'crypto-js/md5'
import { storageGet, storageSet } from './utils'

const hashMap:any = {
    'c6638f528df929698ade4cb86dc19b04': true,
    'e6272e71eecac9505731fb3b0faf2176': true,
    'b6c191fff6b83348baa79d20d297ae40': true
}

const isLogin = () => {
    const cipher = storageGet('cipher') || ''
    const hash: string = MD5(cipher).toString()
    return hashMap[hash]
}

const routes = [
    {
        name: 'write',
        path: '/:page?',
        component: Write
    },
    {
        name: 'add',
        path: '/add',
        component: Add
    },
    {
        name: 'remember',
        path: '/remember',
        component: Remember
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach(( { name }, from, next) => {
    if (!isLogin()) {
        if (name === 'login') {
            return next()
        }
        return next({
            name: 'login'
        })
    } else {
        if (name === 'login') {
            return next({
                name: 'write'
            })
        }
    }
    next()
})

export default router