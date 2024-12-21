'use strict'

/**
 * static files (404.html, sw.js, conf.js)
 */
const ASSET_URL = 'https://hunshcn.github.io/gh-proxy/'
// 前缀，如果自定义路由为example.com/gh/*，将PREFIX改为 '/gh/'，注意，少一个杠都会错！
const PREFIX = '/'
// 分支文件使用jsDelivr镜像的开关，0为关闭，默认关闭
const Config = {
    jsdelivr: 0
}

const whiteList = [] // 白名单，路径里面有包含字符的才会通过，e.g. ['/username/']

/** @type {ResponseInit} */
const PREFLIGHT_INIT = {
    status: 204,
    headers: new Headers({
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
        'access-control-max-age': '1728000',
    }),
}

/**
 * 添加新的样式常量
 */
const PH_STYLE = `
    body { 
        background-color: #000000;
        color: #ffffff;
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        min-height: 100vh
    }
    .ph-container {
        max-width: 1000px;
        margin: 50px auto;
        padding: 20px;
    }
    .ph-header {
        text-align: center;
        margin-bottom: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    .ph-logo {
        font-size: 48px;
        font-weight: 800;
        display: inline-block;
        background: #000000;
        padding: 10px 20px;
        border-radius: 3px;
        margin: 0;
    }
    .ph-highlight {
        display: inline-block;
        background-color: #ffa31a;
        color: #000000;
        padding: 2px 8px;
        border-radius: 3px;
        margin-left: 2px;
    }
    .ph-input-container {
        background: #1b1b1b;
        padding: 30px;
        border-radius: 3px;
        margin-bottom: 30px;
        border: 1px solid #2c2c2c;
    }
    .ph-input {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        background: #2b2b2b;
        border: 1px solid #3f3f3f;
        color: #ffffff;
        border-radius: 3px;
        margin-bottom: 15px;
    }
    .ph-input:focus {
        outline: none;
        border-color: #ffa31a;
    }
    .ph-button {
        background-color: #ffa31a;
        color: #000000;
        border: none;
        padding: 12px 30px;
        font-size: 16px;
        font-weight: bold;
        border-radius: 3px;
        cursor: pointer;
        text-transform: uppercase;
        transition: all 0.2s;
        display: inline-block;
    }
    .ph-button:hover {
        background-color: #ff9900;
    }
    .ph-examples {
        background: #1b1b1b;
        padding: 20px;
        border-radius: 3px;
        border: 1px solid #2c2c2c;
    }
    .ph-examples h3 {
        color: #ffa31a;
        margin: 0 0 15px 0;
        font-size: 18px;
        text-transform: uppercase;
    }
    .ph-examples code {
        display: block;
        background: #2b2b2b;
        padding: 12px;
        margin: 8px 0;
        border-radius: 3px;
        color: #ffffff;
        font-family: monospace;
        border: 1px solid #3f3f3f;
    }
    .ph-warning {
        color: #ffa31a;
        margin-top: 15px;
        font-weight: bold;
        font-size: 14px;
    }
    /* 添加 GitHub 图标和动画样式 */
    .github-icon {
        width: 50px;
        height: 50px;
        animation: rotate 2s linear infinite;
        fill: #ffa31a;  /* Pornhub 黄色 */
        margin: 0;  /* 移除原有的 margin */
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .logo-container {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .ph-logo {
        margin: 0;
        line-height: 1;
    }
`

const exp1 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive)\/.*$/i
const exp2 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i
const exp3 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i
const exp4 = /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+?\/.+$/i
const exp5 = /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i
const exp6 = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/tags.*$/i

