<template>
  <div class="eSignature" >
    <div v-if="hasPermission">
      <group label-width="11em" label-margin-right="1.5em" label-align="left">
        <bill-code v-on:on-billCode="billCodeEvent" ></bill-code>
        <cell title="获取当前位置" :value="(province+city+district)" @click.native="showMapFence" is-link>
          <i slot="icon" class='fa fa-map-marker fa-lg fa-grey'></i>
        </cell>
        <cell title="是否在电子围栏范围内" :value="insideFence">
          <i slot="icon" v-if="insideFence === '否'" class='fa fa-exclamation fa-lg' style="color:red;margin-right:5px;"></i>
        </cell>
        <datetime v-model="sign_date" :min-year="minYear" :end-date="endDate" format="YYYY-MM-DD" :hour-list="hourList" 
            @on-change="timeChange" title="签收日期"></datetime>
      </group>
      <group title="电子回单" label-width="5.5em" label-margin-right="2em">
        <div style="position:relative;display:flex;align-items: center;left:16px;">
          <i slot="icon" v-if="signType[0] === '异常签收'" class='fa fa-exclamation fa-lg' style="color:red;margin-right:5px;"></i>
          <popup-picker title="签收类型" popup-title="签收类型" :data="signTypes" v-model="signType" @on-change="check" placeholder="请选择" class="popup-sign-type"
                 style="width:100%;margin-right:16px;"></popup-picker>
        </div>
        <popup-picker v-if="signType[0]==='异常签收'" title="异常原因" popup-title="异常原因" :data="abnormalTypes" v-model="abnormalType" @on-change="check" placeholder="请选择"></popup-picker>
        <x-input  v-if="abnormalType[0]==='其他'" title="其他原因" placeholder="其他原因备注" v-model="abnormalComment" placeholder-align="right" text-align="right"></x-input>
        <add-img :photos="receiptPhotos" :count='9'  v-on:on-getPhotos="getReceiptPhotos"></add-img>
      </group>
      <group title="货物摆放照片" label-width="5.5em" label-margin-right="2em">
        <add-img :photos="cargoPhotos" :count='9'  v-on:on-getPhotos="getCargoPhotos"></add-img>
      </group>
      <group v-if="signType[0] !== '自提回单'" title="特殊场景(可选)" label-width="120px" label-margin-right="2em">
        <popup-picker title="业务场景 场景难度" popup-title="业务场景  场景难度" :data="businessSceneAndSpecials" v-model="businessSceneAndSpecial" 
          @on-change="sceneChange" placeholder="请选择"></popup-picker>
        <x-input v-if="businessSceneAndSpecial[1]==='其他'" title="补充信息" placeholder="输入补充信息" v-model="comment" placeholder-align="right" text-align="right"></x-input>
        <add-img :photos="specScenePhotos" :count='9'  v-on:on-getPhotos="getSpecScenePhotos"></add-img>
      </group>
      
      <div style="padding:25px;">
        <x-button :disabled="disabled" type="primary" action-type="submit" @click.native="complete">完成</x-button>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showDialog" class="dialog-demo">
          <div class="img-box">
            <div id="e-container" ref="containerRef"></div>
          </div>
          <div @click="showDialog=false">
            <span class="vux-close"></span>
          </div>
        </x-dialog>
      </div>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>


