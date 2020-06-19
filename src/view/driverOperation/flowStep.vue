<template>
  <div class="step-item">
    <div class="vertical-line-top" v-if="showTopLine" v-bind:class="{ 'line-done': (isDone || isOnroad) }"></div>
    <div  v-if="onroad"></div>
    <div v-else class="circle-icon" v-bind:class="{ 'circle-done': (isDone || isOnroad) }">
      <i slot="icon" class='fa fa-check fa-lg circle-i-done' v-if="isDone"></i> 
      <i slot="icon" class='fa fa-truck fa-lg circle-i-done' v-else-if="isOnroad" ></i> 
      <i slot="icon" class='fa fa-ellipsis-h fa-lg circle-i' v-else></i> 
    </div>
    <div class="content" @click="$emit(isOnroad ? 'on-onroad' : 'on-updateStatus')">
      <h2>{{title}}</h2>
      <p>{{content}}</p>
    </div>
    <div class="vertical-line-bottom" v-bind:class="{ 'line-done': (isDone || isOnroad) }"></div>
  </div>
</template>


<script>
  import { XButton } from 'vux'

  export default {
    name: 'FlowStep',
    components : { XButton },
    props: ['title','content','topLine','done','hasBtn','isOnroad'],
    data () {
      return {
        showTopLine: true,
        isDone: false
      }
    },
    mounted () {
      if(!this.topLine) {
        this.showTopLine = false
      }
      if(this.done) {
        this.isDone = true
      }
    },
    watch: {
      done: function (newDone, oldDone) {
        this.isDone = newDone
      }
    }
  }

</script>

<style scoped>
   .step-item {
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width:100%;
    height: 72px;
  }
  .step-item .circle-icon {
    display: flex;
    justify-content:center;
    align-items:center;
    width: 32px;
    height: 32px;
    min-width: 32px;
    border: 3px solid #dfd7d7;
    border-radius: 50%; 
  }
  .step-item .content {
    position:relative;
    width:100%;
    padding-left: 14px;
    z-index:1;
  }
  .step-item .content p{
    color: gray;
    font-size: 12px;
  }
  .step-item .vertical-line-bottom {
    position: absolute;
    left: 15px;
    top: 50px;
    height: 22px;
    width:3px;
    background: #dfd7d7;
  }
  .step-item .vertical-line-top {
    position: absolute;
    left: 15px;
    top: 0px;
    height: 22px;
    width:3px;
    background: #dfd7d7;
  }
  .circle-done{
    color: #3b6ddd;
    border-color: #3b6ddd !important;
  }
  .line-done{
    background: #3b6ddd !important;
  }
   .circle-i-done {
    color: #3b6ddd;
  }
  .circle-i {
    color: #dfd7d7;
    margin-top:1px;
  }
  .step-item .weui-btn{
    position: absolute;
    padding: 0px 10px !important;
    line-height: 24px !important;
    height: 24px !important;
    /* background: white;
    color: #727d96; */
    font-size: 12px;
    margin: 0 !important;
    top:13px;
    left:120px;
    z-index:9999;
  }
</style>
