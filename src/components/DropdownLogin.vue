<template lang="pug">
  .text-center
    v-menu(offset-y='')
      template(v-slot:activator='{ on, attrs }')
        v-btn(  color="primary" v-bind='attrs' v-on='on')
          v-icon mdi-account-circle
      v-list
        v-list-item(v-for='(item, index) in items' :key='index')
          v-list-item-title {{ item.title }}
</template>
<script>
export default {
  data: () => ({
      items: [
        { title: 'My Profile' },
        { title: 'Sign Out' },
        
      ],
    }),
}
</script>