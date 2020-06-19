<template>
 <div class="product-detail">
  <!-- <group v-cloak>     -->
    <div class="list">
      <card class="item-card"  v-for="good in goods" :key="good.index" @click.native="goGoodsDetail(good)">
        <div slot="header" class="vux-1px-b card-header">
          <span class="pull-right text-muted">{{ good.order_status }}</span>
          <p>发货单编号 :  <span class="ticket-code">{{good.bill_code }}</span></p>
        </div>
        <div slot="content" class="card-body">
          <flexbox>
            <flexbox-item class="item"><strong>货物名称</strong> {{ good.item_name }}</flexbox-item>
            <flexbox-item class="item"><strong>货物规格</strong> {{ good.item_model }}</flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item class="item"><strong>下单时间</strong> {{ good.arrive_time }}</flexbox-item>
            <flexbox-item class="item"><strong>下单数量</strong> {{ good.arrive_qty }}</flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item class="item"><strong>收货人</strong> {{ good.receiver }}</flexbox-item>
            <flexbox-item class="item"><strong>联系方式</strong> {{ good.receiver_tel }}</flexbox-item>
          </flexbox>
        </div>
      </card>
    </div>
 </div>
</template>

<script>
  import { Group,Flexbox, FlexboxItem,  Cell, Card } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'

  export default {
    name: 'OrderDetail',
    components: { Group, Flexbox, FlexboxItem, Cell,  Card },
    data () {
      return {
        item: {order_code: '', order_detail: {}},
        goods: null
      }
    },
    mounted () {
      types.DEBUG_MODE ? console.log("orderCode=",this.$route.query.orderCode) : null
      this.getDetail()
    },
    methods: {
      /**
       * 查询详情
       */
      getDetail() {
        let params = {
          order_code: this.$route.query.orderCode
        }
        this.$store.commit('updateLoading', true)
        // 订单
        if(this.$route.query.searchType === 'order') {
          if(this.$route.query.detailType === 'orderDetail') {
            this.$store.commit('updateTitle',types.ORDER_PRODUCT_DETAIL_TITLE)
            axios.loadOrderDetail(params).then( (res) => {
              this.success(res)
            }, (error) => {
              this.error(error)
            })
          }else {
            this.$store.commit('updateTitle',types.PRODUCT_DETAIL_TITLE)
            axios.loadOrderProduct(params).then( (res) => {
              this.success(res)
            }, (error) => {
              this.error(error)
            })
          }
        }
        // 发货单
        else {
          if(this.$route.query.detailType === 'stockDetail') {
            this.$store.commit('updateTitle',types.STOCK_DETAIL_TITLE)
            axios.loadStockDetail(params).then( (res) => {
              this.success(res)
            }, (error) => {
              this.error(error)
            })
          }else {
            this.$store.commit('updateTitle',types.STOCK_PRODUCT_DETAIL_TITLE)
            axios.loadStockProduct(params).then( (res) => {
              this.success(res)
            }, (error) => {
              this.error(error)
            })
          }
        }
      },
       /**
       * 成功返回
       */
      success(res) {
        this.$store.commit('updateLoading', false)
        if(res.code === 0) {
          this.goods = res.data
          console.log( this.goods )
        }else {
          this.$vux.toast.text(res.message, 'middle')
        }
      },
      /**
       * 错误返回
       */
      error(error) {
        console.log("error="+JSON.stringify(error))
        this.$store.commit('updateLoading', false)
      },
      /*
      *查看货物详情
      */
     goGoodsDetail(item){

       var searchType = this.$route.query.searchType
       this.$router.push({name: 'goodsDetail',query: { orderCode : item.order_code, billRowid: item.bill_rowid, searchType:  searchType}})

     }
    }
  }

</script>

<style scoped>
  /* [v-cloak]{
    display:none;
  } */
  .product-detail {
    padding-top:52px;
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
    padding: 10px 10px 0 0;
  }
  .item-card .number{
    width:100%;
    text-align: center;
  }
  .right-icon {
    font-size: 22px;
    margin: 0 2px;
  }
  .ticket-code{
    color: #3b6ddd;
  }
  .item-card .card-body{
    padding: 10px 0 5px 10px;
  }
  .item-card .item {
    padding: 5px  0;
    font-size: 13px;
    text-align: left;
  }
  .item-card .card-body strong{
    font-size: 13px;
    color:#222020;
    padding-bottom: 3px;
  }
  .item-card .vux-card-content{
    padding:0 !important;
    margin: 0 !important;
  }
  .item-card .weui-btn{
    padding: 0 10px !important;
    line-height: 22px !important;
    height: 22px !important;
    margin: 0 !important;
    background: white;
    color: grey;
    font-size: 12px;
  }
  .item-card .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .dialog {
    height: 260px;
  }
</style>

