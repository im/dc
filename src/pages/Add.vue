<script setup lang="ts">

import axios from 'axios'
import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'

const word = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null | any>(null)
const disabled = computed(() => !word.value.length)

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

const addWord = async () => {
    loading.value = true
    const res = await axios.get('/api/add', {
        params: {
            word: word.value
        }
    })

    const { code, data } = res.data
    if (code) {
        word.value = ''
        console.log(data)
    } else {
        window.location.reload()
    }
    loading.value = false
}
onMounted(() => {
    focus()
})
</script>

<template>
    <div class="add-wrap">
        <div class="add-box">
            <el-input ref="inputRef" v-model.trim="word" :disabled="loading" :autofocus="true" type="text" size="large" @blur="blur" @keyup.enter="add"></el-input>
            <el-button :loading="loading" :disabled="disabled" size="large" plain @click="add">SUBMIT</el-button>
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
</style>
