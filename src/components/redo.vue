<template>
  <div  id="Redo">
    <div class="user-info">
      <i slot="icon" class='fa fa-smile-o fa-5x fa-grey'></i>
    </div>
    <p>{{data}}操作成功了 !</p>
    <div class="btn">
      <x-button type="primary"  @click.native="redo">再次操作</x-button>
    </div>
  </div>
</template>

<script>
  import { XButton } from 'vux'

  export default {
    name: 'Redo',
    components: {
      XButton 
    },
    data () {
      return {
        data: ''
      }
    },
    mounted () {
      this.data = this.$route.query.data
    },
    methods: {
      redo() {
        if(this.data === '司机采景') {
          this.$router.replace({name: 'DriverScene',query: { 'doInit': true }})
        }else if(this.data === '回单确认') {
          this.$router.replace({name: 'ReceiptConfirm',query: { 'doInit': true }})
        }else if(this.data === '电子签收') {
          this.$router.replace({name: 'ESignature',query: { 'doInit': true }})
        }else if(this.data === '投诉建议') {
          this.$router.replace({name: 'AddOpinion',query: { 'doInit': true }})
        }
      }
    }

  }
</script>
<style scoped>
  #Redo{
    width:100%;
    text-align: center;
    padding-top: 30%;
  }
  #Redo p{
    color: #bdb3b3;
    margin-top:10px;
  }
  .user-info{
    width:100%;
    height: 100px;
    padding: 14px 0;
    text-align: center;
  }
  .fa-grey{
    color: #dedede;
  }
  .btn {
    margin-top: 20%;
    padding: 0 auto;
    text-align: center;
    width:100%;
  }
  #Redo .weui-btn{
    line-height: 34px !important;
    height: 34px !important;
    font-size: 16px;
    width: 120px;
  }
</style>
