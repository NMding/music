<template>
    <transition name="list-fade">
        <div class="playlist" ref="playlist" v-show="isShow">
            <div class="list-wrapper">
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon"></i>
                        <span class="text">{{modeTxt}}</span>
                        <span class="clear" @click="clearAll">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <scroll class="list-content" ref="listContent">
                    <ul>
                        <li class="item" ref="listItem" v-for="(item,index) in playList" :key="item.key" @click="changeSong(index)">
                            <i class="current" :class="currentClass(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i></i>
                            </span>
                            <span class="delete" @click.stop="del(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </ul>
                </scroll>
                <div class="list-close" @click="close">
                    <span>关闭</span>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Scroll from '@/components/scroll'
import {mapGetters,mapActions,mapMutations} from 'vuex'
import {MessageBox} from 'mint-ui'
export default {
    components:{
        Scroll,
    },
    computed:{
        modeTxt(){
            return this.mode == 0 ? "顺序播放" : this.mode == 1 ? "随机播放" : "单曲循环"
        },
        ...mapGetters(['mode','playList','currentSong'])
    },
    props:{
        isShow:{
            type:Boolean,
            default:false
        }
    },
    updated(){
        this.$refs.listContent.refresh()
    },
    methods:{
        currentClass(item){
            return item.id == this.currentSong.id ? 'icon-play' : ""
        },
        changeSong(index){
            this.changeCurrentIndex(index)
        },
        close(){
            this.$emit('changeShow',false)
        },
        del(item){
            this.delOne(item)
        },
        clearAll(){
           MessageBox.confirm('是否清空播放列表').then(() => {
              this.clear()
              this.close()
           });
        },
        ...mapMutations(["changeCurrentIndex"]),
        ...mapActions(["delOne","clear"])
    }
}
</script>

<style lang="less" scoped>
 @import '~@/assets/less/variable.less';
 @import url("//unpkg.com/mint-ui/lib/style.css");
 .playlist{
     position:fixed;
     left:0;
     right:0;
     top:0;
     bottom:0;
     z-index:200;
     background-color: @color-background-d;
     &.list-fade-enter-active, &.list-fade-leave-active{
         transition:opacoty 0.3s;
         .list-wrapper{
             transition: all 0.3s;
         }
     }
     &.list-fade-enter, &.list-fade-leave-to{
         opacity: 0;
         .list-wrapper{
            transform: translate3d(0,100%,0);
         }
     }
     .list-wrapper{
         position: absolute;
         left:0;
         bottom:0;
         width:100%;
         background-color:@color-highlight-background;
         .list-header{
             position: relative;
             padding:20px 30px 10px 20px;
             .title{
                 display:flex;
                 align-items: center;
                 .icon{
                     margin-right: 10px;
                     font-size: 30px;
                     color:@color-theme-d;
                 }
                 .text{
                     flex:1;
                     font-size: @font-size-medium;
                     color:@color-text-l;
                 }
                 .clear{
                     .icon-clear{
                         font-size: @font-size-medium;
                         color:@color-text-d;
                     }
                 }
             }
         }
         .list-content{
             max-height:240px;
             overflow: hidden;
             .item{
                 display:flex;
                 align-items: center;
                 height:40px;
                 padding:0 30px 0 20px;
                 overflow: hidden;
                  &.list-enter-active, &.list-leave-active{
                     transition: all 0.1s;
                 }
                 &.list-enter, &.list-leave-to{
                    height:0;
                }
                .currnet{
                    flex:0 0 20px;
                    width:20px;
                    font-size: @font-size-small;
                    color:@color-theme-d;
                }
                .text{
                    flex:1;
                    font-size: @font-size-medium;
                    color:@color-text-d;
                }
                .like{             
                    margin-right:15px;
                    font-size:@font-size-small;
                    color:@color-theme;
                    .icon-favorite{
                        color:@color-sub-theme;
                    }
                }
                .delete{
                    font-size: @font-size-small;
                    color:@color-theme;
                }
             }
             .list-operate{
                 width:140px;
                 margin:20px auto 30px auto;
                 .add{
                     display:flex;
                     align-items: center;
                     padding:8px 16px;
                     border:1px solid @color-text-l;
                     border-radius:100px;
                     color:@color-text-l;
                     .icon-add{
                         margin-right:5px;
                         font-size: @font-size-small-s;
                     }
                     .text{
                         font-size: @font-size-small;
                     }
                 }
             }
         }
        .list-close{
            text-align: center;
            line-height: 50px;
            background:@color-background;
            font-size: @font-size-medium-x;
            color:@color-text-l;
         }
    }
}
 

</style>
