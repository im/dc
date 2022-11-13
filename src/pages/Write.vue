<script setup lang="ts">

import { onMounted, defineComponent, nextTick, computed, watchEffect, watch, ref, pushScopeId } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '../store'
import { storageGet, storageSet, format, transform } from '../utils'
import client, { q } from '../db'

const store = useStore()
const route = useRoute()
const router = useRouter()

const words = ref([])
const currentIndex = ref(0)
const value = ref('')

const loading = ref(true)
const remembers:any = ref([])
const voice = computed(() => store.config.voice)
const syllables = computed(() => store.config.syllables)
const review = computed(() => store.config.review)
const view = computed(() => store.config.view)

const date = computed(() => route.params.date || format(new Date(), 'YYYY-mm-dd'))

const currentWord: any = computed(() => words.value[currentIndex.value] || {})
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
const interprets = computed(() => ( currentWord.value.interpret || '').split(/\r?\n/))
const inputRef = ref<HTMLInputElement | null | any>(null)

const filterWords = (words:any = []) => {
    const arr = remembers.value.map((v:any) => v.word)
    return (words || []).filter((v:any) => !arr.includes( v.word as never ))
}

const getWords = async () => {
    loading.value = true

    const res:any = await client.query( q.Map(q.Paginate(q.Match(q.Index('word_list'), date.value)), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
    const data = (res.data || []).map((item:any) => {
        return {
            ...item.data,
            id: item.ref.value.id
        }
    })

    words.value = filterWords(data)

    loading.value = false

    focus()

}

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
    if (!store.config.voice) return
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
    // console.clear()
    if (!review.value) {
        console.log(
            `%c${word.value}`,
            'font-size:16px;font-weight:bold'
        )
        ukpron.value && console.log(`%c/${ukpron.value}/`, 'font-size:12px')
    }
    interprets.value[0] &&
            console.log(`%c${interprets.value[0]}`, 'font-size:12px')
}

const next = (isRemember = false) => {
    if (store.config.review) {
        play()
    }
    if (!isRemember) {
        const current = currentIndex.value
        const index = current + 1
        currentIndex.value = getCurrentIndex(index)
    }
    value.value = ''
    log()
    if (!store.config.review) {
        play()
    }
}

const prev = () => {
    const current = currentIndex.value
    const index = current - 1
    currentIndex.value = getCurrentIndex(index)
    value.value = ''
    log()
}

const getRemember = async () => {
    const res:any = await client.query( q.Map(q.Paginate(q.Match(q.Index('remember_list'), date.value)), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
    const data = (res.data || []).map((item:any) => {
        return {
            ...item.data,
            id: item.ref.value.id
        }
    })
    remembers.value = data
}

const setRemember = () => {
    const word = currentWord.value.word
    const uuid = transform(word, format(date.value, 'YYYYmmdd') as any)
    client.query(
        q.If(
            q.Exists(q.Ref(q.Collection('rememberList'), uuid)),
            q.Update(
                q.Ref(q.Collection('rememberList'), uuid),
                {
                    data: {
                        word,
                        date: date.value
                    },
                },
            ),
            q.Create(
                q.Ref(q.Collection('rememberList'), uuid),
                {
                    data: {
                        word,
                        date: date.value
                    },
                },
            )
        )
    )
        .then(async (res:any) => {
            await getRemember()

            words.value = filterWords(words.value)
        })
        .catch((err) => {
            console.error(
                'Error: [%s] %s: %s',
                err.name,
                err.message,
                err.errors()[0].description,
            )
            alert(err.message)
        })
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

const handleKey = (e:any) => {
    const code = e.keyCode

    if (code === 192 && store.config.voice) {
        e.returnValue = false
        return  play() 
    }

    if (code === 9) {
        return
    }

    if (code === 189 || code === 187) {
        e.returnValue = false
        return false
    }

    if (code === 13) {
        if (isSuccess.value) {
            setRemember()
            next(true)
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

const changeValue = (e:any) => {
    const { data } = e
    const index = codeClass.value.lastIndexOf('success')
    const target = textArray.value[index + 1]
    if (syllables.value && target && data) {
        if (isDot(target)) {
            value.value = value.value + '.'
        }
    }
}

watch(() => route.params.date, async () => {
    await getRemember()

    getWords()
})

watchEffect(async () => {
    await getRemember()
    getWords()
})

onMounted(() => {
    focus()
})

</script>

<template>
    <div class="write-wrap">
            <div class="write-box">
                <el-skeleton v-if="loading" :rows="5" animated />
                <div v-else-if="words.length">
                    <div class="row" :class="{ review: review }">
                        <div
                            v-for="(w, i) in textArray"
                            :key="w + i"
                            :class="{ dot: isDot(w) }"
                            class="word">
                            {{ isDot(w) ? '' : w }}
                        </div>
                        <div class="cursor hide"></div>
                    </div>
                    <div class="row">
                        <div
                            v-for="(w, i) in wordArray"
                            :key="w + i"
                            :class="{ dot: isDot(w), [codeClass[i]]: true }"
                            class="word">
                            {{ isDot(w) ? '' : w }}
                        </div>
                        <div class="cursor"></div>
                    </div>
                    <input
                    ref="inputRef"
                    v-model="value"
                    type="text"
                    class="input"
                    @keydown="handleKey"
                    @blur="blur"
                    @input="changeValue" />
                </div>
                
                <el-empty v-else="!loading && words.length" description="empty"></el-empty>
            </div>
            <div class="write-box">
                <div v-if="!loading && words.length">
                    <div v-if="ukpron" :class="{ review: review }" class="ukpron">/{{ ukpron }}/ <span v-if="voice" class="voice">V</span></div>
                    <div class="interprets" :class="{ review: view }">
                        <div
                            v-for="interpret in interprets"
                            :key="interpret">
                            {{ interpret }}
                        </div>
                    </div>
                </div>
            </div>
        <!-- <div v-if="!words.length && !loading" class="empty">
            <el-empty description="empty"></el-empty>
        </div> -->
    </div>
</template>

<style lang="stylus">
@keyframes cursor
    0%
        opacity 1
        background: #000;
    100%
        opacity 0
        background: #409eff
.write-wrap
    width 100%
    height 100%
    padding-top 200px
    font-family FredokaOne
    .empty
        width 100%
        text-align: center
        .el-button
            border-radius 0
            font-weight bold
            height 40px
            line-height 40px
            font-family FredokaOne
    .voice
        font-family RubikMoonrocks
    .review
        filter blur(10px)
    .dot
        margin 0 5px
        width 6px
        display block
        &.success:after
            background #67c23a
    .dot:after
        position absolute
        left 0
        top 0
        content ''
        border-radius 100%
        display block
        width 6px
        height 6px
        background #2c3e50
    .ukpron
        text-align center
        cursor pointer
        margin-bottom 20px
        margin-top 20px
        &:hover
            color #409eff
            font-weight bold
    .write-box
        width 400px
        display flex
        justify-content center
        position relative
        margin 0 auto
        .input
            position absolute
            left 0
            top 0
            outline none
            height 34px
            width 100%
            border 0
            font-size 30px
            font-weight bold
            letter-spacing 1px
            opacity 0
        .cursor
            width: 2px;
            height: 22px;
            margin-left: 2px;
            background: #000;
            margin-top: 3px;
            animation cursor 1.5s ease infinite
            &.hide
                visibility: hidden;
        .row
            position relative
            display flex
            align-items center
            font-weight bold
            font-size 30px
            letter-spacing 1px
            height 34px
            line-height 34px
        .word
            position relative

</style>
