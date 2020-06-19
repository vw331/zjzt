<template>
    <div class="main-view-top">
        <group>
            <datetime-range title="预约时间" :start-date="allow_time_start" :end-date="allow_time_end"  v-model="model.arrive_time" icon-type="error"></datetime-range>
            <cell title="预约仓库" v-model="model.warehouse_name"  @click.native="showWarehousePopup=true" is-link></cell>
            <cell-form-preview v-if="warehouseInfo.length" :list="warehouseInfo"></cell-form-preview>
            <cell title="司机" v-model="model.driver_name" @click.native="showDriversPopup=true" is-link></cell>
            <cell-form-preview v-if="driverInfo.length"  :list="driverInfo"></cell-form-preview>
            <x-input title="出发地" v-model="model.from_address" text-align="right" placeholder="填写出发地址" :required="true" ref="formAddressRef" icon-type="error"></x-input>
            <x-input title="货品描述" v-model="model.product_des" text-align="right" placeholder="描述货品" :required="true" ref="productDesRef"></x-input>
            <x-input title="备注" v-model="model.remark"></x-input>          
        </group>
        <add-img v-if="type==0" :photos="photos"  v-on:on-getPhotos="getPhotos"></add-img>
        <box gap="10px 10px">
            <x-button type="primary"  action-type="submit" @click.native="complete">提交</x-button>
        </box>
        <div v-transfer-dom>
            <popup v-model="showWarehousePopup">
                <div style="z-index: 999">
                    <search 
                        :auto-fixed="false"
                        position="static"
                        v-model="warehouseSearchKey"
                        placeholder="查询"
                        @on-submit="handleWarehouseSearch"
                        ref="driverSearch"></search>
                    <div style="height: 80vh;overflow-y: auto">
                        <checklist ref="wareHouseObject" 
                            :options="warehouseFormatList" 
                            v-model="warehouseSelected" 
                            :max="1" 
                            @on-change="headlerWarehouseChange">
                        </checklist>
                    </div>
                </div>
            </popup>
        </div>
        <div v-transfer-dom>    
            <popup v-model="showDriversPopup">
                <div style="z-index: 999">
                    <search 
                        :auto-fixed="false"
                        position="static"
                        v-model="driverSearchKey"
                        placeholder="输入承运商信息查询司机"
                        @on-submit="handleDriverSearch"
                        ref="driverSearch"></search>
                    
                    <div style="height: 80vh;overflow-y: auto">
                        <checklist ref="driversObject" 
                            :options="driversFormatList"
                            v-model="driversSelected"
                            :max="1" 
                            @on-change="headlerDriverChange">
                        </checklist>
                    </div>
                </div>
            </popup>
        </div>
    </div>
</template>
<script>
import { TransferDom, Group, Cell, Box, DatetimeRange, CellFormPreview, dateFormat, PopupPicker, Popup, PopupHeader, XButton, Checklist, XInput, Search } from 'vux'
import axios from '../../api/axios'
import AddImg from '../../components/addImg.vue'