<script>
  import { Cell, Group, XInput, Datetime, XButton, PopupPicker, XDialog, dateFormat, TransferDomDirective as TransferDom  } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import BillCode from '../../components/billCode.vue'
  import { setTimeout } from 'timers'
  import AddImg from '../../components/addImg.vue'
  import NoPermission from '../../components/noPermission.vue'

  /**
   * 电子签收
   */
  export default {
    directives: {
      TransferDom
    },
    name: 'ESignature',
    components: {
      Cell, Group, XInput, Datetime, XButton, PopupPicker, BillCode, XDialog, AddImg, NoPermission
    },
    data() {
      return {
        role: '',
        hasPermission: false,
        billCode: '',
        sign_date:'',
        hourList: types.HOUR_LIST,
        minuteList: types.MUNITE_LIST,
        businessSceneAndSpecial: ['请选择'],
        businessSceneAndSpecials: [['请选择','仓库', '基站', '移动签收', '直运签收'],['请选择','地面', '上楼', '上山', '其他']],
        businessSceneValues: { '仓库': 11, '基站': 12, '移动签收': 31, '直运签收': 32, },
        sceneLevelValues: { '地面': 13, '上楼': 14, '上山': 15, '其他': 16 },
        comment: '', //场景难度 补充信息
        orderSignType: '', // 订单二维码扫描获取 当前订单签收状态类型
        signType:['请选择'], 
        signTypes: [['请选择', '正常签收', '异常签收', '自提回单']],
        signTypeValues: { '正常签收': 1, '异常签收': 2, '自提回单': 30 }, 
        abnormalType:['请选择'], 
        abnormalTypes: [['请选择', '货品不符', '数量不符', '包装损坏', '其他']],
        abnormalTypeValues: { '货品不符': 3, '数量不符': 4, '包装损坏': 5, '其他': 6 },
        currentAddress: '', //当前所在位置详细
        province: '', // 省
        city: '', // 市
        district: '', // 区县
        currentPos: '', // 当前所在地经纬度
        receiptPos: '', // 订单默认签收经纬度
        receiptAddress: '',
        longitude: '', // 经度
        latitude: '', // 纬度
        insideFence: '',
        showDialog: false,
        receiptPhotos: [], // 回单
        cargoPhotos: [], // 货物摆放
        specScenePhotos: [], // 场景
        receiptImgIds: '', 
        cargoImgIds: '',
        sceneImgIds: '',
        receiptUploadDoneNum: 0,
        cargoUploadDoneNum: 0,
        sceneUploadDoneNum: 0,
        minYear: '',
        endDate: dateFormat(new Date(), 'YYYY-MM-DD') ,
        disabled: false,
        abnormalComment: '' //签收异常 其他原因 备注信息
      }
    },
    created () {
      let now = new Date()
      this.minYear = now.getFullYear()
      this.$store.commit('updateTitle',types.ESIGNATURE_TITLE)
      this.$store.commit('updateShowBack',false)
      this.sign_date = this.common.getNowDate()
      this.common.wxConfig(false, ['getLocation','chooseImage','previewImage','uploadImage','scanQRCode'])
      this.role = this.common.getRoleId()
      types.DEBUG_MODE ? this.role = '6' : null
      if( ['2','3','4','5','6'].includes(this.role) ){
        this.hasPermission = true
        if(this.$route.query.doInit) {
          this.initData()
        }
      }
    },
    methods : {
      /**
       * 数据初始化
       */
      initData () {
        this.billCode = ''
        this.sign_date = this.common.getNowDate()
        this.businessSceneAndSpecial = ['请选择']
        this.comment = ''
        this.orderSignType = ''
        this.signType = ['请选择']
        this.abnormalType = ['请选择']
        this.receiptAddress = ''
        this.insideFence = ''
        this.receiptPhotos = [],
        this.cargoPhotos = [],
        this.specScenePhotos = [],
        this.receiptImgIds = '',
        this.cargoImgIds = '',
        this.sceneImgIds = '',
        this.receiptUploadDoneNum = 0,
        this.cargoUploadDoneNum = 0,
        this.sceneUploadDoneNum = 0
      },
      /**
       * 签收类型
       */
      getSignType(value) {
        let signType = '请选择'
        switch(value) {
          case '1' : signType = '正常签收'; break;
          case '2' : signType = '异常签收'; break;
          case '30' : signType = '自提回单'; break;
          default : signType = '请选择'; break;
        }
        return signType
      },
      /**
       * 时间选择
       */
      timeChange (value) {
        this.sign_date = value
      },
      /**
       * 订单号监控 和业务逻辑处理
       */
      billCodeEvent (value) {
        this.billCode = value
        if(value !== '') {
          let params = {
            order_code : value
          }
          this.$store.commit('updateLoading', true)  
          axios.getOrderInfo(params).then( (res) => {
            this.$store.commit('updateLoading', false)
            if(res.code === 0){
              this.orderSignType = this.getSignType(res.data.sign_type)
              this.signType = [this.orderSignType]
              if(res.data.to_address !== '' && res.data.to_address !== null ) {
                this.receiptAddress = res.data.to_address
                this.getCurrentPos().then( (curPos)=> {
                  this.getGeverseGeocoder(curPos)
                  return curPos
                }).then( (curPos) =>{
                  this.getGeocoder(this.receiptAddress).then( (position) => {
                    this.receiptPos = position
                    this.fenceJudge(this.receiptPos, curPos)
                  })
                })
              }
            }else {
              this.$vux.toast.text(res.message, 'middle')
            }
          }, (error) => {
              this.$store.commit('updateLoading', false)
          })  
        }
      },  
      /**
       * 所在地 是否在交货地址电子围栏范围内 
       */
      fenceJudge(receiptPos, curPos) {
        let distance =  this.common.getDistance(receiptPos.lat, receiptPos.lng,curPos.lat,curPos.lng); //获取两地间经纬度距离
        if(distance <= types.DISTANCE_OF_FENCE) {
          this.insideFence = '是'
        }else {
          this.insideFence = '否'
        }
      },
      /**
       * 业务场景 场景难度
       */
      sceneChange (value) {
        console.log(JSON.stringify(value))
        if( value[0] === '请选择' || value[1] === '请选择') {
          this.businessSceneAndSpecial = ['请选择']
        }
      },
      /**
       * 展示腾讯地图电子围栏
       */
      showMapFence () {
        this.$store.commit('updateLoading', true) 
        this.getCurrentPos().then((position) =>{
          console.log("position="+JSON.stringify(position))
          this.currentPos = position
          if( this.receiptPos !== '') {
            this.fenceJudge(this.receiptPos, position)
          }
          let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
          if(clientHeight > 0) {
            this.$refs.containerRef.style.height = (clientHeight*0.75)+'px';
          }
          let options = {
            zoom: 13,
            center: position,
            mapTypeId: qq.maps.MapTypeId.ROADMAP,
            scaleControl: false,
            zoomControl: false,
            zoomControlOptions: {
                position: qq.maps.ControlPosition.RIGHT_BOTTOM   //设置地图控件位置靠近左侧
            },
          }
          let map = new qq.maps.Map(document.getElementById("e-container"), options)
          this.showDialog = true
          setTimeout( ()=>{
            this.$store.commit('updateLoading', false) 
            let curPosMarker = new qq.maps.Marker({
              map:map,
              position: position
            })
            var curPosLabel = new qq.maps.Label({
                position: position,
                offset: new qq.maps.Size(15,-30),
                map: map,
                content:'我的位置'
            })
            map.panTo(position)
            this.getGeverseGeocoder(position)
            if(this.receiptPos !== '') {
              var receiptMarker = new qq.maps.Marker({
                  map:map,
                  position: this.receiptPos
              });
              var label = new qq.maps.Label({
                  position: this.receiptPos,
                  offset: new qq.maps.Size(15,-30),
                  map: map,
                  content: `交货地址: ${this.receiptAddress}`
              })
              var circle=new qq.maps.Circle({ 
                map:map,
                center: this.receiptPos,
                radius:types.DISTANCE_OF_FENCE,
                strokeWeight:1
              });
              qq.maps.event.addListener(receiptMarker, 'click', function(event) {
                label.setVisible(true);
                if(label.getMap()){
                    label.setMap(null);
                }else{
                    label.setMap(map);
                }
              })
            }
          },300)
        })
      },
       /**
       * 获取当前经纬度坐标 
       */
      async getCurrentPos() {
        return new Promise((resolve, reject) => {
          wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success:  (res) => {
              console.log("res="+JSON.stringify(res))
              this.longitude = res.longitude
              this.latitude = res.latitude
              this.currentPos = new qq.maps.LatLng(res.latitude, res.longitude)
              resolve(this.currentPos)
            }
          })
        }).catch( (error)=> {
          console.log(error)
          reject(error)
        })
      },
      /**
       * 提货地点 地址解析
      */
      getGeocoder (address) {
        //调用地址解析类
        return new Promise((resolve, reject) => {
          var geocoder = new qq.maps.Geocoder({
            complete : (result) => {
              let latLng = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)
              resolve(latLng)
            },
            error : (error) => {
              this.insideFence = '否'
              this.$vux.toast.text('交货地址经纬度解析失败哦~', 'middle')
            }
          })
          geocoder.getLocation(address)
         }).catch( (error)=> {
          console.log(error)
          reject(error)
        })
      },
       /**
       * 当前地点 逆地址解析
       */
      getGeverseGeocoder (latlng) {
        var reverseGeocoder = new qq.maps.Geocoder({
          complete : (result) => {
              console.log(JSON.stringify(result))
              let addressComponents = result.detail.addressComponents ;
              this.currentAddress = (result.detail.address).substring(2)
              this.province = addressComponents.province
              this.city = addressComponents.city
              this.district = addressComponents.district
            }
        })
        reverseGeocoder.getAddress(latlng);
      },
      /**
       * 电子回单 拍照或打开相册
       */
      getReceiptPhotos (photos) {
        this.receiptPhotos = photos
      },
       /**
       * 货物摆放 拍照或打开相册
       */
      getCargoPhotos (photos) {
        this.cargoPhotos = photos
      },
      /**
       * 特殊场景 拍照或打开相册 
       */
      getSpecScenePhotos (photos) {
        this.specScenePhotos = photos
      },  
       /**
       * 完成多张上传
       * 上传给微信服务器端， 微信服务器端返回 serverId
       */
      complete () {

        //4月22日应中通要求，允许司机自提
        // if( (this.role === '5' || this.role === '3') &&  this.signType[0] === '自提回单') 
        // {  
        //   this.$vux.toast.text('抱歉, 您没有权限自提回单 !', 'middle'); 
        //   return;  
        // }        
        if( this.billCode === '') 
        {  this.$vux.toast.text('订单号不能为空哦~', 'middle');  return;  }
         if( this.currentAddress === '')
        {  this.$vux.toast.text('当前位置不能为空哦~, 请点击获取', 'middle');  return;  }
        if( this.signType[0] === '请选择') 
        {  this.$vux.toast.text('签收类型不能为空哦~', 'middle');  return;  }
        if( this.signType[0] === '异常签收' && this.abnormalType[0] === '请选择') 
        {  this.$vux.toast.text('异常签收原因不能为空哦~', 'middle');  return;  }
        if( this.receiptPhotos.length === 0) 
        {  this.$vux.toast.text('请添加电子回单照片!', 'middle');  return;  }  
         if( this.cargoPhotos.length === 0) 
        {  this.$vux.toast.text('请添加货物摆放照片!', 'middle');  return;  }  
        if( this.businessSceneAndSpecial[0] !== '请选择' && this.specScenePhotos.length === 0 ) 
        {  this.$vux.toast.text('请添加特殊场景照片!', 'middle');  return;  }  
        if( this.businessSceneAndSpecial[0] === '请选择' && this.specScenePhotos.length > 0 )
        {  this.$vux.toast.text('添加了场景照片, 必须选择特殊场景内容 !', 'middle');  return;  }
        if( !(this.insideFence === '是') ) {
          let vue = this
          vue.$vux.confirm.show({
            title:'电子签收',
            content: '所在位置在交货地点电子围栏范围之外, 确定签收 ?',
            onCancel () {},
            onConfirm () {
              vue.initImgIds()
              vue.receiptUploadToWeixin()
            }
          })
        }else {
          this.initImgIds()
          this.receiptUploadToWeixin()
        }
      },
      /**
       * 上传图片字符串初始化
       */
      initImgIds() {
        this.receiptImgIds = ''
        this.cargoImgIds = ''
        this.sceneImgIds = ''
      },
       /**
       * 电子回单 
       * 上传照片给微信服务端
       */
      receiptUploadToWeixin() {
        this.disabled = true
        if(this.receiptPhotos.length === this.receiptUploadDoneNum) {
          this.receiptUploadDoneNum = 0
          this.receiptImgIds = this.receiptImgIds.substring(0, this.receiptImgIds.length-1)
          this.cargoUploadToWeixin()
        }else {
          let vue = this
          let _this = this

            wx.uploadImage({ 
              localId: vue.receiptPhotos[vue.receiptUploadDoneNum].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success:  (res) => {
                let serverId = res.serverId; // 返回图片的服务器端ID
                vue.receiptUploadDoneNum++
                vue.$vux.toast.text(`已上传${vue.receiptUploadDoneNum}张`, 'middle')
                vue.receiptImgIds = `${vue.receiptImgIds}${serverId},`
                setTimeout(vue.receiptUploadToWeixin.bind(_this), 500)
              },
              fail : (res) => {
                
                vue.disabled = false
                vue.$vux.toast.text('电子回单图片上传失败, 请尝试重新上传！', 'middle')
              }
            })
        }
      },
      /**
       * 货物摆放 
       * 上传照片给微信服务端
       */
      cargoUploadToWeixin() {
        if(this.cargoPhotos.length === this.cargoUploadDoneNum) {
          this.cargoUploadDoneNum = 0
          this.cargoImgIds = this.cargoImgIds.substring(0, this.cargoImgIds.length-1)
          if(this.specScenePhotos.length > 0) {
            setTimeout(this.specSceneUploadToWeixin.bind(this), 500)
          }else {
            this.postSignReceipt()
          } 
        }else {
          let vue = this
          let _this = this

            wx.uploadImage({ 
              localId: vue.cargoPhotos[vue.cargoUploadDoneNum].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success:  (res) => {
                let serverId = res.serverId; // 返回图片的服务器端ID
                vue.cargoUploadDoneNum++
                vue.$vux.toast.text(`已上传${(vue.cargoUploadDoneNum+vue.receiptPhotos.length)}张`, 'middle')
                vue.cargoImgIds = `${vue.cargoImgIds}${serverId},`
                setTimeout(vue.cargoUploadToWeixin.bind(_this), 500)
              },
              fail : (res) => {
                vue.disabled = false
                
                vue.$vux.toast.text('货物摆放图片上传失败, 请尝试重新上传！', 'middle')

              }
            })

        }
      },
      /**
       * 特殊场景
       * 上传照片给微信服务端
       */
      specSceneUploadToWeixin() {
        if(this.specScenePhotos.length === this.sceneUploadDoneNum) {
          this.sceneUploadDoneNum = 0
          this.sceneImgIds = this.sceneImgIds.substring(0, this.sceneImgIds.length-1)
          this.postSignReceipt()
        }else {
          let vue = this
          let _this = this

            wx.uploadImage({ 
              localId: vue.specScenePhotos[vue.sceneUploadDoneNum].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success:  (res) => {
                let serverId = res.serverId; // 返回图片的服务器端ID
                vue.sceneUploadDoneNum++
                vue.$vux.toast.text(`已上传${(vue.sceneUploadDoneNum+vue.receiptPhotos.length+vue.cargoPhotos.length)}张`, 'middle')
                vue.sceneImgIds = `${vue.sceneImgIds}${serverId},`
                setTimeout(vue.specSceneUploadToWeixin.bind(_this),300)
              },
              fail : (res) => {
                vue.disabled = false               
                vue.$vux.toast.text('特殊场景图片上传失败, 请尝试重新上传！', 'middle')

              }
            })

        }
      },
       /**
       * 完成订单电子签收
       * post serverId 给服务端
       */
      postSignReceipt() {
        let params = {
          bill_code: this.billCode,
          biz_scene: this.businessSceneAndSpecial[0] === '请选择' ? '' : this.businessSceneValues[this.businessSceneAndSpecial[0]],
          spec_scene:  this.businessSceneAndSpecial[1] === '请选择' ? '' :  this.sceneLevelValues[this.businessSceneAndSpecial[1]],
          comment: this.comment,
          address: this.currentAddress,
          province: this.province,
          city: this.city,
          area: this.district,
          longitude: this.longitude,
          latitude: this.latitude,
          sign_date: this.sign_date,
          sign_type: this.signType[0] === '请选择' ? '' : this.signTypeValues[this.signType[0]],
          abnormal_type: this.abnormalType[0] === '请选择' ? '' : this.abnormalTypeValues[this.abnormalType[0]],
          receipt_images: this.receiptImgIds, 
          cargo_images: this.cargoImgIds,
          scene_images: this.sceneImgIds,
          abnormal: this.abnormalComment
        }
        types.DEBUG_MODE ? console.log("params="+JSON.stringify(params)) : null
        this.$store.commit('updateLoading', true)  
        axios.signReceipt(params).then( (res) => {
          this.disabled = false
          this.$store.commit('updateLoading', false)

          if(res.code === 0){

            this.$vux.toast.text('操作成功.', 'middle')
            this.$router.replace({name: 'Redo', query: { data: '电子签收' }})

          }else {

            this.$vux.toast.text(res.message, 'middle')
            this.receiptPhotos = [] // 回单
            this.cargoPhotos = [] // 货物摆放
            this.specScenePhotos = [] // 场景
              
          }

        }, (error) => {
          this.disabled = false
          this.$store.commit('updateLoading', false)
          this.$vux.toast.text('网络/服务异常', 'middle')
        })  
      }
        
    }
  }

</script>

<style lang="less" >
  @import '~vux/src/styles/close';
  .eSignature {
    margin-top: 46px;
  }
  .eSignature .vux-label {
    margin-bottom: 0px !important;
  }
  .eSignature .sign-type-wrapper{
    display:flex;
    width:100%;
    justify-content:start;
    align-items: center;
  }
  .popup-sign-type .weui-cell{
    padding: 10px 15px 10px 0 !important;
  }
  .fa-icon {
    color:black;
    margin-right:14px;
  }
  .eSignature .cell-x-icon {
    display: block;
    fill: #f3eeee;
  }
  .eSignature .vux-datetime p {
    font-weight:bold;
  }
  .eSignature .fa-grey {
    color:grey;
    margin-right:10px;
  }
  .eSignature .vux-close {
    margin-top: 8px;
    margin-bottom: 8px;
  }
  #container{
    min-width:240px;
    max-width:100%;
    min-height:360px;
  }
  .eSignature .vux-datetime p {
    font-weight:600;
  }
</style>
