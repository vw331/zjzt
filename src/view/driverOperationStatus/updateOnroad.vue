<template>
  <div class="update-onroad">
    <group label-width="5.5em" label-margin-right="2em" label-align="left">
      <cell title="调度单编号" :value="billCode"></cell>
      <cell title="当前省份" :value="province"></cell>
      <cell title="当前城市" :value="city"></cell>
      <cell title="当前区县" :value="district"></cell>
      <cell title="当前地址" :value="address"></cell>
      <cell title="司机" :value="driverName"></cell>
      <cell title="手机号码" :value="driverMobile"></cell>
      <datetime v-model="time" format="YYYY-MM-DD HH:mm" :hour-list="hourList" :minute-list="minuteList"
           @on-change="timeChange" title="选择时间"></datetime>
        <x-input title="备注" placeholder="输入备注信息" v-model="remark" placeholder-align="right" text-align="right"></x-input>
    </group>
    <add-img :photos="photos" v-on:on-getPhotos="getPhotos"></add-img>
    <div style="padding:25px;">
      <x-button  type="primary" action-type="submit" @click.native="complete">完成</x-button>
    </div>
  </div>
</template>


<script>
  import { Cell, Group, XInput, Datetime, XButton } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { Cookie } from '../../utils/storage'
  import AddImg from '../../components/addImg.vue'

  var reverseGeocoder

  export default {
    name: 'UpdateOnroad',
    components: {
      Cell, Group, XInput, Datetime, XButton, AddImg 
    },
    data() {
      return {
        billCode: '',
        driverName: '',
        driverMobile: '',
        time:'',
        province: '', // 省
        city: '', // 市
        district: '', // 区县
        address: '', // 整个地址信息
        longitude: '', // 经度
        latitude: '', // 纬度
        hourList: types.HOUR_LIST,
        minuteList: types.MUNITE_LIST,
        photos: [],
        serverIds: '', // 微信返回的照片id 拼接的字符串 , 用于调度单状态更新接口
        uploadDoneNum: 0,
        remark:''
      }
    },
    created () {
      this.time = this.common.getNowTime()
    },
    mounted () {
      this.$store.commit('updateTitle',types.UPDATE_ONROAD_TITLE)
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: Cookie.get('appId'), // 必填，公众号的唯一标识
        timestamp:  Cookie.get('timestamp'), // 必填，生成签名的时间戳
        nonceStr:  Cookie.get('nonceStr'), // 必填，生成签名的随机串
        signature:  Cookie.get('signature'),// 必填，签名
        jsApiList:  ['getLocation','chooseImage','previewImage','uploadImage'] // 必填，需要使用的JS接口列表
      })
      this.init()
    },
     /**
     * 监听 $route的变化
     * 解决 $router.go 页面跳转 数据缓存问题
     */
    watch : {
      '$route' () {
        if(this.$route.name === 'UpdateOnroad') {
          this.initData()
        }
      }
    },
    methods : {
      init () {
        wx.ready(() => {
          console.log("suceess")
          this.$store.commit('updateLoading', true) 
          setTimeout( ()=>{
            this.getCurrentLocation()
          },300)
        })
        wx.error((res) => {
           console.log(JSON.stringify(res))
        });
        this.billCode =this.$route.query.billCode
        this.driverName = this.$route.query.driverName
        this.driverMobile = this.$route.query.driverMobile
      },
      initData() {
        this.$store.commit('updateTitle',types.UPDATE_ONROAD_TITLE)
        this.time = this.common.getNowTime()
        this.serverIds = ''
        this.uploadDoneNum = 0
        this.photos = []
        this.remark = ''
      },
      /**
       * 获取当前定位
       */
      getCurrentLocation() { 
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: (res) => {
              this.$store.commit('updateLoading', false)  
              types.DEBUG_MODE ? console.log("res="+JSON.stringify(res)) : null
              let latlng = new qq.maps.LatLng(res.latitude, res.longitude)
              this.getGeverseGeocoder(latlng)
            }
          })
      },
      /**
       * 当前地点 逆地址解析
       */
      getGeverseGeocoder (latlng) {
        reverseGeocoder = new qq.maps.Geocoder({
          complete : (result) => {
              console.log(JSON.stringify(result))
              let addressComponents = result.detail.addressComponents ;
              this.province = addressComponents.province
              this.city = addressComponents.city
              this.district = addressComponents.district
              this.address = (result.detail.address).substring(2)
              this.longitude = result.detail.location.lng
              this.latitude =result.detail.location.lat
            }
        })
        reverseGeocoder.getAddress(latlng);
      },
      /**
       * 时间选择
       */
      timeChange (value) {
        this.time = value
      },
      /**
       * 拍照或打开相册
       */
      getPhotos (photos) {
        this.photos = photos
        console.log("photos="+photos.length)
      },  
      complete () {
         let photo = this.photos[0]
         if(this.photos.length > 0) {
           this.uploadToWeixin()
         }else {
           this.postStatus()
         }
      },
      /**
       * 上传照片给微信服务端
       */
      uploadToWeixin() {
        if(this.photos.length === this.uploadDoneNum) {
          this.uploadDoneNum = 0
          this.serverIds = this.serverIds.substring(0, this.serverIds.length-1)
          this.postStatus()
        }else {
          let vue = this
          wx.uploadImage({ // wxLocalRexource://564395326248118
            localId: vue.photos[this.uploadDoneNum]+'', // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success:  (res) => {
              let serverId = res.serverId; // 返回图片的服务器端ID
              vue.uploadDoneNum++
              vue.$vux.toast.text(`已上传${vue.uploadDoneNum}张`, 'middle')
              vue.serverIds = `${vue.serverIds}${serverId},`
              setTimeout(vue.uploadToWeixin(),300)
            }
          })
        }
      },
      /**
       * 完成在途上报
       * post serverId 给服务端
       */
      postStatus() {
        let params = {
          bill_code: this.billCode,
          province: this.province,
          city: this.city,
          area: this.district,
          address: this.address,
          longitude: this.longitude,
          latitude: this.latitude,
          time: this.time+':00',
          images: this.serverIds,
          message: this.remark
        }
        types.DEBUG_MODE ? console.log("params="+JSON.stringify(params)) : null
        this.$store.commit('updateLoading', true)  
        axios.addRoadinfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.$vux.toast.text('操作成功.', 'middle')
            this.$router.go(-1)
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
  .update-onroad {
    margin-top: 56px;
  }
  .update-onroad .vux-label {
    margin-bottom: 0px !important;
  }
  .fa-icon {
    color:black;
    margin-right:14px;
  }
  .update-onroad .vux-datetime p {
    font-weight:bold;
  }
</style>
