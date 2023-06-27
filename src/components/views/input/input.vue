<!--
* Input
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-26 20:29:03
* @since 0.0.0
-->

<template>
    <div class="input-box">
        <textarea v-model.trim="texts" :disabled="loading" rows="40"></textarea>
        <button :disabled="loading" @click="handleClick">SUBMIT</button>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, transform, storageSet, storageGet } from '@/utils'

// https://www.cnblogs.com/xujinzhong/p/13489238.html
import { useWordsStore } from '@/stores/words'

const wordsStore = useWordsStore()
const loading = ref(false)
const texts = ref('')
const route = useRoute()
const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))

// const arr = []
// $('.table-wrapper').each((index,wrap) => {
//      const trs = $(wrap).find('table tr')
//      trs.each((i, tr) => {
//         const  text = $(tr).find('td').eq(1).text().trim()
//         arr.push(text)
//      })
// })
// console.log(arr.join(','))

const getWord = async (word: string) => {
    return fetch(`https://langeasy.com.cn/loadLexisList.action?strict=1&word=${word}`).then(res => {
        return res.json()
    }).then(res => {
        return res.wordlist[0] || null
    })
}

const getSyllables = async (word: string) => {
    return fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=5995bbce-03fd-4ef5-b686-1b39539ed434`).then(res => {
        return res.json()
    }).then(data => {
        if (data[0] && data[0].hwi && data[0].hwi.hw) {
            const hw = data[0].hwi.hw || ''
            return hw.replace(/\*/g, '.')
        } else {
            return ''
        }
    })
}

const addWord = async (word, callback) => {

    const wordInfo = await getWord(word)

    if (!wordInfo) {
        return
    }
    const syllables = await getSyllables(word)

    wordInfo.date = date.value
    wordInfo.syllables = syllables

    try {
        await wordsStore.save(wordInfo)
    } catch (err) {
        console.log(err)
    }
}

const run = async () => {

    const arr = texts.value.split(',')
    let timer = null
    loading.value = true

    timer = setInterval(async () => {
        if (arr.length) {
            await addWord(arr.shift())
            storageSet('word-input', arr.join(','))
            texts.value = arr.join(',')
            console.log(arr.length)
        } else {
            clearInterval(timer)
            loading.value = false
        }
    }, 3000)

}

const handleClick = () => {
    if (texts.value && texts.value.length) {
        storageSet('word-input', texts.value)
        run()
    }

}

onMounted(() => {
    texts.value = storageGet('word-input')
})
</script>

<style src="./input.styl" lang="stylus" scoped></style>
