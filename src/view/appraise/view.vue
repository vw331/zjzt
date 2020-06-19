<template>
    <div style="height:100%;">
        <view-box ref="viewBox"  style="padding: 55px 0 0 0" body-padding-bottom="0">
            <x-header :left-options="{preventGoBack: true }" @on-click-back="$emit('close')" style="width:100%;position:absolute;left:0;top:0;">客户评价</x-header>
            <Group label-width="5em">
                <cell title="整体评价">
                    <rater :disabled="true" v-model="info.overallStar" min="1"></rater>
                    <div class="rater-des">{{ info.overallStar | overallDes }}</div>
                </cell>
                <cell title="接单速度">
                    <rater :disabled="true" v-model="info.respondStar" min="1"></rater>
                    <div class="rater-des">{{ info.respondStar | respondDes }}</div>
                </cell>
                <cell title="服务评价">
                    <rater :disabled="true" v-model="info.serviceStar" min="1"></rater>
                    <div class="rater-des">{{ info.serviceStar | serviceDes }}</div>
                </cell>
                <cell title="物流评价">
                    <rater :disabled="true" v-model="info.transportStar" min="1"></rater>
                    <div class="rater-des">{{ info.transportStar | transportDes }}</div>
                </cell>
                <cell title="评价内容" align-items="flex-start" :value="info.evaluation" style="min-height:10rem"></cell>
                <cell title="图片"> 
                    <add-img :photos="photos" read></add-img>
                </cell> 
            </Group>
            <Group style="margin-top:10px">
                <cell title="评价时间" :value="info.createTime"></cell>
                <cell title="评价人" :value="info.operatorName"></cell>
            </Group>
        </view-box>
    </div>
</template>

<script>
    import { ViewBox, XHeader, Rater, Group, Box, Cell, CellBox, XTextarea  } from 'vux'
    import scoreFilter from '@/filters/scoreFilter.js'
    import AddImg from '@/components/addImg.vue'
    import { STATIC_SERVER_PATH } from '@/utils/constant'

    export default {
        name: 'appraiseView',
        components: { ViewBox, XHeader, Rater, Group, Box, Cell, CellBox, XTextarea, AddImg  },
        data(){
            return {
               
            }
        },
        props: {
            info: { type: Object, required: true }
        },
        created(){
        },
        mounted(){
            this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
        },
        methods: {         
        },
        computed: {
            photos(){
                return this.info.assetUrls.split(',')
                    .filter(item => item)
                    .map((item, index) => {
                        console.log(item )
                        return STATIC_SERVER_PATH + item
                    })
            }
        },
        filters: scoreFilter
    }
</script>

<style lang="less">

</style>