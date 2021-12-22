import axios from 'axios'
import Vue from 'vue'
export const BASE_URL_DEV='http://clothstore-api.website'
export const instance = axios.create({
  baseURL: `${BASE_URL_DEV}/api/v1/`,
  timeout: 6000,
  headers: {
    Authorization: Vue.$cookies? `Bearer ${VUe.$cookies.get("token","")}`:"",
    Accept:"application/json",
    "Content-Type":"application/json" 
  }
});
instance.interceptors.request.use(
  function(config){
    if(Vue.$cookies){
      config.headers['Authorization']= `Bearer ${Vue.$cookies.get("token","")}`;
    }
    return config;
  },
  function(error){
    return Promise.reject(error);
  }
)
instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);
//
// export const httpClient2 = axios.create({
//   baseURL: `${BASE_URL2}`,
//   timeout: 60000,
//   headers: {
//     Authorization: Vue.$cookies
//       ? `Bearer ${Vue.$cookies.get("token", "")}`
//       : "",
//     Accept: "application/json",
//     "Content-Type": "application/json"
//   }
// });
// httpClient2.interceptors.request.use(
//   function(config) {
//     if (Vue.$cookies) {
//       config.headers["Authorization"] = `Bearer ${Vue.$cookies.get(
//         "token",
//         ""
//       )}`;
//     }
//     return config;
//   },
//   function(error) {
//     Bugsnag.notify(error);
//     return Promise.reject(error);
//   }
// );
// httpClient2.interceptors.response.use(
//   function(response) {
//     return response;
//   },
//   function(error) {
//     Bugsnag.notify(error);
//     return Promise.reject(error);
//   }
// );

//endpoint
export const getProducts = (params)=> instance.get("products",{params});
export const postLogin = (params)=> instance.post("login",params);

