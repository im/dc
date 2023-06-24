import { createRouter, createWebHashHistory } from 'vue-router'
import MD5 from 'crypto-js/md5'
import { storageGet } from '@/utils'

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
    { name: 'coding', path: '/', component: () => import('@/components/views/coding') },
    { name: 'login', path: '/login', component: () => import('@/components/views/login') }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
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
                name: 'coding'
            })
        }
    }
    next()
})
export default router