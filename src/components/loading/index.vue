
<template>
  <div class="loading">
      <img src="./loading.gif" >
      <p class="desc">正在加载中</p>
    </div>  
</template>

<script>
export default {
  name:"loading",
  props:{
    title:{
      type:String,
      default:'loading...'    
    }    
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .loading{
    width:100%;
    text-align: center; 
    margin-top:40%;
    .desc{
      line-height:20px;
      color:@color-text-l;    
    }   
  }

</style>
