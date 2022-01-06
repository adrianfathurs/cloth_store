<template lang="pug">
div
  v-btn(icon='' @click="statusDialog=true"  v-bind='attrs' v-on='on')
      v-icon mdi-account-circle
  v-dialog(transition='dialog-top-transition' v-model="statusDialog" max-width='400')
        
    v-card
      v-toolbar(color='primary' dark='') {{this.signUpMode==false?"Login":"Sign Up"}}
      v-card-text.p-4
        validation-observer(ref='observer' v-slot='{ invalid }')
          form(@submit.prevent='submit')
            validation-provider(v-if="signUpMode" v-slot='{ errors }' name='name' rules='required')
              v-text-field.mt-3(v-model='name' :error-messages='errors' label='name' required='')
            validation-provider(v-slot='{ errors }' name='email' rules='required|email')
              v-text-field.mt-3(v-model='email' :error-messages='errors' label='E-mail' required='')
            VuePhoneNumberInput(v-if="signUpMode" v-model='phoneNumber')
            v-text-field.input-group--focused(:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" name='input-10-2' label='Password' hint='At least 8 characters' v-model="password" @click:append='show2 = !show2')
            validation-provider(v-if="signUpMode==false" v-slot='{ errors }' name='checkbox')
              v-checkbox(v-model='keepLogin' :error-messages='errors' :value="true" label='Keep Login' type='checkbox' required='')
          v-btn(v-if="signUpMode==false" type='button' color="primary" @click=" btnLogin()" :block="true" :disabled="invalid")
            | Login
        center.mt-2.mb-2(v-if="signUpMode==false")
          label(style="font-weight:bold") OR
        v-btn(v-if="signUpMode==false" type='button'  :block="true" @click="" )
          v-row(justify="center")
              img.mt-1(:height="25" :width="25" src="@/assets/logo_google.png")
              p.ml-1.mt-2 Login With Google
        v-btn.mt-2( type='button' color="warning" :block="true" @click="btnSignUp()" )
          | Sign Up
        v-btn.mt-2(v-if="signUpMode" type='button'  :block="true" @click="btnLogin()" )
          | Back
  otp-modal(v-show="otpModal" :otpModal="otpModal" @backParent="changeOTPModal()")
</template>
<script>
  import Vue from 'vue'
  const VuePhoneNumberInput = require('vue-phone-number-input');
  import 'vue-phone-number-input/dist/vue-phone-number-input.css';
  import OtpModal from '../components/shopIT/OtpModal.vue'
  import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import {postLogin,postRegister} from '../utils/api'
  setInteractionMode('eager')

  extend('digits', {
    ...digits,
    message: '{_field_} needs to be {length} digits. ({_value_})',
  })

  extend('required', {
    ...required,
    message: '{_field_} can not be empty',
  })

  extend('max', {
    ...max,
    message: '{_field_} may not be greater than {length} characters',
  })

  extend('regex', {
    ...regex,
    message: '{_field_} {_value_} does not match {regex}',
  })

  extend('email', {
    ...email,
    message: 'Email must be valid',
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
      VuePhoneNumberInput,
      OtpModal,
    },
    data: () => ({
      otpModal:false,
      name: null,
      signUpMode:false,
      keepLogin:false,
      show2: false,
      statusDialog:false,
      password: '',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => (`The email and password you entered don't match`),
        },
      phoneNumber: '',
      email: '',
      select: null,
      items: [
        'Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
      ],
      checkbox: null,
    }),
    watch:{
      email:function(newVal){
        console.log(this.$refs.observer.validate(),"validasi");
        console.log(newVal)
      },
      password:function(newVal){
        console.log(this.$refs.observer.validate(),"validasi");
        console.log(newVal)
      },
      keepLogin:function (newVal) {
        if(!newVal){
          this.keepLogin=false
        }
        console.log("keepLogin",newVal)
      }
    },
    methods: {
      changeOTPModal(){
        this.otpModal=false;
        this.statusDialog=false
        this.$emit("cookiesLogin")
      },
      async btnSignUp(){
        try {
            if(this.signUpMode==false){
              this.signUpMode=true;
            }else{
              let obj={
                name:this.name,
                email:this.email,
                password:this.password,
                phone_number:this.phoneNumber
              }
                let response=await postRegister(obj)
                console.log(response.data.message)
                if( response.data.message.code == 200 ){
                  this.otpModal=true
                  this.signUpMode=false
                  this.$cookies.set("token",response.data.message.token.token,this.keepLogin ? "1y":"1h")
                }else if(response.data.message.message == "User Already Exist" && response.data.message.code == 200){
                  alert("User Already Exist, Langsung Login")
                }
            }
          } catch (error) {
            console.log(error.message)
            alert(error.message)  
          }
      },
      async btnLogin(){
        if(this.signUpMode){
          this.signUpMode=false
        }else{
          let obj={
            email:this.email,
          password:this.password
        }
        let response=await postLogin(obj)
          if(response.data.meta.code == 200 && response.data.meta.is_verified==1){
            console.log("berhasil login")
            this.$store.dispatch("actionAuth",response.data.meta)
            this.$cookies.set("keepLogin", this.keepLogin ? "yes" : "no", "1y");
            this.$cookies.set("token",response.data.meta.token,this.keepLogin ? "1y":"1h")
            // this.$cookies.set("email",response.data.data.email,this.keepLogin ? "1y":"1h")
            setTimeout(() => {
              this.statusDialog=false
            }, 1000);
            this.$emit("cookiesLogin")
          }else if(response.data.meta.code == 200 && response.data.meta.is_verified==0){
            this.$cookies.set("token",response.data.meta.token,this.keepLogin ? "1y":"1h");
            this.otpModal=true;
          }
          else{
            alert("gagal Login")
          }
            }
      },
      submit () {
        this.$refs.observer.validate()
      },
      clear () {
        this.name = ''
        this.phoneNumber = ''
        this.email = ''
        this.select = null
        this.checkbox = null
        this.$refs.observer.reset()
      },
    },
  }
</script>