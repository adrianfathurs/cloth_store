<template lang="pug">
  v-dialog(transition='dialog-top-transition' max-width='400')
        template(v-slot:activator='{ on, attrs }')
          v-btn(icon=''  v-bind='attrs' v-on='on')
            v-icon mdi-account-circle
        template(v-slot:default='statusDialog')
          v-card
            v-toolbar(color='primary' dark='') Login
            v-card-text.p-4
              validation-observer(ref='observer' v-slot='{ invalid }')
                form(@submit.prevent='submit')
                  validation-provider(v-slot='{ errors }' name='email' rules='required|email')
                    v-text-field.mt-3(v-model='email' :error-messages='errors' label='E-mail' required='')
                  v-text-field.input-group--focused(:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" name='input-10-2' label='Password' hint='At least 8 characters' v-model="password" @click:append='show2 = !show2')
                  validation-provider(v-slot='{ errors }' name='checkbox')
                    v-checkbox(v-model='keepLogin' :error-messages='errors' value='1' label='Keep Login' type='checkbox' required='')
                v-btn(type='button' color="primary" @click="btnLogin()" :block="true" :disabled="invalid")
                  | Login
              center
                label(style="font-weight:bold") OR
              v-btn(type='button'  :block="true" @click="" )
                v-row(justify="center")
                    img.mt-1(:height="25" :width="25" src="@/assets/logo_google.png")
                    p.ml-1.mt-2 Login With Google
</template>
<script>
  import { required, digits, email, max, regex } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import {postLogin} from '../utils/api'
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
    },
    data: () => ({
      name: '',
      show2: false,
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
    },
    methods: {
      async btnLogin(){
        let obj={
          email:this.email,
          password:this.password
        }
        let response=await postLogin(obj)
        console.log(response,"ini response");
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