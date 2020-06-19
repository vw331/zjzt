<template>
  <div id="BindForm">
      <group label-width="5.5em" label-margin-right="2em" label-align="left">
        <x-input title="用户姓名" placeholder="请输入您的姓名" is-type="china-name" placeholder-align="right" text-align="right" ref="nameRef" v-model="name" @on-change="bindCheck" required></x-input>
        <x-input title="手机号码" placeholder="请输入您的手机号码" is-type="china-mobile" placeholder-align="right" text-align="right" ref="mobileRef" v-model="mobile" keyboard="number" @on-change="bindCheck" required></x-input>
        <x-input title="验证码" placeholder="请输入验证码"  :is-type="codeValue" class="weui-vcode" ref="codeRef"  v-model="code" keyboard="number" @on-change="bindCheck" required>
          <x-button slot="right" type="primary" @click.native="sendSMSCode" mini>
            <span v-if="!sendSMSSuccess">发送验证码</span>
            <span v-else>{{count}} 秒后重试</span>
            </x-button>
        </x-input>
        <x-input title="单位名称" placeholder="请输入您的单位名称" :is-type="companyValue" placeholder-align="right" ref="companyRef" text-align="right" v-model="company" @on-change="bindCheck" required></x-input>
        <popup-picker title="用户类型" popup-title="用户类型" :data="typeList" v-model="role" @on-change="onChange" placeholder="请选择"></popup-picker>
      </group>
      
      <div style="padding:25px;">
        <x-button :disabled="disabled"  type="primary" action-type="submit" @click.native="updateOrBind">提交</x-button>
      </div>
  </div>

</template>

<script>
  import { Group, PopupPicker, XInput, XButton } from 'vux' 
  import axios from '../api/axios'
  import { setTimeout, clearTimeout } from 'timers'

  var timer
  export default {
    name: 'BindForm',
    components: {
      Group,
      PopupPicker,
      XInput,
      XButton
    },
    props: ['type'],
    data () {
      return {
        disabled: true,
        sendSMSSuccess: false,
        count: 60,
        name: '',
        mobile: '',
        code:'',
        codeValue: function(value){
          return {
            valid: value.length >= 4,
            msg: "验证码有误!"
          }
        },
        company:'',
        companyValue: function(value){
          return {
            valid: value.length >= 2,
            msg: "部门名称有误!"
          }
        },
        role: ['请选择'],
        typeList: [['请选择', '客户', '供应商', '承运商', '中通员工', '司机', '超级用户']], // 1 2 3 4 5 6
        roleMap: { '1': '客户', '2': '供应商', '3': '承运商', '4': '中通员工', '5': '司机', '6': '超级用户'},
        peopleId: '',
      }
    },
    created () {
        let isBind = this.$store.state.user.isBind; 
        if( (this.type === 'updateBind') && isBind ) {
          this.$store.commit('updateLoading', true)
          axios.getUserinfo().then( (res) => {
            this.$store.commit('updateLoading', false)
            this.peopleId = res.data.id;
            this.name = res.data.name
            this.mobile = res.data.telephone
            this.company = res.data.companyDomain.name
            this.role = [this.roleMap[res.data.role]]
          }, (error) => {
            this.$store.commit('updateLoading', false)
          })   
        }else {
          console.log("您还未绑定");
        }
    },
    methods: {
      /**
       * 表单检测
       */
      bindCheck() {
        if (this.$refs.nameRef.valid && this.$refs.mobileRef.valid && this.$refs.codeRef.valid && this.$refs.companyRef.valid 
            && this.role[0] !=='请选择') {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      },
      onChange (val) {
        if(this.role[0] !=='请选择'){
          this.bindCheck();
        }else {
          this.$vux.toast.text('请选择用户类哦~', 'middle')
        }
      },
      /**
       * 发送短信验证码
       */
      sendSMSCode() {
        if(this.$refs.mobileRef.valid) {
          if(!this.sendSMSSuccess) {
            let params = {
              telephone: this.mobile,
            }
            this.$store.commit('updateLoading', true)
            axios.sendSMSCode(params).then( (res) => {
              console.log( res )
              if(res.code == 0) {
                this.sendSMSSuccess = true;
                this.countDown()
              }
              this.$store.commit('updateLoading', false)
            }, (error) => {
              console.log("error="+JSON.stringify(error))
              this.$store.commit('updateLoading', false)
            })
          }
        }else {
          this.$vux.toast.text('手机号码有误哦~', 'middle')
        }
      },
      /**
       * 倒计时 60秒
       */
      countDown() {
        if(this.count <= 0) {
          clearTimeout(timer) 
          this.sendSMSSuccess = false
          this.count = 60 
        }else {
          this.count --
          timer  = setTimeout(this.countDown,1000)
        }
      },
      /**
       * 用户绑定或修改
       */
      updateOrBind() {
        let vue = this
        this.count = 0
        if( this.type === 'updateBind') {
          let params = {
            peopleId: this.peopleId,
            telephone: this.mobile,
            verifycode: this.code,
            name: this.name,
            company: this.company,
            role: this.common.roleNum(this.role[0]) 
          }
          this.$emit('on-updateBind',params)
        }else {
          let params = {
            telephone: this.mobile,
            verifycode: this.code,
            name: this.name,
            company: this.company,
            role: this.common.roleNum(this.role[0]) 
          }
          this.$emit('on-bind',params)
        }
      }
    }
  }
</script>

<style>
</style>
