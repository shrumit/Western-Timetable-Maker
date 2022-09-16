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

const COMPUTE_URL = window.location.origin.includes('localhost') ? 'http://localhost:8081/compute' : window.location.origin + '/compute'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [vuexPersist.plugin],
  state: {
    metadata: {
      time: '',
      campusTypes: [],
      deliveryTypes: []
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
    emptySemester: {
      searchList: [],
      courseList:[],
      computeLoading: false,
      computeData: [],
      coursecomp: [],
      errorMsg: ''
    },
    filters: {
      selectedCampusTypes: [],
      selectedDeliveryTypes: []
    }
  },
  
  mutations: {
    addSearchList(state, {semesterId, data}) {
      state.semester[semesterId].searchList = data
    },
    
    addCourseToList(state, payload) {
      payload.course.components.forEach(function(c, cIndex, cArray){
        cArray[cIndex].selected = true
        cArray[cIndex].sections.forEach(function(s,sIndex, sArray){
          sArray[sIndex].selected = true
        })
      })

      // compute color and store
      payload.course.color = courseNameToColor(payload.course.name)
      
      state.semester[payload.semesterId].courseList.push(payload.course)
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
      Vue.set(state.semester, semesterId, JSON.parse(JSON.stringify(state.emptySemester)))
    },

    // filters
    updateSelectedCampusTypes(state, selectedCampusTypes) {
      state.filters.selectedCampusTypes = selectedCampusTypes
    },
    updateSelectedDeliveryTypes(state, selectedDeliveryTypes) {
      state.filters.selectedDeliveryTypes = selectedDeliveryTypes
    }

  },
  
  actions: {
    resetSemester({commit, dispatch}, semesterId) {
      commit('resetSemester', semesterId)
      dispatch('loadSearch')
    },
    fetchCourse({commit, state}, {courseId, semesterId}) {
      if ( courseId != null && courseId >= 0 && !state.semester[semesterId].courseList.some( item => item['id'] === courseId)) {
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
      
      // produce coursecomp, which is a flattening of course:components[] with 'selected' components and sections only
      // coursecomp is used to generate the /compute payload and to render Table.vue
      let coursecomp = []
      courseList.forEach(function(course) {
        course.components.forEach(function(comp){
          if (comp.selected != true) return;
          // serializing and deserializing removes extra things from the object
          let filteredComp = JSON.parse(JSON.stringify(comp))

          // remove unselected sections
          filteredComp.sections = filteredComp.sections.filter(section => section.selected == true)
          // skip if no section are selected
          if (filteredComp.sections.length == 0) return

          // add some course properties to the comp
          filteredComp.courseId = course.id
          filteredComp.courseName = course.name
          filteredComp.courseColor = course.color

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

function strHash(str) { // java String#hashCode
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
     hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
function numToColor(num) {
num = num * num
return "rgb("+(255-((num*7)%127))+","+(255-((num*5)%83))+","+(255-((num*3)%79))+")"
// return "rgb("+(255-(num%151))+","+(255-(num%127))+","+(255-(num%103))+")"
}
function courseNameToColor(name) {
return numToColor(strHash(name))
}