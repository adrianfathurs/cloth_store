<template>
  <div class="row text-center">
    <div class="col-md-3 col-sm-6 col-xs-12 " style="height:100% !important"  v-for ="item in items" :key="item.id">
          <slot name="item" v-bind:item="item"></slot>
    </div>
    <div v-if="items.length" v-observe-visibility="handleScrolledToBottom" style="height:10"></div>
  </div>
</template>
<script>
export default {
  props:{
    items:{
      required: true,
      type: Array
    }
  },
  data() {
    return {
      page:1,
    }
  },
  methods: {
    handleScrolledToBottom(isVisible){
      if(!isVisible){return}
      var count= Math.ceil(this.items.length/10)
      console.log(this.page,"ini page")
      console.log(count,"ini count")
      if(this.page != count || count == 1){                                 
        this.page++;
        this.$emit("refresh",this.page);
      }
    }
  },
}
</script>