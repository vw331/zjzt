<template>
 <div class="order-detail">
  <card v-for="(item, index) in items" :key="item.index" class="item-card" >
      <div slot="header" class="vux-0px-b card-header">
          <strong>{{index+1}}、商品名称:  <span  class="ticket-code">{{item.item_name}}</span></strong>
      </div>
      <div slot="content" class="card-body">
        <p>规格:  {{item.unit}}</p>
        <p class="text-muted small"> 
          <flexbox>
            <flexbox-item>重量：{{item.weight}} kg  </flexbox-item>
            <flexbox-item>体积：{{item.volume}} m³ </flexbox-item>
            <flexbox-item>件数 : {{item.quantity}}</flexbox-item>
          </flexbox>
        </p>
      </div>
    </card>
 </div>
</template>

<script>
  import { Card, Flexbox, FlexboxItem } from 'vux'
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'

  export default {
    name: 'OrderDetail',
    components: { Card, Flexbox, FlexboxItem },
    data () {
      return {
        items: [],
      }
    },
    mounted () {
      this.$store.commit('updateTitle',types.ORDER_DETAIL_TITLE)
      this.item = this.$route.query.item
      this.listProducts()
    },
    methods: {
      listProducts() {
        let params = {
          order_id: this.item.id
        }
        this.$store.commit('updateLoading', true)
        axios.listProducts(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.items = res.data
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            console.log("error="+JSON.stringify(error))
            this.$store.commit('updateLoading', false)
        })
      },
    }
  }

</script>

<style scoped>
  .order-detail{
   /*  margin-top:60px; */
   padding-top:46px;
  }
  .item-card {
    margin: 10px;
    border-radius: 5px;
    border: 1px solid #f7f1f1;
  }
  .card-body{
    margin: 0 0 5px 0px;
  }
</style>

