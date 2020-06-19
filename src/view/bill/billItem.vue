<template>
    <div class="OrderItem">
		<card class="item-card" @click.native="$emit('on-orderDetail', item)">
            <div slot="header" class="vux-1px-b card-header">
                <span class="pull-right" :class="item.orderStatusStyle">{{ item.orderStatus}}</span>
                <p tappable style="font-weight:500;" @click="$emit('on-orderDetail',item)">发货单号 :  <span class="ticket-code">{{item.order_code}}</span></p>
            </div>
            <div slot="content" class="card-body">
                <flexbox :gutter="0" orient="vertical" class="m-b-sm">
                <flexbox-item v-for="(goods, i) in item.subItemList" :key="i" class="products-item text-muted">
                    <span class="text-ellipsis products-item-name">{{ goods.item_name }}</span><span>{{ Number(goods.item_qty) + goods.item_unit  }}</span>
                </flexbox-item>
                <flexbox-item class="text-right" v-if="!item.isShowAll">
                    <a @click.stop="toggleGoodsState" class="small">{{ item.moreText }}</a>
                </flexbox-item>
                </flexbox>
                <div class="p-h-xs vux-1px-t"> 
                <p>项目编号: <span class="text-muted">{{ item.projectCode }}</span></p>
                <p>订单到达时间: <span class="text-muted">{{ item.arrive_time }}</span></p>
                <p>客户名称：<span class="text-muted">{{ item.custName }}</span></p>
                <p class="space-between"><span>收货人：</span><span class="text-muted">{{ item.receiver }}</span><span>联系方式：</span><span class="text-muted">{{ item.receiver_tel }}</span></p>
                <p>收货地址: <span class="text-muted">{{ item.receiver_address }}</span></p>
                </div>
            </div>
            <!-- <div slot="footer" class="card-footer vux-1px-t">
                <div class="text-right clearfix">
                <x-button class="pull-right" mini plain v-if="item.orderStatus == '待评价' &&  !item.evaluation" @click.native="addEvaluation(item)">评价</x-button>
                <x-button class="pull-right" mini plain v-if="item.evaluation" @click.native="showEvaluation(item.evaluation)">客户评价: <strong>{{ item.evaluation.evaluationname }} </strong></x-button>
                </div>
            </div>  -->
        </card>
	</div>
</template>

<script>

import { Card, Flexbox, FlexboxItem, XButton, XDialog, TransferDom, Popup, XInput, Group } from 'vux'
import axios from '@/api/axios'


export default {
    directives: {
      TransferDom
    },
    name: "BillItem",
    components: {
      Card, Flexbox, FlexboxItem, XButton, XDialog, Popup, XInput, Group
    },
    props: ['bill'],
    data(){
        return {
            expandAll: false,
            showDialog: false,
            curItem: '',
            comment: '',
            rateValue: 4,
            evaluation: { 4: '0', 3: '1', 2: '2', 1: '3', 0: '3'},
            evaluationName:{'0': '不满意', '1': '不满意', '2': '一般', '3': '满意', '4': '非常满意' }
        }
    },
    computed: { 
      item(){

        const target = JSON.parse(JSON.stringify( this.bill ))
        const maxLen = 3
        const styleMapping = {
          "待确认": "text-warning",
          "待拣取": "text-warning", 
          "待发运": "text-danger", 
          "待签收": "text-danger", 
          "待评价": "text-success"
        }

        return Object.assign(target, {
          orderStatusStyle: styleMapping[target.orderStatus],
          isShowAll: target.subItemList.length <= maxLen,
          moreText: this.expandAll ? '▴ 折叠': `▾ 显示剩余${ target.subItemList.length - maxLen }条信息`,
          subItemList: this.expandAll ? target.subItemList : target.subItemList.slice(0, 3)
        })

      }
    },
    methods: {

    }
}
</script>

<style>

.OrderItem {
    width:100%;
  }
  .item-card {
    margin: 10px;
    padding: 5px 5px 0;
    background: white;
    border-radius: 10px;
  }
  .item-card .card-header {
    padding: 5px 10px !important;
  }
  .item-card .card-footer {
    position: relative;
    padding: 5px
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
    padding: 10px 10px 0 ;
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
  .products-item {
    display: flex;
    justify-content: space-between;
    font-size: small;
  }
  .products-item-name {
    flex: .8
  }

</style>