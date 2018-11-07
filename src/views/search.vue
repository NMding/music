<template>
  <div class="about">
    <input type="text" placeholder="搜索歌曲、歌手">
  </div>
</template>
<script>
  export default{
  }
</script>
<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .about{
    input{
      //解决input框设置为100%时会溢出的方法
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;  
      width:100%;
      margin-top:15px;
      height: 50px;
      background:@color-background-d;  
      background-color: #ffffff21;
      padding-left: 50px;
      border-radius:10px;      
    }
  }
</style>