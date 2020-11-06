<template>
  <div>
    <h1>Lesson</h1>
    <p>{{ slides[slideIndex].title }}</p>
    <p>{{ items[itemIndex] }}</p>
    <button>Move Back</button>
    <button @click="moveForward">Move Forward</button>
  </div>
</template>

<script>
export default {
  name: 'Lesson',
  data: function() {
    return {
      slideIndex: 0,
      itemIndex: 0,

      slides: [
        {
          title: 'Slide 1',
          items: [
            'Test 1:1',
            'Test 1:2'
          ]
        },
        {
          title: 'Slide 2',
          items: [
            'Test 2:1',
            'Test 2:2'
          ]
        }
      ],
      items: []
    }
  },
  mounted: function() {
    this.items = this.slides[0].items
  },
  methods: {
    moveForward: function() {
      if (this.itemIndex < this.items.length - 1) {
        this.itemIndex += 1
      } else if (this.slideIndex < this.slides.length - 1) {
        this.slideIndex += 1
        this.items = this.slides[this.slideIndex].items
        this.itemIndex = 0
      }

      if (this.itemIndex === this.items.length - 1 && this.slideIndex === this.slides.length - 1) {
        console.log('The end!')
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
