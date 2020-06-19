<template>
  <div class="no-permission">
    <i slot="icon" class='fa fa-frown-o fa-5x fa-grey'></i>
    <div class="title">
      抱歉, 您没有访问权限 !
    </div>
  </div>
</template>

<script>

export default {
  name: 'NoPermission',
}
</script>

<style>
  .no-permission{
    position: absolute;
    width:100%;
    top: 30%; 
    text-align: center;
  }
  .no-permission .fa-grey {
    text-align: center;
    color: #dbd4d4f1;
  }
  .no-permission .title {
    color: #c5bebef1;
    margin-top: 20px;
  }
</style>
