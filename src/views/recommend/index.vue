<template>
	<div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div class="slider-wrapper">
        <div class="swiper-container banner">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in slider" :key="item.key"><img :src="item.picUrl" width="100%"></div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <div class="recommend-list">
          <h3 class="list-title">热门歌单推荐</h3>
          <ul>
            <li class="item" v-for="item in list" :key="item.key" @click="detail(item.id)">
              <div class="icon">
                <img :src="item.picUrl" width="60" height="60" alt="">
              </div>
              <div class="text">
                <p class="name">{{item.songListAuthor}}</p>
                <p class="desc">{{item.songListDesc}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="isloading">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
	</div>
</template>



<script>
// import axios from "axios"
import {getRecommend} from '@/api'
import Bscroll from 'better-scroll'
import Scroll from '@/components/scroll'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import Loading from '@/components/loading'
import {myMixin} from '@/assets/js/mixin.js'
	export default {
   mixins:[myMixin],
		data:function(){
		  return{
        slider:[],
        list:[],
        isloading:true,
		  }
		},
		created(){
		  this.getSlide()
		},
		methods:{
      watchPlayList(playList){
        if(playList.length>0){
          this.$refs.recommend.style.bottom="60px";
          this.$refs.scroll.refresh();  
        }else{
          this.$refs.recommend.style.bottom="0";
          this.$refs.scroll.refresh();    
        }  
      },
		  getSlide:function(){
		    getRecommend().then((res) => {
          this.slider = res.data.slider
          this.list = res.data.songList
          this.isloading=false;
          var banner = new Swiper('.banner',{
            observer:true,
            observeParents:true,
            pagination:{
              el:'.swiper-pagination',
            }
          })
        })
      },
      detail(id){
        this.$router.push({path:`/recommend/${id}`}) 
      }
    },
    components:{
      Scroll,
      Loading,
      Swiper
    },
    
	}
</script>



<style lang="less" scoped>
  @import '~@/assets/less/variable.less';
 .recommend{
    position:fixed;
    width:100%;
    top:88px;
    bottom:0;
    .recommend-content{
      height:100%;
      overflow: hidden;
      .slider-wrapper{
        position: relative;
        overflow: hidden;
        width: 100%;
      }
       .recommend-list{
        .list-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }
        .item{
          display:flex;
          box-sizing:border-box;
          align-items: center;
          padding:0 20px 20px 20px;
          .icon{
            flex:0 0 60px;
            width:60px;
            padding-right: 20px;
          }
          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
          }
          .name{
            margin-bottom: 10px;
            color:@color-text;
          }
          .desc{
            color:@color-text-d;
          }
        }
      }
      .loading-container{
        position:absolute;
        width:100%;
        top:0;
        height:100%;
        background:#222;
      }
    }
  }
</style>

