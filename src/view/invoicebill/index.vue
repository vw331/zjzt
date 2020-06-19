<template>
  <div class="invoicebill">
    <scroller lock-x :height="(scrollerHeight+'px')" >
      <div id="scroll-event">
        <card v-for="(item, index) in items" :key="item.index" class="item-card" @click.native="toOrderDetail(item)">
          <div slot="header" class="vux-0px-b card-header">
            <span class="pull-right" 
                v-bind:class="{ 
                  'text-warning': (item.status == 'O' || item.status == 'A' || item.status == 'C'),
                  'text-danger': (item.status == 'W' || item.status == 'E' || item.status == 'L' || item.status == 'T'),
                  'text-success': (item.status == 'D' || item.status == 'G' || item.status == 'R')
                }"
              >{{ statusValue[item.status]}}</span>
              <strong>{{index+1}}、订单号:  <span  class="ticket-code">{{item.code}}</span></strong>
          </div>
          <div slot="content" class="card-body">
            <p><img  src="../../assets/start.png" width="28" height="28">  {{item.from_address}}</p>
            <p style="margin-top:8px;padding-left:2px;"><img  src="../../assets/end.png" width="24" height="24">  {{item.to_address}}</p>
          </div>
        </card>
    </div>
    </scroller>
  </div>
</template>

<script>

import { Card, Flexbox, FlexboxItem, XHeader,Scroller } from 'vux'
import axios from '../../api/axios'
import * as types from '../../utils/constant'

/**
 * 发货单列表
 */
export default {
  name: 'Invoicebill',
  components: { Card, Flexbox, FlexboxItem, XHeader, Scroller },
 
  data () {
    return {
      scrollerHeight: 400,
      invoicebill: '',
      items: [],
      scrollTop: 0,
      lastRouteName: '',
      statusValue: {'':'', 'O':'已打开', 'A':'已生效', 'C':'已取消', 'W':'车辆到库', 'E':'提货完成', 'L':'装车完成', 'T':'在途运输', 'D':'已运抵', 'G':'已签收', 'R':'已回单'}
    }
  },
  created() {
    this.scrollerHeight = (document.documentElement.offsetHeight || document.body.offsetHeight) - 46-10;
    this.$store.commit('updateTitle',types.INVOICEBILL_TITLE)
    let params = {
				truck_loading_no: this.$route.query.truck_loading_no
    }
    this.invoicebill = this.$route.query.invoicebill
    this.getInvoiceInfo(params)
  },
  
  methods: {
    toOrderDetail (item) {
      this.$router.push({path:'/init/orderDetail', query: {item: item}})
    },
    /**
     * 获取数据
     */
    getInvoiceInfo(params) {
      this.$store.commit('updateLoading', true)
      axios.getInvoiceInfo(params).then( (res) => {
        this.$store.commit('updateLoading', false)
        if(res.code === 0){
          this.items = res.data
        }else {
          this.$vux.toast.text(res.message, 'middle')
        }
      }, (error) => {
        console.log("error="+JSON.stringify(error))
        this.$store.commit('updateLoading', false)
      })
		},
  }
  
}
</script>

<style>
  .invoicebill {
    padding-top:56px;
  }
  .invoicebill .box-body {
    padding: 8px 14px;
    background: white;
  }
  .invoicebill .box-body .number{
    width:100%;
    text-align: center;
  }
  .invoicebill .right-icon {
    font-size: 22px;
    margin: 0 2px;
  }
  .invoicebill .ticket-code{
    color: #3b6ddd;
  }
  .invoicebill .item-card {
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #f7f1f1;
  }
  .invoicebill .card-body{
    padding: 10px;
  }
  .invoicebill .vux-flexbox {
    padding: 10px 0 0 0;
    text-align: center !important;
  }
  .invoicebill .vux-flexbox .vux-flexbox-item{
    font-size: 12px !important;
  }
</style>
