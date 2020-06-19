<template>
	<div id="Tab">
		<tab :scroll-threshold="5" v-model="tabItem" prevent-default @on-before-index-change="tabOnClick" >
      <tab-item>全部</tab-item>
      <tab-item>待确认</tab-item>
      <tab-item>待拣取</tab-item>
      <tab-item>待发运</tab-item>
      <tab-item>待签收</tab-item>
      <tab-item>待评价</tab-item>
    </tab>
	</div>
</template>

<script>
  import {Tab, TabItem} from 'vux'
  import { watch } from 'fs';

  export default {
    name: "SubTab",
    components: {
      Tab, TabItem
    },
    props: ['tabIndex'],
    data () {
      return {
       tabItem: 0
      }
    },
    created() {
      this.tabItem = this.tabIndex
    },
    methods: {
      tabOnClick (index) {
        this.tabItem = index
        this.$emit('on-tabSearch',this.tabItem)
      }
    },
    watch:{
      tabIndex(val, oldVal) {
        this.tabItem = val
      },
    },
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  #Tab {
    width:100%;
    position:fixed;
    left:0;
    top:46px;
    z-index:100;
  }
</style>