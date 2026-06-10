<template>
  <div>
    <div id="t_bodyContainer" class="container box">
      <!-- Title -->
      <div style="text-align: center">
        <h1 class="title">Western Timetable Maker</h1>
      </div>

      <!-- Semester selection tab -->
      <div class="tabs is-boxed">
        <ul>
          <li class="t_semesterTab" :class="{ 'is-active': store.curSemester === 0 }" @click="changeSemester(0)"><a>FALL
              2024</a></li>
          <li class="t_semesterTab" :class="{ 'is-active': store.curSemester === 1 }" @click="changeSemester(1)"><a>WINTER
              2025</a></li>
        </ul>
      </div>

      <article id="disclaimer" class="message is-info">
        <div class="message-body">
          <span class="red">**Updated for 2024/2025!**</span>
          Data last updated on <strong>{{ store.metadata.time }}</strong>. Western Timetable Maker is not affiliated with the
          university.
        </div>
      </article>

      <!-- Body -->
      <div class="columns" :class="{ t_lowerFall: store.curSemester == 0, t_lowerWinter: store.curSemester == 1 }">
        <CourseSelection class="column is-5" />
        <Results class="column" />
      </div>

      <!-- Footer -->
      <footer id="footer"><strong>Western Timetable Maker</strong> is <a
          href="https://github.com/shrumit/Western-Timetable-Maker" target="_blank">open-source</a>.</footer>
    </div>
  </div>
</template>

<script setup>
  import CourseSelection from './components/CourseSelection.vue'
  import Results from './components/Results.vue'
  import { useStore } from './store.js'

  const store = useStore()

  function changeSemester(semesterId) {
    store.changeSemester(semesterId)
  }
</script>

<style lang="scss">
  #t_bodyContainer {
    max-width: 98%;
    margin-top: 10px;
    padding: 2rem;
    // min-height: 1000px;
    border-radius: 3px;
  }

  #disclaimer {
    font-size: 0.8rem;
    // text-align: center;
  }

  #footer {
    text-align: center;
    padding-top: 4rem;
    font-size: 1rem;
  }

  #footer a {
    text-decoration: underline;
    white-space: nowrap;
  }

  .t_semesterTab.is-active {
    font-weight: 600;
  }

  .red {
    color: red;
    font-weight: bold;
  }

  @media (max-width: 1024px) {
    #t_bodyContainer {
      max-width: 99%;
      padding: 0.5rem;
    }
  }
</style>
