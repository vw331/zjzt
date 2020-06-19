<template>
    <div class="main-view-top" v-if="showDetail">
        <group label-width="5em">
            <cell title="当前状态"  :value="model.statusDes"></cell>
            <cell v-if="model.status=='2'" title="失败原因"  :value="model.statusReason"></cell>
            <cell title="预约时间"  :value="model.arriveTime"></cell>
            <cell title="预约仓库"  :value="model.warehouseName"></cell>
            <cell align-items="flex-start" title="预约地点"  :value="model.warehouseAddress"></cell>
            <cell align-items="flex-start" title="出发地" :value="model.fromAddress"></cell>
            <cell title="月台" :value="platformFormat"></cell>
            <cell title="图片"> 
                <add-img v-if="type==0" :photos="photos" read></add-img>
            </cell>              
        </group>
        <group label-width="5em" title="司机车辆信息">    
            <cell title="司机" :value="model.driverName"></cell>
            <cell title="手机号码"  :value="model.driverPhone"></cell>
            <cell title="车型"  :value="model.carVehicle"></cell>
            <cell title="车牌"  :value="model.carLicense"></cell>
            <cell align-items="flex-start" title="货品描述"  :value="model.productDes"></cell>
        </group>
        <group label-width="5em" title="其他信息">    
            <cell title="创建时间"  :value="model.createTime"></cell>
            <cell title="更新时间"  :value="model.updateTime"></cell>
            <cell title="备注"  :value="model.remark"></cell>
        </group>
    </div>
</template>
<script>
import { Group, Cell, CellBox } from 'vux'
import axios from '../../api/axios'
import { STATIC_SERVER_PATH } from '@/utils/constant'
import AddImg from '@/components/addImg.vue'

export default {
    name: 'appointmentView',
    components: { Group, Cell, CellBox, AddImg },
    data(){
        return {
            type: this.$route.params.type,
            showDetail: false,
            model: {
                "id": '',
                "operatorPhone": "",
                "operatorName": "",
                "warehouseName": "",
                "fromAddress": "",
                "driverName": "",
                "driverPhone": "",
                "driverLicense": "",
                "carVehicle": "",
                "carLicense": "",
                "productDes": "",
                "type": "",
                "typeDes": "",
                "status": "",
                "statusDes": "",
                "statusReason": "",
                "operateTime": "",
                "syncTime": "",
                "warehouseAddress": "",
                "remark": "",
                "arriveTime": "",
                "createTime": "",
                "updateTime": ""
            }
        }
    },
    created(){

        this.$store.commit('updateShowBack', true)
        this.$store.commit('updateTitle', this.typeDes)
        this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
        this.load()
    
    },
    methods: {
        load(){

            this.$store.commit('updateLoading', true)
            axios.getReservationDetail({ pk_id: this.$route.params.id })
                .then(res => {

                    const { code, data, message} = res
                    if(code == 0){
                        this.model = { ...this.model, ...data }
                        this.showDetail = true
                    }else{
                        this.$vux.toast.text(message)
                    }

                })
                .finally(res => {
                    this.$store.commit('updateLoading', false)
                })

        }
    },
    computed: {
        typeDes(){
            let typeMap = {
                "0": "送货预约详情",
                "1": "提货预约详情"                
            }
            return typeMap[this.type]
        },
        platformFormat(){
            return this.model.dockList.map(item => item.dock).join(',')
        },
        photos(){
            return this.model.assetUrls.split(',')
                .filter(item => item)
                .map((item, index) => {
                    return STATIC_SERVER_PATH + item
                })
        }
    }
}
</script>
<style scope>
    
</style>