<template>
    <div style="height:100%;">
        <view-box ref="viewBox"  style="padding: 55px 0 0 0" body-padding-bottom="0">
            <x-header :left-options="{preventGoBack: true }" @on-click-back="$emit('close')" style="width:100%;position:absolute;left:0;top:0;">客户评价</x-header>
            <Group label-width="5em">
                <cell title="整体评价">
                    <rater v-model="overallStar" min="1"></rater>
                    <div class="rater-des">{{ overallStar | overallDes }}</div>
                </cell>
                <x-textarea title="评价内容" rows="5" v-model="evaluation"></x-textarea>
                 <cell-box>
                    <add-img :photos="photos" :count='9' v-on:on-getPhotos="getPhotos"></add-img>
                </cell-box>
            </Group>
            <Group title="其他评价">
                <cell title="接单速度">
                    <rater v-model="respondStar" min="1"></rater>
                    <div class="rater-des">{{ respondStar | respondDes }}</div>
                </cell>
                <cell title="服务评价">
                    <rater v-model="serviceStar" min="1"></rater>
                    <div class="rater-des">{{ serviceStar | serviceDes }}</div>
                </cell>
                <cell title="物流评价">
                    <rater v-model="transportStar" min="1"></rater>
                    <div class="rater-des">{{ transportStar | transportDes }}</div>
                </cell>
            </Group>
            <box gap="10px 10px">
                <x-button :disabled="submit_disabled" type="primary" action-type="submit" @click.native="complete">提交</x-button>
            </box> 
        </view-box>
    </div>
</template>

<script>
    import { ViewBox, XHeader, Rater, Group, Box, Cell, CellBox, XTextarea, XButton  } from 'vux'
    import scoreFilter from '@/filters/scoreFilter.js'
    import AddImg from '@/components/addImg.vue'
    import axios from '@/api/axios'

    export default {
        name: 'appraiseEdit',
        components: { ViewBox, XHeader, Rater, Group, Box, Cell, CellBox, XTextarea, XButton, AddImg  },
        data(){
            return {
                submit_disabled: true,
                bill_code: this.$route.params.id,
                receiver_tel: '',
                photos: [],
                imgIds: '',
                photoUploadDoneNum: 0,
                overallStar: 5,
                respondStar: 5,
                serviceStar: 5,
                transportStar: 5,
                evaluation: ''
            }
        },
        props: {
            info: { type: Object, required: true }
        },
        created(){
            this.getDetail()
        },
        mounted(){
            this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
        },
        methods: { 
            getDetail(){

                axios.loadStockDetail({ ship_code: this.bill_code })
                    .then( res => {
                        const { code, message, data } = res
                        if(code == '0'){
                            this.submit_disabled = false
                            this.receiver_tel = data.receiver_tel
                        } 
                    })

            },
            getPhotos (photos) {
                this.photos = photos
            },   
            complete () {
                let photo = this.photos[0]
                if(this.photos.length > 0) {
                    this.uploadToWeixin()
                }else {
                    this.submitOpinion()
                }
            },
            uploadToWeixin() {

                if(this.photos.length === this.photoUploadDoneNum) {
                    this.photoUploadDoneNum = 0
                    this.imgIds = this.imgIds.substring(0, this.imgIds.length-1)
                    this.submitOpinion()
                }else {
                    let _this = this

                    wx.uploadImage({ 
                        localId: _this.photos[_this.photoUploadDoneNum].toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success:  (res) => {
                            let serverId = res.serverId; // 返回图片的服务器端ID
                            _this.photoUploadDoneNum++
                            _this.$vux.toast.text(`已上传${_this.photoUploadDoneNum}张`, 'middle')
                            _this.imgIds = `${_this.imgIds}${serverId},`
                            setTimeout(_this.uploadToWeixin.bind(_this), 500)
                        },
                        fail : (res) => {
                            _this.$vux.toast.text('图片上传失败, 请尝试重新上传！', 'middle')
                        }
                    })
                }
            },
            submitOpinion(){

                if( !this.evaluation ){
                    this.$vux.toast.text("评价内容必填!")
                    return false
                }

                const result = {
                    billCode: this.bill_code,
                    receiverTel: this.receiver_tel,
                    overallStar: this.overallStar,
                    respondStar: this.respondStar,
                    serviceStar: this.serviceStar,
                    transportStar: this.transportStar,
                    evaluation: this.evaluation,
                    images: this.imgIds
                }

                this.$store.commit('updateLoading', true)

                axios.addEvaluationV2(result)
                    .then( res => {

                        const { code, data, message } = res

                        this.$vux.toast.show({
                            type: code == 0 ? 'success': 'warn',
                            text: message
                        })

                        code == 0 && setTimeout(() => {

                           this.$emit('close', 'success')     

                        }, 1500)

                    })
                    .finally(res => {
                        this.$store.commit('updateLoading', false)
                    })

            }      
        },
        filters: scoreFilter
    }
</script>

<style lang="less">

</style>