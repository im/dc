<template>
    <div class="app">
        <img v-if="bg" :src="bg" class="bg" />
        <router-view></router-view>
        <!-- <Wallpaper v-if="!isLogin" v-model="wallpaperIndex" /> -->
        <Operation v-if="!isLogin" />
        <!-- <div v-if="!isLogin" class="handle remember" @click="routeLink(route.name === 'remember' ? 'write' : 'remember')">
            {{ route.name === 'remember' ? 'H': 'R' }}
        </div> -->
        <!-- <div v-if="!isLogin" class="handle route" @click="routeLink(route.name === 'add' ? 'write' : 'add')">
            {{ route.name === 'add' ? 'H': 'A' }}
        </div> -->
        <div class="date">{{ date }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed,watchEffect, onMounted } from 'vue'
import Wallpaper from './components/Wallpaper.vue'
import Operation from './components/Operation.vue'
import { useRouter, useRoute, } from 'vue-router'
import { getAssetsBg, storageGet, storageSet, format } from './utils'
import client, { q } from './db'

const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))

const index = Number(storageGet('wallpaper') || 0)

const wallpaperIndex = ref(index)
const router = useRouter()
const route = useRoute()

const routeLink = (name: string) => {
    router.push({
        name
    })
}

watchEffect(() => {
    storageSet('wallpaper', wallpaperIndex.value)
})

const isLogin = computed(() => route.name === 'login')

const bg = computed(() => getAssetsBg(wallpaperIndex.value))

onMounted(() => {
    // client.query(
    //     q.ToDate('2018-06-06')
    // )
    //     .then(function (res) { console.log('Result:', res) })
    //     .catch(function (err) { console.log('Error:', err) })

    // fetch(`https://langeasy.com.cn/loadLexisList.action?strict=1&word=hello`).then(res => {
    //     return res.json()

    // }).then(res => {
    //     console.log('res: ', res)

    // })
})

</script>

<style lang="stylus">
// @font-face {
//     font-family:'RubikMoonrocks' ;
//     src: url('./assets/fonts/RubikMoonrocks.ttf');
// }
@font-face {
    font-family:'FredokaOne' ;
    src: url('./assets/fonts/FredokaOne.ttf');
}
#app, .app
    font-family RubikMoonrocks, FredokaOne, Monaco, PT Serif, Serif, Avenir, Helvetica, Arial, sans-serif!important
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    width 100vw
    height 100vh
    position relative
    overflow hidden
.app
    .bg
        width 100%
        height 100%
        position absolute
        left 0
        top 0
        filter blur(20px)
        background #ccc
        z-index -1
        object-fit cover
    .date
        position absolute
        top 5px
        right 5px
        z-index 1
*
    margin 0
    padding 0
    box-sizing: border-box;
ul,li
    list-style none
.handle
    position fixed
    right -1px
    bottom 20px
    padding 5px
    background #fff
    cursor pointer
    transition: 0.2s;
    border-bottom-left-radius 3px
    border-top-left-radius 3px
    z-index 3
    box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16);
    &:hover
        color #409eff
.route
    bottom 80px
    z-index 0
.remember
    bottom 120px
    z-index 0
.fade-enter-active,.fade-leave-active
    transform opacity 0.5s ease

.fade-enter-from,.fade-leave-to
    opacity 0
.success
    color #67c23a
.error
    color #f56c6c

// 滚动条
::-webkit-scrollbar
    width:0px;
    height:0px;
</style>