/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
    headers['access-control-allow-origin'] = '*'
    
    if (status === 404 && !headers['content-type']) {
        body = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>404 - Page Not Found</title>
                    <style>${PH_STYLE}</style>
                </head>
                <body>
                    <div class="ph-container">
                        <div class="ph-header">
                            <div class="logo-container">
                                <svg class="github-icon" viewBox="0 0 16 16" version="1.1">
                                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                                </svg>
                                <h1 class="ph-logo">Git<span class="ph-highlight">Hub</span></h1>
                            </div>
                        </div>
                        <div class="ph-input-container">
                            <input type="text" class="ph-input" placeholder="输入 GitHub 文件链接">
                            <button class="ph-button" onclick="handleDownload()">立即下载</button>
                        </div>
                        <div class="ph-examples">
                            <h3>合法输入示例</h3>
                            <code>分支源码：https://github.com/hunshcn/project/archive/master.zip</code>
                            <code>release源码：https://github.com/hunshcn/project/archive/v0.1.0.tar.gz</code>
                            <code>release文件：https://github.com/hunshcn/project/releases/download/v0.1.0/example.zip</code>
                            <p class="ph-warning">⚠️ 注意：不支持项目文件夹</p>
                        </div>
                    </div>
                    <script>
                        function handleDownload() {
                            const input = document.querySelector('.ph-input');
                            const url = input.value.trim();
                            if (url) {
                                window.location.href = '${PREFIX}' + url;
                            }
                        }
                    </script>
                </body>
            </html>
        `
        headers['content-type'] = 'text/html'
    }
    
    return new Response(body, {status, headers})
}


/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
    try {
        return new URL(urlStr)
    } catch (err) {
        return null
    }
}


addEventListener('fetch', e => {
    const ret = fetchHandler(e)
        .catch(err => makeRes('cfworker error:\n' + err.stack, 502))
    e.respondWith(ret)
})


function checkUrl(u) {
    for (let i of [exp1, exp2, exp3, exp4, exp5, exp6]) {
        if (u.search(i) === 0) {
            return true
        }
    }
    return false
}

// 添加主页模板
const HOME_PAGE = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>GitHub 文件加速</title>
            <style>${PH_STYLE}</style>
        </head>
        <body style="background-color: #0A0A0A;">
            <div class="ph-container">
                <div class="ph-header">
                    <div class="logo-container">
                        <svg class="github-icon" viewBox="0 0 16 16" version="1.1">
                            <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                        </svg>
                        <h1 class="ph-logo" style="color: white; font-size: 60px;">Git<span style="background-color: #F90; color: black; padding: 0 10px; margin-left: 5px;">Hub</span></h1>
                    </div>
                </div>
                <div class="ph-input-container" style="background: #1a1a1a; border: 1px solid #2e2e2e;">
                    <input type="text" class="ph-input" 
                           style="background: #2b2b2b; border: 1px solid #3f3f3f; font-size: 18px; padding: 15px;"
                           placeholder="输入 GitHub 文件链接">
                    <button class="ph-button" 
                            style="background: #F90; padding: 15px 40px; font-size: 18px; margin-top: 10px; width: 100%;"
                            onclick="handleDownload()">立即下载</button>
                </div>
                <div class="ph-examples" style="background: #1a1a1a; border: 1px solid #2e2e2e;">
                    <h3 style="color: #F90; font-size: 20px;">合法输入示例</h3>
                    <code style="background: #2b2b2b; border: 1px solid #3f3f3f;">分支源码：https://github.com/hunshcn/project/archive/master.zip</code>
                    <code style="background: #2b2b2b; border: 1px solid #3f3f3f;">release源码：https://github.com/hunshcn/project/archive/v0.1.0.tar.gz</code>
                    <code style="background: #2b2b2b; border: 1px solid #3f3f3f;">release文件：https://github.com/hunshcn/project/releases/download/v0.1.0/example.zip</code>
                    <p style="color: #F90; margin-top: 20px; font-weight: bold;">⚠️ 注意：不支持项目文件夹</p>
                </div>
            </div>
            <script>
                function handleDownload() {
                    const input = document.querySelector('.ph-input');
                    const url = input.value.trim();
                    if (url) {
                        window.location.href = '${PREFIX}' + url;
                    }
                }
            </script>
        </body>
    </html>
`

/**
 * @param {FetchEvent} e
 */
async function fetchHandler(e) {
    const req = e.request
    const urlStr = req.url
    const urlObj = new URL(urlStr)
    let path = urlObj.searchParams.get('q')
    
    // 如果是根路径，显示主页
    if (urlObj.pathname === PREFIX) {
        return new Response(HOME_PAGE, {
            headers: {
                'content-type': 'text/html;charset=UTF-8'
            }
        })
    }
    
    if (path) {
        return Response.redirect('https://' + urlObj.host + PREFIX + path, 301)
    }
    
    // cfworker 会把路径中的 `//` 合并成 `/`
    path = urlObj.href.substr(urlObj.origin.length + PREFIX.length).replace(/^https?:\/+/, 'https://')
    if (path.search(exp1) === 0 || path.search(exp5) === 0 || path.search(exp6) === 0 || path.search(exp3) === 0 || path.search(exp4) === 0) {
        return httpHandler(req, path)
    } else if (path.search(exp2) === 0) {
        if (Config.jsdelivr) {
            const newUrl = path.replace('/blob/', '@').replace(/^(?:https?:\/\/)?github\.com/, 'https://cdn.jsdelivr.net/gh')
            return Response.redirect(newUrl, 302)
        } else {
            path = path.replace('/blob/', '/raw/')
            return httpHandler(req, path)
        }
    } else if (path.search(exp4) === 0) {
        const newUrl = path.replace(/(?<=com\/.+?\/.+?)\/(.+?\/)/, '@$1').replace(/^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com/, 'https://cdn.jsdelivr.net/gh')
        return Response.redirect(newUrl, 302)
    } else {
        return fetch(ASSET_URL + path)
    }
}


/**
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
    const reqHdrRaw = req.headers

    // preflight
    if (req.method === 'OPTIONS' &&
        reqHdrRaw.has('access-control-request-headers')
    ) {
        return new Response(null, PREFLIGHT_INIT)
    }

    const reqHdrNew = new Headers(reqHdrRaw)

    let urlStr = pathname
    let flag = !Boolean(whiteList.length)
    for (let i of whiteList) {
        if (urlStr.includes(i)) {
            flag = true
            break
        }
    }
    if (!flag) {
        return new Response("blocked", {status: 403})
    }
    if (urlStr.search(/^https?:\/\//) !== 0) {
        urlStr = 'https://' + urlStr
    }
    const urlObj = newUrl(urlStr)

    /** @type {RequestInit} */
    const reqInit = {
        method: req.method,
        headers: reqHdrNew,
        redirect: 'manual',
        body: req.body
    }
    return proxy(urlObj, reqInit)
}


/**
 *
 * @param {URL} urlObj
 * @param {RequestInit} reqInit
 */
async function proxy(urlObj, reqInit) {
    const res = await fetch(urlObj.href, reqInit)
    const resHdrOld = res.headers
    const resHdrNew = new Headers(resHdrOld)

    const status = res.status

    if (resHdrNew.has('location')) {
        let _location = resHdrNew.get('location')
        if (checkUrl(_location))
            resHdrNew.set('location', PREFIX + _location)
        else {
            reqInit.redirect = 'follow'
            return proxy(newUrl(_location), reqInit)
        }
    }
    resHdrNew.set('access-control-expose-headers', '*')
    resHdrNew.set('access-control-allow-origin', '*')

    resHdrNew.delete('content-security-policy')
    resHdrNew.delete('content-security-policy-report-only')
    resHdrNew.delete('clear-site-data')

    return new Response(res.body, {
        status,
        headers: resHdrNew,
    })
}

