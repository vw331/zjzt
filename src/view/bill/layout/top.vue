<template>
	<div id="billTop">
		<x-header title="发货单查询" style="width:100%;position:fixed;left:0;top:0;z-index:100;"
	              :left-options="{showBack: showBack, backText: ''}" :right-options="{showMore: false}">
        <div class="overwrite-title-tab" slot="overwrite-title">
          <x-button mini type="primary" :link="{path: '/orderSearch'}">订单</x-button><i></i>
          <x-button mini>发货单</x-button>
        </div>
        <i slot="right" class='fa fa-search fa-lg' @click="showPopup = true "></i>
    </x-header>

    <div v-transfer-dom>
      <popup  v-model="showPopup" position="right" @on-hide="hideRightPopup" width="100%">
        <popup-header
          right-text="取消"
          title="发货单查询"
          :show-bottom-border="false"
          @on-click-right="showPopup = false"></popup-header>
        <group  label-width="6em" label-margin-right="2em" label-align="left">
          <x-input v-model="params.bill_code" title="发货单号" placeholder="发货单编号"  placeholder-align="right" text-align="right"></x-input>
          <x-input v-model="params.project_code" title="项目编号" placeholder="项目编号" placeholder-align="right" text-align="right"></x-input>
          <x-input v-model="params.receiver_name" title="收货人" placeholder="输入收货人"  placeholder-align="right" text-align="right"></x-input>
          <x-input v-model="params.receiver_phone" title="收货人电话" placeholder="输入收货人电话"  placeholder-align="right" text-align="right"></x-input>
          <x-input v-model="params.customer_name" title="客户单位名称" placeholder="输入客户单位名称"  placeholder-align="right" text-align="right"></x-input>
          <datetime v-model="params.date_start" format="YYYY-MM-DD" :end-date="maxDate" title="下单开始日期"></datetime>
          <datetime v-model="params.date_end" format="YYYY-MM-DD" :end-date="maxDate"  title="下单结束日期"></datetime>
        </group>
        <div style="padding:25px;">
          <x-button  type="primary" action-type="submit" @click.native="submit">查询</x-button>
        </div>
      </popup>
    </div>
	</div>
</template>

<script>
  import {XHeader, PopupHeader , Divider, ButtonTab, ButtonTabItem, TransferDom, Popup, Group, XInput, Datetime, PopupPicker, XButton} from 'vux'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ButtonTab,
      ButtonTabItem,
      Popup,
      PopupHeader,
      Group,
      XInput,
      Datetime,
      PopupPicker,
      Divider,
      XButton
    },
    props: ['btnTab'],
    data () {
      let now = new Date()

      return {
        showPopup: false,
        popupStyle: { 'z-index' : 9999 },
        maxDate: `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`,
        params: {
          bill_code: '',
          project_code: '',
          receiver_name: '',
          receiver_phone: '',
          customer_name: '',
          date_start: '',
          date_end: ''
        }
      }
    },
    created() {

    },
    methods: {
      initData() {
        this.bill_code = ''
        this.project_code = ''
        this.receiver_name = ''
        this.receiver_phone = ''
        this.customer_name = ''
        this.date_start = ''
        this.date_end = ''
      },
      hideRightPopup(){
        this.initData()
      },
      buttonTabOnClick () {
        this.$emit('on-btnTab',this.tabItem)
      },
      submit() {
        this.$emit('on-search', JSON.parse(JSON.stringify( this.params )))
        this.showPopup = false
      }
    }
  }
</script>

<style >
  #billTop .vux-header-title {
    font-size: 18px;
    font-weight: 500;
  }
  #billTop .menu {
    margin-right: 70px;
  }
  #billTop .menu div {
    color: #000;
  }
  #billTop .menu:before {
    right: -70px;
  }
  #billTop .overwrite-title {
    margin-top: 5px;
  }
  .vux-datetime p {
    font-weight:bold;
  }
</style>
