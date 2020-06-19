<template>
  <div class="survey-questions">
    66666666666
  </div>
</template>


<script>
  import axios from '../../api/axios'
  import * as types from '../../utils/constant'

  var datas = [{"countA":0,"countB":0,"countC":0,"countD":0,"countE":0,"countF":0,"countG":0,"countH":0,"countI":0,"countJ":0,"createTime":"2018-11-06 15:05:07","createUserId":3,"id":5,"order":"","question":"question5","sort":"","sts":"Y","surveyId":8,"updateTime":"2018-11-06 15:05:07","updateUserId":3},{"countA":0,"countB":0,"countC":0,"countD":0,"countE":0,"countF":0,"countG":0,"countH":0,"countI":0,"countJ":0,"createTime":"2018-11-06 15:01:58","createUserId":3,"id":4,"order":"","question":"question4","sort":"","sts":"Y","surveyId":8,"updateTime":"2018-11-06 15:01:58","updateUserId":3},{"countA":0,"countB":0,"countC":0,"countD":0,"countE":0,"countF":0,"countG":0,"countH":0,"countI":1,"countJ":0,"createTime":"2018-11-06 14:56:28","createUserId":0,"id":3,"order":"","question":"question3","sort":"","sts":"Y","surveyId":8,"updateTime":"2018-11-10 12:14:28","updateUserId":0},{"countA":0,"countB":0,"countC":0,"countD":0,"countE":0,"countF":0,"countG":0,"countH":0,"countI":0,"countJ":1,"createTime":"2018-11-06 14:56:16","createUserId":0,"id":2,"order":"","question":"question2","sort":"","sts":"Y","surveyId":8,"updateTime":"2018-11-10 12:14:17","updateUserId":0},{"countA":1,"countB":0,"countC":0,"countD":0,"countE":0,"countF":0,"countG":0,"countH":0,"countI":0,"countJ":0,"createTime":"2018-11-06 14:55:49","createUserId":0,"id":1,"order":"","question":"question1","sort":"","sts":"Y","surveyId":8,"updateTime":"2018-11-10 12:14:08","updateUserId":0}]
  export default {
    name: 'SurveyQuestions',

    created() {
      this.$store.commit('updateTitle',types.SURVEY_QUESTIONS_TITLE)
      let params = {
        openid: 'o8pDO0drJXdhFw4Wl7ry3EVzjHlM',//this.$route.query.openid,
        surveyId: 8
      }
      console.log(params)
      this.getSurveyQuestions(params)
    },
    methods : {
      getSurveyQuestions(params) {
        this.$store.commit('updateLoading', true)
        axios.getSurveyQuestions(params).then( (res) => {
          this.$store.commit('updateLoading', false)
          if(res.code === 0){
            //this.item = res.data
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
  .survey-questions {
    margin-top: 46px;
  }
</style>
