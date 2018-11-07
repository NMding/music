<template>
    <transition name="slide">
      <music-list :title="title" :bgUrl="bgUrl" :songsList="songsList"></music-list>  
    </transition>
</template>

<script>
import MusicList from '@/components/musicList/'
import {getRankInfo} from '@/api'
export default {
  data(){
    return{
       list:[],
       title:"",
       bgUrl:"",
       songsList:[]    
    }
  },
  created(){
    this.getRankInfodetail();      
  },

  methods:{
     getRankInfodetail:function(){
        let id = this.$route.params.id
       getRankInfo(id).then(res =>{
         console.log(res); 
         this.title=res.topinfo.ListName;
         this.bgUrl=res.topinfo.pic_album;
         var arr=[];
         var gg="";
         for(let j=0;j<res.songlist.length;j++){
           gg=res.songlist[j].data;
           arr.push(gg);  
         }
         this.songsList=this.editSongs(arr);
         
       })    
     },  
     editSongs(list){
       let nSongsList=[];
       for(let i=0;i<list.length;i++){
         let item ={
            // 歌曲的ID
            id:list[i].songid,
            //歌曲的mid
            mid:list[i].songmid,
            //歌曲名
            name:list[i].songname,
            //专辑名
            album:list[i].albumname, 
            //歌曲时长
            interval:list[i].interval,
            //专辑的封面
            img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
            //歌曲链接
            url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
            //歌手
            singer:list[i].singer
         }  
         nSongsList.push(item)
       }   
       return nSongsList
     }           
  },
  components:{
    MusicList    
  },
}
</script>

<style lang="less" scoped>
  .slide-enter-active,.slide-leave-active{
    transition:all 0.3s;    
  }
  .slide-enter,.slide-leave{
    transform:translate3d(100%,0,0);    
  }
</style>

