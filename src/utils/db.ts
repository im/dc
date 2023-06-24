import { openDB } from 'idb/with-async-ittr'

let wordsDb:any = null

export default () => {
    if (wordsDb) return wordsDb
    wordsDb = openDB('words-db', 1, {
        upgrade (db) {
            const wordsStore = db.createObjectStore('words', {
                keyPath: 'id',
                autoIncrement: true,
            })
            wordsStore.createIndex('id', 'id', {
                unique: true
            })

            const configStore = db.createObjectStore('config', {
                keyPath: 'id',
            })
            configStore.createIndex('id', 'id', {
                unique: true
            })
        },
    })
    return wordsDb
}