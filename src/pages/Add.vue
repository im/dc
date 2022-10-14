<script setup lang="ts">

import axios from 'axios'
import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'
import { format, transform } from '../utils'
import { useRoute } from 'vue-router'
import client, { q } from '../db'

const route = useRoute()
const word = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null | any>(null)
const disabled = computed(() => !word.value.length)
const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const wordList:any = ref([])
const add = () => {
    if (word.value.length) {
        addWord()
    }
}

const blur = () => {
    focus()
}

const focus = async () => {
    await nextTick()
    inputRef.value?.input.focus()
}

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

const getWords = async () => {

    const res:any = await client.query( q.Map(q.Paginate(q.Match(q.Index('word_list'), date.value)), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
    const data = (res.data || []).map((item:any) => {
        return {
            ...item.data,
            id: item.ref.value.id
        }
    })
    wordList.value = data
}

const deleteWord = async (item:any) => {
    const res = await client.query(q.Delete(q.Ref(q.Collection('wordList'), item.id)))
    getWords()
}

const addWord = async () => {
    loading.value = true

    const wordInfo = await getWord(word.value)
    if (!wordInfo) return
    const syllables = await getSyllables(word.value)
    wordInfo.date = date.value
    wordInfo.syllables = syllables

    const uuid = transform(wordInfo.word, format(date.value, 'YYYYmmdd') as any)
    client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('wordList'), uuid)),
            q.Update(
                q.Ref(q.Collection('wordList'), uuid),
                {
                    data: wordInfo,
                },
            ),
            q.Create(
                q.Ref(q.Collection('wordList'), uuid),
                {
                    data: wordInfo,
                },
            )
        )
    )
        .then((ret) => {
            word.value = ''
            loading.value = false
            getWords()
        })
        .catch((err) => {
            console.error(
                'Error: [%s] %s: %s',
                err.name,
                err.message,
                err.errors()[0].description,
            )
            alert(err.message)
            word.value = ''
            loading.value = false
        })
}
onMounted(() => {
    getWords()
    focus()
})
</script>

<template>
    <div class="add-wrap">
        <div class="add-box">
            <el-input ref="inputRef" v-model.trim="word" :disabled="loading" :autofocus="true" type="text" size="large" @blur="blur" @keyup.enter="add"></el-input>
            <el-button :loading="loading" :disabled="disabled" size="large" plain @click="add">SUBMIT</el-button>
        </div>
        <div class="word-list">
            <div v-for="item in wordList" :key="item.word" class="item" @click="deleteWord(item)">{{ item.word }}</div>
        </div>
    </div>
</template>

<style lang="stylus">
.add-wrap
    width 100%
    height 100%
    display flex
    padding-top 200px
    font-family FredokaOne
.add-box
    margin  0 auto
    text-align center
    .el-button
        border-radius 0
        font-weight bold
        height 40px
        line-height 40px
        font-family FredokaOne
    .el-input__wrapper
        width 100%
        border-radius 0!important
        background rgba(64,158,255,0.2)
        border 0!important
        box-shadow none
        padding 5px 10px
        height 50px
    .el-input__inner
        font-weight bold
        border-radius 0
        font-size 24px
        font-family FredokaOne
    .el-input
        margin-bottom 10px
        width 300px
        display block
.word-list
    height: 100%
    overflow-y: auto
    .item
        cursor pointer
</style>
