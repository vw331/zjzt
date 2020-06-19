<template>
	<div id="Top">
		<x-header slot="header" style="width:100%;position:fixed;left:0;top:0;z-index: 99"
        :left-options="{showBack: showBack, backText: ''}" :right-options="{showMore: showMore}"
        @on-click-more="clickMore">{{title}}
        <component slot="right" :is="rightComponent"></component >
	  </x-header>

    <div v-transfer-dom>
      <!-- <popup v-model="showMenus" position="right">
        <div style="width:200px;">
          <group>
            <cell v-for="menu in menuList" :title="menu.title" :value="menu.value"
                  @click.native="goToUrl(menu.url)" :class="menu.class" v-bind:key="menu.key"></cell>
          </group>
        </div>
      </popup> -->
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="clickMenu" show-cancel></actionsheet>
    </div>
	</div>
</template>

<script>
  import {mapState} from 'vuex'
  import {XHeader, TransferDom, Popup, Group, Cell, Actionsheet} from 'vux'
  import { router } from '../../router'
  import * as types from '../../utils/constant'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Group,
      Cell,
      Actionsheet
    },
    computed: {
      ...mapState({
        showBack: state => state.user.showBack,
        showMore: state => state.user.showMore,
        title: state => state.user.title,
        rightComponent: state => state.user.rightComponent
      })
    },
    data () {
      return {
        /* menuList: [
          {title: 'userInfo', value: '', url: '/bind'},
          {title: '', value: 'userInfo', url: '/init/waybill', class: 'menu'},
        ], */
        menus: {
          menu1: '新增司机',
          //menu2: '司机查询'
        },
        showMenus: false
      }
    },
    methods: {
      goToUrl(path) {
        if (path) {
          console.log(path)
          router.push({path: path})
        }
        let vue = this
      },
      clickMore() {
        if(this.title === types.VEHICLEINFO_TITLE){
          this.showMenus = true
          console.log("title="+this.title)
        }
      },
      clickMenu(key, item) {
        console.log(key,item)
        if(item === '新增司机') {
          router.push({path: '/init/addDriver'})
        }
      }
    }
  }
</script>

<style sc>
  #Top .vux-header-title {
    font-size: 18px;
    font-weight: 500;
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
</style>