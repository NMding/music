<template>
  <div class="example">
    <scroll class="rank">
      <div>
        <div class="topList" v-for="(item,index) in sing" :key="item.key" @click="detail(item.id)">
      <img :src="item.picUrl">
      <div>
        <h2 class="toptxt">{{item.topTitle}}</h2>
        <p v-for="(thitem,indext) in  sing[index].songList" :key="thitem.key">
          <span>
            {{indext+1}}
          </span>
          {{thitem.songname}}
          <span>
            - {{thitem.singername}}  
          </span>
        </p>
      </div> 
    </div>  
   </div>
   <router-view></router-view>
  </scroll>
  </div>
</template>
<script>
  import Scroll from '@/components/scroll'
  import Loading from '@/components/loading'
  import {getRankList} from "@/api"
  export default{
    data:function(){
      return {
        sing:[],
      }  
    },
    created(){
      this.getRank();  
    },
    methods:{
      getRank:function(){
        getRankList().then(res =>{
          console.log(res);  
          this.sing=res.data.topList;
        })
      },
       detail(id){
          this.$router.push({path:`/ranking/${id}`}) 
        },
    },
    computed:{
      num:function(){
        return 1;  
      }  
    },
    components:{
      Scroll,
      Loading

    }
  }
</script>
<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
  .example{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;  
  }
  .rank{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #222;
    .topList{
      display:flex;
      padding:20px 20px 30px 30px;
      
      img{
        width:100px;
        height:100px;
      }
      div{
        color:@color-text-d; 
        background:@color-highlight-background ;   
        padding-left: 20px;
        height:100px;
        .toptxt{
          color: white;
        }
        p{
          line-height:30px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;  
          width:250px;
        }
        
      }  
    }
  }
</style>