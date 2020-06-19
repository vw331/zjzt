<template>
	<div id="billItem">
		<card class="item-card" v-for="item in orderItems" :key="item.index">
      <div slot="header" class="vux-1px-b card-header">
        <span class="pull-right" 
            v-bind:class="{ 
              'text-warning': (item.orderStatus == '待确认' || item.orderStatus == '待拣取'),
              'text-danger': (item.orderStatus == '待发运' || item.orderStatus == '待签收'),
              'text-success': (item.orderStatus == '待评价')
            }"
          >{{ item.orderStatus}}</span>
          <p tappable style="font-weight:500;" @click="$emit('on-orderDetail',item)">订单号 :  <span class="ticket-code">{{item.order_code}}</span></p>
      </div>
      <div slot="content" class="card-body">
        <p class="text-muted small"> 
          <flexbox>
            <flexbox-item class="item"><strong>客户名称</strong> {{ item.custName }}</flexbox-item>
          </flexbox>
          <flexbox>
            <flexbox-item class="item"><strong>收货人</strong> {{ item.receiver }}</flexbox-item>
            <flexbox-item class="item"><strong>联系方式</strong> {{ item.receiver_tel }}</flexbox-item>
          </flexbox>
        </p>
      </div>
      <div slot="footer" class="clearfix">
        <!-- <x-button mini type="primary" @click.native="$emit('on-productDetail',item)">详情</x-button> -->
        <div style="width:25px;"></div>
        <x-button class="pull-right" mini plain v-if="item.orderStatus == '待评价' &&  !item.evaluation" @click.native="addEvaluation(item)">评价</x-button>
        <x-button class="pull-right" mini plain v-if="item.evaluation" @click.native="showEvaluation(item.evaluation)">客户评价: <strong>{{ item.evaluation.evaluationname }} </strong></x-button>
      </div> 
    </card>
    <div v-transfer-dom>
      <popup v-model="showDialog" height="290px" is-transparent>
        <div style="position:relative;width: 95%;background-color:#fff;height:280px;margin:0 auto;border-radius:5px;padding-top:10px;">
          <div style="width:100%;text-align:center;">
            <item-rater :orderCode="curItem.order_code" v-bind:rateValue="rateValue" v-on:on-rate="currentRateValue"></item-rater>
          </div>
          <group v-if="(rateValue === 1 || rateValue === 0) " label-width="5.5em" label-margin-right="2em" label-align="left">
            <x-input title="不满意原因" placeholder="输入不满意原因" v-model="comment" placeholder-align="right" text-align="right"></x-input>
          </group>
          <div style="position:absolute;width:100%;bottom:10px;padding: 5px 15px 0 15px;">
            <x-button type="primary" @click.native="submit">提交</x-button>
          </div>
        </div>
      </popup>
    </div>
	</div>
</template>

<script>
  import { Card, Flexbox, FlexboxItem, XButton, XDialog, TransferDom, Popup, XInput, Group } from 'vux'
  import ItemRater from './rater.vue'
  import axios from '../../../api/axios'

  export default {
    directives: {
      TransferDom
    },
    name: "BillItem",
    components: {
      Card, Flexbox, FlexboxItem, XButton, XDialog, ItemRater, Popup, XInput, Group
    },
    props: ['items', 'tabType'],
    data () {
      return {
        bill_type: this.tabType,
        orderItems: [],
        showDialog: false,
        curItem: '',
        comment: '',
        rateValue: 4,
        evaluation: { 4: '0', 3: '1', 2: '2', 1: '3', 0: '3'},
        evaluationName:{'0': '不满意', '1': '不满意', '2': '一般', '3': '满意', '4': '非常满意' }
      }
    },
    created() {
      this.orderItems = this.items
    },
    watch: {
      items:  function(newItems, oldItems) {
        console.log( newItems )
        if(newItems.length === 0) {
          this.orderItems = []
        }else {
          this.orderItems = this.orderItems.concat(newItems)
        }
      }
    },
    methods: {
      custName (name) {
        console.log( name )
        return name.length > 6 ? name.substring(0,6)+'...' : name
      },
      addEvaluation (item) {
        this.rateValue = 4
        this.showDialog = true
        this.curItem = item
      },
      showEvaluation(content){
        this.$vux.alert.show({
          title: `客户评价:${content.evaluationname}`,
          content: `评价内容:${content.comment}`
        })

      },
      currentRateValue(value) {
        this.rateValue = value
      },
      /**
       * 客户评价提交
       */
      submit() {
        this.showDialog = false
        let params = {
          order_code: this.curItem.order_code,
          order_code_cust: this.curItem.order_code_cust,  
          evaluation: this.evaluation[this.rateValue],
          comment: this.comment,
          bill_type: this.bill_type
        }
        this.$store.commit('updateLoading', true)
        axios.addEvaluation(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0) {
            this.$vux.toast.text('感谢您的评价!', 'middle')

            Object.assign(this.curItem, { evaluation: res.data  })

          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            console.log("error="+JSON.stringify(error))
            this.$store.commit('updateLoading', false)
        })
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/close';

  #OrderItem {
    width:100%;
  }
  .item-card {
    margin: 10px;
    padding: 5px;
    background: white;
    border-radius: 10px;
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
  .item-card .weui-btn_plain-default{
    background: white;
    border-color: #cccccc;
    border-radius: 99px
  }
  .item-card .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .dialog {
    height: 260px;
  }
</style>