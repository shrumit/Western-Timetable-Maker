import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import axios from 'axios'

const vuexPersist = new VuexPersist({
  key: 'ttmaker-2022',
  storage: window.localStorage
})

const courseData = require('./master.json');
const searchData = require('./search.json');
const metadata = require('./metadata.json');

const COMPUTE_URL='http://localhost:8081/compute'
// const COMPUTE_URL = window.location.origin.includes('localhost') ? 'http://localhost:3200/compute' : window.location.origin + '/compute'

Vue.use(Vuex)

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    metadata: {
      time: ''
    },
    curSemester: 0,
    semester: [
      {
        searchList: [],
        courseList:[],
        computeLoading: false,
        computeData: [],
        coursecomp: [],
        errorMsg: ''
      },
      {
        searchList: [],
        courseList:[],
        computeLoading: false,
        computeData: [],
        coursecomp: [],
        errorMsg: ''
      }
    ],
    emptySemester:
    {
      searchList: [],
      courseList:[],
      computeLoading: false,
      computeData: [],
      coursecomp: [],
      errorMsg: ''
    }
  },
  
  mutations: {
    addSearchList(state, {semesterId, data}){
      state.semester[semesterId].searchList = data//.slice(0,10);
      // state.semester[0].searchList = data[0]//.slice(0,10);
      // state.semester[1].searchList = data[1]//.slice(10,20);
    },
    
    addCourseToList(state, payload) {
      payload.course.components.forEach(function(c, cIndex, cArray){
        cArray[cIndex].selected = true
        cArray[cIndex].sections.forEach(function(s,sIndex, sArray){
          sArray[sIndex].selected = true
        })
      })
      
      state.semester[payload.semesterId].courseList.push(payload.course)
      // Vue.set(state.semester, payload.semesterId, state.semester[payload.semesterId])
    },

    addMetadata(state, metadata) {
      // console.log(metadata)
      state.metadata = metadata;
    },
    
    removeCourse(state, payload) {
      state.semester[payload.semesterId].courseList.splice(payload.courseIndex,1)
    },
    
    toggleSection(state, {semesterId, courseIndex, compIndex, sectionIndex}) {
      state.semester[semesterId].courseList[courseIndex].components[compIndex].sections[sectionIndex].selected =
        !state.semester[semesterId].courseList[courseIndex].components[compIndex].sections[sectionIndex].selected;
      // Vue.set is required to trigger update
      Vue.set(state.semester[semesterId].courseList, courseIndex, state.semester[semesterId].courseList[courseIndex])
    },
    
    toggleComponent(state, {semesterId, courseIndex, compIndex}) {
      state.semester[semesterId].courseList[courseIndex].components[compIndex].selected =
        !state.semester[semesterId].courseList[courseIndex].components[compIndex].selected;
      // Vue.set is required to trigger update
      Vue.set(state.semester[semesterId].courseList, courseIndex, state.semester[semesterId].courseList[courseIndex])
    },
    
    setAllSelectedInComponent(state, {semesterId, courseIndex, compIndex, selected}) {
      state.semester[semesterId].courseList[courseIndex].components[compIndex].sections.forEach(function(s, idx, sArray){
        sArray[idx].selected = selected;
      })
      Vue.set(state.semester[semesterId].courseList, courseIndex, state.semester[semesterId].courseList[courseIndex])
    },
    
    changeSemester(state, semesterId) {
      state.curSemester = semesterId
    },
    
    // computation
    setComputeLoading(state, {semesterId, status}) {
      state.semester[semesterId].computeLoading = status
    },
    setCoursecomp(state, {semesterId, coursecomp}) {
      // Vue.set(state.semester[semesterId].coursecomp, coursecomp)
      state.semester[semesterId].coursecomp = coursecomp
    },
    addComputeData(state, {semesterId, data}) {
      state.semester[semesterId].computeData = data
    },
    setComputeError(state, {semesterId, errorMsg}) {
      console.log(errorMsg)
      state.semester[semesterId].errorMsg = errorMsg
    },
    resetSemester(state, semesterId) {
      // state.semester[semesterId] = JSON.parse(JSON.stringify(state.emptySemester))
      Vue.set(state.semester, semesterId, JSON.parse(JSON.stringify(state.emptySemester)))
      // state.semester[semesterId] = Object.assign(state.emptySemester)
    },
    setDemoReel(state, {semesterId, value}) {
      state.semester[semesterId].demoReelActive = value
    }
  },
  
  actions: {
    resetSemester({commit, dispatch}, semesterId) {
      commit('resetSemester', semesterId)
      dispatch('loadSearch')
    },
    loadTest({dispatch}, {semesterId}) {
      dispatch('fetchCourse',{semesterId: semesterId, courseId: 142})
      dispatch('fetchCourse',{semesterId: semesterId, courseId: 2038})
      dispatch('fetchCourse',{semesterId: semesterId, courseId: 224})
      dispatch('fetchCourse',{semesterId: semesterId, courseId: 395})
      // dispatch('fetchCourse',{semesterId: semesterId, courseId: 691})
    },
    fetchCourse({commit, state}, {courseId, semesterId}) {
      if ( courseId != null && courseId >= 0 && !state.semester[semesterId].courseList.some( item => item['id'] === courseId)) {
        console.log('addCourseToList:'+courseId)
        commit('addCourseToList', {course: courseData[courseId], semesterId: semesterId});
      }
    },
    loadSearch( {commit} ) {
      commit('addSearchList', {semesterId: 0, data: searchData[0]});
      commit('addSearchList', {semesterId: 1, data: searchData[1]});
    },
    loadMetadata( {commit} ) {
      commit('addMetadata', metadata);
    },
    compute({commit, state}, semesterId) {
      commit('setComputeError', {semesterId: semesterId, errorMsg: ''})
      commit('setComputeLoading', {semesterId: semesterId, status: true});
      // console.log(JSON.stringify(state.semester[semesterId].courseList));
      let courseList = state.semester[semesterId].courseList
      
      // produce coursecomp, which is a flattening of course:components[] containing 'selected' components and sections only
      let coursecomp = []
      courseList.forEach(function(course) {
        course.components.forEach(function(comp){
          if (comp.selected != true) return;
          let filteredComp = JSON.parse(JSON.stringify(comp))
          filteredComp.sections = filteredComp.sections.filter(section => section.selected == true)
          if (filteredComp.sections.length == 0) return
          // comp.sections = comp.sections.map(section => section.timebits)
          filteredComp.courseId = course.id
          filteredComp.courseName = course.name
          coursecomp.push(filteredComp)
        })
      })
      
      let req = []
      coursecomp.forEach(function(comp){ // remove everything but timebits
        req.push(comp.sections.map(sec => sec.timebits))
      })
      let startTime = performance.now()
      axios.post(COMPUTE_URL, req)
      .then((res) => {
        let endTime = performance.now()
        let timeTaken = (endTime-startTime)
        res.data.info.timeTaken = timeTaken
        console.log('TIME TAKEN:' + timeTaken + 'ms')        
        commit('setCoursecomp', {semesterId: semesterId, coursecomp: coursecomp}) // coursecomp required by Table.vue for display      
        commit('addComputeData', {semesterId: semesterId, data: res.data})
      })
      .catch((error) => {
        console.log(JSON.stringify(error))
        commit('setComputeError', {semesterId: semesterId, errorMsg: error.message})
      })
      .finally(() => {
        commit('setComputeLoading', {semesterId: semesterId, status: false});
      })
    }
  }
});