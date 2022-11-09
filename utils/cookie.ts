const request = require('request')

const login = () => {
    return new Promise((reslove, reject) => {
        request(
            {
                url: `https://langeasy.com.cn/login.action`,
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Origin: 'https://www.langeasy.com.cn'
                },
                formData: {
                    name: process.env.USERNAME,
                    passwd: process.env.PASSWORD
                }
            },
            function (error:any, response:any, body:any) {
                if (!error && response.statusCode == 200) {
                    reslove(response.headers['set-cookie'])
                } else {
                    reject(error)
                }
            }
        )
    })

}

const cookie = async () => {

    const cookies: any = await login()
    const HOST = 'https://langeasy.com.cn'

    const j = request.jar()
    const obj:any = {}
    cookies.forEach((cookie:any) => {
        const c = cookie.split('=')
        obj[c[0]] = c[1]
    })
    const cookie1 = request.cookie(`acw_tc=${obj.acw_tc}`)
    const cookie2 = request.cookie(`user_web_token=${obj.user_web_token}`)
    j.setCookie(cookie1, HOST)
    j.setCookie(cookie2, HOST)
    return cookies
}

export default cookie