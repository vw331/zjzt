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
                <bill-item v-for="item in items" 
                    :key="item.order_code" 
                    :bill="item" 
                    v-on:on-orderDetail="orderDetail">
                </bill-item>
                <p class="p-h-lg" style="text-align: center" v-if="showEmptyText">暂无数据</p>
            </div>
        </scroller>
      </div>
      <no-permission v-else></no-permission>
    </div>
</template>

<script>

  import axios from '@/api/axios'
  import * as types from '@/utils/constant'
  import Top from '@/view/bill/layout/top.vue'
  import SubTab from '@/view/bill/layout/tab.vue'
  import { Scroller, Tab, TabItem } from 'vux'
  import NoPermission from '@/components/noPermission.vue'
  import BillItem from '@/view/bill/billItem.vue'


export default {
    name: 'BillSearch',
    data(){
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
    components: { Top, Scroller, NoPermission, BillItem, Tab, TabItem },
    created(){
        this.role = this.common.getRoleId()
    },
    mounted(){
        this.conditionSearch()
    },
    activated () {
      this.scrollerHeight = ((document.documentElement.offsetHeight || document.body.offsetHeight) - 46 - 44)+'px';
    },
    methods: {
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
        search() {
            //this.items = datas
            let params = this.params

            this.$store.commit('updateLoading', true)
            axios.listShips(params)
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
            this.$router.push({ path: `/init/billDetail/${target.order_code}` })
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