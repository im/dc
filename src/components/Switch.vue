<template>
     <div class="switch">
        <div v-if="label || code" class="label">
         <span> {{ code }} </span>
         <span> {{ label }} </span>
        </div>
        <div class="box" :class="{ active: modelValue }">
            <div class="off" @click="handleClick(false)">OFF</div>
            <div class="on" @click="handleClick(true)">ON</div>
            <div class="bg"></div>
        </div>
     </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue'

defineProps({
    modelValue: {
        type: Boolean,
        require: true
    },
    label: {
        type: String,
    },
    code: {
        type: String,
    }
})

const emit = defineEmits(['update:modelValue'])

const handleClick = (sw: boolean) => {
    emit('update:modelValue', sw)
}

</script>

<style lang="stylus">
.switch
    width 100%
    margin-bottom 20px
    .label
        background #dcdfe6;
        // border-bottom 1px solid #fff
        // border-top 1px solid #fff
        font-size 12px
        height 24px
        line-height 24px
        display block
        padding 0 8px
        display flex
        justify-content: space-between;
    .box
        width 100%
        height 50px
        line-height 50px
        display flex
        text-align center
        background #dcdfe6;
        position relative
        overflow hidden
        &.active
            .bg
                left 50%
            .on
                color #fff
             .off
                color #2c3e50
        .bg
            transition: 0.4s;
            left 0
            top 0
            position absolute
            height 50px
            background #409eff
            z-index 1
            width 50%
        .off
            left 0
            color #fff
        .on
            left 50%
        .off,.on
            width 50%
            position absolute
            height 50px
            top 0
            z-index 2
            cursor pointer
            &:hover
                opacity 0.8
</style>
