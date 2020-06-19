<template>
	<div id="receiptTop">
    <x-header slot="header" style="width:100%;position:fixed;left:0;top:0;z-index:10;"
	            :left-options="{showBack: false, backText: ''}"   :right-options="{showMore: false}"
	              >签收记录查询<i slot="right" class='fa fa-search fa-lg' @click="clickMore"></i>
    </x-header>
    <div v-transfer-dom>
      <popup v-model="showMenus" position="right" @on-hide="hideRightPopup">
        <div v-bind:style="{width:(common.getScreenWidth*0.8)+'px'}">
          <group title="回单查询" label-width="5.5em" label-margin-right="2em" label-align="left">
            <x-input v-model="orderCode" title="订单编号" placeholder="输入订单编号"  placeholder-align="right" text-align="right"></x-input>
            <popup-picker :popup-style="popupStyle" title="签收类型" popup-title="签收类型" :data="signTypes" v-model="signType" @on-change="check" placeholder="请选择"></popup-picker>
            <datetime v-model="startDate" format="YYYY-MM-DD" :end-date="maxDate" @on-change="startDateChange" title="开始日期"></datetime>
            <datetime v-model="endDate" format="YYYY-MM-DD" :end-date="maxDate"  @on-change="endDateChange" title="结束日期"></datetime>
          </group>
          <div style="padding:25px;">
            <x-button  type="primary" action-type="submit" @click.native="submit">完成</x-button>
          </div>
        </div>
      </popup>
    </div>
	</div>
</template>

<script>
  import { XHeader, TransferDom, Popup, Group, XInput, Datetime, PopupPicker, XButton } from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Popup,
      Group,
       XInput,
      Datetime,
      PopupPicker,
      XButton
    },
    created() {
      let now = new Date()
      this.maxDate = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
      this.popupStyle = { 'z-index' : 9999 }
    },
    data () {
      return {
        showMenus: false,
        orderCode: '',
        signType:['请选择'], 
        signTypes: [['请选择', '正常签收', '异常签收', '自提回单']],
        signTypeValues: { '正常签收': 1, '异常签收': 2, '自提回单': 30 }, 
        startDate: '',
        endDate: '',
        maxDate: '',
        popupStyle: ''
      }
    },
    methods: {
      initData() {
        this.orderCode = ''
        this.signType = ['请选择']
        this.startDate = ''
        this.endDate = ''
      },
      hideRightPopup(){
        this.initData()
      },
      clickMore() {
        this.showMenus = true
      },
      submit() {
        this.showMenus = false
        let params = {
          order_code : this.orderCode,
          sign_type : this.signType[0] === '请选择' ? '' : this.signTypeValues[this.signType[0]],
          date_start : this.startDate,
          date_end : this.endDate,
        }
        this.$emit('on-search',params)
      }
     
    }
  }
</script>

<style >
  #receiptTop{font-size: 14px}
  #receiptTop .vux-header-title {
    font-size: 18px;
    font-weight: 500;
  }
  #receiptTop .vux-datetime p {
    font-weight:bold;
  }
</style>