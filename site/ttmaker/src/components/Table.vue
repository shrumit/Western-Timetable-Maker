<template>
  <div class="t_tableDiv">
    <p>{{ timeslotless }}</p>
    <table class="t_weekTable">
      <thead>
        <td></td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td>
      </thead>
      <tr v-for="row in 30" v-bind:key=row>
        <td>{{ labels[row-1] }}</td>
        <td
        v-for="(day, dayIdx) in days"
        v-bind:key=dayIdx
        class="t_weekSlot"
        :class="{ 't_lab': day[row-1].type==='LAB', 't_tut': day[row-1].type==='TUT', 't_firstCell': day[row-1].firstCell }"
        :style="{'background-color': day[row-1].color, 'border-color':day[row-1].color}"
        :title="day[row-1].tooltip"
        >
          {{ day[row-1].text }}
        </td>
      </tr>
    </table>
    <br>
  </div>
</template>

<script>

function courseShortForm(name) {
  name = name.split('-')[0].trim().split(' ')
  return name[0].slice(0,4) + ' ' + name[1]
}
function courseNameOnly(name) {
  return name.split('-')[1].trim()
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
    days() {
      let days = new Array(5);
      let cellDummy = {
        text: '',
        color: 'inherit',
        tooltip: '',
        type: '',
        firstCell: false
      }
      days[0] = new Array(30).fill(cellDummy)
      days[2] = new Array(30).fill(cellDummy)
      days[1] = new Array(30).fill(cellDummy)
      days[3] = new Array(30).fill(cellDummy)
      days[4] = new Array(30).fill(cellDummy)

      // table sections are joined with coursecomp
      this.table.sections.forEach(function(section, ccIdx) {
        // ignore the timeslotless pseudosection
        if (section == this.coursecomp[ccIdx].sections.length)
          return;       

        this.coursecomp[ccIdx].sections[section].timeslots.forEach(function(ts, tsIdx) { // for each day
          for (let i = 0; i < ts[1]; i++) { // loop as many times as the length
            let cell = {
              text: '',
              color: this.coursecomp[ccIdx].courseColor,
              tooltip: courseNameOnly(this.coursecomp[ccIdx].courseName) + ' ClassNbr:' +this.coursecomp[ccIdx].sections[section].number + ' '+  this.coursecomp[ccIdx].sections[section].location +' ' + this.coursecomp[ccIdx].sections[section].instructor,
              type:  this.coursecomp[ccIdx].name
            }
            if (i == 0) {
              cell.text = courseShortForm(this.coursecomp[ccIdx].courseName) // BIOL 1001A
              cell.firstCell = true
            }
            else if (i == 1) {
              cell.text = this.coursecomp[ccIdx].name + ' ' +  this.coursecomp[ccIdx].sections[section].name // LEC 001
            }
            days[tsIdx][ts[0]+i] = cell
          }
        }.bind(this))
      }.bind(this))

      return days
    },
    timeslotless() {
      let ret = []
      // table sections are joined with coursecomp
      this.table.sections.forEach(function(section, ccIdx) {
        // skip if not the timeslotful pseudosection
        if (section < this.coursecomp[ccIdx].sections.length) return

        // build a context for all timeslotless sections
        this.coursecomp[ccIdx].timeslotless.forEach((sec) => {
          let context = {}
          context.text = `${courseShortForm(this.coursecomp[ccIdx].courseName)} ${this.coursecomp[ccIdx].name} ${sec.name}`
          context.tooltip = courseNameOnly(this.coursecomp[ccIdx].courseName) + ' ClassNbr:' + sec.number + ' '+  sec.location +' ' + sec.instructor
          context.type = this.coursecomp[ccIdx].name
          ret.push(context)
        })
      }.bind(this))
      return JSON.stringify(ret)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.t_tableDiv {
  overflow: auto;
}

table {
  border: 1px solid #DBDBDB;
  width: 100%;
  border-collapse: collapse;
}

td {
  border-top: 1px solid #DBDBDB;
  border-right: 1px solid #DBDBDB !important;
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
  border-top: 1px solid black !important;
}

tr:nth-child(even) {
  background-color: #F3F3F3;
}
tr:nth-child(odd) {
  background-color: #FAFAFA;
}
</style>
