<template>
  <div class="add-opinion">
    <div class="type">
      <checklist  title="建议类型" :options="radioList" v-model="radioValue" :max="1" @on-change="typeChange"></checklist>
    </div>
    <group>
      <x-textarea :max="120" :placeholder="'建议 或投诉内容'" v-model="textareaValue" @on-change="check"></x-textarea>
    </group>
    <group>
      <x-input title="联系方式" placeholder="邮箱/QQ/手机号"  v-model="information" ></x-input>
    </group>
    <add-img :photos="photos"  v-on:on-getPhotos="getPhotos"></add-img>
    <div style="padding:25px;">
      <x-button :disabled="disabled" type="primary" action-type="submit" @click.native="complete">提交</x-button>
    </div>
  </div>
</template>


<script>
  import { Checklist, Group, XTextarea, CheckIcon, XButton, XInput } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import AddImg from '../../components/addImg.vue'

  export default {
    name: 'AddOpinion',
    components: {
      Group,
      Checklist,
      XTextarea,
      CheckIcon,
      XButton,
      XInput,
      AddImg
    },
    data () {
      return {
        disabled: true,
        radioValue: ['建议'],
        radioList: [ '建议', '投诉' ],
        textareaValue: '',
        information: '',
        photos: [],
        serverIds: '', // 微信返回的照片id 拼接的字符串 , 用于调度单状态更新接口
        uploadDoneNum: 0,
      }
    },
    mounted() {
      this.$store.commit('updateTitle',types.ADD_OPINION_TITLE)
      this.$store.commit('updateShowBack',false)
      this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
      if(this.$route.query.doInit) {
        this.initData()
      }
    },
    methods : {
      /**
       * 数据初始化
       */
      initData () {
        this.radioValue = ['建议']
        this.textareaValue = ''
        this.information = ''
        this.photos = []
      },
      check () {
        if(this.textareaValue != '') {
          this.disabled = false
        }else {
          this.disabled = true
        }
      },
      typeChange (value) {
        console.log(JSON.stringify(value))
        this.radioValue = value
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
        let photo = this.photos[0]
        if(this.photos.length > 0) {
          this.uploadToWeixin()
        }else {
          this.submitOpinion()
        }
      },
      /**
       * 上传照片给微信服务端
       */
      uploadToWeixin() {
        if(this.photos.length === this.uploadDoneNum) {
          this.uploadDoneNum = 0
          this.serverIds = this.serverIds.substring(0, this.serverIds.length-1)
          this.submitOpinion()
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
      submitOpinion() {
        let params = {
          opinion: this.textareaValue, // 建议内容
          type: this.radioValue[0] === '建议' ? '2' : '1', // 建议类型(1:投诉 2:建议)
          information: this.information, // 联系方式
          images: this.serverIds
        } 
        console.log(JSON.stringify(params))
        this.$store.commit('updateLoading', true)
        axios.addOpinion(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.$vux.toast.text('提交成功.', 'middle')
            this.$router.replace({name: 'Redo', query: { data: '投诉建议' }})
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })
      },
    }
  }

</script>

<style>
  .add-opinion {
    margin-top: 56px;
  }
  .add-opinion .type {
    background: white;
  }

</style>
