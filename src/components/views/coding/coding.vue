<!--
* Coding
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-24 11:44:03
* @since 0.0.0
-->

<template>
    <div class="coding">
        <div class="container">
            <div class="write-wrap">
                <div class="write-box">
                    <div v-if="words.length">
                        <div class="row" :class="{ review: isReview }">
                            <div v-for="(w, i) in textArray" :key="w + i" :class="{ dot: isDot(w) }" class="word">
                                {{ isDot(w) ? '' : w }}
                            </div>
                            <div class="cursor hide"></div>
                        </div>
                        <div class="row">
                            <div v-for="(w, i) in wordArray" :key="w + i" :class="{ dot: isDot(w), [codeClass[i]]: true }"
                                class="word">
                                {{ isDot(w) ? '' : w }}
                            </div>
                            <div class="cursor"></div>
                        </div>
                        <input ref="inputRef" v-model="value" type="text" class="input" @keydown="handleKey" @blur="blur"
                            @input="changeValue" />
                    </div>

                </div>
                <div class="write-box">
                    <div v-if="words.length">
                        <div v-if="ukpron" :class="{ review: isReview }" class="ukpron">/{{ ukpron }}/ <span v-if="isVoice"
                                class="voice">V</span></div>
                        <div class="interprets" :class="{ review: isView }">
                            <div v-for="interpret in interprets" :key="interpret">
                                {{ interpret }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="total" class="count">{{ currentIndex + 1 }} / {{ total }}</div>
            </div>
        </div>
        <Operate />
    </div>
</template>

<script lang="ts" setup>

import { onMounted, defineComponent, nextTick, computed, watchEffect, watch, ref, pushScopeId } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWordsStore, useConfigStore } from '@/stores/words'
import Operate from '@/components/tags/operate'
import { storageGet, storageSet, format, transform } from '@/utils'

const route = useRoute()

const wordsStore = useWordsStore()
const configStore = useConfigStore()
const words = ref([])
const currentIndex = ref(0)

const syllables = computed(() => configStore.config.syllables)
const isReview = computed(() => configStore.config.review)
const isVoice = computed(() => configStore.config.voice)
const isView = computed(() => configStore.config.view)
const value = ref('')

const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))
const name: any = computed(() => (route.query.name || ''))

const currentWord: any = computed(() => words.value[currentIndex.value] || {})
const total: any = computed(() => words.value.length || 0)
const word = computed(() => {
    const w = currentWord.value.word || ''
    if (syllables.value && w) {
        return currentWord.value.syllables || w || ''
    }
    return w || ''
})

const textArray = computed(() => {
    return [...word.value]
})
const wordArray = computed(() => [...value.value])
const ukpron = computed(() => currentWord.value.uk_pron || '')
const interprets = computed(() => (currentWord.value.interpret || '').split(/\r?\n/))
const inputRef = ref<HTMLInputElement | null | any>(null)

const codeClass = computed(() => {
    const arr: any = []
    textArray.value.forEach((item: string, index: number) => {
        if ((wordArray.value[index] || '').toLocaleLowerCase() === (item || '').toLocaleLowerCase()) {
            arr.push('success')
        } else {
            arr.push('error')
        }
    })
    return arr
})

const isSuccess = computed(() => {
    const successLen = codeClass.value.filter((v: any) => v === 'success').length
    const textArrayLen = textArray.value.length
    const wordArrayLen = wordArray.value.length
    return successLen === textArrayLen && textArrayLen === wordArrayLen
})

const getCurrentIndex = (index: any) => {
    const len = words.value.length
    if (!len) {
        return 0
    }
    if (index > len - 1) {
        return 0
    }

    if (index < 0) {
        return len - 1
    }
    return index
}

const play = () => {
    if (!isVoice.value) return
    const w = currentWord.value.word
    if (w) {
        const url = `https://audio2.beingfine.cn/speeches/UK/UK-speech/${currentWord.value.word}.mp3`
        const mp3 = new Audio(url)
        mp3.play()
        document.title = w + ` - ${interprets.value[0]} - /${ukpron.value}/`
    } else {
        document.title = 'Words'
    }
}

const log = () => {
    if (!isReview.value) {
        console.log(
            `%c${word.value}`,
            'font-size:16px;font-weight:bold'
        )
        ukpron.value && console.log(`%c/${ukpron.value}/`, 'font-size:12px')
    }
    interprets.value[0] &&
        console.log(`%c${interprets.value[0]}`, 'font-size:12px')
}

const next = () => {
    if (isReview.value) {
        play()
    }
    const current = currentIndex.value
    const index = current + 1
    currentIndex.value = getCurrentIndex(index)
    value.value = ''
    log()
    if (!isReview.value) {
        play()
    }
}

const prev = () => {
    if (isReview.value) {
        play()
    }
    const current = currentIndex.value
    const index = current - 1
    currentIndex.value = getCurrentIndex(index)
    value.value = ''
    log()
    if (!isReview.value) {
        play()
    }
}

const blur = () => {
    focus()
}

const focus = async () => {
    await nextTick()
    inputRef.value?.focus()
}

const isDot = (v: any) => {
    return ~v.indexOf('.')
}

const changeValue = (e: any) => {
    const { data } = e
    const index = codeClass.value.lastIndexOf('success')
    const target = textArray.value[index + 1]
    if (syllables.value && target && data) {
        if (isDot(target)) {
            value.value = value.value + '.'
        }
    }
}

const getWords = async () => {
    const list = await wordsStore.get()
    words.value = list.filter((v:any) => v.date === date.value)
    focus()
}

const rememberNext = () => {

    if (isReview.value) {
        play()
    }

    words.value = words.value.filter((v:any) => v.word !== currentWord.value.word)

    const current = currentIndex.value
    const index = current + 1
    currentIndex.value = getCurrentIndex(index)
    value.value = ''

    log()

    if (!isReview.value) {
        play()
    }

}

const handleKey = async (e:any) => {
    const code = e.keyCode

    if (code === 9) {
        return
    }

    if (code === 189 || code === 187) {
        e.returnValue = false
        return false
    }

    if (code === 13) {
        if (isSuccess.value) {
            rememberNext()
        }
    }

    if (code === 32) {
        isSuccess.value && next()
    }

    if (code === 39) {
        next()
    }
    if (code === 37) {
        prev()
    }

    if (wordArray.value.length >= textArray.value.length && code !== 8) {
        e.returnValue = false
        return false
    }
    if (code === 8) {
        value.value = ''
        return
    }
    e.returnValue = (code >= 65 && code <= 90)
}

watch(() => route.params.date, async () => {
    // await getRemember()

    await getWords()
})

watchEffect(async () => {
    // await getRemember()
    await getWords()
})

onMounted(async () => {
    await getWords()
})
</script>

<style src="./coding.styl" lang="stylus" scoped></style>
