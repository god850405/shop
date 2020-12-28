<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="登入" active>
        <b-card bg-variant="light">
          <b-form-group
            class="mb-0"
          >
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text"><b-icon icon="person-fill"></b-icon></span>
              </b-input-group-prepend>
              <b-form-input  v-model="login.email" class="LoginInput" type="email" size="lg" placeholder="信箱">
              </b-form-input>
            </b-input-group>
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text"><b-icon icon="lock-fill"></b-icon></span>
              </b-input-group-prepend>
              <b-form-input v-model="login.password" class="LoginInput" type="password" size="lg" placeholder="密碼">
              </b-form-input>
            </b-input-group>
            <hr>
            <b-button class="login-button" v-on:click="OnLogin">登入</b-button>
            <b-button class="google-login-button" v-facebook-signin-button="appId">FaceBook登入</b-button>
            <b-button class="facebook-login-button" v-google-signin-button="clientId">Google登入</b-button>
          </b-form-group>
        </b-card>

      </b-tab>
      <b-tab title="忘記密碼">
        <b-card bg-variant="light">
          <b-form-group
            class="mb-0"
          >
            <b-input-group>
              <b-input-group-prepend>
                <span class="input-group-text"><b-icon icon="person-fill"></b-icon></span>
              </b-input-group-prepend>
              <b-form-input v-model="forgot.email" class="LoginInput" type="email" size="lg" placeholder="請輸入信箱，系統將發送新密碼">
              </b-form-input>
            </b-input-group>
            <hr>
            <b-button class="login-button" v-on:click="OnForgot">發送郵件</b-button>
            
          </b-form-group>
        </b-card>
      </b-tab>
      <b-tab title="註冊">
        <b-card bg-variant="light">
          <b-form-group
            class="mb-0"
          >
            <b-row class="my-1">
              <b-col sm="3">
                <label type-email>信箱</label>
              </b-col>
              <b-col sm="9">
                <b-form-input v-model="user.email" id="type-email" type="email"></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label type-password>密碼</label>
              </b-col>
              <b-col sm="9">
                <b-form-input v-model="user.password" id="type-password" type="password"></b-form-input>
              </b-col>
            </b-row>
            <b-row class="my-1">
              <b-col sm="3">
                <label type-text>姓名</label>
              </b-col>
              <b-col sm="9">
                <b-form-input v-model="user.name" id="type-text" type="text"></b-form-input>
              </b-col>
            </b-row>
            <hr>
            <b-button class="login-button" v-on:click="OnRegister">註冊</b-button>
          </b-form-group>
        </b-card>
      </b-tab>
    </b-tabs>
  </div>
</template>
<script>
import GoogleSignInButton from 'vue-google-signin-button-directive';
import FacebookSignInButton from 'vue-facebook-signin-button-directive';
import * as types from '@/types'
export default {
  directives: {
    GoogleSignInButton,
    FacebookSignInButton
  },
  data(){
    return{
      ///-----------外部登入:金鑰
      clientId: '343454685721-pnoadkh6521lg5beb03enjukf4vc2qe8.apps.googleusercontent.com',
      appId: '788968945019378',
      //-----------------------
      user:{
        email:'',
        password:'',
        name:'',
      },
      login:{
        email:'',
        password:'',
        name:'',
        token:''
      },
      forgot:{
        email:''
      }
    }
  },
  methods: {
    ///-----------外部登入:方法
    OnGoogleAuthSuccess (token,id,name,email) {
      this.$http.get(`https://localhost:44394/Account/IsEmailExist?email=${email}`).then(response => {
        if(response.data){
          this.login.email = email
          this.login.password = id
          this.OnLogin()
        }else{
          this.user.email = email
          this.user.password = id
          this.user.name = name
          this.OnRegister()
        }
      });
    },
    OnGoogleAuthFail (error) {
      console.log(error)
    },
    OnFacebookAuthSuccess (token,id,name,email) {
      this.$http.get(`https://localhost:44394/Account/IsEmailExist?email=${email}`).then(response => {
        if(response.data){
          this.login.email = email
          this.login.password = id
          this.OnLogin()
        }else{
          this.user.email = email
          this.user.password = id
          this.user.name = name
          this.OnRegister()
        }
      });
    },
    OnFacebookAuthFail (error) {
      console.log(error)
    },
    //------------------------
    OnRegister(){
      if(this.user.email!=''&this.user.password!=''&this.user.name!=''){
        this.$http.get(`https://localhost:44394/Account/IsEmailExist?email=${this.user.email}`).then(response => {
          if(response.data){
            this.makeToast('很抱歉，信箱已經存在')
          }else{
            this.$http.post(`https://localhost:44394/Account/Register?email=${this.user.email}&password=${this.user.password}&name=${this.user.name}`).then(response => {
              if(response.data=='1'){
                this.makeToast('註冊成功')
                this.login.email = this.user.email
                this.login.password = this.user.password
                this.OnLogin()
                // this.$root.$emit('bv::hide::modal', 'modal')
              }else{
                this.makeToast('註冊失敗')
              }
            });
          }
        });
      }else{
        this.makeToast('很抱歉，您輸入的資料不完整')
      }
    },
    OnLogin(){
      if(this.login.email!=''&this.login.password!=''){
        
        // ------------核對使用者帳號密碼
        this.$http.get(`https://localhost:44394/Account/Authorize?email=${this.login.email}&password=${this.login.password}`).then(response => {
          if(response.data){
              //----------登入成功，取得TOKEN
              this.$http.get(`https://localhost:44394/Account?Email=${this.login.email}&Password=${this.login.password}`).then(response => {
                  this.login.token = response.data.token
                  this.login.name = response.data.name
                  if (this.login.token!=null) {
                      //儲存在本地的localStograge中
                      this.$store.commit(types.LOGIN, this.login.token)
                      this.$store.commit({
                          type:"setUser", 
                          email:this.login.email,
                          name:this.login.name
                        })
                      //跳轉至其他頁面
                      // let redirect = decodeURIComponent(this.$route.query.redirect || '/');
                      // this.$router.push({
                      //     name:'home'
                      // }).catch(err => {console.log(err)})
                      // this.$refs['modal-center'].hide()
                      this.makeToast('登入成功')
                      this.$root.$emit('bv::hide::modal', 'modal')
                  }
                  else{
                    this.makeToast('登入失敗')
                  }
              });
          }else{
            this.makeToast('代號或密碼錯誤')
          }
        });
      }else{
        this.makeToast('登入失敗')
      }
    },
    OnForgot(){
      if(this.forgot.email!=''){
        console.log("忘記 TRUE");
      }else{
        console.log("忘記 FALSE");
      }
    },
    makeToast(str) {
      this.$root.$bvToast.toast(str, {
        title: '小提醒',
        // toaster: 'b-toaster-top-center',
        autoHideDelay: 2000,
        appendToast: true
      })
    }
  }
}
</script>
<style>
.login-button{
  width:100%;
  margin-top:5px;
}
.google-login-button{
  width:49%;
  margin-top:5px;
  float:left;
  background-color:indianred;
}
.facebook-login-button{
  width:49%;
  margin-top:5px;
  float:right;
  background-color:DodgerBlue;
}
::-webkit-input-placeholder {
  font-size: 20px!important;
}

:-moz-placeholder { /* Firefox 18- */
      font-size: 20px!important;
}
::-moz-placeholder {  /* Firefox 19+ */
      font-size: 20px!important;
}
</style>