<template>
  <div>
    <v-container>
      <div class="row">
        <div
        class="col-md-3 col-sm-3 col-xs-12"
        >
          <v-card outlined>
            <v-card-title>Filters</v-card-title>
            <v-divider></v-divider>
            <template>
              <v-treeview :items="items" v-model="chooseFilter" @update:active="onFilter" :open="[1]" :active="[5]" :selected-color="'#fff'" activatable open-on-click dense></v-treeview>
            </template>
            <v-divider></v-divider>
            <v-card-title>Price</v-card-title>
            <v-range-slider
              v-model="range"
              :max="max"
              :min="min"
              :height="10"
              class="align-center"
              dense
            ></v-range-slider>
            <v-row class="pa-2" dense>
              <v-col cols="12" sm="5">
                <v-text-field
                  :value="range[0]"
                  label="Min"
                  outlined
                  dense
                  @change="$set(range, 0, $event)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2">
                <p class="pt-2 text-center">TO</p>
              </v-col>
              <v-col cols="12" sm="5">
                <v-text-field
                  :value="range[1]"
                  label="Max"
                  outlined
                  dense
                  @change="$set(range, 1, $event)"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-card-title class="pb-0">Customer Rating</v-card-title>
            <v-container class="pt-0"  fluid>
              <v-checkbox append-icon="mdi-star" label="4 & above" hide-details dense></v-checkbox>
              <v-checkbox append-icon="mdi-star" label="3 & above" hide-details dense></v-checkbox>
              <v-checkbox append-icon="mdi-star" label="2 & above" hide-details dense></v-checkbox>
              <v-checkbox append-icon="mdi-star" label="1 & above" hide-details dense></v-checkbox>
            </v-container>
          </v-card>
        </div>
        <div
          class="col-md-9 col-sm-9 col-xs-12"
        >
          <v-breadcrumbs class="pb-0" :items="breadcrums"></v-breadcrumbs>

          <v-row dense>
            <v-col cols="12" sm="8" class="pl-6 pt-6">
              <small>Showing 1-12 of 200 products</small>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select class="pa-0" v-model="select" :items="options" style="margin-bottom: -20px;" outlined dense></v-select>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <infinite-scroll :items="products" @refresh="getAllProduct">
            <template v-slot:item="{item}">
              
                
                  <v-hover v-slot:default="{ hover }">
                    <v-card
                      class="mx-auto"
                      color="grey lighten-4"
                      max-width="600"
                    >
                      <v-img
                        class="white--text align-end"
                        :aspect-ratio="16/9"
                        height="200px"
                        :src="item.productImage.length==0?require('../assets/product/default.png'):imageUrl+item.productImage[0].file_name"
                      >
                        <!-- <v-card-title>{{item.product_availability}} </v-card-title> -->
                        <v-expand-transition>
                          <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out white darken-2 v-card--reveal display-3 white--text"
                            style="height: 100%;"
                          >
                            <v-btn v-if="hover && item.product_availability==1" @click="detailProduct(item.id)" class="" color="green lighten-1" outlined>VIEW</v-btn>
                            <v-btn v-else-if="hover && item.product_availability==0" class="" style="color:red;" outlined>SOLD OUT</v-btn>
                            
                          </div>

                        </v-expand-transition>
                      </v-img>
                      <v-card-text class="text--primary">
                        <div><a href="/product" style="text-decoration: none">{{item.name.length> 13 ? item.name.substring(0,9)+" [...]":item.name}}</a></div>
                        <p>{{item.price}} IDR</p>
                      </v-card-text>
                    </v-card>
                  </v-hover>
               
              
            </template>
          </infinite-scroll>
          
        </div>
      </div>
    </v-container>
  </div>
</template>
<style>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .8;
    position: absolute;
    width: 100%;
  }
</style>
<script>
import { getAllProducts, getAllCategory, getCategoryById } from '../utils/api'
import { imageURL } from '../utils/imageUrl'
import InfiniteScroll from '../components/shopIT/InfiniteScroll.vue'
    export default {
        components:{
          InfiniteScroll
        },
        watch:{
          // chooseFilter:{
          //   handle:function(newVal){
          //       console.log(newVal);
          //     }
          // }
        },
        data: () => ({
            chooseFilter:[0],
            data:[],
            products:[],
            scrollUp:0,
            maxScroll:230,
            busy:false,
            imageUrl:imageURL,
            range: [0, 10000],
            select:'Popularity',
            options: [
                'Default',
                'Popularity',
                'Relevance',
                'Price: Low to High',
                'Price: High to Low',
            ],
            page:1,
            breadcrums: [
                {
                    text: 'Home',
                    disabled: false,
                    href: 'breadcrumbs_home',
                },
                {
                    text: 'Clothing',
                    disabled: false,
                    href: 'breadcrumbs_clothing',
                },
                {
                    text: 'T-Shirts',
                    disabled: true,
                    href: 'breadcrumbs_shirts',
                },
            ],
            min:0,
            max:10000,
            items: [
                {
                    id: 0,
                    name: 'All',
                    
                },

            ],
        }),
  methods:{
    
    async getCategoriesById(params){
      try {
        let response= await getCategoryById({category:params});
      
        this.max=response.data.metaData.max_price;
        this.range=[0,response.data.metaData.max_price]
        console.log(response.data.metaData.max_price)
      } catch (error) {
        console.log(error)
      }
    },
    onFilter(chooseFilter){
      console.log(chooseFilter[0])
      if(chooseFilter.length != 0 && chooseFilter[0]==3){
        this.getCategoriesById("jeans")
      }
      
    },
    async getCategories(){
            let response = await getAllCategory();
            console.log(response.data)
            response.data.data.map((item)=>{
              var obj={
                id:item.id,
                name:item.name.charAt(0).toUpperCase()+item.name.slice(1),
              }
              this.items.push(obj);
            })
    },
    onScroll() {
      var usersHeading = this.$refs["scrolling"];
      if (usersHeading) {
          var marginTopUsers = usersHeading.getBoundingClientRect().top;
          console.log(marginTopUsers,"margin Top User")
          var innerHeight = window.innerHeight;
          console.log(innerHeight,"inner Height")
          if(this.maxScroll > marginTopUsers){
            this.maxScroll = marginTopUsers;
            console.log("reload")
          }else if(this.maxScroll < marginTopUsers){
            console.log("tidak reload")
          }
                                
      }  
    },
    loadMore(){
      this.busy = true;
      setTimeout(() => {
        this.getAllProduct();
        this.busy = false;
        
      }, 10000);
      
    },
    async getAllProduct(number){
      try {
        console.log(number,"ini number")
        let response = await getAllProducts({page:number});
      
          if(response.data.metaData.code==200){
            // console.log(response.data.metaData.products.data[0]);
            let res=response.data.metaData.products.data;
            for (let index = 0; index < res.length; index++) {
              var element = res[index];
              this.products.push(element)  
            }
            
            console.log(this.products)
          }else if(response.data.metaData.code==400){
            alert("Server Error")
          }
      } catch (error) {
        console.log("ini error blog"+error)
      }
    },
    detailProduct(id){
      this.$router.push("/product/"+id);
    }
  },
  mounted() {
    this.getAllProduct(1);
    this.getCategories();
    this.$nextTick(function() {
        window.addEventListener('scroll', this.onScroll);
        this.onScroll(); // needed for initial loading on page
    }); 
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll);
  }  
  }
</script>
