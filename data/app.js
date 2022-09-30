const login = require('./login')
const request = require('request')
const fs = require('fs-extra')
const distDir = 'public/data.json'

const handleData = (list) => {

    let words = JSON.parse(fs.readFileSync(distDir, 'utf8') || [])

    list.forEach(v => {
        delete v.sentenceList
    })

    const result = list.concat(words).sort((a, b) => {
        return new Date(a.updatetime).getTime() - new Date(b.updatetime).getTime()
    })
    fs.outputFileSync(distDir, JSON.stringify(result))

}

const getWords = async (page, cookie) => {
    return new Promise((reslove, reject) => {
        request(
            {
                url: `https://langeasy.com.cn/getUserNewWord.action?page=${page}&time=${new Date().getTime()}`,
                method: 'get',
                jar: cookie
            },
            async (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    const data = JSON.parse(body)
                    const wordList = data.wordList
                    const { currentPage, totalPage } = data.pageInfo

                    handleData(wordList)

                    if (currentPage < totalPage) {
                        const page = currentPage + 1 - 1
                        console.log('page: ', page)
                        await getWords(page, cookie)
                    } else {
                        console.log(' data.pageInfo: ', data.pageInfo)
                    }
                } else {
                    reject(error)
                }
            }
        )
    })
}

const run = async () => {

    const cookie = await login.cookie()
    fs.outputFileSync(distDir, '[]')

    await getWords(0, cookie)

    // fs.outputFileSync(distDir, JSON.stringify(data))

}

run()
