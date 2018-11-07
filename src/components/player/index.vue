<template>
  <div class="player" v-show="playList.length >0"> 
      <transition name="normal">
      <!-- 播放全屏页面 -->
      <div class="normal-player" v-show="fullScreen">
           <!-- 背景 模糊 -->
            <div class="background">
                <img alt="" wdith="100%" height="100%">
            </div>
             <!-- 顶部 -->
            <div class="top">
                <div class="back">
                    <i class="icon-back" @click="toggleFullScreen"></i>
                </div>
                <h1 class="title">{{currentSong.name}}</h1>
                <h2 class="subtitle"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}} </span></h2>
            </div>
             <!-- 中间cd部分 -->
            <div class="middle swiper-container">
                <div class="swiper-wrapper">
                    <div class="middle-l swiper-slide" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdState">
                                <img  :src="currentSong.img" alt="" class="image">
                            </div>
                        </div>
                        <!-- 一条歌词滚动 -->
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{currentLyc}}</div>
                        </div>
                    </div>
                    <!-- 歌词滚动 -->
                    <scroll class="middle-r swiper-slide" ref="lyriclist">
                        <div class="lyric-wrapper">
                            <div v-for=" (item,index) in lyric.lines" :key="item.key" ref="lyricLine" >
                                <p class="text" :class="{current:index==currentLine}">
                                    {{item.txt}}
                                </p>
                            </div>
                        </div>
                    </scroll>
                </div>
            </div>
              <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{playTime}}</span>
                    <div class="progress-bar-wrapper">
                        <progressBar @percentChange="changeCurrentTime" :percent="percent"></progressBar>
                    </div>
                    <span class="time time-r">{{songTime}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left">
                        <i :class="getMode" @click="onChangeMode"></i>
                    </div>
                    <div class="icon i-left">
                        <i class="icon-prev" @click="prev"></i>
                    </div>
                    <div class="icon i-center">
                        <i :class="btnState" @click="togglePlay"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon-next" @click="next"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon-not-favorite"></i>
                    </div>
                </div>
            </div>
      </div>
      </transition>   
      <!-- 小屏 -->
      <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="toggleFullScreen">
        <div class="icon">
            <img :src="currentSong.img" alt="" wdith="40" height="40" :class="cdState">
        </div>
        <div class="text">
            <h2 class="name">{{currentSong.name}}</h2>
            <p class="desc"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}} </span></p>
        </div>
        <div class="control">
            <i :class="btnState" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
            <i class="icon-playlist"  @click.stop="openList"></i>
        </div>
    </div>
    </transition>   
      <!-- 引入H5播放器 -->
      <audio @ended="ended" @timeupdate="updateTime" :src="currentSong.url" ref="audio" @canplay="changeIsReady" @error="changeIsReady"></audio>

       <play-list v-show="isOpenList" :isShow="isOpenList" @changeShow="closeList"></play-list>
  </div>    
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import  ProgressBar from '@/components/progressBar'
import Scroll from '@/components/scroll'
import {getLyric} from '@/api'
import {Base64}  from 'js-base64'
import  Lyric   from  'lyric-parser'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import PlayList from '@/components/playList'
export default {
    data(){
      return {
        //播放器播放的链接加载完成
        isReady:false,    
        //当前播放时间
        currentTime:0,
        lyric:{},
        currentLyc:"",
        currentLine:0,
        isOpenList:false
      }
    },
    components:{
      ProgressBar,
      Scroll,
      Swiper, 
      PlayList
    },
    mounted(){
      this.$nextTick( ()=>{
        var banner = new Swiper('.middle',{
            observer:true,
            observeParents:true,
            pagination:{
              el:'.dot-wrapper',
              bulletClass:"dot",
              bulletActiveClass:"active",

            }
          })    
      })    
    },
    computed:{
        //根据播放状态来判断cd是否旋转
        cdState(){
          return this.playing ? 'play' : 'pause'      
        },
        //根据播放状态来判断播放按钮显示
        btnState(){
          return this.playing ?'icon-pause' : 'icon-play'   
        },
         //根据播放状态来判断小屏的播放按钮显示
        btnState(){
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        //转换歌曲时长 
        songTime(){
          let m=this.currentSong.interval /60 |0
          
          let s=this.currentSong.interval %60 |0
          if(s.toString().length<2){
            s='0'+s;    
          }
          return  `${m}:${s}`   
        },
        //播放事件转换
        playTime(){
          let m=this.currentTime / 60 |0;
          
          let s=this.currentTime % 60 |0;
          if(s.toString().length<2){
            s='0'+s;    
          }
          return  `${m}:${s}`        
        },
        //计算已播放事件和总时间的百分比
        percent(){
          return this.currentTime / this.currentSong.interval   
        },
         //判断播放模式
        getMode(){
            switch(this.mode){
                case 0:
                  return 'icon-sequence'
                  break;
                case 1:
                  return 'icon-random'
                  break;
                case 2:
                  return 'icon-loop'
                  break;

            }
        },
      ...mapGetters([
        'playing',
        'fullScreen',
        'playList',
        'currentIndex',
        'currentSong',
        'mode'
      ])    
    },
    methods:{
      //更改播放状态
      togglePlay(){
        this.changePlaying(!this.playing)    
        //歌词
        this.lyric.togglePlay();
      },
      //点击更改全屏状态
      toggleFullScreen(){
        this.changeFullScreen(!this.fullScreen)  
      },
      //播放下一首歌曲
      next(){
        if(!this.isReady){
          return 
        }  
        let index =this.currentIndex+1;
        if(index ==this.playList.length){
          index=0;     
        }  
        this.changeCurrentIndex(index);  
        this.isReady=false;
         if(!this.playing){
          this.togglePlay();    
        }     
      },
      //播放上一首歌曲
      prev(){
        //当播放准备状态为true
        if(!this.isReady){
          return 
        }
        let index =this.currentIndex-1;
        if(index == -1){
          index=this.playList.length-1;     
        }  
        this.changeCurrentIndex(index); 
        this.isReady=false; 
        if(!this.playing){
          this.togglePlay();    
        }       
      },
      //更改播放器 是否重新加载
      changeIsReady(){
        this.isReady=true;    
      },
      //当播放器播放时获取当前播放时间
      updateTime(ev){
        this.currentTime=ev.target.currentTime;  
      },
      //根据子组件传回来的百分比来计算当前需要播放的歌曲时间
      changeCurrentTime(v){
        let t=this.currentSong.interval *v;
        this.$refs.audio.currentTime=t;
        
      },
      //获取歌词
      getLyc(){
        getLyric(this.currentSong.id).then( (res) => {
          this.lyric=new Lyric(Base64.decode(res.lyric),this.hanlder);    
          if(this.playing){
            this.lyric.play()    
          } 
        })    
      },
      hanlder({lineNum,txt}){
            this.currentLine = lineNum
            if(lineNum > 5){
                let lineEl = this.$refs.lyricLine[lineNum-5]
                this.$refs.lyriclist.scrollToElement(lineEl,300);
            }else{
                this.$refs.lyriclist.scrollTo(0,0,300);
            }
            this.currentLyc = txt     
        },
        onChangeMode(){
            let mode = (this.mode + 1) % 3
            this.changeMode(mode)
        },
        //播放完成后
        ended(){
            if(this.mode == 0){
                this.next()
            }else if(this.mode == 1){
                //洗牌算法将原本的顺序播放列表打乱形成新的播放列表
                this.next()
            }else if(this.mode ==2 ){
                this.loop()
            }
        },
        //单曲循环
        loop(){
            this.$refs.audio.currentTime == 0
            this.$refs.audio.play()
            this.lyric.seek(0)
        },
        openList(){
            this.isOpenList = true
        },
        closeList(val){
            this.isOpenList = val
        },
      ...mapMutations(["changePlaying","changeFullScreen","changeCurrentIndex","changeMode"])
    },
    watch:{
      //监听播放歌曲的改变
      currentSong(val){
        this.$nextTick(()=>{
          this.getLyc();
          this.$refs.audio.play();    
        }) 
      },
     //监听playing的状态，控制播放器的播放
      playing(val){
          this.$nextTick(()=>{
             val ? this.$refs.audio.play() : this.$refs.audio.pause();    
          })  
      }    
    },

}
</script>

<style lang="less"  >
@import "~@/assets/less/variable.less";
.player{
    .normal-player{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 150;
        background: @color-background;
        .background{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
            filter:blur(20px);
        }
        .top{
            position: relative;
            margin-bottom: 25px;
            .back{
                position: absolute;
                top: 0;
                left: 6px;
                z-index: 50;
                .icon-back{
                    display: block;
                    padding: 9px;
                    font-size:@font-size-large-x;
                    color: @color-text;
                    transform: rotate(-90deg);
                }
            }
            .title{
                width: 70%;
                margin: 0 auto;
                line-height: 40px;
                text-align: center;
                font-size: @font-size-large;
                color: @color-text;
            }
            .subtitle{
                line-height: 20px;
                text-align: center;
                font-size:@font-size-medium;
                color: @color-text;
            }
        }
        .middle{
            position: fixed;
            width: 100%;
            top: 80px;
            bottom: 170px;
            white-space: nowrap;
            font-style: 0;
            .middle-l{
                display: inline-block;
                vertical-align: top;
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 80%;
                .cd-wrapper{
                    position: absolute;
                    left: 10%;
                    top: 0;
                    width: 80%;
                    height: 100%;
                    .cd{
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        border: 10px solid rgba(255,255,255,0.1);
                        border-radius: 50%;
                        &.play{
                            animation: rotate 20s linear infinite;
                        }
                        &.pause{
                            animation-play-state:paused;
                        }
                        .image{
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                }
                .playing-lyric-wrapper{
                    width: 80%;
                    margin: 30px auto 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .player-lyric{
                        height: 20px;
                        line-height: 20px;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                    }
                }
            }

            .middle-r{
                display: inline-block;
                vertical-align: top;
                width: 100%;
                height: 100%;
                overflow: hidden;
                .lyric-wrapper{
                    width: 80%;
                    margin: 0 auto;
                    overflow: hidden;
                    text-align: center;
                    .text{
                        line-height: 32px;
                        color: @color-text-l;
                        font-size: @font-size-medium;
                        &.current{
                            color:@color-text;
                        }
                    }
                }
            }
        }
        .bottom{
            position: absolute;
            bottom: 50px;
            width: 100%;
            .dot-wrapper{
                text-align: center;
                font-size: 0;
                .dot{
                    display: inline-block;
                    vertical-align: middle;
                    margin: 0 4px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: @color-text-l;
                    &.active{
                        width: 20px;
                        border-radius: 5px;
                        background: @color-text-ll;
                    }
                }
            }
            .progress-wrapper{
                display: flex;
                align-items: center;
                width: 80%;
                margin: 0 auto;
                padding: 10px 0;
                .time{
                    color:@color-text;
                    font-style: @font-size-small;
                    flex:0 0 30px;
                    line-height: 30px;
                    width: 30px;
                    &.time-l{
                        text-align: left;
                    }
                    &.time-r{
                        text-align: right;
                    }
                }
                .progress-bar-wrapper{
                    flex:1;
                }
            }
            .operators{
                display: flex;
                align-items: center;
                .icon{
                    flex:1;
                    color:@color-theme;
                    &.disable{
                        color:@color-theme-d;
                    }
                    i{
                        font-size: 30px;
                    }
                }
                .i-left{
                    text-align: right;
                }
                .i-center{
                    padding: 0 20px;
                    text-align: center;
                    i{
                        font-size: 40px;
                    }
                }
                .i-right{
                    text-align: left;
                }
                .icon-favorite{
                    color:@color-sub-theme;
                }
            }
        }
        &.normal-enter-active,&.normal-leave-active{
            transition: all 0.4s;
            .top,.bottom{
                transition: all 0.4s cubic-bezier(0.86,0.18,0.82,1.32);
            }
        }
        &.normal-enter,&normal-leave-to{
            opacity: 0;
            .top{
                transform: translate3d(0,-100px,0);
            }
            .bottom{
                transform: translate3d(0,100px,0);
            }
        }
    }

    .mini-player{
        display: flex;
        align-items: center;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 180;
        width: 100%;
        height: 60px;
        background: @color-highlight-background;
        &.mini-enter,&mini-leave-to{
            opacity: 0;
        }
        .icon{
            flex:0 0 40px;
            width: 40px;
            padding: 0 10px 0 20px;
            img{
                border-radius: 50%;
                &.play{
                    animation: rotate 10s linear infinite;
                }
                &.pause{
                    animation-play-state: paused;
                }
            }
        }
        .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            .name{
                margin-bottom: 2px;
                font-size: @font-size-medium;
                color:@color-text;
            }
            .desc{
                font-size: @font-size-small;
                color:@color-text-d;

            }
        }
        .control{
            flex:0 0 30px;
            width: 30px;
            padding: 0 10px;
            .icon-play-mini,.icon-pause-mini,.icon-playlist{
                font-size: 30px;
                color:@color-theme-d;  
            }
            .icon-mini{
                font-style: 32px;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}
@keyframes rotate{
    0%{
        transform: rotate(0);
    }
    100%{
        transform: rotate(360deg);
    }
}
</style>







