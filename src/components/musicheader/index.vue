<template>
  <div class="music-header">
    <span class="logo"></span>
    <h2 class="text">Water Music</h2> 
  </div>
</template>
<script>
export default {

}

</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .music-header{
    height:44px;
    text-align:center;
    position:relative;
    .logo{
      width:32px;
      height:32px;
      display:inline-block;
      background:url('default.png');
      background-size:100% 100%;
      margin-top:6px;
      margin-right:8px;
    }
    .text{
      display:inline-block;
      line-height:44px;
      color:@color-theme;
      position:relative;
      top:-6px;
    }
  }
</style>