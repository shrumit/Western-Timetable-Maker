<template>
  <div class="t_tableDiv">
    <table class="t_weekTable">
      <thead>
        <tr>
          <th></th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in 30" v-bind:key=row>
          <th scope="row">{{ labels[row-1] }}</th>
          <td
          v-for="(day, dayIdx) in daysArray"
          v-bind:key=dayIdx
          class="t_weekSlot"
          :class="{ 't_lab': day[row-1].type==='LAB', 't_tut': day[row-1].type==='TUT', 't_firstCell': day[row-1].firstCell }"
          :style="{'background-color': day[row-1].color, 'border-color':day[row-1].color}"
          :title="day[row-1].tooltip"
          >
            {{ day[row-1].text }}
          </td>
        </tr>
      </tbody>
    </table>
    <br>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store.js'

function courseShortForm(name) {
  name = name.split('-')[0].trim().split(' ')
  return name[0].slice(0,4) + ' ' + name[1]
}
function courseNameOnly(name) {
  return name.split('-')[1].trim()
  // return name.slice(0,4) + ' ' + name.split(' ')[1]
}

const props = defineProps({
  table: Object,
})

const store = useStore()
const labels = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM']

const coursecomp = computed(() => store.semester[store.curSemester].coursecomp)
const daysArray = computed(() => {
  let days = new Array(5);
  let cellDummy = {
    text: '',
    color: 'inherit',
    tooltip: '',
    type: '',
    firstCell: false
  }
  days[0] = new Array(32).fill(cellDummy)
  days[1] = new Array(32).fill(cellDummy)
  days[2] = new Array(32).fill(cellDummy)
  days[3] = new Array(32).fill(cellDummy)
  days[4] = new Array(32).fill(cellDummy)

  // coursecomponent sections are joined with metadata to produce days of the table
  props.table.sections.forEach(function(section, ccIdx) {
    coursecomp.value[ccIdx].sections[section].timeslots.forEach(function(ts, tsIdx) { // for each day
      for (let i = 0; i < ts[1]; i++) { // loop as many times as the length
        let cell = {
          text: '',
          color: coursecomp.value[ccIdx].courseColor,
          tooltip: courseNameOnly(coursecomp.value[ccIdx].courseName) + ' ClassNbr:' + coursecomp.value[ccIdx].sections[section].number + ' ' + coursecomp.value[ccIdx].sections[section].location + ' ' + coursecomp.value[ccIdx].sections[section].instructor,
          type:  coursecomp.value[ccIdx].name
        }
        if (i == 0) {
          cell.text = courseShortForm(coursecomp.value[ccIdx].courseName) // BIOL 1001A
          cell.firstCell = true
        }
        else if (i == 1) {
          cell.text = coursecomp.value[ccIdx].name + ' ' +  coursecomp.value[ccIdx].sections[section].name// <COMP SEC INSTRUCTOR>
        }
        days[tsIdx][ts[0]+i] = cell
      }
    })
  })

  return days
})

</script>

<style scoped>
.t_tableDiv {
  overflow: auto;
}

table {
  border: 1px solid var(--tt-table-border);
  width: 100%;
  /* margins: 0 auto; */
  /* max-width: 1000px; */
  border-collapse: collapse;
}

td,
th {
  border-top: 1px solid var(--tt-table-border);
  border-right: 1px solid var(--tt-table-border) !important;
  font-weight: normal;
  padding: 0 0.5em 0 0.5em;
  text-align: left;
  width: 8em;
}
tr {
  color: var(--tt-table-muted-text);
}
tr:hover {
  color: var(--tt-table-hover-text);
}

.t_weekSlot {
  color: var(--tt-table-slot-text);
  text-align: center;
}

.t_tut {
  color: var(--tt-table-tutorial-text);
}

.t_lab {
  color: var(--tt-table-lab-text);
}

.t_firstCell {
  border-top: 1px solid var(--tt-table-slot-divider) !important;
}

tr:nth-child(even) {
  background-color: var(--tt-table-row-even-bg);
}
tr:nth-child(odd) {
  background-color: var(--tt-table-row-odd-bg);
}
</style>
