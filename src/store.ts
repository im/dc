import { defineStore } from 'pinia'

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
    }
})

export default useStore