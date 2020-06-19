<template>
  <div id="UpdateBind">
    <div v-if="!updateBindSuccess">
      <div class="title">
        <img class="logo" src="../../assets/logo.png">
        <h1>用户修改</h1>
      </div>
      <bind-form type="updateBind"  v-on:on-updateBind="updateBind"></bind-form>
    </div>
    <div v-else>
      <bind-hint msg="用户修改提交成功~"></bind-hint>
    </div>
  </div>
</template>

<script>
  import axios from '../../api/axios'
  import BindHint from '../../components/bindHint.vue'
  import BindForm from '../../components/bindForm.vue'

  export default {
    name: 'UpdateBind',
    components: {
      BindHint,
      BindForm 
    },
    data () {
      return {
        updateBindSuccess: false
      }
    },
    methods: {
      /**
       * 用户修改
       */
      updateBind(params) {
        this.$store.commit('updateLoading', true)
        axios.doUpdateBind(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code == 0) {
            this.updateBindSuccess = true
            this.$vux.toast.text('修改提交成功', 'middle')
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            console.log("error="+JSON.stringify(error))
            this.$store.commit('updateLoading', false)
        })
      }
    }
  }
</script>

<style>
  #UpdateBind {
		position: absolute;
		top: 10%;
		width:100%;
	}
   #UpdateBind .title {
     text-align: center;
   }
   .logo {
     width: 80px;
     height: 80px;
     border-radius: 50%;
     margin-bottom: 10px;
   }
</style>
