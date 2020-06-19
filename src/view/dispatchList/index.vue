<template>
  <div class="dispatch-list">
    <div  v-if="hasPermission">
      <div v-if="(items.length === 0 && noContent)" class="no-content">列表内容为空.</div>
      <card v-for="item in items" :key="item.index" class="item-card" @click.native="toTruckOrDriver(item)">
        <div slot="header" class="vux-1px-b card-header">
          <span class="pull-right" > {{ dispatchStatus(item.dispatch_status) }}</span>
          <span><strong>调度单号: {{ item.bol_code }}</strong>&nbsp;&nbsp;<span class="text-danger">{{item.billTypeName}}</span></span>
        </div>
        <div slot="content" class="card-body">
          <p>承运商：{{item.carrier_name}} 
            <span class="pull-right" style="margin-right:10px;" v-bind:class="{ 
              'text-warning': item.status === 'O' ||  item.status == 'A' ||  item.status == 'C',
              'text-danger':  item.status === 'E' ||  item.status == 'L' ||  item.status == 'W',
              'text-success': item.status === 'T' || item.status === 'D' ||  item.status == 'R' ||  item.status == 'G'
            }"
          >状态: {{ statusDetail[item.status] }}</span></p>
          <p>手机号：{{item.carrier_phone}}</p>
          <p>提货地址：{{item.extract_site}}</p>
          <p>交货地址：{{item.delivery_site}}</p>
          <p class="text-muted small">
            <flexbox>
              <flexbox-item>重量：{{item.weight}} kg  </flexbox-item>
              <flexbox-item>体积：{{item.volume}} m³ </flexbox-item>
              <flexbox-item>件数 : {{item.total_quantity}}</flexbox-item>
            </flexbox>
          </p>
        </div>
      </card>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Card, Flexbox, FlexboxItem } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { Cookie } from '../../utils/storage'
  import NoPermission from '../../components/noPermission.vue'
  
  /**
   * 调度单列表
   * 
   * 用于微信公众号菜单按钮
   * 司机、承运商都可访问该页面， 司机获取自己所有的调度单列表，承运商获取当前'待调度'的调度单列表
   */
  export default {
    name: 'DispatchList',
    components: {
      Card, Flexbox, FlexboxItem, NoPermission
    },
    mounted() {
      this.$store.commit('updateTitle',types.DISPATCH_LIST_TITLE)
      this.role = Cookie.get('roleId')
      let routeName= this.$route.query.routeName
      types.DEBUG_MODE ? this.role = '6' : null
      // '3' 承运商 '5'司机
      if( (routeName === 'TruckInfo' && ['2', '3'].includes(this.role)) || (routeName === undefined && this.role === '5') || this.role === '6'){
        this.hasPermission = true
      }else {
        this.hasPermission = false
      }
      if( this.hasPermission ) {
        this.getDispatchList()
      }
    },
    data() {
      return{
        items: '', // dispatch_status '0' 待接收  '1' 已调度 '2' 已拒绝
        role:'',
        hasPermission: false,
        noContent: false,
        statusDetail : { 'O': '已打开', 'A': '已生效', 'C': '已取消', 'W': '提货点签到', 'E': '提货确认', 'L': '装车完成', 'T': '发运', 'D': '运抵', 'R': '已回单','G': '已签收' },
      }
    },
    methods : {
      getDispatchList() {
        this.$store.commit('updateLoading', true)
        axios.getDispatchList().then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.items = res.data
            if(this.items.length === 0) {
              this.noContent = true
            }else {
              this.noContent = false
            }
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })
      },
      /**
       * 页面导航，司机和承运商跳转到不同的操作页面
       */
      toTruckOrDriver(item) {
        let params = {
          truck_loading_no:  item.bol_code,
        }
         let routeName= this.$route.query.routeName
        if((routeName === undefined && this.role === '5') || (routeName === undefined && this.role === '6')) {
          this.$router.push({path: '/init/driverOperation', query: params})
        }else if((routeName === 'TruckInfo' && ['2', '3'].includes(this.role)) || (routeName === 'TruckInfo' && this.role === '6')) {
          this.$router.push({path: '/init/truckbill', query: params})
        }
      },
      dispatchStatus(status) {
        let statusStr = ""
        switch(status) {
          case '0' : statusStr = '待接收';break;
          case '1' : statusStr = '已调度';break;
          case '2' : statusStr = '已拒绝';break;
        }
        return statusStr
      },
    }
  }

</script>

<style>
  .dispatch-list {
    margin-top: 46px;
    padding: 15px 0;
  }
   .item-card {
    margin: 10px;
    border-radius: 5px;
  }
  .card-body{
    padding: 10px;
  }
  .card-body .phone {
    margin-left: 30px;
    
  }
  .dispatch-list .vux-flexbox {
    padding: 10px 0 0 0;
    text-align:start !important;
  }
  .dispatch-list .vux-flexbox .vux-flexbox-item{
    font-size: 12px !important;
  }
  .dispatch-list .no-content {
    position: absolute;
    top:56px;
    width: 100%;
    text-align: center;
    color: #bdb8b8;
    font-size: 16px;
  }
</style>
