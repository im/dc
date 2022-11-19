<template>
     <div class="remember-box">
        <div>
            <ul class="word-list">
                        <li v-for="(word, index) in remembers" :key="word + index" @click="handleClick(word)">{{ word.word }}</li>
                    </ul>
        </div>
     </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import client, { q } from '../db'
import { useRoute } from 'vue-router'
import { storageGet, storageSet, format, transform } from '../utils'

const route = useRoute()

const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))

const remembers:any = ref([])

const getRemember = async () => {
    const data = storageGet(date.value) || []
    remembers.value = data
}

const handleClick = async (item:any) => {
    remembers.value = remembers.value.filter((wordItem:any) => wordItem.id !== item.id)
    storageSet(date.value, remembers.value)
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
        flex-wrap wrap
        li
            margin 5px
            cursor pointer
            transition: 0.2s;
            &:hover
                color #409eff
    .el-timeline-item__tail
        border-color #909399
</style>
