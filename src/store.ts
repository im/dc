import { storageGet, storageSet, format, transform } from './utils'
import { defineStore } from 'pinia'
import client, { q } from './db'

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
        async reload (date:any, size:any) {
            let res:any = null
            if (date) {
                res = await client.query( q.Map(q.Paginate(q.Match(q.Index('word_list'), date), { size: size }), q.Lambda(['ref'],q.Get(q.Var('ref')))) )
            } else {
                res = await client.query( q.Map(q.Paginate(q.Match(q.Index('all_word_list')), { size: size }), q.Lambda(['ref'],q.Get(q.Var('ref')))))
            }

            const data = (res.data || []).map((item:any) => {
                return {
                    ...item.data,
                    id: item.ref.value.id
                }
            })
            storageSet(date + 'words', data)
            window.location.reload()
        }
    }
})

export default useStore