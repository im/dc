const fs = require('fs-extra')
const path = require('path')
const axios = require('axios')

const dataPath = path.join(__dirname, '../public/data.json')
const pendingPath = path.join(__dirname, 'pending.txt')

const getData = () => {
    const str = fs.readFileSync(dataPath, 'utf-8')
    return str.trim() ? JSON.parse(str) : {}
}

const setData = (wordInfo) => {
    const { word } = wordInfo
    const data = getData()
    if (data[word]) return
    data[word] = wordInfo
    fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8')
}

const getPendings = () => {
    const str = fs.readFileSync(pendingPath, 'utf-8')
    return str.trim() ? str.split(',') : []
}
const setPendings = (pendings) => {
    fs.writeFileSync(pendingPath, pendings.join(','), 'utf-8')
}

const handle = (word, success, error) => {
    axios.get(`https://langeasy.com.cn/loadLexisList.action?strict=1&word=${word}`).then(res => {
        try {
            const data = res.data || {}
            const wordInfo = data.wordlist[0] || null

            if (!wordInfo) {
                error()
            }

            axios.get(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=5995bbce-03fd-4ef5-b686-1b39539ed434`).then(res => {
                const data = res.data || {}
                if (data[0] && data[0].hwi && data[0].hwi.hw) {
                    const syllables = data[0].hwi.hw || ''
                    wordInfo.syllables = syllables.replace(/\*/g, '.')
                } else {
                    wordInfo.syllables = word
                }
                success(wordInfo)
            }).catch(err => {
                error()
            })
        } catch (err) {
            error()
        }
    }).catch(err => {
        error()
    })
}

let timer = null
let isStart = false

timer = setInterval(() => {
    const pendings = getPendings()
    if (!pendings || !pendings.length) {
        clearInterval(timer)
        isStart = false
    }
    if (isStart) return
    isStart = true
    const data = getData()
    const word = pendings.shift()
    if (data[word]) {
        setPendings(pendings)
        isStart = false
        return
    }
    handle(word, (wordInfo) => {
        setData(wordInfo)
        setPendings(pendings)
        isStart = false
        console.log(word, pendings.length)
    }, () => {
        setPendings(pendings)
        isStart = false
    })
}, 3000)