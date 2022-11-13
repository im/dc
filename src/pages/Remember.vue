<template>
     <div class="remember-box">
        <div>
            <el-timeline>
                <el-timeline-item
                    v-for="(item, index) in remembers"
                    :key="index"
                    size="large"
                    color="#909399"
                    placement="top"
                    :timestamp="item.date">
                    <ul class="word-list">
                        <li v-for="(word, index) in item.words" :key="word + index" @click="handleClick(word)">{{ word.word }}</li>
                    </ul>
                </el-timeline-item>
            </el-timeline>
        </div>
     </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import client, { q } from '../db'
import { useRoute } from 'vue-router'
import { storageGet, storageSet, format, transform } from '../utils'

const route = useRoute()

const date = computed(() => route.params.date)

const remembers:any = ref([])

const getRemember = async () => {
    let res:any = null
    if (date.value) {
        res = await client.query( q.Map(q.Paginate(q.Match(q.Index('remember_list'), date.value)), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
    } else {
        res = await client.query( q.Map(q.Paginate(q.Match(q.Index('all_remember_list'))), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
    }

    const map:any = {}
    const data = (res.data || []).map((item:any) => {
        item.data.id = item.ref.value.id
        if (map[item.data.date]) {
            map[item.data.date].push(item.data)
        } else {
            map[item.data.date] = [item.data]
        }
    })
    const arr:any = []

    Object.keys(map).forEach((key:any) => {
        arr.push({
            date: key,
            words: map[key]
        })
    })

    remembers.value = arr
}

const handleClick = async (item:any) => {
    const res = await client.query(q.Delete(q.Ref(q.Collection('rememberList'), item.id)))


    remembers.value = remembers.value.map((v: any) => {
        v.words = v.words.filter((wordItem:any) => wordItem.id !== item.id)
        return v
    }).filter((r:any) => r.words.length)


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
