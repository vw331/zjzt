<template>
	<div id="Rater">
    <div class="rater-title">
      客户评价
    </div>
    <p style="padding:5px;">订单号 :  <span>{{orderCode}}</span></p>
    <rater v-model="rateValue" :min=1 :max=4 :font-size=35  :margin=10 ></rater>
    <p class="rater-name">{{rateText[rateValue]}}</p>
	</div>
</template>

<script>
  import { Rater, Group, Cell } from 'vux'

  export default {
    name: "ItemRater",
    components: {
      Rater, Group, Cell
    },
    props: ['rateValue','orderCode'],
    data () {
      return {
        rateText:{'0': '不满意', '1': '不满意', '2': '一般', '3': '满意', '4': '非常满意' }
      }
    },
    watch:{
      rateValue(val, oldVal) {
        this.$emit('on-rate',val); 
      },
    }
  }
</script>

<style>
  #Rater {
    padding:0;
  }
  .rater-wrapper {
    padding: 10px;
  }
  .rater-name {
    padding: 10px;
  }
  .rater-title {
    width:100%;
    line-height: 30px;
    margin: 5px 0;
    color: grey;
    text-align: center;
    border-bottom: 1px solid #f1eeee;
  }
  .rater-code{
    width:100%;
    text-align: left;
  }

</style>