<template>
     <div class="remember-box">
        <div>
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in remember"
                    :key="index"
                    size="large"
                    color="#909399"
                    placement="top"
                    :timestamp="item.date">
                    <ul class="word-list">
                        <li v-for="(word, index) in item.words" :key="word + index" @click="handleClick(word)">{{ word }}</li>
                    </ul>
                </el-timeline-item>
            </el-timeline>
        </div>
     </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storageGet, storageSet } from '../utils'

const remember:any = ref([])

const getRemember = () => {
    const rememberMap = storageGet('remember') || {}
    const dates = Object.keys(rememberMap).sort((a,b) => new Date(b).getTime() - new Date(a).getTime())
    remember.value = dates.map((date:string) => {
        return {
            date,
            words: rememberMap[date]
        }
    }).filter((v:any) => v.words.length)
}

const handleClick = (word:any) => {
    const rememberMap = storageGet('remember') || {}
    Object.keys(rememberMap).forEach(key => {
        const words = rememberMap[key]
        rememberMap[key] = words.filter((v:any) => v !== word)
    })
    storageSet('remember',rememberMap)
    getRemember()
}

onMounted(() => {
    getRemember()
})

</script>

<style lang="stylus">
.remember-box
    display flex
    justify-content center
    height 80vh
    overflow-y auto
    margin 10vh auto
    font-family FredokaOne
    & > div
        max-width 800px
    .word-list
        display flex
        li
            margin 5px
            cursor pointer
            transition: 0.2s;
            &:hover
                color #409eff
    .el-timeline-item__tail
        border-color #909399
</style>
