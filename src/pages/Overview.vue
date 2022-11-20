<script setup lang="ts">

import { onMounted, defineComponent, ref, nextTick, computed } from 'vue'
import { storageSet, storageGet } from '../utils'

import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
const chartRef = ref<HTMLInputElement | null | any>(null)

use([
    GridComponent,
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
])

const option = ref({})

const getData = () => {
    const list = Object.keys(localStorage).map(key => {
        if (~key.indexOf('_words')) {
            return {
                date: key.split('_')[0] === 'all' ? '全部' : key.split('_')[0],
                data: storageGet(key)

            }
        }
    }).filter(Boolean)
    return {
        xAxis: list.map((item:any) => {
            return item.date
        }),
        series: list.map((item:any) => {
            return item.data.length || 0
        }),
    }
}

onMounted(() => {
    const { xAxis, series } = getData()

    const colors = ['#0780cf',
        '#765005',
        '#fa6d1d',
        '#0e2c82',
        '#b6b51f',
        '#da1f18',
        '#701866',
        '#f47a75',
        '#009db2',
        '#024b51',
        '#0780cf',
        '#765005',]

    nextTick(() => {
        option.value = {

            tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}',
                borderWidth: 3,
                textStyle: {
                    fontWeight: 'bold',
                    color: '#000'
                }
            },
            xAxis: {
                type: 'category',
                data: xAxis,
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(204, 204, 204, 0.6)'
                    }
                },
                axisLabel: {
                    fontWeight: 'bold',
                    color: '#000'
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(204, 204, 204, 0.6)'
                    }
                },
                axisLabel: {
                    fontWeight: 'bold',
                    color: '#000'
                }
            },
            series: [
                {
                    data: series,
                    type: 'bar',
                    barMaxWidth: 20,
                    roundCap: true,
                    itemStyle: {
                        borderRadius: [3, 3, 0, 0,],
                        color: (data:any) => {
                            return colors[data.dataIndex % colors.length]
                        },
                        opacity: 1
                    },
                    emphasis: {
                        itemStyle: {
                            // color: 'blue',
                            opacity: 0.7
                        }
                    }
                }
            ]
        }
    })

})

</script>

<template>
    <v-chart ref="chartRef" class="chart" :option="option" />
</template>

<style lang="stylus">
</style>
