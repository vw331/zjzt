<template>
  <div class="vehicleinfo">
    <group title="从已存在的司机中选择或输入" label-width="5em">
      <popup-picker  title="司机信息" popup-title="司机" :data="driverList" v-model="driver" @on-show="onShow" @on-hide="onHide" placeholder="请选择" @on-change="check"></popup-picker>
    </group>
    <group label-width="5.5em" label-margin-right="2em" label-align="left">
      <popup-picker title="车型" popup-title="车型选择" :data="vehicleTypeList" v-model="vehicleType" @on-change="vehicleinfoCheck" placeholder="请选择"></popup-picker>
      <x-input title="司机" placeholder="请输入司机姓名" is-type="china-name" ref="driverRef" v-model="driverName" @on-change="vehicleinfoCheck" required></x-input>
      <x-input title="手机号" placeholder="请输入司机手机号" is-type="china-mobile" ref="mobileRef" v-model="mobile" keyboard="number" @on-change="vehicleinfoCheck" required></x-input>
      <x-input title="车牌号" placeholder="请输入车牌号" :is-type="licenseValue"  ref="licenseRef"  v-model="license" @on-change="vehicleinfoCheck" required></x-input>
      <x-input title="证件号" placeholder="请输入证件号" :is-type="drivingLicenseValue"  ref="drivingLicenseRef"  v-model="drivingLicense" @on-change="vehicleinfoCheck" required></x-input>
    </group>
    <div style="padding:25px;">
      <x-button :disabled="disabled"  type="primary" action-type="submit" @click.native="complete">完成</x-button>
    </div>
  </div>
</template>

<script>
  import { Group, XInput, XButton, PopupPicker, Cell } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { router } from '../../router'

  export default {
    name: 'Vehicleinfo',
    components: {
      Group,
      XInput,
      XButton,
      PopupPicker,
      Cell 
    },
    data () {
      return {
        disabled: true,
        driverName: '',
        mobile: '',
        license: '',
        licenseValue: function(value){
          return {
            valid: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1}$/.test(value),
            msg: "车牌号有误!"
          }
        },
        vehicleType:['请选择'], 
        vehicleTypeList: [['请选择','微型车', '4.2', '5.2', '6.2', '6.8', '9.6', '13.5', '17.5']],
        drivingLicense: '',
        drivingLicenseValue: function(value){ 
          return {
            valid: value.length >= 2,
            msg: "证件号有误!"
          }
        },
        driver: ['请选择'],
        driverList: [['请选择']], 
        driverItems: [],
        vPopupPicker: {'z-index': 999,'height': '260px'}
      }
     
    },
    created(){
      this.$store.commit('updateTitle',types.VEHICLEINFO_TITLE)
      if(this.$route.query.item !== '') {
        var item = this.$route.query.item
        this.driverName = item.driver_name
        this.mobile = item.driver_phone 
        this.license = item.license
        this.vehicleType = [item.vehicle]             
        this.drivingLicense = item.driving_license
      }
    },
    methods : {
      vehicleinfoCheck() {
        if (this.$refs.driverRef.valid && this.$refs.mobileRef.valid && this.$refs.licenseRef.valid && this.vehicleType[0] !== '请选择'
            && this.$refs.drivingLicenseRef.valid) {
          this.disabled = false
        } else {
          this.disabled = true
        }
        console.log(" this.disabled="+ this.disabled)
      },
       /**
       * 司机选择
       */
      onHide() {
        if (this.driver[0] !== '请选择') {
          let arr = this.driver[0].split('|')
          this.driver[0] = arr[0]
          this.driverItems.forEach( (item) => {
            if(arr[0].trim() === item.driverName && arr[1].trim() === item.driverMoblie && arr[2].trim() === item.license) {
              this.driverName = item.driverName
              this.mobile = item.driverMoblie
              this.license = item.license
              this.vehicleType = [item.vehicleType]             
              this.drivingLicense = item.drivingLicense
            }
          })
          this.disabled = false
        } else {
          this.disabled = true
          this.driverName = ''
          this.mobile = ''
          this.license = ''
          this.vehicleType = ['请选择']
          this.drivingLicense = ''
        }
      },
      onShow () {
        this.driverList = [['请选择']]
        let params = {
          carrier_name: this.$route.query.item.carrier_name
        }
        this.$store.commit('updateLoading', true) 
        axios.getDrivers(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0) {
            if(res.data.length > 0){
              this.driverItems = res.data
              this.driverItems.forEach( (item) => {
              this.driverList[0].push(`${item.driverName} | ${item.driverMoblie} | ${item.license}`)
              })
            }else {
              this.$vux.toast.text('司机信息列表为空, 请手动编写.', 'middle')
            }
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$vux.toast.text("error=" + JSON.stringify(error), 'middle')
            this.$store.commit('updateLoading', false)
        })
      },
      complete () {
        let params = {
          truck_loading_no: this.$route.query.truck_loading_no,
          accept: this.$route.query.accept,
          license: this.license,
          vehicle: this.vehicleType[0],
          driver_name: this.driverName,
          driver_phone: this.mobile,
          driving_license: this.drivingLicense
        }
        this.$store.commit('updateLoading', true)
        axios.doAcceptBill(params).then( (res) => {
          this.$store.commit('updateLoading', false)
           if(res.code === 0) {
             this.$vux.toast.text('受理成功.', 'middle')
             router.go(-1)
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

<style>
  .vehicleinfo {
    padding-top:56px;
  }
</style>
