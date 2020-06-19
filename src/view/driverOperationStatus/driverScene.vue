<template>
  <div class="driver-scene">
    <div v-if="['2', '3', '4', '5', '6'].includes( this.role )">
      <group label-width="5.5em" label-margin-right="2em" label-align="left">
        <bill-code v-on:on-billCode="billCodeEvent" ></bill-code>
        <popup-picker title="业务场景" popup-title="业务场景" :data="businessScenes" v-model="businessScene" @on-change="sceneChange" placeholder="请选择"></popup-picker>
        <popup-picker title="场景难度" popup-title="场景难度" :data="sceneLevels" v-model="sceneLevel" @on-change="sceneChange" placeholder="请选择"></popup-picker>
        <x-input v-if="sceneLevel[0]==='其他'" title="补充信息" placeholder="输入补充信息" v-model="comment" placeholder-align="right" text-align="right"></x-input>
        <cell title="当前地址" :value="address"></cell>
        <!-- <cell title="当前经度" :value="longitude"></cell>
        <cell title="当前纬度" :value="latitude"></cell> -->
      </group>
      <add-img :photos="photos"  v-on:on-getPhotos="getPhotos"></add-img>
      <div style="padding:25px;">
        <x-button :disabled="disabled"  type="primary" action-type="submit" @click.native="complete">完成</x-button>
      </div>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Cell, Group, XInput, XButton, PopupPicker } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import BillCode from '../../components/billCode.vue'
  import { Cookie } from '../../utils/storage'
  import AddImg from '../../components/addImg.vue'
  import NoPermission from '../../components/noPermission.vue'


  export default {
    name: 'DriverScene',
    components: {
      Cell, Group, XInput, XButton, PopupPicker , BillCode, AddImg, NoPermission
    },
    data() {
      return {
        role: '',
        billCode: '', 
        disabled: true,
        businessScene:['请选择'], 
        businessScenes: [['请选择', '仓库', '基站', '移动签收', '直运签收']],
        businessSceneValues: { '仓库': 11, '基站': 12, '移动签收': 31, '直运签收': 32, },
        sceneLevel:['请选择'], 
        sceneLevels: [['请选择', '地面', '上楼', '上山', '其他']],
        sceneLevelValues: { '地面': 13, '上楼': 14, '上山': 15, '其他': 16 },
        address: '', // 整个地址信息
        province: '', // 省
        city: '', // 市
        district: '', // 区县
        longitude: '', // 经度
        latitude: '', // 纬度
        photos: [],
        serverIds: '', // 微信返回的照片id 拼接的字符串 , 用于调度单状态更新接口
        uploadDoneNum: 0,
        comment: ''
      }
    },
    mounted () {
      this.$store.commit('updateTitle',types.UPLOAD_IMG_FOR_ORDER_TITLE)
      this.$store.commit('updateShowBack',false)
      this.common.wxConfig(false, ['getLocation','chooseImage','previewImage','uploadImage','scanQRCode'])
      this.role = Cookie.get('roleId')
      if( ['2', '3', '4', '5', '6'].includes( this.role ) ) {
        if(this.$route.query.doInit) {
          this.initData()
        }
        this.init()
      }
      types.DEBUG_MODE ? this.role = '6' : null
    },
    methods : {
      /**
       * 数据初始化
       */
      initData () {
        this.billCode = ''
        this.businessScene = ['请选择']
        this.sceneLevel = ['请选择']
        this.photos = []
        this.serverIds = ''
        this.uploadDoneNum = 0
        this.comment = ''
      },
      /**
       * wx sdk 初始化
       */
       init () {
        wx.ready(() => {
          this.$store.commit('updateLoading', true) 
          setTimeout( ()=>{
            this.getCurrentLocation()
          },300)
        })
        wx.error((res) => {
           console.log(JSON.stringify(res))
        })
      },
      billCodeEvent (value) {
        console.log(value)
        this.billCode = value
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
        var  reverseGeocoder = new qq.maps.Geocoder({
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
      sceneChange(value) {
        if(this.businessScene[0] !== '请选择' && this.sceneLevel[0] !== '请选择') {
          this.disabled = false
        }else {
          this.disabled = true
        }
      },
      /**
       * 拍照或打开相册
       */
      getPhotos (photos) {
        this.photos = photos
        console.log("photos="+photos.length)
      },          
      /**
       * 完成多张上传
       * 上传给微信服务器端， 微信服务器端返回 serverId
       */
      complete () {
        if(this.billCode === '') {
          this.$vux.toast.text('订单号不能为空哦~', 'middle')
          return
        }
        let photo = this.photos[0]
        if(this.photos.length > 0) {
          this.uploadToWeixin()
        }else {
          this.postDriverScene()
        }
      },
      /**
       * 上传照片给微信服务端
       */
      uploadToWeixin() {
        if(this.photos.length === this.uploadDoneNum) {
          this.uploadDoneNum = 0
          this.serverIds = this.serverIds.substring(0, this.serverIds.length-1)
          this.postDriverScene()
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
       * 完成司机采景
       * post serverId 给服务端
       */
      postDriverScene() {
        let params = {
          bill_code: this.billCode,
          biz_scene: this.businessSceneValues[0] === '请选择' ? '' : this.businessSceneValues[this.businessScene[0]],
          spec_scene: this.sceneLevelValues[0] === '请选择' ? '' : this.sceneLevelValues[this.sceneLevel[0]],
          address: this.address,
          province: this.province,
          city: this.city,
          area: this.district,
          longitude: this.longitude,
          latitude: this.latitude,
          comment: this.comment,
          images: this.serverIds
        }
        types.DEBUG_MODE ? console.log("params="+JSON.stringify(params)) : null
        this.$store.commit('updateLoading', true)  
        axios.addSceneinfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.$vux.toast.text('操作成功.', 'middle')
            this.$router.replace({name: 'Redo', query: { data: '司机采景' }})
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
  .driver-scene {
    margin-top: 46px;
  }
  .driver-scene .vux-label {
    margin-bottom: 0px !important;
  }
  .fa-icon {
    color:black;
    margin-right:14px;
  }
  .driver-scene .vux-datetime p {
    font-weight:bold;
  }
</style>
