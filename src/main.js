// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import FastClick from 'fastclick'
import {WechatPlugin, AjaxPlugin, LoadingPlugin, ToastPlugin, AlertPlugin,ConfirmPlugin} from 'vux'

import App from './App';
import router from './router/admin';
import * as types from './utils/constant'
import Common from './utils/common'
import { Cookie } from './utils/storage'
import { store } from './store'
require("babel-polyfill");

console.log( process.env )

/**
 * 获取用户绑定信息
 * isBind  0为未绑定 false, 1为绑定 true
 */
function getBind() {
  !types.DEBUG_MODE ? console.log("cookie="+document.cookie) : null;
  if(!types.DEBUG_MODE) {
    let isBind = Cookie.get('isBind') === '1' ? true : false
    isBind ? store.commit('updateBind',true) : null
  }else {
    store.commit('updateBind',true)
  }
}
getBind()
/**
 * 加载插件
 */
Vue.use(Vuex)
Vue.use(WechatPlugin)
Vue.use(AjaxPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)


/**
 * 公用组件
 */
Vue.prototype.updateTitle = function (value) {
  this.$store.commit('updateTitle', value)
}
Vue.prototype.common = Common

/** 
 * 
 * 
*/
Vue.config.devtools = true;
/**
 *  日志输出开关
 */
Vue.config.productionTip = true
/**
 *  点击延迟
 */
FastClick.attach(document.body)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})


