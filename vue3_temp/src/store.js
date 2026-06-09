import { defineStore } from 'pinia'
import axios from 'axios'

import courseData from './master.json'
import searchData from './search.json'
import metadataData from './metadata.json'

const COMPUTE_URL = window.location.origin.includes('localhost') ? 'http://localhost:8081/compute' : window.location.origin + '/compute'

const createSemesterState = (semesterId) => ({
  searchList: searchData[semesterId] ?? [],
  courseList: [],
  computeLoading: false,
  computeData: [],
  coursecomp: [],
  errorMsg: '',
})

const restoreStaticState = ({ store }) => {
  store.metadata = metadataData
  store.semester.forEach((semester, semesterId) => {
    semester.searchList = searchData[semesterId] ?? []
  })
}

const ignoredPersistKeys = new Set(['emptySemester', 'metadata', 'searchList'])

const persistedStateSerializer = {
  serialize: (state) =>
    JSON.stringify(state, (key, value) => {
      if (ignoredPersistKeys.has(key)) return undefined
      return value
    }),
  deserialize: (value) =>
    JSON.parse(value, (key, value) => {
      if (ignoredPersistKeys.has(key)) return undefined
      return value
    }),
}

export const useStore = defineStore('ttmaker', {
  state: () => ({
    metadata: metadataData,
    curSemester: 0,
    semester: [createSemesterState(0), createSemesterState(1)],
  }),

  // Requires pinia-plugin-persistedstate to be registered on the Pinia instance.
  persist: {
    key: 'ttmaker-2026',
    storage: window.localStorage,
    serializer: persistedStateSerializer,
    afterHydrate: restoreStaticState,
  },

  actions: {
    addCourseToList(payload) {
      payload.course.components.forEach(function (c, cIndex, cArray) {
        cArray[cIndex].selected = true
        cArray[cIndex].sections.forEach(function (s, sIndex, sArray) {
          sArray[sIndex].selected = true
        })
      })

      // compute color and store
      payload.course.color = courseNameToColor(payload.course.name)

      this.semester[payload.semesterId].courseList.push(payload.course)
    },

    removeCourse(payload) {
      this.semester[payload.semesterId].courseList.splice(payload.courseIndex, 1)
    },

    toggleSection({ semesterId, courseIndex, compIndex, sectionIndex }) {
      this.semester[semesterId].courseList[courseIndex].components[compIndex].sections[sectionIndex].selected =
        !this.semester[semesterId].courseList[courseIndex].components[compIndex].sections[sectionIndex].selected
    },

    toggleComponent({ semesterId, courseIndex, compIndex }) {
      this.semester[semesterId].courseList[courseIndex].components[compIndex].selected = !this.semester[semesterId].courseList[courseIndex].components[compIndex].selected
    },

    setAllSelectedInComponent({ semesterId, courseIndex, compIndex, selected }) {
      this.semester[semesterId].courseList[courseIndex].components[compIndex].sections.forEach(function (s, idx, sArray) {
        sArray[idx].selected = selected
      })
    },

    changeSemester(semesterId) {
      this.curSemester = semesterId
    },

    // computation
    setComputeLoading({ semesterId, status }) {
      this.semester[semesterId].computeLoading = status
    },

    setCoursecomp({ semesterId, coursecomp }) {
      this.semester[semesterId].coursecomp = coursecomp
    },

    addComputeData({ semesterId, data }) {
      this.semester[semesterId].computeData = data
    },

    setComputeError({ semesterId, errorMsg }) {
      console.log(errorMsg)
      this.semester[semesterId].errorMsg = errorMsg
    },

    resetSemester(semesterId) {
      this.semester[semesterId] = createSemesterState(semesterId)
    },

    loadTest({ semesterId }) {
      this.fetchCourse({ semesterId: semesterId, courseId: 142 })
      this.fetchCourse({ semesterId: semesterId, courseId: 2038 })
      this.fetchCourse({ semesterId: semesterId, courseId: 224 })
      this.fetchCourse({ semesterId: semesterId, courseId: 395 })
      // this.fetchCourse({ semesterId: semesterId, courseId: 691 })
    },

    fetchCourse({ courseId, semesterId }) {
      if (courseId != null && courseId >= 0 && !this.semester[semesterId].courseList.some((item) => item['id'] === courseId)) {
        this.addCourseToList({ course: courseData[courseId], semesterId: semesterId })
      }
    },

    compute(semesterId) {
      this.setComputeError({ semesterId: semesterId, errorMsg: '' })
      this.setComputeLoading({ semesterId: semesterId, status: true })
      // console.log(JSON.stringify(this.semester[semesterId].courseList));
      let courseList = this.semester[semesterId].courseList

      // produce coursecomp, which is a flattening of course:components[] with 'selected' components and sections only
      // coursecomp is used to generate the /compute payload and to render Table.vue
      let coursecomp = []
      courseList.forEach(function (course) {
        course.components.forEach(function (comp) {
          if (comp.selected != true) return
          // serializing and deserializing removes extra things from the object
          let filteredComp = JSON.parse(JSON.stringify(comp))

          // remove unselected sections
          filteredComp.sections = filteredComp.sections.filter((section) => section.selected == true)
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
      coursecomp.forEach(function (comp) {
        // remove everything but timebits
        req.push(comp.sections.map((sec) => sec.timebits))
      })
      let startTime = performance.now()
      axios
        .post(COMPUTE_URL, req)
        .then((res) => {
          let endTime = performance.now()
          let timeTaken = endTime - startTime
          res.data.info.timeTaken = timeTaken
          this.setCoursecomp({ semesterId: semesterId, coursecomp: coursecomp }) // coursecomp required by Table.vue for display
          this.addComputeData({ semesterId: semesterId, data: res.data })
        })
        .catch((error) => {
          console.log(JSON.stringify(error))
          this.setComputeError({ semesterId: semesterId, errorMsg: error.message })
        })
        .finally(() => {
          this.setComputeLoading({ semesterId: semesterId, status: false })
        })
    },
  },
})

export default useStore

function strHash(str) {
  // java String#hashCode
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function numToColor(num) {
  num = num * num
  return 'rgb(' + (255 - ((num * 7) % 127)) + ',' + (255 - ((num * 5) % 83)) + ',' + (255 - ((num * 3) % 79)) + ')'
  // return "rgb("+(255-(num%151))+","+(255-(num%127))+","+(255-(num%103))+")"
}

function courseNameToColor(name) {
  return numToColor(strHash(name))
}
