<template>
	<div class="search">
	  <input type="text" class="find-music" name="" placeholder="搜索歌曲、歌手" v-model="keyword">
      <div class="none"  ref="block">
          <p class="hold">热门搜索</p>
          <div class="hotback" v-for="(item,index) in key" :key="item.key" v-if="index<9" ref="hotback" @click="changeval(item,index)">
            <p class="p">{{item.k}}</p>
          </div> 
      </div>

      <div class="result" ref="result"> 
        <div class="block" v-for="thitem in result" :key="thitem.key">
          <img src="http://bpic.588ku.com/element_origin_min_pic/18/06/08/378eae5bf9705d495ee24793d2fb70a7.jpg">
          <p>{{thitem.name}}
            <span>专辑:{{thitem.album.name}}</span>    
           </p>
         </div>
      </div>
      
	</div>
</template>



<script>
  import {getHotKey}  from '@/api'
  import {search}  from '@/api'
	export default {
      data () {
        return {
            keyword:"",
            p:10,
            n:10,
            key:[],
            result:[]
        }
      },
      created(){
        this.getHotKey()    
      },
      methods:{
        getHotKey(){
          let id = this.$route.params.id;
          getHotKey(id).then(res =>{
            console.log(res)    
            this.key=res.data.hotkey  
          })    
        },
        changeval(item,index){
          this.keyword=item.name;     
        }    
      },
      watch:{
        keyword(k){
             search(k,this.p,this.n).then(res=>{
              console.log(res);
              console.log(k);
              this.result=res.data.song.list
              this.$refs.block.style.display="none";
              if(k==""){
                this.$refs.block.style.display="block";    
              }
            })             
               
        },    
      }
	}
</script>




<style lang="less" scoped>
@import '~@/assets/less/variable.less';
.search{
  margin:0 auto;
  width:90%;
}
  .find-music{
    position:relative;
    padding-left:30px;
    margin-top:10px;
    width:92%;
    height:40px;
    background:rgb(51,51,51);
    border-width: 0;
    border: 0px;outline:none;cursor: pointer;
    color:grey;
    border-radius:12px;
  }
  .hold{
    margin-left:10px;
    margin-top:20px;
    margin-bottom:20px;
    font-size:18px;
    color: rgba(255, 255, 255, 0.6);
  }
  .hotback{
      display:flex;
      float: left;
    margin:10px 10px 10px 0;
    font-size:18px;
    color: rgba(255, 255, 255, 0.6);
  }
  .p{ 
    float: left;
    margin:6px;
    padding:6px;
    color:grey;
    background:rgb(51,51,51);
    border-radius:5px;
    font-size:16px;     
  }
  .result{
    margin-top:20px;    
  }
  .block{
    display:flex;
    color:@color-text-d;
    margin-top:20px;
    img{
      width:30px;
      height:30px;
      padding:10px;
    }    
    p{
      line-height:45px;    
    }
  }
  .username{
    display:flex;
    color:@color-text-d;
    img{
      width:30px;
      height:30px;    
      padding:10px;
    } 
    p{
      line-height:45px;    
    }   
  }
</style>
