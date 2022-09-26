<template>
    <div v-click-outside="onClickOutside" class="wallpaper" :class="{ open: open }">
        <ul class="list">
            <li :class="{ active: modelValue === 0 }" @click="handleClick(0)">
                <div class="shade">{{ 0 }}</div>
            </li>
            <li v-for="index in 20" :key="index" :class="{ active: modelValue === index }" @click="handleClick(index)">
                <img object-fit="fill" :src="getBg(index)" />
                <div class="shade">{{ index }}</div>
            </li>
        </ul>

         <div class="handle" @click="handle">
            {{ open ? 'OFF': 'ON' }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'
import { getAssetsBg } from '../utils'
import { ClickOutside as vClickOutside } from 'element-plus'

defineProps({
    modelValue: {
        type: Number,
        require: true
    }
})
const open = ref(false)

const getBg = getAssetsBg

const handle = () => {
    open.value = !open.value
}

const onClickOutside = () => {
    open.value = false
}

const emit = defineEmits(['update:modelValue'])

const handleClick = (index:number) => {
    emit('update:modelValue', index)
}

</script>

<style lang="stylus">
.wallpaper
    height 100vh
    width 200px
    position fixed
    background #fff
    right -200px
    top 0
    transition: 0.2s;
    z-index 1
    &.open
        right 0
        box-shadow: 0px 16px 48px 16px rgba(0, 0, 0, .08), 0px 12px 32px rgba(0, 0, 0, .12), 0px 8px 16px -8px rgba(0, 0, 0, .16);
    .list
        height 100%
        overflow-y auto
        li
            height 100px
            cursor pointer
            overflow hidden
            transition: 0.3s;
            position relative
            &.active
                .shade
                    left 0
            .shade
                width 100%
                height 100%
                display flex
                align-items center
                justify-content: center;
                position absolute
                left -100%
                top 0
                z-index 1
                transition: 0.2s;
                background rgba(255,255,255,0.7)
                color #409eff
                font-size 18px
                font-weight bold
            &:hover
                img
                    transform: scale(1.2);
                    opacity 0.8
            img
                transition: 0.3s;
                width 100%

</style>
