<!--
* List
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-27 09:53:24
* @since 0.0.0
-->

<template>
        <div>
            <a v-for="item in list" :key="item.word" :title="item.interpret + (wordMap[item.word] ? wordMap[item.word].date : '')" href="javascript:;" :class="{ active: wordMap[item.word] }" @click="handleClick(item)">{{ item.word }}</a>
        </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, transform, storageSet, storageGet } from '@/utils'

import { useWordsStore } from '@/stores/words'

const wordsStore = useWordsStore()
const loading = ref(false)
const route = useRoute()
const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const wordMap = computed(() => {
    return words.value.reduce((acc:any,cur:any) => {
        acc[cur.word] = cur
        return acc
    },{})
})
const words:any = ref([])
const list:any = ref([])

const getWords = async () => {
    return fetch(`/dc/data.json`).then(res => {
        return res.json()
    }).then(obj => {
        list.value = Object.keys(obj).map(key => {
            return obj[key]
        })
    })
}

const deleteWord = async (word:any) => {
    await wordsStore.del(word.id)
}

const updateWords = async () => {
    words.value = await wordsStore.get()
    // @ts-ignore
    window.words = words.value
}

const handleClick = async (item:any) => {
    const current = wordMap.value[item.word]
    if (current) {
        await deleteWord(current)
    } else {
        await wordsStore.save({
            ...item,
            date: date.value
        })
    }
    updateWords()
}

onMounted(() => {
    getWords()
    updateWords()
})

</script>

<style src="./list.styl" lang="stylus" scoped></style>
