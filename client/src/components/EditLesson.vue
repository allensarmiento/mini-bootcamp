<template>
  <div>
    <h1>Edit Lesson</h1>

    <div style="padding: 4rem;">
      <b-jumbotron v-for="(slide, index) in slides" :key="index">
        <template #header>
          Slide {{ slide.number }}: {{ slide.title }}
        </template>

        <hr class="my-4">

        <div style="text-align: left;">
          <div v-for="(item, index) in slide.items" :key="index">
            <p v-if="item.type === 'text' || item.type === 'question'">
              {{ item.text }}
            </p>

            <b-table 
              v-if="item.type === 'table'" 
              striped 
              :items="item.table"
            ></b-table>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between;">
          <b-button variant="primary" href="#">Edit</b-button>
          <b-button variant="warning" href="#">Delete</b-button>
        </div>
      </b-jumbotron>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLesson } from '../utilities/firebase'

export default {
  name: 'EditLesson',
  data: function() {
    return {
      lessonNumber: null,
      slides: []
    }
  },
  computed: mapState(['userProfile']),
  mounted: async function() {
    this.lessonNumber = this.$route.params.lessonNumber
    this.slides = await getLesson(this.$route.params.lessonNumber)
  }
}
</script>

<style lang="scss" scoped>

</style>
