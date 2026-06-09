<template>
  <div>
    <h2 class="subtitle">Courses</h2>
    <!-- <button class="button" @click="loadTest">Load Test</button> -->
    
    
    <!-- Search bar -->
    <div class="">
      <VueSelect
      v-model="selected[curSemester]"
      :key="selected[curSemester]"
      class="course-select"
      :filter-by="filter"
      :get-option-label="getOptionLabel"
      :get-option-value="getOptionValue"
      :options="options"
      :placeholder="searchPlaceholder"
      >
      </VueSelect>
    </div>
    
    <!-- Add button -->
    <div style="text-align: right;">
      <button id="t_addBtn"
        class="button is-dark is-rounded"
        @click="fetchCourse"
        :disabled="courseAlreadyAdded"
        >
          Add
      </button>
      <p v-if="courseAlreadyAdded" class="errorMsg">Course already in list</p>
    </div>

    <!-- Message box -->
    <article  class="message is-dark is-marginless">
      <div class="message-body">
        · Distance/online courses and sections will not appear.
        <br>
        · Please remove and re-add cached courses to get the latest section data.
        <!-- <br> -->
        <!-- · Potential timetables: {{ formattedCombinationsNum }} -->
      </div>
    </article>
    
    <div class="columns is-vcentered">
      <div class="column is-one-fifth">
        <!-- Remove All button -->
        <button id="t_removeBtn" class="button is-danger is-small is-outlined" @click="removeAll">Reset</button>
      </div>
    </div>

    <!-- Compute button -->
    <div id="t_computeButtonDiv">
      <button id="t_computeButton"
        class="button is-link is-rounded"
        :class="{'is-loading': computeLoading}"
        :disabled="disableCompute"
        @click="compute()">
          Generate Timetables
      </button>
      <p v-if="combinationsNum > 0">{{ formattedCombinationsNum }} possible combinations</p>
      <p v-if="combinationsNum > COMBINATIONS_LIMIT" class="errorMsg">
        Too many combinations to filter! Please de-select some sections manually or select fewer courses.
      </p>
      <p v-if="errorMsg.length" class="errorMsg">Error: {{ errorMsg }}</p>
      <p :class="{'is-loading': computeLoading}" id="patience">Patience is a virtue.</p>
    </div>

    <!-- List of added courses -->
    <Course
    v-for="(course, index) in selectedCourses"
    :key="course.id"
    :courseIndex="index"
    />

  </div>
</template>

<script setup>
  import { computed, reactive } from 'vue'
  import Course from './Course.vue'
  import { useStore } from '../store.js'
  import VueSelect from 'vue3-select-component'
  import 'vue3-select-component/styles'

  defineOptions({
    name: 'CourseSelection'
  })

  const store = useStore()

  const selected = reactive([null, null])
  const COMBINATIONS_LIMIT = 15000000000

  const curSemester = computed(() => store.curSemester)
  const searchPlaceholder = computed(() => {
    if (store.curSemester == 0) return 'Search for fall semester courses...'
    else if (store.curSemester == 1) return 'Search for winter semester courses...'
    else return "Error"
  })
  const options = computed(() => store.semester[curSemester.value].searchList)
  const selectedCourses = computed(() => store.semester[curSemester.value].courseList)
  const combinationsNum = computed(() => {
    if (!selectedCourses.value || selectedCourses.value.length == 0)
      return 0;

    let n = 1;
    selectedCourses.value.forEach(function(course) {
      course.components.forEach(function(comp){
        if (!comp.selected) return;
        let s = comp.sections.filter(x => x.selected).length
        if (s>0) n *= s
      })
    })
    return n
    // return JSON.stringify(store.semester[curSemester.value].courseList)
  })
  const formattedCombinationsNum = computed(() => combinationsNum.value.toLocaleString())
  const disableCompute = computed(() => selectedCourses.value.length == 0 ||
    combinationsNum.value > COMBINATIONS_LIMIT)
  const computeLoading = computed(() => store.semester[curSemester.value].computeLoading)
  const errorMsg = computed(() => store.semester[curSemester.value].errorMsg)
  const courseAlreadyAdded = computed(() => selectedCourses.value.some((e => e.id === selected[curSemester.value])))

  function fetchCourse() {
    // console.log('fetchCourse:' + selected)
    store.fetchCourse({
      semesterId: curSemester.value,
      courseId: selected[curSemester.value]
    })
    selected[curSemester.value] = null
  }

  function filter(option, label, search) {
    // don't show results until more than 1 characters typed
    if (search == null || label == null || search.length < 2) return false;
    return (label).toLowerCase().indexOf(search.toLowerCase()) > -1;
  }

  function getOptionLabel(option) {
    return option.name
  }

  function getOptionValue(option) {
    return option.id
  }

  function loadTest() {
    store.loadTest({semesterId: curSemester.value})
  }

  function compute() {
    store.compute(curSemester.value)
  }

  function removeAll() {
    store.resetSemester(curSemester.value)
  }
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* @import '../styles.scss'; */

  button {
    margin-top: 10px;
    margin-bottom: 10px;
    min-width: 8em;
  }

  #patience {
    opacity: 0;
  }

  #patience.is-loading {
    opacity: 1;
    transition: opacity 4s;
    transition-delay: 2s;
  }

  .errorMsg {
    color: darkorange;
  }

  .campusLabel {
    margin-right: 5px;
  }

  .course-select {
    --vs-border: 1px solid #4F2683;
    --vs-outline-color: #4F2683;
    --vs-placeholder-color: #4F2683;
    --vs-indicator-icon-color: #4F2683;
    --vs-option-focused-background-color: #4F2683;
    --vs-option-focused-text-color: #FFFFFF;
    --vs-option-selected-background-color: #4F2683;
    --vs-option-selected-text-color: #FFFFFF;
  }

  #t_computeButtonDiv {
    text-align: center;
  }

  #t_computeButton {
    box-shadow: 0px 13px 10px -10px rgba(0,0,0,0.4);
  }
</style>
