<template>
    <div>
        <div class="main-view"  v-if="order.order_code">

            <div class="top-section">
                <h1 class="status_des">{{ order.order_status }}</h1>
                <p class="order_number"><strong>中通订单号</strong> {{ order.order_code }}</p>
                <p class="order_number"><strong>原订单号</strong> {{ order.order_code_cust }}</p>
            </div>

            <group label-width="4em">
                <cell title="收货" primary="content">
                    <div class="font-14 text-left p-h-xs">
                        <p  class="space-between"><span>收货人：{{ order.receiver }}</span><span>联系方式：{{ order.receiver_tel }}</span></p>
                        <p>收货地址：{{ order.receiver_address }}</p>
                    </div>
                </cell>
            </group>

            <group title="发货单">
                <cell
                    v-for="billItem in order.billInfo" :key="billItem.billCode"
                    :title="billItem.billCode"
                    @click.native="handleBillClick(billItem)"
                    is-link>
                </cell>
            </group>

            <group title="商品">
                <card>
                    <div slot="content" class="p-sm">
                        <template v-if="productList.length">
                            <flexbox-item  v-for="(product, i) in productList" :key="i" class="products-item text-muted">
                                <span class="text-ellipsis products-item-name">{{ product.name }}</span><span>{{ product.quantity + product.unit }}</span>
                            </flexbox-item>
                        </template>
                        <p v-else class="p-md text-center">暂无商品</p>
                    </div>
                </card>
            </group>

        </div>
        <order-receiving :show="showReceiving" @change="handleChangeReceiving" @hide="handleReceiving"></order-receiving>
    </div>
</template>
<script>

import { FormPreview, FlexboxItem, Group , Cell, Card, Badge, XButton   } from 'vux'
import axios from '../../api/axios'
import orderReceiving from './orderReceiving'

export default {
    name: 'RealOrderDetail',
    components: { FormPreview, FlexboxItem, Group , Cell, Card, Badge, XButton, orderReceiving  },
    data(){
        return {
            orderId: this.$route.params.id,
            order: {},
            showReceiving: false
        }
    },
    created(){

        this.$store.commit('showBack', true)
        this.$store.commit('updateTitle', '订单详情')
        this.$route.params.id && this.getData({ order_code:  this.$route.params.id })

    },
    updated(){

    },
    computed: {
        productList(){

            const billList = this.order.billInfo || [];
            return billList.reduce((total, current) => {
                return total.concat(current.productList)
            }, [])

        }
    },
    methods: {
        getData(params){

            this.$store.commit('updateLoading', true)
            axios.loadOrderDetail(params)
                .then(function(res){
                    const { code, message, data } = res

                    if( code !== 0){
                        this.$vux.toast.show({
                            type: 'warn',
                            text: message
                        })
                        return false
                    }

                    this.order = res.data

                }.bind(this))
                .finally( res => {
                    this.$store.commit('updateLoading', false)
                })

        },
        error(msg){
            this.$vux.alert.show({
                title: '提醒',
                content: msg,
                onHide () {  this.$router.go(-1)  }
            })
        },
        handleBillClick(bill){
            this.$router.push({ path: `/init/billDetail/${bill.billCode}` })
        },
        handleReceiving(){
            this.showReceiving = !this.showReceiving
        },
        handleChangeReceiving(result){
            console.log( result )
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
</style>
