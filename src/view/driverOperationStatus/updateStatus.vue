<template>
  <div class="update-status">
    <group label-width="7.5em" label-margin-right="2em" label-align="left">
      <cell title="调度单编号" :value="billCode"></cell>
      <cell title="调度单状态" :value="getTitle()"></cell>
      <cell title="司机" :value="driverName"></cell>
      <cell title="手机号码" :value="driverMobile"></cell>
      <datetime v-model="time" :min-year="minYear" format="YYYY-MM-DD HH:mm" :hour-list="hourList" :minute-list="minuteList"
           @on-change="timeChange" title="选择时间"></datetime>
      <x-input title="备注" placeholder="输入备注信息" v-model="remark" placeholder-align="right" text-align="right"></x-input>
      <cell v-if="status === 'E'" title="提货单二维码"><img :src="`data:image/png;base64,${barcode}`"  width="80" height="80"></cell>
    </group>
    <p v-if="status === 'L'" style="padding:5px 16px;color:grey;">
      <i slot="icon" class='fa fa-exclamation fa-lg' style="color:red;margin-right:5px;"></i>
      请在车辆的左、右、后三个方向拍照</p>
    <add-img :photos="photos"  v-on:on-getPhotos="getPhotos"></add-img>
    <div style="padding:25px;">
      <x-button  type="primary" action-type="submit" @click.native="complete">完成</x-button>
    </div>
  </div>
</template>


<script>
  import { Cell, Group, XInput, Datetime, XButton  } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { Cookie } from '../../utils/storage'
  import AddImg from '../../components/addImg.vue'

  export default {
    name: 'UpdateStatus',
    components: {
      Cell, Group, XInput, Datetime, XButton, AddImg
    },
    data() {
      return {
        billCode: '',
        status: '',
        driverName: '',
        driverMobile: '',
        time:'请选择',
        hourList: types.HOUR_LIST,
        minuteList: types.MUNITE_LIST,
        remark:'',
        serverIds: '', // 微信返回的照片id 拼接的字符串 , 用于调度单状态更新接口
        uploadDoneNum: 0,
        photos: [],
        minYear: '',
        barcode: ''
      }
    },
    created () {
      let now = new Date()
      this.minYear = now.getFullYear()
      this.init()
    },
    mounted () {
      this.status = this.$route.query.status
      types.DEBUG_MODE ? console.log("status----------------"+this.status) : null
		  this.$store.commit('updateTitle',this.getTitle())
      this.billCode =this.$route.query.billCode
      this.driverName = this.$route.query.driverName
      this.driverMobile = this.$route.query.driverMobile
      this.barcode = this.$route.query.barcode
      this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
    },
    /**
     * 监听 $route的变化
     * 解决 $router.go 页面跳转 数据缓存问题
     */
    /* watch : {
      '$route' () {
        if(this.$route.name === 'UpdateStatus') {
          console.log("init----------------")
          this.$store.commit('updateTitle',this.getTitle())
          this.init()
        }
      } 
    },*/
    methods : {
      init() {
        this.time = this.common.getNowTime()
        this.remark = ''
        this.serverIds = ''
        this.uploadDoneNum = 0
        this.photos = []
      },
      getTitle() {
        let title=''
        switch (this.status) {
          case 'W':
            title = '提货点签到'; break;
          case 'E':
            title = '提货确认'; break;
          case 'L':
            title = '装车完成'; break;
          case 'T':
            title = '发运'; break;
          case 'D':
            title = '运抵'; break;
          default:
            break;
        }
        return title
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
        //this.$vux.toast.text(photos.length+'', 'middle')
      },  
      /**
       * 完成多张上传
       * 上传给微信服务器端, 微信服务器端返回 serverId
       */
      complete () {
        if(this.status === 'T' && this.remark === '') {
          this.$vux.toast.text(`请填写发运备注信息 !`, 'middle')
          return
        }
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
       * 完成调度单状态更新
       * post serverId 给服务端
       */
      postStatus() {
        let params = {
          bill_code: this.billCode,
          status: this.status,
          time: this.time+':00',
          message: this.remark,
          images: this.serverIds
        }
        let vue = this
        vue.$store.commit('updateLoading', true) 
        axios.updateStatus(params).then( (res) => {
          vue.$store.commit('updateLoading', false)
          if(res.code === 0){
            if(vue.$route.query.status === 'W') {
              vue.$vux.toast.text('操作成功.', 'middle')
              vue.$router.go(-2)
            }else if(vue.$route.query.status === 'D') {
              vue.$vux.confirm.show({
                title:'运抵操作成功',
                content: '是否现在签收回单？',
                onCancel () {
                  vue.$router.go(-1)
                },
                onConfirm () {
                  vue.$router.push({path:'/init/eSignature'})
                }
              })
            }else {
              vue.$vux.toast.text('操作成功.', 'middle')
              vue.$router.go(-1)
            }
          }else {
            vue.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            vue.$store.commit('updateLoading', false)
        })  
      }
    }
  }

</script>

<style less>
  .update-status {
    margin-top: 56px;
  }
  .update-status .vux-label {
    margin-bottom: 0px !important;
  }
  .fa-icon {
    color:black;
    margin-right:14px;
  }
  .update-status .vux-datetime p {
    font-weight:bold;
  }

</style>
