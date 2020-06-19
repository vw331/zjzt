<template>
  <div class="driver-operation">
    <div v-if="role === '5' || this.role === '6' ">
      <div class="task-container">
        <div v-if="!isDirectShipment" class="title">当前任务 : {{currentTask}}</div>
        <p>状态 : {{stepDetail[item.status] === '提货点签到' ? '车辆到库' : stepDetail[item.status]}}</p>
        <p>提货地点 : {{item.extract_site}}</p>
        <p>月台: {{item.platform}}</p>
      </div>
      <group>
        <cell :title="billCode" is-link class="bill-code" @click.native="toPickGoods">
          <i slot="icon" class='fa fa-truck fa-lg fa-grey'></i>
        </cell>
      </group>
      <scroller lock-x scrollbar-y use-pulldown :height="scrollerHeight" @on-pulldown-loading="refresh" ref="scrollerRef"
        :pulldown-config="{content:'下拉刷新',downContent:'下拉刷新',upContent:'释放刷新',loadingContent:'状态刷新...'}">
        <div class="flow-container">
          <flow-step v-on:on-updateStatus="driverUpdateStatus('W')" :topLine="false" :done="(step[item.status] > 0) ? true : false" title="提货点签到" 
                            content="车辆到达提货地点电子围栏范围内，在地图上获取实时定位 完成签到操作"></flow-step>
          <flow-step v-on:on-updateStatus="driverUpdateStatus('E')" :topLine="true" :done="(step[item.status] > 1) ? true : false" 
                            title="提货确认" content="完成提货确认操作, 提货时, 将提货二维码展示给交接复核人员验证"></flow-step>
          <flow-step v-on:on-updateStatus="driverUpdateStatus('L')" :topLine="true" :done="(step[item.status] > 2) ? true : false" title="装车完成" 
                            content="装车完成, 请在车辆的左、右、后三个方向拍照上传照片" ></flow-step>
          <flow-step v-on:on-updateStatus="driverUpdateStatus('T')" :hasBtn="true" :topLine="true" :done="(step[item.status] > 3) ? true : false" title="发运" 
                            content="发运操作, 必须填写备注信息"></flow-step>
          <flow-step v-on:on-onroad="driverUpdateOnroad" v-on:on-updateStatus="driverUpdateStatus('Onroad')" :topLine="true" :isOnroad="(step[item.status] > 3) ? true : false" :done="false" title="在途运输" 
                            content="允许多次在途运输填报, 获取位置信息, 拍摄照片上传"></flow-step>                  
          <flow-step v-on:on-updateStatus="driverUpdateStatus('D')" :topLine="true" :done="(step[item.status] > 4) ? true : false" title="运抵" content="运抵后, 完成整个运输流程"></flow-step>
          <div style="padding-top:25px;" v-if="(step[item.status] < 5)">
            <x-button :disabled="disabled"  type="primary" action-type="submit" @click.native="nextTask()">{{currentTask}}</x-button>
          </div>
        </div>
      </scroller>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Flow, FlowState, FlowLine, Cell, Group, XButton, Scroller  } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import FlowStep from './flowStep.vue'
  import { Cookie } from '../../utils/storage'
  import NoPermission from '../../components/noPermission.vue'

  /**
   * 司机作业
   * 
   * 司机作业状态操作页面
   */
  export default {
    name: 'DriverOperation',
    components: {
      Flow, 
      FlowState, 
      FlowLine,
      FlowStep,
      Cell,
      Group,
      XButton,
      NoPermission,
      Scroller
    },
    data () {
      return {
        item: '',
        billCode: "提货单号 : ",
        step : {'O': -2, 'A': -1, 'C': 0,  'W': 1, 'E': 2, 'L': 3, 'T': 4, 'D': 5, 'R': 6, 'G': 7 },
        stepDetail : { 'O': '已打开', 'A': '已生效', 'C': '已取消', 'W': '提货点签到', 'E': '提货确认', 'L': '装车完成', 'T': '发运', 'D': '运抵', 'R': '已回单','G': '已签收' },
        taskStep : { '提货点签到': 'W', '提货确认': 'E', '装车完成': 'L', '发运': 'T', '运抵': 'D' },
        taskStepDetail : { '1': '提货点签到', '2': '提货确认', '3': '装车完成', '4': '发运', '5': '运抵'},
        role: '',
        disabled: false,
        scrollerHeight: '400px'
      }
    },
    computed: {
      currentTask: function () {
        let taskText = '提货点签到'
        if(this.item !== '') {
          if( this.step[this.item.status] < 1 ) {
            taskText = this.stepDetail['W']
          }else if( this.step[this.item.status] >= 1 && this.step[this.item.status] < 5 ) {
            taskText = this.taskStepDetail[ (this.step[this.item.status]+1)+'' ]
          }else {
            taskText = '已完成'
            this.disabled = true
          }
        }
         return taskText
      }
    },
    mounted() {
      this.scrollerHeight = ((document.documentElement.offsetHeight || document.body.offsetHeight) - 52 - 92 - 39)+'px';
      types.DEBUG_MODE ? console.log("height="+this.scrollerHeight) : null
      this.$store.commit('updateTitle',types.DRIVER_OPERATION_TITLE)
      this.role = Cookie.get('roleId')
      types.DEBUG_MODE ? this.role = '6' : null
      if( this.role === '5' || this.role === '6' ) {
        let params = {
          truck_loading_no: this.$route.query.truck_loading_no
        }
        this.getTruckInfo(params)
      }
    },
    methods : {
      /**
       * 发货单状态刷新
       */
      refresh () {
        setTimeout(() => {
          let params = {
            truck_loading_no: this.$route.query.truck_loading_no
          }
          axios.getTruckInfo(params).then( (res) => { 
            this.$refs.scrollerRef.donePulldown()
            if(res.code === 0){
              this.item = res.data
              this.billCode = ` 提货单号 : ${this.item.bol_code} `
            }else {
              this.$vux.toast.text(res.message, 'middle')
            }
          }, (error) => {
            this.$refs.scrollerRef.donePulldown()
          })
        }, 500)
      },
      /**
       * 司机到库确认
       */
      reachConfirm(status) {
        let querys = {
          billCode: this.item.bol_code,
          status: status,
          driverName: this.item.driver_name,
          driverMobile: this.item.driver_phone,
          extractSite: this.item.extract_site
        }
        this.$router.push({path: '/init/pickGoodsSign',query: querys})
      },
      nextTask () {
        this.driverUpdateStatus(this.taskStep[this.currentTask])
      },
      /**
       * 司机更新调度单状态
       */ 
      driverUpdateStatus (status) {
        // 点击提货点签到以后的任务
        if(  !this.isDirectShipment && this.step[status] > 1 && this.step[this.item.status] < 1 ) {
          this.$vux.toast.text('提货点签到是必做操作哦~', 'middle')
          return
        }
        // 点击了已完成的任务
        if( this.step[status] <= this.step[this.item.status] ) {
          this.$vux.toast.text(`您当前已是${this.stepDetail[this.item.status]}状态 !`, 'middle')
          return
        }
        // 发运操作完成后 才能进行运抵操作
        if(status === 'D' &&  this.step[this.item.status] < 4) {
          this.$vux.toast.text('发运后才能进行此操作哦~', 'middle')
          return
        }
        if( status === 'Onroad' && this.item.status !== 'T') {
          this.$vux.toast.text('司机在途才能进行此操作哦~', 'middle')
          return
        }
        if(status === 'W') {
          this.reachConfirm(status)
        }else {
          let querys = {
            billCode: this.item.bol_code,
            status: status,
            driverName: this.item.driver_name,
            driverMobile: this.item.driver_phone,
            barcode: this.item.barcode
          }
          this.$router.push({name: 'UpdateStatus',query: querys})
        }
         
      },
      /**
       * 司机填报在途信息
       */
      driverUpdateOnroad(){
        if( this.item.status === 'T') {
          let querys = {
            billCode: this.item.bol_code,
            driverName: this.item.driver_name,
            driverMobile: this.item.driver_phone,
          }
          this.$router.push({path: '/init/UpdateOnroad',query: querys})
        }else {
          this.$vux.toast.text('司机在途才能进行此操作哦~', 'middle')
        }
      },
      getTruckInfo(params) {
        this.$store.commit('updateLoading', true)
        axios.getTruckInfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.item = res.data
            this.billCode = ` 提货单号 : ${this.item.bol_code} `
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })
      },
      /**
       * 提货单详情
       */
      toPickGoods () {
        let params = {
          truck_loading_no: this.$route.query.truck_loading_no
        }
        this.$router.push({ name: 'DeliveryInfo', query: params})
      }
    },
    computed: {
      isDirectShipment(){  //是否是直订直运
        return  (this.item.billTypeName && this.item.billTypeName == "直订直运") ? true: false
      }
    }
  }

</script>

<style>
  .driver-operation {
    padding-top: 46px;
  }
  .driver-operation .weui-grid__icon {
    padding-left:4px;
  }
  .driver-operation .weui-grid__icon + .weui-grid__label {
    margin-top:0 !important;
  }
  .flow-container {
    width:100%;
    height:100%;
    padding:10px 30px 30px 30px;
    background:white;
  }
  .driver-operation .bill-code {
    background: #2e64d8;
  }
  .fa-grey {
    color:#fff;
    margin-right:14px;
  }
  .driver-operation .vux-label {
    color:#fff;
    margin-bottom: 0px !important;
  }
  .driver-operation .weui-cell_access .weui-cell__ft:after{
    border-color: white !important;
  }
  .driver-operation .weui-cells {
    margin: 0!important;
  }
  .task-container {
    width:100%;
    height: 92px;
    background: #3b6ddd;
    padding: 0px 0 10px 16px;
    color:white;
    border:0px solid red;
  }
  .task-container .title {
    font-size: 24px;
  }
  .task-container p {
    font-size: 14px;
    color: #fcf8f8f1;
  }

</style>
