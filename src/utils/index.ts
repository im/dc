export const getAssetsBg = (index: number) => {
    if (!index) return ''
    return new URL(`../src/assets/bg/${index}.svg`, import.meta.url).href
}

export const storageGet = (name: any) => {
    const data: any = window.localStorage.getItem(name)
    if (data) {
        return JSON.parse(data)
    } else {
        return null
    }
}

export const storageSet = (name: any, data: any) => {
    window.localStorage.setItem(name, JSON.stringify(data))
}

export const format = (millisecond:any, template:any) => {
    let res = ''
    try {
        let date = new Date(millisecond)
        let opt:any = {
            'Y+': date.getFullYear().toString(), // 年
            'm+': (date.getMonth() + 1).toString(), // 月
            'd+': date.getDate().toString(), // 日
            'H+': date.getHours().toString(), // 时
            'M+': date.getMinutes().toString(), // 分
            'S+': date.getSeconds().toString(), // 秒
        }
        template = template || 'YYYY-mm-dd'
        for (let k in opt) {
            let ret = new RegExp('(' + k + ')').exec(template)
            if (ret) {
                template = template.replace(
                    ret[1],
                    ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
                )
            }
        }
        res = template
    } catch (error) {
        console.warn('ERROR formatDate', error)
    }
    return res
}

export const transform = (word:string, date: string) => {
    const str = 'abcdefghijklmnopqrstuvwxyz'
    const lower = str.split('')
    const targetArr = word.split('').map(v => v.toLocaleLowerCase())
    const resluts = targetArr.map(i => lower.indexOf(i) % 10).join('')
    const s:any = (date + resluts).repeat(3)
    return s.substring(0, 16)

}
