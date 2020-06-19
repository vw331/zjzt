<template>
  <div id="Bind">
    <div v-if="!bindSuccess">
      <div class="title">
        <img class="logo" src="../../assets/logo.png">
        <h1>用户绑定</h1>
      </div>
      <bind-form type="bind"  v-on:on-bind="bind"></bind-form>
    </div>
    <div v-else>
      <bind-hint msg="已提交成功, 等待审核~"></bind-hint>
    </div>
  </div>
</template>

<script>
  import axios from '../../api/axios'
  import BindHint from '../../components/bindHint.vue'
  import BindForm from '../../components/bindForm.vue'

  var timer
  export default {
    name: 'Bind',
    components: {
      BindHint,
      BindForm 
    },
    data () {
      return {
        bindSuccess: false
      }
    },
    methods: {
      /**
       * 用户绑定 
       */
      bind(params) {
        this.$store.commit('updateLoading', true)
        axios.bind(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code == 0) {
            this.bindSuccess = true
            this.$vux.toast.text('提交成功, 等待审核~', 'middle')
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
	/* #Bind {
		position: absolute;
		top: 50%;
		left: 50%;
		width:100%;
		transform: translate(-50%, -40%);
  } */
  #Bind {
		position: absolute;
		top: 10%;
		width:100%;
	}
  #Bind .title {
     text-align: center;
  }
  #Bind .logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }
</style>
