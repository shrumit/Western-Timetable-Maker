<template>
    <div v-show="curStep !== 2">
        <ol>
            <li :class="{ 'is-active': curStep === 0 }">Select and add a course.</li>
            <li :class="{ 'is-active': curStep === 1 }">Click "Generate Timetables" to compute conflict-free timetables!
            </li>
        </ol>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store.js'

defineOptions({
    name: 'Instructions'
})

const store = useStore()
const curSemester = computed(() => store.curSemester)
const curStep = computed(() => {
    if (store.semester[curSemester.value].courseList.length == 0
        && store.semester[curSemester.value].computeData.length == 0) {
        return 0
    }
    else if (store.semester[curSemester.value].computeData.length == 0) {
        return 1
    }
    else {
        return 2
    }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@use '../theme' as *;

div {
    padding: 2rem;
}

.is-active {
    font-weight: bold;
    color: $tt-western-purple;
}
</style>
