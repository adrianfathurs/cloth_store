<template lang="pug">
  v-dialog( transition='dialog-top-transition' v-model="otpModal" max-width='600' persistent )
    v-card(style="padding:60px" height="400")
      div.mt-4
        div.content-center
          .shopIT-h1 OTP
        .span.content-center Please, check OTP code on you're email !
        div.content-center.mt-1
          v-otp-input(ref='otpInput' input-classes='otp-input' separator='-' :num-inputs='6' :should-auto-focus='true' :is-input-num='true' @on-change='handleOnChange' @on-complete='handleOnComplete')
        .content-center.mt-3
          v-btn(@click='handleClearInput()') Clear Input
</template>

<script>
import {postCheckOTP} from '../../utils/api'
export default {
  name: 'App',
  props:['otpModal'],
  methods: {
    async checkOTP(otp){
      try {
        var body={
          otp_code:otp
        }
        let response= await postCheckOTP(body)
        if(response.data.code ==200 && response.data.message=="Account Verified"){
          this.$emit("backParent")
        }else if(response.data.code == 200 && response.data.message=="Wrong OTP Code"){
          alert("OTP KAMU SALAH")
        }
        
      } catch (error) {
        console.log(error)
      }
    },
    handleOnComplete(value) {
      this.checkOTP(value)
    },
    handleOnChange(value) {
      console.log('OTP changed: ', value);
    },
    handleClearInput() {
      this.$refs.otpInput.clearInput();
    },
  },
};
</script>

<style>
  @import '../../assets/css/OTP.css';
</style>
