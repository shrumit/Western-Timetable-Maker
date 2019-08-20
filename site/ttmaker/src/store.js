import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const courseData = require('./master.json');
const searchData = require('./search.json');

const URL='http://localhost:8081/'
const COMPUTE_URL='http://localhost:3100/compute'

Vue.use(Vuex)

function test(input) {
  console.log('test' + input);
}

export default new Vuex.Store({
  
  state: {
    curSemester: 0,
    semester: [
      {
        searchList: [],
        courseList:[],
        computeLoading: false
      },
      {
        searchList: [],
        courseList:[],
        computeLoading: false
      }
    ],
    masterCourseList:[]
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
    
    changeSemester(state, semesterId) {
      state.curSemester = semesterId
    },
    
    // computation
    setComputeLoading(state, {semesterId, status}) {
      state.semester[semesterId].computeLoading = status
    },
    setCoursecomp(state, {semesterId, coursecomp}) {
      state.semester[semesterId].coursecomp = coursecomp
    }
  },
  
  actions: {
    fetchCourse({commit, state}, payload) {
      if ( payload.courseId != null && payload.courseId >= 0 && !state.semester[payload.semesterId].courseList.some( item => item['id'] === payload.courseId)) {
        payload.course = courseData[payload.courseId];
        
        commit('addCourseToList', payload);
      }
    },
    loadSearch( {commit} ) {
      test('world')
      commit('addSearchList', {semesterId: 0, data: searchData[0]});
      commit('addSearchList', {semesterId: 1, data: searchData[1]});
    },
    compute({commit, state}, semesterId) {
      // commit('setComputeLoading', {semesterId: semesterId, status: true});
      console.log(JSON.stringify(state.semester[semesterId].courseList));
      let courseList = state.semester[semesterId].courseList
      
      // produce coursecomp, which is a flattening of course:components[] with 'selected' components and sections only
      let coursecomp = []
      courseList.forEach(function(course) {
        course.components.forEach(function(comp){
          if (comp.selected != true) return;
          comp.sections = comp.sections.filter(section => section.selected == true)
          if (comp.sections.length == 0) return
          // comp.sections = comp.sections.map(section => section.timebits)
          comp.courseId = course.id
          comp.courseName = course.name
          coursecomp.push(comp)
        })
      })
      commit('setCoursecomp', {semesterId: semesterId, coursecomp: coursecomp})
      
      console.log(JSON.stringify(coursecomp))
      console.log(coursecomp)
      // let req = {}
      // courseList.forEach(function(c) {
      //   c.components.forEach(function(comp, compIdx){
      //     if (comp.selected == true) {
      //       let secArr = []
      //       comp.sections.forEach(function(sec,secIdx) {
      //         if (sec.selected == true) {
      //           secArr.push(sec.timebits);
      //         }
      //       })
      //       if (secArr.length > 0) {
      //         req[c.id+'-'+compIdx] = secArr
      //       }
      //     }
      //   })
      // })
      let req = []
      coursecomp.forEach(function(comp){
        req.push(comp.sections.map(sec => sec.timebits))
      })
      console.log(JSON.stringify(req))
      axios.post(COMPUTE_URL,req).then((res) => {
        console.log(res)
        // commit
        // commit('setComputeLoading', {semesterId: semesterId, status: false});
      })
      // setTimeout(function(){
      //   commit('setComputeLoading', {semesterId: semesterId, status: false});
      // }, 2000)
    }
  }
})


// axios.get(URL+'search.json').then((response) => {
//   commit('addSearchList', response.data)
// })