export default {
    name: 'appointmentEdit',
    directives: { TransferDom },
    components: { Group, Cell, Box, DatetimeRange, CellFormPreview, PopupPicker, Popup, PopupHeader, Checklist, XButton, XInput, Search, AddImg},
    data(){

        let now = new Date();
        return {
            type: this.$route.params.type,
            allow_time_start: dateFormat(now, 'YYYY-MM-DD HH:mm'), 
            allow_time_end: dateFormat( new Date(new Date().setMonth(now.getMonth()+1)), 'YYYY-MM-DD HH:mm' ),
            warehouseList: [],
            driversList: [],
            showWarehousePopup: false,
            showDriversPopup: false,
            driverSearchKey: '',
            warehouseSearchKey: '',
            model: {
                type: this.$route.params.type,
                arrive_time: dateFormat(now, 'YYYY-MM-DD HH mm').split(' '),
                warehouse_name: '',
                warehouse_address: '',
                from_address: '',
                driver_name: '',
                driver_phone: '',
                driver_license: '',
                car_vehicle: '',
                car_license: '',
                product_des: '',
                remark: '',
                images: ''
            },
            photos: [],
            serverIds: '', 
            uploadDoneNum: 0
        }

    },
    created(){
        this.$store.commit('updateShowBack', true)
        this.$store.commit('updateTitle', this.typeDes)
        this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
        this.getWarehouse('')
    },
    beforeRouteLeave(to, from, next){
        to.meta.keepAlive = false;  
        next();
    },
    computed: {
        typeDes(){
            let typeMap = {
                "0": "预约送货",
                "1": "预约提货"                
            }
            return typeMap[this.type]
        },       
        warehouseFormatList(){
            const pickerArr =  ['City', 'District', 'Neighbourhood', 'Address']
            return this.warehouseList.map((item, index) => {
                return {
                    key: `${item.WarehouseName }`,
                    value: item.WarehouseName,
                    inlineDesc: pickerArr.reduce((all, curr) => all + (item[curr] || ''), '')
                }
            })
        },
        driversFormatList(){
            return this.driversList.map((item, index) => {
                return {
                    key: `${item.driverMoblie}`,
                    value: `${item.driverName}&nbsp;&nbsp;<small class="text-muted">${item.license}</small>`,
                    inlineDesc: item.carrierName
                }
            })
        },
        warehouseSelected(){
            return this.model.warehouse_name ? [ this.model.warehouse_name ] : []
        },
        driversSelected(){
            return this.model.driver_phone ? [this.model.driver_phone] : []
        },
        validate(){
            
            const target = JSON.parse(JSON.stringify( this.model ))
            const errorMsg = []

            if( target.arrive_time.length < 0 ){  errorMsg.push('预约时间必选') }
            if( !target.warehouse_name.trim() ){ errorMsg.push('仓库必选') }
            if( !target.driver_name.trim() ){ errorMsg.push('司机必选') }
            if( !target.from_address.trim() ){ errorMsg.push('出发地必选') }
            if( !target.product_des.trim() ){ errorMsg.push('货物必填') }

            return {
                result: errorMsg.length == 0,
                msg: errorMsg
            }

        },
        warehouseInfo(){
            return this.model.warehouse_name ?  [
                { label: '仓库地址', value: this.model.warehouse_address }
            ] : []
        },
        driverInfo(){
            return this.model.driver_name ? [
                { label: '司机手机号', value: this.model.driver_phone },
                { label: '司机证件号', value: this.model.driver_license },
                { label: '车型', value: this.model.car_vehicle },
                { label: '车牌号', value: this.model.car_license }
            ] : []
        }
    },
    methods: {
        getPhotos (photos) {
            this.photos = photos
            console.log("photos="+photos.length)
        },      
        headlerWarehouseClick(){

            this.showWarehousePopup = true

        },
        handleDriverSearch(key){
            
            key = key.trim()
            key && this.getDrivers(key)

        },
        handleWarehouseSearch(key){

            this.getWarehouse(key)

        },
        getWarehouse(key){

            this.$store.commit('updateLoading', true)
            axios.getWarehouses({ warehouse_name: key })
                .then(res => {
                    const { code, data, message } = res
                    if(code == 0){
                        this.warehouseList = [...data]
                    }else{
                        this.$vux.toast.text(message)
                    }
                })
                .finally(res => {
                    this.$store.commit('updateLoading', false)
                })

        },
        getDrivers(carrier_name){

            this.$store.commit('updateLoading', true)
            axios.getDrivers({carrier_name: carrier_name})
                .then(res => {
                    const { code, data, message } = res
                    if(code == 0){
                        this.driversList = [ ...data ]
                    }else{
                        this.$vux.toast.text(message)
                    }
                })
                .finally(res => {
                    this.$store.commit('updateLoading', false)
                })

        },
        headlerWarehouseChange(val, label){

            if( val.length ){
                Object.assign(this.model, {
                    warehouse_name: val[0],
                    warehouse_address: this.warehouseFormatList.find(item => item.value == val[0]).inlineDesc
                })
                 this.showWarehousePopup = false
            }else{
                Object.assign(this.model, {
                    warehouse_name: '',
                    warehouse_address: ''
                })
            }

        },
        headlerDriverChange(val, label){

            if(val.length){
                let selected = this.driversList.find(item => item.driverMoblie == val[0] )
                Object.assign(this.model, {
                    driver_name: selected.driverName,
                    driver_phone: selected.driverMoblie,
                    driver_license: selected.drivingLicense,
                    car_vehicle: selected.vehicleType,
                    car_license: selected.license,
                })
                this.showDriversPopup = false
            }else{
                Object.assign(this.model, {
                    driver_name: '',
                    driver_phone: '',
                    driver_license: '',
                    car_vehicle: '',
                    car_license: '',
                })
            }

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
            if(this.photos.length === this.uploadDoneNum) {
                this.uploadDoneNum = 0
                this.model.images = this.serverIds.substring(0, this.serverIds.length-1)
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
        submitOpinion(){

            if(this.validate.result && this.$refs.formAddressRef.valid && this.$refs.productDesRef.valid ){
                
                let formData = JSON.parse(JSON.stringify( this.model ))
                    formData = {
                        ...formData,
                        arrive_time: `${formData.arrive_time[0]} ${formData.arrive_time[1]}:${formData.arrive_time[2]}:00`
                    } 

                this.$store.commit('updateLoading', true)
                axios.addReservation(formData)
                    .then(res => {

                        const { code, data, message } = res

                        this.$vux.toast.show({
                            type: code == 0 ? 'success': 'warn',
                            text: message
                        })

                        code == 0 && setTimeout(() => {

                            let goto = this.$route.path.replace("add", "list")
                            this.$router.push({ 
                                path: goto
                            })

                        }, 1500)

                    })
                    .finally(res => {
                        this.$store.commit('updateLoading', false)
                    })

            }else{

                this.$vux.toast.show({
                    type: 'warn',
                    text: this.validate.msg[0]
                })

            }

        }
    },
}
</script>
<style scope>

</style>