<script setup lang="ts">

import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'
import { storageSet, storageGet } from '../utils'
import Words from '../words'

const list = Object.keys(Words).map(v => v.toUpperCase())

</script>

<template>
    <div class="list">
        <div v-for="item in list" :key="item" class="item" @click="$router.push({ name: 'write', query: { name: item } })">{{ item }}</div>
    </div>
</template>

<style lang="stylus" scoped>
.list
    width 40vw
    margin 10vh auto
    height 80vh
    overflow-y auto
    display flex
    .item
        cursor pointer
        margin 0 10px
        &:hover
            color #409eff
</style>
