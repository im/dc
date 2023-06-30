<!--
* Login
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-24 11:30:04
* @since 0.0.0
-->

<template>
     <div class="login-wrap">
        <div class="login-box">
            <input ref="inputRef" v-model.trim="cipher" :disabled="loading" :autofocus="true" type="password" size="large" @blur="blur" @keyup.enter="login" />
            <button :loading="loading" :disabled="disabled" size="large" plain @click="login">LOGIN</button>
        </div>
    </div>
</template>

<script lang="ts" setup>

import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'
import { storageSet } from '@/utils'

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
    inputRef.value?.focus()
}

onMounted(() => {
    focus()
})
</script>

<style src="./login.styl" lang="stylus" scoped></style>
