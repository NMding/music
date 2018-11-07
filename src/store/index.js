import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    //记录播放列表
    playList:[],
    //记录播放器是否全屏
    fullScreen:false,
    //播放状态      
    playing:false,
    //当前播放歌曲的列表 索引
    currentIndex:-1,
    //播放模式：顺序为0，随机为1，单曲为2
    mode:0
    
  },
  getters:{
    playList:state =>state.playList,
    fullScreen:state =>state.fullScreen,
    playing:state =>state.playing,
    currentIndex:state =>state.currentIndex,
    //当前播放的歌曲的信息
    currentSong:(state)=>{
      return state.playList[state.currentIndex] || {}    
    },
    mode:state => state.mode,    
  },
  mutations:{
    changePlayList(state,playList){
      state.playList=playList    
    },  
    changeFullScreen(state,fullScreen){
      state.fullScreen=fullScreen    
    },
    changePlaying(state,playing){
      state.playing=playing    
    },
    changeCurrentIndex(state,currentIndex){
      state.currentIndex=currentIndex    
    },  
    changeMode(state,mode){
      state.mode = mode
    }
  },
  actions:{
    addPlayer({commit},{list,index}){
      commit('changePlayList',list)  
      commit('changeFullScreen',true)  
      commit('changePlaying',true)  
      commit('changeCurrentIndex',index)    
    },
     //删除一首歌
     delOne({commit,state},item){
      let index = 0
      let playlist = state.playList
      let currentIndex = state.currentIndex
      for(let j=0;j<playlist.length;j++){
          if(playlist[j].id == item.id){
              index = j
          }
      }           
      playlist.splice(index,1) 
      if(currentIndex == playlist.length){
          currentIndex --
      }           
      commit('changePlayList',playlist)
      commit('changePlaying',true)
      commit('changeCurrentIndex',currentIndex)
      },
      //清空播放列表
      clear({commit}){
          commit('changePlayList',[])
          commit('changePlaying',false)
          commit('changeCurrentIndex',-1)
      }    
  }    
})