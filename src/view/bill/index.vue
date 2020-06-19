<template>
    <div class="main-view" v-if="bill.status">
        <div class="top-section">
            <h1 class="status_des">{{ bill.status }}</h1>
            <p class="order_number"><strong>发货单号</strong> {{ bill.billCode }}</p>
        </div>
        <group>
            <card>
                <div slot="content" class="p-sm">
                    <flexbox-item v-for="(product, i) in bill.productList" :key="i" class="products-item text-muted">
                        <span class="text-ellipsis products-item-name">{{ product.name }}</span><span>{{ product.quantity + product.unit }}</span>
                    </flexbox-item>
                </div>
            </card>    
        </group>
        <div class="toolbar-bottom p-sm text-right">
            <x-button v-if="bill.permissions.includes('签收')" mini @click.native="handleReceiptAction">签收</x-button>
            <x-button v-if="bill.permissions.includes('查看评价')" mini @click.native="handleViewAppraise">查看评价</x-button>
            <x-button v-if="bill.permissions.includes('再次评价')" mini @click.native="handleAddAppraise">再次评价</x-button>
            <x-button v-if="bill.permissions.includes('评价')" mini @click.native="handleAddAppraise">评价</x-button>
            <x-button v-show="isShowTraceBtn(bill.status)" mini :link="'/init/logisticsTrace/'+ billCode">物流</x-button>
        </div>
        <div v-transfer-dom>
            <popup v-model="showEvaluateList" position="bottom" height="80vh">
                <popup-header :title="'当前' + evaluateDetailList.length +'条评价'"></popup-header>
                <group>
                    <cell v-for="item in evaluateDetailList" 
                        :key="item.id" 
                        :title="item.createTime"
                        @click.native="handleSelectEvaluateItem(item)"
                        is-link
                        ></cell>
                </group>
            </popup>
        </div>
        <div v-transfer-dom>
            <popup v-model="showFullScreenPopup" position="right" width="100%" :should-rerender-on-show="true">
                <component v-bind:is="popupComponent" :info="popupComponentData" @close="closeFullScreenPopup"></component>
            </popup>
        </div>
    </div>
</template>

<script>
import { TransferDom, FlexboxItem, Group , Cell, Card, Badge, XButton, Popup, PopupHeader } from 'vux'
import axios from '../../api/axios'
import appraiseView from '../appraise/view'
import appraiseEdit from '../appraise/edit'

export default {
    name: 'BillDetail',
    directives: { TransferDom },
    components: { FlexboxItem, Group , Cell, Card, Badge, XButton, Popup, PopupHeader, appraiseView },
    data(){
        return {
            showEvaluateList: false,
            showFullScreenPopup: false,
            popupComponent: null,
            popupComponentData: null,
            evaluateDetailList: [],
            billCode: this.$route.params.id,
            bill: {},
        }
    },
    created(){
        this.$store.commit('updateTitle', '发货单详情')   
        this.getData()
    },
    mounted(){
        this.common.wxConfig(false, ['chooseImage','previewImage','uploadImage'])
    },
    methods: {
        isShowTraceBtn(status){
            return ['已拣取','已发运','已签收' ].includes(status)
        },
        getData(params){

            this.$store.commit('updateLoading', true)
            axios.loadStockDetail({ ship_code: this.billCode })
                .then(res => {

                    const { code, data, message } = res

                    if( code == 0 ){
                        this.bill = res.data
                    }else{
                        this.$vux.toast.show({
                            type: 'warn',
                            text: message
                        })
                    }

                })
                .finally( res => {
                    
                    this.$store.commit('updateLoading', false)
                    
                })

        },
        refresh(){
            this.showFullScreenPopup = false;
            this.evaluateDetailList = []
            this.popupComponentData = null
            this.getData()
        },
        closeFullScreenPopup(result){
            this.showFullScreenPopup = false
            result == 'success' && this.refresh()
        },
        handleReceiptAction(){
            
            this.$vux.confirm.show({
                title: '签收',
                content: '请确定收到货后签收!',
                onCancel () {  },
                onConfirm: () => {
                    
                    this.$store.commit('updateLoading', true)

                    axios.confirmReceipt({ 
                            bill_code: this.billCode,
                            receiver_tel: this.bill.receiver_tel
                        })
                        .then(res => {

                            const { code, data, message } = res

                            this.$vux.toast.show({
                                type: code == 0 ? 'success': 'warn',
                                text: message
                            })

                            code == '0' && this.getData()

                        })
                        .finally(res => {
                            this.$store.commit('updateLoading', false)
                        })


                }
            })

        },
        handleViewAppraise(){
            
            this.$store.commit('updateLoading', true)
            axios.evaluationDetail({ bill_code: this.billCode })
                .then( res => {

                    const { code, message, data } = res 
                    
                    if( code !== 0){
                        this.$vux.toast.show({
                            type: 'warn',
                            text: message
                        })
                        return false
                    }

                    this.evaluateDetailList = [ ...data ]

                    if( this.evaluateDetailList.length == 0 ){
                        
                        this.$vux.toast.show({
                            type: 'cancle',
                            text: '暂无评价'
                        })

                    }else if(this.evaluateDetailList.length == 1){

                        this.handleSelectEvaluateItem(this.evaluateDetailList[0])

                    }else{

                        this.showEvaluateList = true

                    }

                })
                .finally( res => {
                    this.$store.commit('updateLoading', false)
                })

        },
        handleAddAppraise(){
            this.showFullScreenPopup = true
            this.popupComponentData = {
                bill_code: this.billCode
            }
            this.popupComponent = appraiseEdit
        },
        handleSelectEvaluateItem(item){
            this.showFullScreenPopup = true
            this.popupComponentData = item
            this.popupComponent = appraiseView
        }
    }
}
</script>

<style scrope>
    .top-section {
        min-height: 120px;
        padding: 20px;
        background: #3b6ddd;
        color: #ffffff
    }
    .status_des {
        font-size: 28px;
        line-height: 1.6;
        color: #ffffff
    }
    .order_number {
        font-size: 16px
    }
    .dock-bottom {
        min-height: 40px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #ffffff
    }
    .products-item {
        display: flex;
        justify-content: space-between;
        font-size: small;
    }
    .products-item-name {
        flex: .8
    }
    .toolbar-bottom {
        position: fixed;
        width: 100%;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ffffff
    }
    .toolbar-bottom .weui-btn {
        margin-top: 0 !important
    }
</style>