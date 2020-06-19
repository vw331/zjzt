<template>
  <div class="bind-hint">
    <i slot="icon" class='fa fa-smile-o fa-5x fa-grey'></i>
    <div class="title">
      {{msg}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'BindHint',
  props: ['msg'],
}
</script>

<style>
  .bind-hint{
    width:100%;
    height: 100px;
    padding: 14px;
    text-align: center;
  }
  .bind-hint .fa-grey {
    text-align: center;
    color: #dbd4d4f1;
  }
  .bind-hint .title {
    color: #c5bebef1;
    margin-top: 20px;
  }
</style>
