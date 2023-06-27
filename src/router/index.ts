import { createRouter, createWebHashHistory } from 'vue-router'
import MD5 from 'crypto-js/md5'
import { storageGet } from '@/utils'

import SaveView from '@/components/views/save'
import LoginView from '@/components/views/login'
import CodingView from '@/components/views/coding'
import InputView from '@/components/views/input'
import ListView from '@/components/views/list'

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
    { name: 'save', path: '/save/:date?', component: SaveView },
    { name: 'login', path: '/login', component: LoginView },
    { name: 'input', path: '/input/:date?', component: InputView },
    { name: 'list', path: '/list/:date?', component: ListView },
    { name: 'coding', path: '/:date?', component: CodingView },
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