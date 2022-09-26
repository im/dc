import { defineStore } from 'pinia'
import axios from 'axios'
import { storageGet, storageSet } from './utils'

export const useStore = defineStore({
    id: 'words',
    state: () => ({
        wordLoading: false,
        wordMap: {} as any,
        pageInfo: {} as any,
        syllableMap: {} as any,
        config: {
            syllables: true,
            voice: false,
            review: false,
            view: false
        } as any
    }),
    actions: {
        clearWordMap () {
            storageSet('wordMap', {})
            storageSet('pageInfo', {})
        },
        async setSyllableMap () {
            this.syllableMap = storageGet('syllables') || {}
        },
        async getSyllables (word: string) {
            const syllables = storageGet('syllables') || {}
            if (!syllables[word]) {
                const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=5995bbce-03fd-4ef5-b686-1b39539ed434`
                const res = await axios.get(url)
                if (res && res.data[0] && res.data[0].hwi && res.data[0].hwi.hw) {
                    const hw = res.data[0].hwi.hw || ''
                    syllables[word] = hw.replace(/\*/g, '.')
                } else {
                    syllables[word] = word
                }
            }
            storageSet('syllables', syllables)
            this.syllableMap = syllables
        },
        async getWords (page: number) {
            this.wordLoading = true

            const response = await fetch('/data.json')
            const data = await response.json()
            console.log('data: ', data)
            // const wordMap = storageGet('wordMap') || {}
            // const pageInfo = storageGet('pageInfo') || {}
            // this.wordMap = wordMap
            // this.pageInfo = pageInfo

            // if (this.wordMap[page]) {
            //     this.pageInfo = pageInfo
            //     this.wordLoading = false
            //     return
            // }

            // const res = await axios.get('/api/list', {
            //     params: {
            //         page: page - 1
            //     }
            // })

            // const { code, data } = res.data

            // if (code) {
            //     this.pageInfo = data.pageInfo || {}
            //     this.wordMap[page] = data.wordList || []
            //     storageSet('wordMap', this.wordMap)
            //     storageSet('pageInfo', this.pageInfo)
            // } else {
            //     // window.location.reload()
            // }

            this.wordLoading = false
        }
    }
})

export default useStore