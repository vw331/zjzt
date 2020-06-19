<template>
	<div id="Search">
      <search @on-change="getResult" :results="results" v-model="value" position="relative" top="90px" placeholder="输入订单编号" 
        @on-focus="onFocus" @on-cancel="onCancel" @on-submit="onSubmit" ref="search"></search>
	</div>
</template>

<script>
  import { Search } from 'vux'

  export default {
    name: "SearchBar",
    components: {
      Search
    },
    data () {
      return {
         results: [],
        value: ''
      }
    },
    methods: {
      searchMore () {

      },
      getResult (val) {
        console.log('on-change', val)
      },
      onSubmit () {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: 'on submit'
        })
      },
      onFocus () {
        console.log('on focus')
      },
      onCancel () {
        console.log('on cancel')
      }
    }
  }
</script>

<style lang="less" scoped>
  #Search {
    width:100%;
  }
</style>