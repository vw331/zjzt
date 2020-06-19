import axios from 'axios'
import Vue from 'vue'
import * as types from '../utils/constant'
import { router } from '../router/index'
import { API_SERVER_PATH } from '@/utils/constant'

// 发送
axios.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})


axios.interceptors.response.use(response => {
    //types.DEBUG_MODE ? console.log("response="+JSON.stringify(response.data)) : null
    let result = ''
    // code 等于2 说明用户没有操作权限 路由跳转到绑定页面
    if(response.data.code !== 2){
      result = response.data
    }else {
      Vue.$vux.toast.text('您没有操作权限 !', 'middle')
      router.push({path: '/bind'})
    }
    return result
  }, error => {
    let response = error.response
    types.DEBUG_MODE ? console.log("response error="+JSON.stringify(error)) : null
    Vue.$vux.toast.text('网络/服务异常.', 'middle')
    return Promise.reject(response)
  })


export default {
  get(url, params) {
    if (!url) return
    return axios({
        method: 'get',
        url: `${API_SERVER_PATH}${url}`,
        params,
        timeout: 40000
    })      
  },
  post(url, data) {
      if (!url) return
      return axios({
          method: 'post',
          url: `${API_SERVER_PATH}${url}`,
          data: data,
          timeout: 40000
      })
  }
}