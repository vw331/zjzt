<template>
  <div class="survey-info">
    <div class="group">
      <h2><strong>{{item.title}}</strong></h2>
      <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.content}}</p>
      <x-button mini  type="primary">问题反馈</x-button>
    </div>
  </div>
</template>


<script>
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'
  import { XButton  } from 'vux'

  var datas = {"content":"尊敬的客户： 您好!在2015年的合作中，贵公司给我司的工作提供了极大的支持，后的合作中去，更好地提供全方位服务。 您的意见和建议将是中通通信公司改进工作的最好动力和财富，请您于2015年12月10日前将填写好的《客户满意度调查表》回复到本邮箱(sunyy0507@163.com）,非常感谢您的支持，祝您工作愉快！ 浙江中通通信有限公司 2015年12月","createTime":"2018-11-05 16:46:08","createUserId":3,"id":8,"order":"","sort":"","specialPeople":"","state":"1","sts":"Y",
    "title":"浙江中通通信","updateTime":"2018-11-05 16:46:08","updateUserId":3}
  export default {
    name: 'SurveyInfo',
    components: {
      XButton 
    },
    created() {
      this.$store.commit('updateTitle',types.SURVEY_INFO_TITLE)
      let params = {
        openid: 'o8pDO0drJXdhFw4Wl7ry3EVzjHlM', //this.$route.query.openid,
        surveyId: 8
      }
      console.log(params)
      this.getSurveyInfo(params)
    },
    data () {
      return {
        item: ''
      }
    },
    methods : {
      getSurveyInfo(params) {
        this.$store.commit('updateLoading', true)
        axios.getSurveyInfo(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            this.item = datas//res.data
          }else {
            this.$vux.toast.text(res.message, 'middle')
          }
        }, (error) => {
            this.$store.commit('updateLoading', false)
        })
      },
    }
  }

</script>

<style>
  .survey-info {
   /*  margin-top: 56px; */
  }
  .group {
    padding: 14px;
    background:white;
    border-top: 1px solid #f7f1f1;
    border-bottom: 1px solid #f7f1f1;
  }
  .group p {
    padding: 8px 0;
  }
</style>
