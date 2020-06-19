<template>
  <div id="app">
    <loading v-model="loading" text="请稍候..."></loading>
    <!-- <transition>
      <router-view></router-view>
    </transition> -->
    <keep-alive >
      <router-view v-if="$route.meta.faKeepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.faKeepAlive"></router-view>
  </div>
</template>

<script>

import { Loading, XHeader, TransferDom, Popup, Group, Cell, ConfirmPlugin } from 'vux'
import { mapState } from 'vuex'


export default {
	directives: {
      TransferDom
    },
  	name: 'App',
  	components: {
		Loading,
		XHeader,
    Popup,
    Group,
    Cell,
    ConfirmPlugin 
  },
  data(){
    return {}
  },
  mounted () {
    /**
     * 禁止页面中有滑动或者拖拽事件时，整个网页也会随着移动
     */
    /* document.body.addEventListener('touchmove' , function(e){
      var e=e || window.event;
      e.preventDefault();
    },{ passive: false }) */
  },
  updated(){
  },
	computed: {
      ...mapState({
        loading: state => state.user.loading,
        showBack: state => state.user.showBack,
        title: state => state.user.title
      })
  },
}
</script>

<style lang="less">

@import "./styles/reset.less";
@import "./styles/style.less";
@import '~vux/src/styles/1px.less';

#app {
  height: 100%;
  background: #f2f2f2;
  overflow: auto;
}
#Top .vux-header-title {
font-size: 16px;
}
#Top .menu {
margin-right: 70px;
}
#Top .menu div {
color: #000;
}
#Top .menu:before {
right: -70px;
}
.weui-toast{
  top: 40% !important;
}
input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
  color: #b3adad;
  font-size:14px;
}

</style>
