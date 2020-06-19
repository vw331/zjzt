<template>
  <div>
    <div class="add-img">
      <p v-if="showAdd" class="label">添加照片<span v-if="addCount>1">(不多于{{addCount}}张)</span></p>
      <div v-if="showAdd" class="photo-container">
        <div class="plus-box" @click="takePhoto">
          <x-icon type="ios-plus-empty" size="62" class="cell-x-icon"></x-icon>
        </div>
      </div> 
      <img v-for="photo in photos" :key="photo.id" :src="photo" class="photo"  width="64" height="64" style="margin:8px 8px 0 8px" @click="openPhoto(photo)">
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="clickMenu" show-cancel></actionsheet>
    </div>
  </div>
</template>

<script>
import { Actionsheet, TransferDom  } from 'vux'
import { Cookie } from '../utils/storage'

export default {
  name: 'AddImg',
  directives: {
    TransferDom
  },
  components: {
    Actionsheet, TransferDom
  },
  props : ['count','photos', 'read'],
  data () {
    return {
      billCode: '',
      //photos:[],
      showAdd: true,
      selectPhoto: '',
      menus: {
        '0': '预览',
        '1': '删除'
      },
      showMenus: false,
      addCount: 9
    }
  },
  created () {
    console.log( this.photos )
    if( this.read !== undefined){
      this.showAdd = false
      this.menus = {
        '0': '预览'
      }
    }
    if(this.count !== undefined && this.count != null) {
      this.addCount = this.count
    }
  },
  methods : {
    takePhoto () {
      let vue = this
      console.log(vue.photos.length)
      if(vue.photos.length < this.addCount) {
        wx.chooseImage({
          count: this.addCount, // 默认9
          sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['camera', 'album'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            res.localIds.forEach( (localId) => {
              if(vue.photos.length < this.addCount) {
                vue.photos.push(localId)
              }
            })
            this.$emit('on-getPhotos',vue.photos)
          }
        })
      }else {
        vue.$vux.toast.text(`最多上传${this.addCount}张照片`, 'middle')
      }
    },
     /**
       * Actionsheet 预览 或删除 照片
       */
      clickMenu(key, item) {
        console.log(key,item)
        if(key === '0') {  
          // 预览
          wx.previewImage({
            current: this.selectPhoto, // 当前显示图片的http链接
            urls: this.photos // 需要预览的图片http链接列表
          })
        }else if(key === '1') {
          // 删除
          for(let i=0; i<this.photos.length; i++) {
            if(this.photos[i] == this.selectPhoto) {
              this.photos.splice(i,1)
               this.$emit('on-getPhotos',this.photos)
            }
          }
        }
      },
      /**
       * 打开Actionsheet
       */
      openPhoto (photo) {
        this.selectPhoto = photo
        this.showMenus = true
      },
  }
}
</script>

<style scoped>
  .add-img {
    width:100%;
    height:100%;
    min-height: 120px;
    padding: 10px 0px;
    background: white;
    
    /* margin-top:14px;
    border-top: 1px solid #f3eeee; */
    border-bottom: 1px solid #f3eeee;
  }
  .add-img:empty {
    display: none
  }

  .add-img .label {
    margin-left: 8px;
    font-size: 14px;
    color: #b6b3b3;
    
  }
  .photo-container {
    width:100%;
    margin-left: 8px;
  }
  .photo-container .photo {
    float: left;
  }
  .photo-container .plus-box {
    float: left;
    width: 64px;
    height: 64px;
    margin:8px 10px 0 8px;
    border: 1px solid #ebe4e4;
    text-align: center;
    background: #f8f5f5;
  }
  .add-img .cell-x-icon {
    display: block;
    fill: #e4dddd;
  }
  
</style>
