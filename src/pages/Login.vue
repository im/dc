<script setup lang="ts">

import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'
import { storageSet } from '../utils'

const cipher = ref('')
const loading = ref(false)
const inputRef = ref<HTMLInputElement | null | any>(null)
const disabled = computed(() => !cipher.value.length)

const login = () => {
    if (cipher.value.length) {
        storageSet('cipher',cipher.value)
        window.location.reload()
    }
}

const blur = () => {
    focus()
}

const focus = async () => {
    await nextTick()
    inputRef.value?.input.focus()
}

onMounted(() => {
    focus()
})
</script>

<template>
    <div class="login-wrap">
        <div class="login-box">
            <el-input ref="inputRef" v-model.trim="cipher" :disabled="loading" :autofocus="true" type="password" size="large" @blur="blur" @keyup.enter="login"></el-input>
            <el-button :loading="loading" :disabled="disabled" size="large" plain @click="login">LOGIN</el-button>
        </div>
    </div>
</template>

<style lang="stylus">
.login-wrap
    width 100%
    height 100%
    display flex
    padding-top 200px
    font-family FredokaOne
.login-box
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
