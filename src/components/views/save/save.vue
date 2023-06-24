<!--
* Save
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-24 11:45:39
* @since 0.0.0
-->

<template>
    <div class="add-wrap">
        <div class="add-box">
            <input ref="inputRef" v-model.trim="word" :disabled="loading" :placeholder="placeholder" :autofocus="true" type="text" @blur="blur" @keyup.enter="add" />
            <button :disabled="loading" @click="add">SUBMIT</button>
            <div v-if="details.syllables" class="title">{{ details.syllables }}</div>
            <div class="interprets">
                <div
                    v-for="interpret in interprets"
                    :key="interpret">
                    {{ interpret }}
                </div>
            </div>
            <div v-if="details.uk_pron">/{{ details.uk_pron }}/</div>
        </div>
        <div class="word-list">
            <div v-for="item in wordList" :key="item.word" title="点击删除" class="item" @click="deleteWord(item)">{{ item.word }} - {{ item.date }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { format, transform, storageSet } from '@/utils'
import { useWordsStore } from '@/stores/words'

const wordsStore = useWordsStore()

const route = useRoute()
const word = ref('')
const details:any = ref({})
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null | any>(null)
const disabled = computed(() => !word.value.length)
const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const placeholder: any = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const interprets = computed(() => ( details.value.interpret || '').split(/\r?\n/))
const wordList:any = ref([])

const blur = () => {
    focus()
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

const focus = async () => {
    await nextTick()
    inputRef.value?.focus()
}

const add = () => {
    if (word.value.length) {
        addWord()
    }
}

const deleteWord = async (word:any) => {
    await wordsStore.del(word.id)
    getWords()
}

const getWords = async () => {

    wordList.value = await wordsStore.get()

}

const addWord = async () => {
    loading.value = true

    const wordInfo = await getWord(word.value)

    if (!wordInfo) {
        loading.value = false
        details.value = {}
        details.value = {
            syllables: '没有数据'
        }
        focus()
        return
    }

    const syllables = await getSyllables(word.value)

    wordInfo.date = date.value
    wordInfo.syllables = syllables

    try {
        await wordsStore.save(wordInfo)
        word.value = ''
        loading.value = false
        details.value = wordInfo
        focus()
        getWords()
    } catch (err) {
        alert(err)
        word.value = ''
        loading.value = false
        details.value = {}
        focus()
        getWords()
    }
}

onMounted(() => {
    getWords()
    focus()
})
</script>

<style src="./save.styl" lang="stylus" scoped></style>
