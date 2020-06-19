<template>
  <div class="pick-goods-sign">
    <div id="container"></div>
    <div class="description">
      <p class="content">提货地点 : {{pickAddress}}</p>
      <p class="content">当前位置 : {{currentAddress}}</p>
      <p class="hint">到达指定提货点附近, 点击获取定位, 如果当前位置在提货点电子围栏范围内, 点击签到</p>
    </div>
    <div style="padding:10px 25px;">
      <x-button :disabled="disabled"  type="primary" @click.native="signConfirm">签到确认</x-button>
    </div>
  </div>
</template>


<script>
  import { XButton } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { Cookie } from '../../utils/storage'
  import { setTimeout } from 'timers'

  var map
  var marker
  export default {
    name: 'PickGoodsSign',
    components: {
      XButton
    },
    created() {
      this.$store.commit('updateTitle',types.PICK_GOODS_SIGN_TITLE)
      if(this.$route.query.extractSite !== undefined && this.$route.query.extractSite !== null) {
        this.pickAddress = this.$route.query.extractSite
      }else {
        this.$vux.toast.text('提货地点为空哦~', 'middle')
      }
      this.common.wxConfig(false, ['getLocation'])
    },
    mounted () {
      this.init()
    },
    data() {
      return {
        disabled: true,
        pickAddress: '', //'extractSite=浙江杭州拱墅区上塘路120号',
        currentAddress: '',
        pickPos: null,
        currentPos: null
      }
    },
    methods : {
      init () {
        wx.ready(() => {
          console.log("suceess")
          this.getGeocoder()
        })
        wx.error((res) => {
           console.log(JSON.stringify(res))
        });
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
              this.currentPos = new qq.maps.LatLng(res.latitude, res.longitude)
              resolve(this.currentPos)
            }
          })
        }).catch( (error)=> {
          console.log(error);
          reject(error)
        });
      },
      /**
       * 提货地点 地址解析
       */
      getGeocoder () {
        //调用地址解析类
        var geocoder = new qq.maps.Geocoder({
            complete : (result) => {
                this.pickPos = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)
                var myOptions = {
                  zoom: 13,
                  center: this.pickPos,
                  mapTypeId: qq.maps.MapTypeId.ROADMAP,
                  scaleControl: true,
                  zoomControlOptions: {
                      position: qq.maps.ControlPosition.RIGHT_BOTTOM   //设置地图控件位置靠近左侧
                  },
                }
                map = new qq.maps.Map(document.getElementById("container"), myOptions)
                //地图上画出提货地点
                let pickMarker = new qq.maps.Marker({
                    map:map,
                    position: this.pickPos
                });
                var label = new qq.maps.Label({
                    position: this.pickPos,
                    offset: new qq.maps.Size(15,-30),
                    map: map,
                    content:this.pickAddress
                })
                var circle=new qq.maps.Circle({ 
                  map:map,
                  center: this.pickPos,
                  radius:1000,
                  strokeWeight:1
                });
                qq.maps.event.addListener(pickMarker, 'click', function(event) {
                  label.setVisible(true);
                  if(label.getMap()){
                      label.setMap(null);
                  }else{
                      label.setMap(map);
                  }
                })
                // 创建定位按钮
                this.pickAddress !=='' ? this.createControlDiv() : null
                // 获取定位
                this.getCurrentPos().then( (curPos)=> {
                  console.log("curPos="+ JSON.stringify(curPos)) 
                  // 画出我的位置
                  var curPosLabel = new qq.maps.Label({
                      position: curPos,
                      offset: new qq.maps.Size(15,-30),
                      map: map,
                      content:'我的位置'
                  })
                  this.fenceJudge(this.pickPos,curPos)
                  marker = new qq.maps.Marker({
                    map:map,
                    position: curPos
                  })
                  this.getGeverseGeocoder(curPos)
                })
            },
            error : (error) => {
              this.$vux.toast.text('提货地址解析失败哦~', 'middle')
            }
        })
        geocoder.getLocation(this.pickAddress);
      },
      /**
       * 所在地 是否在交货地址电子围栏范围内 
       */
      fenceJudge(receiptPos, curPos) {
        let distance =  this.common.getDistance(receiptPos.lat, receiptPos.lng,curPos.lat,curPos.lng); //获取两地间经纬度距离
        if(distance < types.DISTANCE_OF_FENCE) {
          this.disabled = false
        }else {
          this.disabled = true
        }
      },
       /**
       * 当前地点 逆地址解析
       */
      getGeverseGeocoder (latlng) {
        var reverseGeocoder = new qq.maps.Geocoder({
            complete : (result) => {
              console.log(JSON.stringify(result))
              let address = result.detail.addressComponents
              this.currentAddress = (result.detail.address).substring(2)
              this.currentPos = new qq.maps.LatLng(result.detail.location.lat, result.detail.location.lng)
              console.log(JSON.stringify( this.currentPos),JSON.stringify(this.pickPos))
            }
          })
          reverseGeocoder.getAddress(latlng);
      },
      /**
       * 签到确认
       */
      signConfirm () {
        this.$router.push({path: '/init/UpdateStatus',query: this.$route.query})
      },
      /**
       * 创建定位控件
       */
      createControlDiv () {
        var anchor = new qq.maps.Point(16, 40),
        size = new qq.maps.Size(35, 40),
        origin = new qq.maps.Point(0, 0)
        let markerIcon = new qq.maps.MarkerImage("img/center.gif", size, origin, anchor)
        let CustomZoomControl = (controlDiv, map) => {
            controlDiv.style.padding = "5px 10px";
            controlDiv.style.margin = "160px 0 0 10px";
            controlDiv.style.backgroundColor = "#FFFFFF";
            controlDiv.index = 1;//设置在当前布局中的位置
            controlDiv.innerHTML = "<i class='fa fa-location-arrow fa-lg'></i>";
            qq.maps.event.addDomListener(controlDiv, "click",  (event) => {
              this.getCurrentPos().then((position) =>{
                this.fenceJudge(this.pickPos,position)
                marker != null ? marker.setMap(null) : null
                marker = new qq.maps.Marker({
                  map:map,
                  position: position
                })
                // 画出我的位置
                var curPosLabel = new qq.maps.Label({
                    position: position,
                    offset: new qq.maps.Size(15,-30),
                    map: map,
                    content:'我的位置'
                })
                map.panTo(position)
                this.getGeverseGeocoder(position)
              })
            })
        }
        //创建div元素
        var customZoomDiv = document.createElement("div")
        var customZoomControl = new CustomZoomControl(customZoomDiv, map)
        map.controls[qq.maps.ControlPosition.LEFT_CENTER].push(customZoomDiv)
      }
    }
  }

</script>

<style>
  .pick-goods-sign {
    margin-top: 46px;
    width:100%;
    height:100%;
  }
  #container{
    min-width:320px;
    min-height:300px;
  }
  .description {
    margin: 10px;
    padding: 8px 10px;
    border-bottom: 1px solid #f7f1f1;
  }
  .description .content {
    font-size: 16px;
    font-weight: 600;
  }
  .description .hint {
    margin-top: 8px;
    font-size: 14px;
    color: grey;
  }
</style>
