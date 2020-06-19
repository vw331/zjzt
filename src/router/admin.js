
import Vue from 'vue'
import { router } from './index'
import { store } from '../store'
import * as types from '../utils/constant'

router.beforeEach((to, from, next) => {
    console.log("from="+from.name+"---bind="+store.state.user.isBind)
    // 缓存页面不需要滚动初始化
   /*  if( !(to.name === 'Invoicebill' || to.name === 'OrderDetail') ) {
      document.documentElement.scrollTop = 0  // 如果页面有滚动距离，则让页面回到顶部
      document.body.scrollTop = 0
    } */
    // 判断前往的界面是否需要绑定
    if (to.meta.bind) { 
      if (store.state.user.isBind) { // 是否已经绑定
          next()
      }else {
        console.log("未绑定");
        Vue.$vux.confirm.show({
          title:'未绑定',
          content: '您需要先绑定哦~',
          onCancel () {
            console.log('this') 
          },
          onConfirm () {
            router.push({path: '/bind'})
          }
        })
      }
    }else {
      if( to.name === 'Bind' && store.state.user.isBind ) {
        router.push({path: '/updateBind'})
      }else {
        next()
      }
    }
    
})

export default router