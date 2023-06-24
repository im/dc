<!--
* Operate
* @author tangxiaomi <81195314@qq.com>
* @date 2023-06-24 11:47:39
* @since 0.0.0
-->

<template>
    <div class="operate">
        <router-link tag="a" :to="{ name: 'save' }">添加</router-link>
        <a href="javascript:;" @click="handle('voice')">声音: {{ text(config.voice) }}</a>
        <a href="javascript:;" @click="handle('syllables')">音节: {{ text(config.syllables) }}</a>
        <a href="javascript:;" @click="handle('review')">默写: {{ text(config.review) }}</a>
        <a href="javascript:;" @click="handle('view')">释义: {{ text(config.view) }}</a>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
// @ts-ignore
import { useConfigStore } from '@/stores/words'

const configStore = useConfigStore()

const config = computed(() => configStore.config)

const text = (val:any) => {
    return val ? '开' : '关'
}

const handle = async (id:any) => {
    // @ts-ignore
    const value = !config.value[id]
    await configStore.update({ id, value })
}

const getConfig = async () => {
    const configs = await configStore.get()

    if (!configs.length) {
        await configStore.save({ id: 'voice', value: false })
        await configStore.save({ id: 'syllables', value: true })
        await configStore.save({ id: 'review', value: false })
        await configStore.save({ id: 'view', value: false })
    }
}

onMounted(async () => {
    await getConfig()
})

</script>

<style src="./operate.styl" lang="stylus" scoped></style>
