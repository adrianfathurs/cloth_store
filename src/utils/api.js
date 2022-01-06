import axios from 'axios'
import Vue from 'vue'
export const BASE_URL_DEV='https://backend.clothstore-api.website'
export const instance = axios.create({
  baseURL: `${BASE_URL_DEV}/api/v1/`,
  timeout: 6000,
  headers: {
    Authorization: Vue.$cookies? `Bearer ${Vue.$cookies.get("token","")}`:"",
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

/* ENDPOINT */
//product
export const getAllProducts = (params)=> instance.get("products",{params});
export const getDetailProduct = (params)=> instance.get("products/"+params);
//authentication
export const postLogin = (params)=> instance.post("login",params);
export const postRegister = (params)=> instance.post("register",params);
export const postCheckOTP =(params)=>instance.post("checkOTP",params);
//Banner
export const getAllBanner=(params)=>instance.get("banner",params)

