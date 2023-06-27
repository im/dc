<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
	<router-view></router-view>
</template>

<style lang="stylus">
// @font-face
//     font-family:'FredokaOne' ;
//     src: url('./assets/fonts/FredokaOne.ttf');

#app, .app
    // font-family RubikMoonrocks, FredokaOne, Monaco, PT Serif, Serif, Avenir, Helvetica, Arial, sans-serif!important
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    color #2c3e50
    width 100vw
    height 100vh
    position relative
    overflow hidden

.success
    color #67c23a
.error
    color #f56c6c

::-webkit-scrollbar
    width:0px;
    height:0px;

*
  margin 0
  padding 0

</style>
