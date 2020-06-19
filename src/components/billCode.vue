<template>
  <div class="bill-code">
    <x-input title="订单号" placeholder="扫码或手动输入" debounce="1000" v-model="billCode" class="weui-vcode" @on-change="change" ></x-input>
    <div class="img-container">
      <img src="../assets/QR.png" width="22" height="22" @click="scanQRCode">
    </div>
  </div>
</template>

<script>
import { XInput  } from 'vux'
import { Cookie } from '../utils/storage'

export default {
  name: 'BillCode',
  components: {
    XInput
  },
  data () {
    return {
      billCode: ''
    }
  },
  methods : {
    scanQRCode () {
      let vue = this
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success:  (res) => {
          var serialNumber = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          var serial = serialNumber.split(",");
          vue.billCode = serial[serial.length-1];
          vue.$emit('on-billCode',vue.billCode);
        }
      })
    },
    change (value) {
      this.$emit('on-billCode',value)
    }
  }
}
</script>

<style>
  .bill-code{
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding-right:16px;
  }
  .bill-code .img-container{
    height: 22px;
    min-width:50px;
    border-left:1px solid #ebe4e4;
    text-align: end;
    padding-right: 5px;
  }
  .bill-code img{
    min-width: 22px;
  }
  
</style>
