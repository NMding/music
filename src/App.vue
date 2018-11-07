<template>
  <div id="app">
    <!--头部公共组件-->
    <music-header></music-header>
    <!--选项卡公共组件-->
    <tabs></tabs>
    <!--路由页面--> 
    <router-view> </router-view>
    <!-- 播放器页面 -->
    <player></player>
  </div>
</template>

<script>
import MusicHeader from "@/components/musicheader"
import Tabs from "@/components/tabs"
import Player from '@/components/player'
export default {
  components:{
    MusicHeader,
    Tabs,
    Player
  }
}

</script>

<style lang="less">
  @import '~@/assets/less/index.less';
  html,body{
    width:100%;
    height:100%;  
  }
</style>
