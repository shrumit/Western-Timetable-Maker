<template>
  <div>
    <!-- <p v-if="daysArray && Array.isArray(daysArray)">{{ daysArray[0] }}</p> -->
    <!-- {{ coursecomp }} -->
    Score: {{ table.score }}
    <table class="t_weekTable">
      <thead>
        <td></td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td>
      </thead>
      <tr v-for="row in 30" v-bind:key=row>
        <td>{{ labels[row-1] }}</td>
        <!-- v-if="day[row-1]" -->
        <td
        v-for="(day, dayIdx) in daysArray"
        v-bind:key=dayIdx
        class="t_weekSlot"
        :class="{ 't_lab': day[row-1].type==='LAB', 't_tut': day[row-1].type==='TUT', 't_firstCell': day[row-1].firstCell }"
        :style="{'background-color': day[row-1].color, 'border-color':day[row-1].color}"
        :title="day[row-1].tooltip"
        >
          {{ day[row-1].text }}
          <!-- {{ day[row-1] }} -->
        </td>
        <!-- <td v-else>
          
        </td> -->
      </tr>
    </table>
    <br>
  </div>
</template>

<script>
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
function courseShortForm(name) {
  name = name.split('-')[0].trim().split(' ')
  return name[0].slice(0,4) + ' ' + name[1]
}
function courseNameOnly(name) {
  return name.split('-')[1].trim()
  // return name.slice(0,4) + ' ' + name.split(' ')[1]
}

export default {
  name: 'Table',
  props: {
    table: Object,
  },
  data() {
    return {
      labels: ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM','06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM','10:00 PM','10:30 PM','11:00 PM','11:30 PM']
    }
  },
  computed: {
    curSemester() {
      return this.$store.state.curSemester
    },
    coursecomp() {
      return this.$store.state.semester[this.curSemester].coursecomp
    },
    daysArray() {
      let days = new Array(5);
      let cellDummy = {
        text: '',
        color: 'inherit',
        tooltip: '',
        type: ''
      }
      days[0] = new Array(32).fill(cellDummy)
      days[1] = new Array(32).fill(cellDummy)
      days[2] = new Array(32).fill(cellDummy)
      days[3] = new Array(32).fill(cellDummy)
      days[4] = new Array(32).fill(cellDummy)
      this.table.sections.forEach(function(section, ccIdx) {
        this.coursecomp[ccIdx].sections[section].timeslots.forEach(function(ts, tsIdx) { // for each day
          for (let i = 0; i < ts[1]; i++) { // loop as many times as the length
            let cell = {
              text: '',
              // color: numToColor(this.coursecomp[ccIdx].sections[section].number),
              color: courseNameToColor(this.coursecomp[ccIdx].courseName),
              tooltip: courseNameOnly(this.coursecomp[ccIdx].courseName) + ' ClassNbr:' +this.coursecomp[ccIdx].sections[section].number + ' '+  this.coursecomp[ccIdx].sections[section].location +' ' + this.coursecomp[ccIdx].sections[section].instructor,
              type:  this.coursecomp[ccIdx].name
            }
            if (i == 0) {
              cell.text = courseShortForm(this.coursecomp[ccIdx].courseName) // BIOL 1001A
              cell.firstCell = true
            }
            else if (i == 1)
              cell.text = this.coursecomp[ccIdx].name + ' ' +  this.coursecomp[ccIdx].sections[section].name// <COMP SEC INSTRUCTOR>
            days[tsIdx][ts[0]+i] = cell
          }
        }.bind(this))
      }.bind(this))
      return days
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  border: 1px solid #DBDBDB;
  width: 100%;
  /* margins: 0 auto; */
  /* max-width: 1000px; */
  border-collapse: collapse;
}
td {
  border-top: 1px solid #DBDBDB;
  border-right: 1px solid #DBDBDB;
  padding: 0 0.5em 0 0.5em;
  width: 8em;
}
tr {
  color: grey;
}
tr:hover {
  color: black;
}

.t_weekSlot {
  color: black;
  text-align: center;
}

.t_tut {
  color: indianred;
}

.t_lab {
  color: darkgreen;
}

.t_firstCell {
  box-shadow: inset 0px 1px 0px 0px black;
}

tr:nth-child(even) {
  background-color: #F3F3F3;
}
tr:nth-child(odd) {
  background-color: #FAFAFA;
}
</style>
