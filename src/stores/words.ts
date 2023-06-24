import { defineStore } from 'pinia'
import Db from '@/utils/db'

const WordsDb = Db()
const NAME = 'words'
const CONFIG_NAME = 'config'

export const useWordsStore = defineStore('Words', {
    state: () => {
        return {
            words: []
        }
    },
    actions: {
        async get () {
            return await (await WordsDb).getAllFromIndex(NAME, 'id')
        },
        async save (data: any) {
            const words = await WordsDb
            const tx = words.transaction(NAME, 'readwrite')

            if (data.id) {
                const index = tx.store.index('id')
                for await (const cursor of index.iterate(data.id)) {
                    const o = Object.assign(cursor.value, data)
                    cursor.update(o)
                }
                await tx.done
                return data.id
            } else {
                const id = await tx.store.add(data)
                // this.update()
                await tx.done
                return id
            }

        },
        async del (key:number) {
            await (await WordsDb).delete(NAME, key)
        }
    },
})

export const useConfigStore = defineStore('Config', {
    state: () => {
        return {
            config: {
                voice: false,
                syllables: true,
                review: false,
                view: false
            }
        }
    },
    actions: {
        async get () {
            const datas = await (await WordsDb).getAllFromIndex(CONFIG_NAME, 'id') || []
            this.config = datas.reduce((acc:any,cur:any) => {
                acc[cur.id] = cur.value
                return acc
            }, {})
            return datas
        },
        async update (data: any) {
            const words = await WordsDb
            const tx = words.transaction(CONFIG_NAME, 'readwrite')
            const index = tx.store.index('id')
            for await (const cursor of index.iterate(data.id)) {
                const o = Object.assign(cursor.value, data)
                cursor.update(o)
            }
            await tx.done
            await this.get()
            return data.id
        },
        async save (data: any) {
            const words = await WordsDb
            const tx = words.transaction(CONFIG_NAME, 'readwrite')
            const id = await tx.store.add(data)
            await tx.done
            this.get()
            return id

        }
    },
})