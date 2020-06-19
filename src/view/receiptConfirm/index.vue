<template>
  <div class="receipt-confirm">
    <div v-if="hasPermission">
      <group label-width="5.5em" label-margin-right="2em" label-align="left">
        <bill-code v-on:on-billCode="billCodeEvent" ></bill-code>
        <datetime v-model="time" :min-year="minYear" format="YYYY-MM-DD HH:mm" :hour-list="hourList" :minute-list="minuteList"
            @on-change="change" title="选择时间"></datetime>
      </group>
      <div style="padding:25px;">
        <x-button :disabled="disabled"  type="primary" action-type="submit" @click.native="complete">完成</x-button>
      </div>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Cell, Group, XInput, Datetime, XButton  } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import BillCode from '../../components/billCode.vue'
  import NoPermission from '../../components/noPermission.vue'

  /**
   * 实物回单
   * 签收之后，才能回单
   */
  export default {
    name: 'ReceiptConfirm',
    components: {
      Cell, Group, XInput, Datetime, XButton, BillCode, NoPermission
    },
    data() {
      return {
        role: '',
        hasPermission: false,
        billCode: '',
        time: '',
        disabled: true,
        hourList: types.HOUR_LIST,
        minuteList: types.MUNITE_LIST,
        minYear: ''
      }
    },
    created () {
      let now = new Date()
      this.minYear = now.getFullYear()
      this.$store.commit('updateTitle',types.RECEIPT_CONFIRM_TITLE)
      this.$store.commit('updateShowBack',false)
      this.time = this.common.getNowTime()
      this.common.wxConfig(false, ['scanQRCode'])
      this.role = this.common.getRoleId()
      if( this.role === '4' || this.role === '6') {
        this.hasPermission = true
        if(this.$route.query.doInit) {
          this.initData()
        }
      }
      types.DEBUG_MODE ? this.role = '6' : null
    },
    methods : {
      /**
       * 数据初始化
       */
      initData () {
        this.billCode = ''
        this.time = this.common.getNowTime()
      },
      billCodeEvent (value) {
        this.billCode = value
         if(this.time !== '' && this.billCode !== '') {
          this.disabled = false
        }else {
          this.disabled = true
        }
      },
      change (value) {
        console.log(value)
        if(this.time !== '' && this.billCode !== '') {
          this.disabled = false
        }else {
          this.disabled = true
        }
      },
      /**
       * 完成实物回单
       */
      complete() {
        let params = {
          bill_code: this.billCode,
          time: this.time+':00',
        }
        types.DEBUG_MODE ? console.log("params="+JSON.stringify(params)) : null
        this.$store.commit('updateLoading', true)  
        axios.addReceiptinfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.$vux.toast.text('操作成功.', 'middle')
            this.$router.replace({name: 'Redo', query: { data: '回单确认' }})
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })  
      }
    }
  }

</script>

<style less>
  .receipt-confirm {
    margin-top: 56px;
  }
  .receipt-confirm .vux-label {
    margin-bottom: 0px !important;
  }
  .fa-icon {
    color:black;
    margin-right:14px;
  }
  .receipt-confirm .cell-x-icon {
    display: block;
    fill: #f3eeee;
  }
  .receipt-confirm .vux-datetime p {
    font-weight:bold;
  }
</style>
