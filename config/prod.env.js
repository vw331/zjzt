'use strict'

let HOST = process.argv.splice(2)[0] || 'test';

console.log( process.argv.splice(2)[0] )
console.log( HOST )

let STATIC_SERVER = HOST == 'test' ? '"https://zt.12ya.net/zjzt/"' : '"http://zhejtt.zjzttx.com.cn/"'
let API_SERVER = HOST == 'test' ? '"https://zt.12ya.net/zjzt"' : '"http://zhejtt.zjzttx.com.cn"'

console.log( `打包路径API_SERVER:-------->>${API_SERVER }`)
console.log( `打包路径STATIC_SERVER:-------->>${STATIC_SERVER}`)

module.exports = {
  NODE_ENV: '"production"',
  API_SERVER,
  STATIC_SERVER
}
