<template>
     <div v-click-outside="onClickOutside" class="operation" :class="{ open: open }">
        <div class="page">
            <div :class="{ loading }" @click="prevPage">
                -
                PREV
            </div>
            <div :class="{ loading }" @click="nextPage">
            +
                NEXT
            </div>
        </div>
        <Switch v-model="store.config.voice" code="1" label="Voice"></Switch>
        <Switch v-model="store.config.syllables" code="2" label="Syllables"></Switch>
        <Switch v-model="store.config.review" code="3" label="Review"></Switch>
        <Switch v-model="store.config.view" code="4" label="View"></Switch>
        <div class="reload" @click="routerLink">
            {{ routerText }}
            <div class="bg"></div>
        </div>
        <div class="reload" @click="add">
            Add
            <div class="bg"></div>
        </div>
        <div class="reload" @click="reload">
            Reload
            <div class="bg"></div>
        </div>
        <div class="reload" @click="all">
            All
            <div class="bg"></div>
        </div>
        <div class="reload" @click="$router.push({name: 'overview'})">
            Overview
            <div class="bg"></div>
        </div>
        <div class="handle" @click="handle">
            {{ open ? 'OFF': 'ON' }}
        </div>
     </div>
</template>

<script setup lang="ts">
import { ClickOutside as vClickOutside } from 'element-plus'
import { ref, defineEmits, onMounted,computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../store'
import Switch from './Switch.vue'
import { storageGet, storageSet, format } from '../utils'

const store = useStore()

const open = ref(false)
const router = useRouter()
const route = useRoute()
const loading = computed(() => store.wordLoading)
const date: any = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const size = computed(() => (route.query.size ? +route.query.size : 0) || 64)
const isRemember = computed(() => route.name === 'remember')

const routerText = computed(() => isRemember.value ? 'Write' : 'Remember' )

const nextPage = () => {
    const calc = new Date(date.value).getTime() + (1000 * 60 * 60 * 24)
    const cur = format(new Date(calc), 'YYYY-mm-dd')

    router.push({
        name: route.name as string,
        params: {
            date: cur
        }
    })
}

const prevPage = () => {
    const calc = new Date(date.value).getTime() - ( 1000 * 60 * 60 * 24)
    const cur = format(new Date(calc), 'YYYY-mm-dd')

    router.push({
        name: route.name as string,
        params: {
            date: cur
        }
    })
}

const handle = () => {
    open.value = !open.value
}
const onClickOutside = () => {
    open.value = false
}

const routerLink = () => {
    router.push({
        name: isRemember.value ? 'write' : 'remember',
        params: {
            date: date.value
        }
    })

}

const add = () => {
    router.push({
        name: 'add',
        params: {
            date: date.value
        }
    })
}

const reload = () => {
    store.reload(route.params.date || 'all', size.value)
}

const all = () => {
    store.reload(route.params.date || 'all', 1000)
}

onMounted(() => {
    document.addEventListener('keyup', (e) => {
        const code = e.keyCode
        if (code === 9) {
            handle()
        }
        if (code === 49) {
            store.config.voice = !store.config.voice
        }
        if (code === 50) {
            store.config.syllables = !store.config.syllables
        }

        if (code === 51) {
            store.config.review = !store.config.review
        }

        if (code === 52) {
            store.config.view = !store.config.view
        }
        if (code === 189) {
            prevPage()
        }
        if (code === 187) {
            nextPage()
        }
    })
})

</script>

<style lang="stylus">
.operation
    height 100vh
    width 200px
    position fixed
    background #fff
    left -200px
    top 0
    transition: 0.2s;
    z-index 1
    overflow-y auto
    // visibility:  hidden
    .reload
        height 50px
        line-height 50px
        text-align center
        cursor pointer
        position relative
        overflow hidden
        margin-bottom 10px
        .bg
            background: #409eff;
            filter: blur(20px);
    .page
        display flex
        align-items center
        height 50px
        line-height 50px
        position absolute
        bottom 0
        left 0
        width 100%
        background rgba(64, 158, 255, 0.2)
        div
            width 50%
            text-align center
            cursor pointer
            transition: 0.2s;
            &.disabled
                cursor: not-allowed;
                background #f4f4f5
                color #c8c9cc
                pointer-events: none;
                &:hover
                    cursor: not-allowed;
                    background #f4f4f5
                    color #c8c9cc
            &:hover
                color #fff
                background rgba(64, 158, 255, 0.8)
    .handle
        left -1000px
        right auto
        bottom 100px
        border-bottom-left-radius 0px
        border-top-left-radius 0px
        border-bottom-right-radius 3px
        border-top-right-radius 3px
    &.open
        left 0
        box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16);
</style>
