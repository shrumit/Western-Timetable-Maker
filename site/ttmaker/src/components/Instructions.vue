<template>
    <div v-show="curStep !== 2">
        <ol>
            <li :class="{ 'is-active': curStep === 0 }">Search for and "Add" your courses.</li>
            <li :class="{ 'is-active': curStep === 1 }">Click "Generate Timetables" to compute conflict-free timetables!
            </li>
        </ol>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from '../store.js'

const store = useStore()
const curStep = computed(() => {
    if (store.semester[store.curSemester].courseList.length == 0
        && store.semester[store.curSemester].computeData.length == 0) {
        return 0
    }
    else if (store.semester[store.curSemester].computeData.length == 0) {
        return 1
    }
    else {
        return 2
    }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
div {
    padding: 2rem;
}

.is-active {
    font-weight: bold;
    color: var(--tt-accent-color);
}
</style>
