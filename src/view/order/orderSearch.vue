<template>
    <div class="order-search">
      <div v-if="role === '1' || role === '4' || role === '6'">
        <top v-on:on-search="conditionSearch"></top>
        <div id="Tab">
          <tab :scroll-threshold="5">
            <tab-item
              ref="tabItem"
              v-for="(item, index ) in tabItems"
              :key="index"
              @on-item-click="tabOnClick(item)"
              :selected="index==0"
            >{{ item }}
            </tab-item>
          </tab>
        </div>
        <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" :height="scrollerHeight" ref="scroller" @on-pullup-loading="loadMore"
              style="position:relative;top:2px;">
            <div class="list">
              <order-item v-for="item in items"
                :key="item.order_code"
                :order="item"
                v-on:on-orderDetail="orderDetail">
              </order-item>
              <p class="p-h-lg" style="text-align: center" v-if="showEmptyText">暂无数据</p>
            </div>
        </scroller>
      </div>
      <no-permission v-else></no-permission>
    </div>
</template>


<script>
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import Top from './layout/top.vue'
  import SubTab from './layout/tab.vue'
  import OrderItem from './layout/orderItem.vue'
  import { Scroller, Tab, TabItem } from 'vux'
  import NoPermission from '../../components/noPermission.vue'

  export default {
    name: 'OrderSearch',
		components: { Top, OrderItem, Scroller, NoPermission, Tab, TabItem },
    data() {

      return {
        tabItems:['待确认', '待拣取', '待发运', '待签收', '待评价', '全部'],
        items: [],
        scrollerHeight: '400px',
        pullupConfig: {
          content: '上拉加载更多',
          pullUpHeight: 60,
          height: 40,
          autoRefresh: false,
          downContent: '释放后加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        role: '',
        params: {
          page_num: 1,
          page_size: 10,
        },
        extra_params: {
          order_status: '待确认'
        }
      }

    },
    created () {
      this.role = this.common.getRoleId()

    },
    mounted(){

      this.conditionSearch()

    },
    /**
     * keep alive页面缓存模式 入口
     */
    activated () {
      /**
       * 为什么这里做 scrollerHeight 赋值操作？是为了解决，ios端查询页面微信自动增加底部导航栏后
       * 第一次详情页返回首页 页面滚动异常问题
       */
      this.scrollerHeight = ((document.documentElement.offsetHeight || document.body.offsetHeight) - 46 - 44)+'px';
    },
    methods : {

      /**
       * 查询
       */
      conditionSearch(params) {

        this.items = []
        this.$nextTick(() => {
          this.$refs.scroller.disablePullup()
          this.$refs.scroller.reset({top: 0})
        })
        this.params = {
           ...params,
          ...this.extra_params,
          page_num: 1,
          page_size: 10,
        }

        this.search()

      },

      /**
       * 加载更多
       */
      loadMore () {

        const current = this.params.page_num;
        this.params = { ...this.params,  page_num: current + 1  };
        this.search()

      },

      tabOnClick(status) {

        this.extra_params = {
          ...this.extra_params,
          order_status:  status !== '全部' ? status: null
        }

        this.conditionSearch( this.params )

      },

      /**
       * 查询
       */
      search() {
         //this.items = datas
        let params = this.params

        this.$store.commit('updateLoading', true)

        axios.listOrders(params)
          .then( (res) => {
            this.searchSuccess(res)
          }, (error) => {
            this.searchError(error)
          })
          .finally(() => {
            this.$store.commit('updateLoading', false)
            this.$refs.scroller.donePullup()
          })

      },
      /**
       * 查询成功返回
       */
      searchSuccess(res) {

        if(res.code === 0) {
          this.items = [ ...this.items, ...res.data ];
          this.setEmptyText(  !res.data.length  )
          res.data.length < this.params.page_size ? this.$refs.scroller.disablePullup()	: this.$refs.scroller.enablePullup()
        }else {
          this.$vux.toast.text(res.message, 'middle')
        }
      },
      /**
       * 查询错误返回
       */
      searchError(error) {
        this.$vux.toast.text('查询失败.', 'middle')
      },

      setEmptyText(bool){
        this.showEmptyText = bool
      },

      orderDetail(target){
        if(target.orderStatus !== '待确认'){
          this.$router.push({ path: `/init/readOrderDetail/${target.order_code}` })
        }
      }

    }
  }

</script>

<style>
  #Tab {
      width:100%;
      position:fixed;
      left:0;
      top:46px;
      z-index:100;
    }
  .order-search {
    padding-top: 90px;
  }
  .order-search .list {
    padding: 10px 0;
  }
</style>
