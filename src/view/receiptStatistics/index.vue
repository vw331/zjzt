<template>
  <div class="receipt-statistics">
    <div v-if="role === '5' || role === '6'">
      <top v-on:on-search="conditionSearch"></top>
      <!-- <div v-if="(total === 0)" class="no-content">没有查询到您的签收记录.</div> -->
      <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" :height="scrollerHeight" ref="pullUpRef" @on-pullup-loading="loadMore">
        <div>
          <p style="padding: 10px 10px 0 10px;color:blue;">签收记录总量 : {{total}}</p>
          <card class="item-card" v-for="(item,index) in items" :key="item.index">
            <div slot="header" class="vux-0px-b card-header">
              <span class="pull-right" style="position:relative;top:2px;">{{item.sign_typename}}</span>
              <p style="font-weight:500;font-size:16px;">{{index+1}}、订单号 :  <span>{{item.order_code}}</span></p>
            </div>
            <div slot="content" class="card-body">
              <p>签收地点 : {{item.address}}</p>
              <p class="text-muted small"> 
                <flexbox>
                  <flexbox-item class="item">签收人 <br><span class="item-name">{{item.signer_name}}</span></flexbox-item>
                  <flexbox-item class="item">签收人电话<br><span class="item-name">{{item.signer_phone}}</span></flexbox-item>
                  <flexbox-item class="item">签收日期<br><span class="item-name">{{stringSplit(item.sign_time)}}</span></flexbox-item>
                </flexbox>
              </p>
            </div>
          </card>
        </div>
      </scroller>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Group, XInput, PopupPicker, XButton, Datetime, Card, Flexbox, FlexboxItem, Scroller  } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import Top from './layout/top.vue'
  import { Cookie } from '../../utils/storage'
  import NoPermission from '../../components/noPermission.vue'

  /**
   * 签收记录查询
   */
  export default {
    name: 'ReceiptStatistics',
    components: {
      Group, XInput, PopupPicker, XButton, Datetime, Top, Card, Flexbox, FlexboxItem, Scroller, NoPermission 
    },
    data() {
      return {
        items: [],
        scrollerHeight: '400px',
        pullupConfig: {
          content: '',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '载入中...'
        },
        isScrollerOver: false,
        role: '',
        pageNum: 1,
        limit: '20',
        orderCode : '',
        signType : '',
        dateStart : '',
        dateEnd : '',
        total: 0,
      }
    },
    created () {
      this.$store.commit('updateShowBack',false)
      this.scrollerHeight = ((document.documentElement.offsetHeight || document.body.offsetHeight) - 46)+'px';
      console.log("===="+this.scrollerHeight);
      this.role = Cookie.get('roleId')
      types.DEBUG_MODE ? this.role = '6' : null
      if( this.role === '5' || this.role === '6') {
        this.search()
      }
    },
    methods : {
      stringSplit(str) {
        return (str.split(' '))[0]
      },
      /**
       * 加载更多
       */
      loadMore () {
        this.pageNum += 1
        setTimeout(() => {
          this.search()
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.pullUpRef.donePullup()
              this.$refs.pullUpRef.reset()
            })
          }, 100)
        }, 500)
      },
      /**
       * 回单条件查询
       */
      conditionSearch(params) {
        this.items = []
        this.pageNum = 1
        this.orderCode = params.order_code
        this.signType = params.sign_type
        this.dateStart = params.date_start
        this.dateEnd = params.date_end
        if(this.isScrollerOver) {
          this.isScrollerOver = false
          this.$refs.pullUpRef.enablePullup()
        }
        this.search()
      },
      search () {
        let params = {
          order_code : this.orderCode,
          sign_type : this.signType,
          date_start : this.dateStart,
          date_end : this.dateEnd,
          limit : this.limit,
          start: this.pageNum+''
        }
        this.$store.commit('updateLoading', true)
        axios.listSign(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0) {
            if(this.orderCode === '' && this.signType === '' && this.dateStart === '' && this.dateEnd === ''){
              this.total = res.data.total
            }
            this.items = this.items.concat(res.data.list)
            if(this.items.length <= this.total && !this.isScrollerOver) {
              this.isScrollerOver = true
              this.$refs.pullUpRef.disablePullup()
            }
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })
      },
    }
  }

</script>

<style less scoped>
  .receipt-statistics {
    margin-top: 46px;
  }
  .receipt-statistics .vux-label {
    margin-bottom: 0px !important;
  }
  .receipt-statistics .cell-x-icon {
    display: block;
    fill: #f3eeee;
  }
  .receipt-statistics .vux-datetime p {
    font-weight:bold;
  }
  .item-card {
    padding: 5px;
    background: white;
    border: 1px solid #f7f1f1;
  }
  .item-card .card-header {
    padding: 5px 10px !important;
  }
  .item-card .bottom-container {
    width: 100%;
    display:flex;
    justify-content: flex-end;
    padding: 5px 0;
  }
  .item-card .number{
    width:100%;
    text-align: center;
  }
  .item-card .card-body{
    padding: 0 10px;
  }
  .item-card .card-body p{
    color:grey;font-size:13px;
  }
  .item-card .card-body .item{
    padding: 5px 0;
    text-align: left;
    font-size: 12px;
    color: #444242;
  }
  .item-card .card-body .item-name{
    font-size: 12px;
    color: grey;
  }
  .receipt-statistics .no-content {
    width: 100%;
    margin-top: 2px;
    text-align: center;
    color: rgb(189, 184, 184);
    font-size: 16px;
  }
</style>
