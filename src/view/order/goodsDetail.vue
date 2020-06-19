<template>
 <div class="product-detail">
  <!-- <group v-cloak>     -->
   <div class="list" v-if="item">
      <group label-width="6.5em">  
        <cell title="订单状态" v-if="item.order_status">{{item.order_status}}</cell>   
      </group>

      <card class="item-card">
        <div slot="header" class="vux-1px-b card-header">下单信息</div>
        <div slot="content" class="card-body">
          <p class="text-muted small">            
            <flexbox>
              <flexbox-item class="item" v-if="item.arrive_qty"><strong>下单数量</strong> {{ item.arrive_qty }}</flexbox-item>
              <flexbox-item class="item" v-if="item.arrive_man"><strong>下单人</strong> {{ item.arrive_man }}</flexbox-item>
            </flexbox>
            <flexbox orient="vertical" :gutter="0">
              <flexbox-item class="item" v-if="item.arrive_time"><strong>下单时间</strong> {{ item.arrive_time }}</flexbox-item>
              <flexbox-item class="item" v-if="item.arrive_loc"><strong>下单地点</strong> {{ item.arrive_loc }}</flexbox-item>
            </flexbox>           
          </p>
        </div>
      </card>

      <card class="item-card">
        <div slot="header" class="vux-1px-b card-header">拣货信息</div>
        <div slot="content" class="card-body">
          <p class="text-muted small">            
            <flexbox>
              <flexbox-item class="item" v-if="item.pick_qty"><strong>拣货数量</strong> {{ item.pick_qty }}</flexbox-item>
              <flexbox-item class="item" v-if="item.pick_man"><strong>拣货人</strong> {{ item.pick_man }}</flexbox-item>
            </flexbox>
            <flexbox orient="vertical" :gutter="0">
              <flexbox-item class="item" v-if="item.pick_time"><strong>拣货时间</strong> {{ item.pick_time }}</flexbox-item>              
              <flexbox-item class="item" v-if="item.pick_loc"><strong>拣货地点</strong> {{ item.pick_loc }}</flexbox-item>
            </flexbox>           
          </p>
        </div>
      </card>

      <card class="item-card">
        <div slot="header" class="vux-1px-b card-header">发运信息</div>
        <div slot="content" class="card-body">
          <p class="text-muted small">            
            <flexbox>
              <flexbox-item class="item" v-if="item.ship_qty"><strong>发运数量</strong> {{ item.ship_qty }}</flexbox-item>
              <flexbox-item class="item" v-if="item.ship_man"><strong>发运人</strong> {{ item.ship_man }}</flexbox-item>
            </flexbox>
            <flexbox orient="vertical" :gutter="0">
              <flexbox-item class="item" v-if="item.ship_time"><strong>发运时间</strong> {{ item.ship_time }}</flexbox-item>             
              <flexbox-item class="item" v-if="item.ship_loc"><strong>发运地点</strong> {{ item.ship_loc }}</flexbox-item>
            </flexbox>           
          </p>
        </div>
      </card>

      <card class="item-card">
        <div slot="header" class="vux-1px-b card-header">签收信息</div>
        <div slot="content" class="card-body">
          <p class="text-muted small">            
            <flexbox>
              <flexbox-item class="item" v-if="item.deliver_qty"><strong>签收数量</strong> {{ item.deliver_qty }}</flexbox-item>
              <flexbox-item class="item" v-if="item.deliver_man"><strong>签收人</strong> {{ item.deliver_man }}</flexbox-item>
            </flexbox>
            <flexbox orient="vertical" :gutter="0">
              <flexbox-item class="item" v-if="item.deliver_time"><strong>签收时间</strong> {{ item.deliver_time }}</flexbox-item>              
              <flexbox-item class="item" v-if="item.deliver_loc"><strong>签收地点</strong> {{ item.deliver_loc }}</flexbox-item>
            </flexbox>           
          </p>
        </div>
      </card>

      <template v-if="showAll">   
        <card class="item-card">
          <div slot="header" class="vux-1px-b card-header">其他信息</div>
          <div slot="content" class="card-body">
            <p class="text-muted small">            
              <flexbox orient="vertical" :gutter="0">
                <flexbox-item class="item" v-if="item.order_code"><strong>订单编号</strong> {{ item.order_code }}</flexbox-item>
                <flexbox-item class="item" v-if="item.item_name"><strong>货品名称</strong> {{ item.item_name }}</flexbox-item>
                <flexbox-item class="item" v-if="item.item_model"><strong>规格型号</strong> {{ item.item_model }}</flexbox-item>
                <flexbox-item class="item" v-if="item.order_rowid"><strong>订单行号</strong> {{ item.order_rowid }}</flexbox-item>
                <flexbox-item class="item" v-if="item.bill_code"><strong>发货单编号</strong> {{ item.bill_code }}</flexbox-item>
                <flexbox-item class="item" v-if="item.bill_rowid"><strong>发货单行号</strong> {{ item.bill_rowid }}</flexbox-item>
                <flexbox-item class="item" v-if="item.factory_deliver_time"><strong>厂家发运时间</strong> {{ item.factory_deliver_time }}</flexbox-item>
                <flexbox-item class="item" v-if="item.driver_tel"><strong>司机电话</strong> {{ item.driver_tel }}</flexbox-item>
                <flexbox-item class="item" v-if="item.receiver"><strong>收货人</strong> {{ item.receiver }}</flexbox-item>
                <flexbox-item class="item" v-if="item.receiver_tel"><strong>收货人电话</strong> {{ item.receiver_tel }}</flexbox-item>
              </flexbox>           
            </p>
          </div>
        </card>

        <card class="item-card">
          <div slot="header" class="vux-1px-b card-header">订单信息</div>
          <div slot="content" class="card-body">
            <p class="text-muted small">            
              <flexbox orient="vertical" :gutter="0">
                <flexbox-item class="item"><strong>受理数量(总)</strong> {{ item.order_qty_all }}</flexbox-item>
                <flexbox-item class="item"><strong>受理时间(总)</strong> {{ item.order_time_all }}</flexbox-item>
                <flexbox-item class="item"><strong>拣货数量(总)</strong> {{ item.pick_qty_all }}</flexbox-item>
                <flexbox-item class="item"><strong>拣货时间(总)</strong> {{ item.pick_time_all }}</flexbox-item>
                <flexbox-item class="item"><strong>发运数量(总)</strong> {{ item.ship_qty_all }}</flexbox-item>
                <flexbox-item class="item"><strong>发运时间(总)</strong> {{ item.ship_time_all }}</flexbox-item>
                <flexbox-item class="item"><strong>签收数量(总)</strong> {{ item.deliver_qty_all }}</flexbox-item>
                <flexbox-item class="item"><strong>签收时间(总)</strong> {{ item.deliver_time_all }}</flexbox-item>
              </flexbox>           
            </p>
          </div>
        </card>
      </template>  
      <div class="show-more" @click="showAll = !showAll" style="margin-top: 10px">
        <a href="javascript:;">{{ showAll ? '显示主要内容': '显示更多' }}<i class="arrow" :class="[showAll ? 'down' : 'up' ]"></i></a>
      </div>
   </div>  
 </div>
