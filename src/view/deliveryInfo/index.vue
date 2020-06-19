<template>
 <div class="delivery-info">
  <group>    
    <cell title="承运商">{{item.carrier_name}}</cell>
    <cell title="提货单号"><div class="bill-number" @click="toInvoicebill">{{item.bol_code}}</div></cell>
    <cell title="状态">{{deliveryStatus(item.status)}}</cell>
    <cell title="发货单数量">{{item.delivery_num}}</cell>
    <cell title="件数">{{item.total_quantity}}</cell>
    <cell title="重量">{{item.weight}} KG</cell>
    <cell title="体积">{{item.volume}} m³</cell>
    <cell title="提货联系电话">{{item.pickupPhone}}</cell>
    <cell title="提货时限">{{item.time_limit}}</cell>
    <cell title="提货地点">{{item.extract_site}}</cell>
    <cell title="交货地点">{{item.delivery_site}}</cell>
    <cell title="月台">{{item.platform}}</cell>
    <cell title="车型">{{item.vehicle}}</cell>
    <cell title="车牌号">{{item.license}}</cell>
    <cell title="司机">{{item.driver_name}}</cell>
    <cell title="联系电话">{{item.driver_phone}}</cell>
    <cell title="是否多点配送">{{item.multipoint}}</cell>
    <cell title="配送点位数">{{item.delivery_num}}</cell>
    <cell title="配载类型">{{item.stowage_type}}</cell>
    <cell title="配载类型">{{item.stowage_type}}</cell>

    <cell title="提货单二维码"><img :src="`data:image/png;base64,${item.barcode?item.barcode:''}`"  width="80" height="80"></cell>
  </group>
 </div>
</template>

<script>
  import { Group, Cell } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'

  /**
   * 提货单详情
   * 
   * 司机收到提货单模板通知时，调用该提货单页面
   */
  export default {
    name: 'DeliveryInfo',
    components: { Group, Cell },
    data () {
      return {
        item: {}
      }
    },
    mounted () {
      this.$store.commit('updateTitle',types.DELIVERY_INFO_TITLE)
      let params = {
        truck_loading_no: this.$route.query.truck_loading_no
      }
      this.getTruckInfo(params)
    },
    methods : {
      deliveryStatus(status) {
        let statusStr = ""
        switch(status) {
          case 'O' : statusStr = '已打开';break;
          case 'A' : statusStr = '已生效';break;
          case 'C' : statusStr = '已取消';break;
          case 'W' : statusStr = '车辆到库';break;
          case 'E' : statusStr = '提货完成';break;
          case 'L' : statusStr = '装车完成';break;
          case 'T' : statusStr = '在途';break;
          case 'D' : statusStr = '已运抵';break;
          case 'R' : statusStr = '已回单';break;
          case 'G' : statusStr = '已签收';break;
        }
        return statusStr
      },
      /**
       * 提货单订单列表
       */
      toInvoicebill() {
        let params = {
          // 后台url 会带一个 truck_loading_no 参数
          truck_loading_no:  this.$route.query.truck_loading_no,
          invoicebill: this.item
        }
        this.$router.push({path:'/init/invoicebill', query: params})
      },
      /**
       * 提货单详情列表
       */
      getTruckInfo(params) {
        this.$store.commit('updateLoading', true)
        axios.getTruckInfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.item = res.data
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

<style>
  .delivery-info {
    margin-top:46px;
  }
  .bill-number{
		color: #3b6ddd;
	}
</style>