</template>

<script>
  import { Group,Flexbox, FlexboxItem,  Cell, Card } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'

  export default {
    name: 'GoodsDetail',
    components: { Group, Flexbox, FlexboxItem, Cell,  Card },
    data () {
      return {
        showAll: false,
        item: null
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
          order_code: this.$route.query.orderCode,
          bill_rowid: this.$route.query.billRowid
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
          this.item = res.data
          console.log( this.item )
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
    }
  }

</script>

<style scoped>
  /* [v-cloak]{
    display:none;
  } */
  .product-detail {
    padding-top:32px;
  }
  .bill-number{
		color: #3b6ddd;
	}
  .show-more {
    padding: 15px; 
    text-align: center;
    background-color: #ffffff;
  }
  .arrow {
    display: inline-block;
    width: 10px;
    height: 10px;
    position: relative;
  }
  .arrow:after {
    content: '';
    display: block;
    position: absolute;
    top: 3px;
    left: 6px;
    border-width: 4px;
    border-style: solid;
    
  }
  .arrow.up:after {
    border-color: #666666 transparent transparent transparent
  }
  .arrow.down:after {
    top: 0;
    border-color: transparent transparent #666666  transparent
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
    padding: 8px 0 5px 8px;
  }
  .item-card .item {
    padding:  2px 0;
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
  
</style>

