<template>
  <div class="bg">
    <div class="login_from" v-if="login_resgister">
      <div class="login_from_h4 Login_from_cursor">
        <h4 class="Login_h4"><span class="Login_from_Sign">登录</span>/<a @click="show_res()">注册</a></h4>
      </div>
      <form>
        <div class="Login_input">
          <input v-model="user_login" class="loign_padding_left Login_from_control" type="text" placeholder="用户名">
        </div>
        <div class="Login_input">
          <input v-model="login_pwd" class="loign_padding_left Login_from_control" type="password" placeholder="密码">
        </div>
        <div :v-model="error_msg" class="Login_input"></div>
        <br>
        <div class="Login_input">
          <input type="button" class="Login_button" value="登 录" @click="fnLogin()">
        </div>
      </form>
      <div class="Login_input">
        <div class="Login_from_a">
          Don't have account?  <a @click="show_res()" class="Login_from_Sign Login_from_cursor">Sign Up </a>now?
        </div>
      </div>
    </div>
    <div class="login_from" v-else>
      <div class="login_from_h4 Login_from_cursor">
        <h4 class="Login_h4"><a @click="show_login()">登录</a>/<span class="Login_from_Sign">注册</span></h4>
      </div>
      <form>
        <div class="Login_input">
          <input v-model="user_res" class="loign_padding_left Login_from_control" type="text" placeholder="注册用户名">
        </div>
        <div class="Login_input">
          <input v-model="res_pwd" class="loign_padding_left Login_from_control" type="password" placeholder="密码">
        </div>
        <div :v-model="error_msg" class="Login_input"></div>
        <br>
        <div class="Login_input">
          <input type="button" class="Login_button" value="注 册" @click="fnres()">
        </div>
      </form>
      <div class="Login_input">
        <div class="Login_from_a">
          Have account?<a @click="show_login()" class="Login_from_Sign Login_from_cursor">Log in </a>now
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login_resgister: true,
      user_login: '',
      login_pwd: '',
      error_msg: '',
      user_res: '',
      res_pwd: ''
    }
  },
  methods: {
    // 切换到注册
    show_res () {
      this.login_resgister = false
    },
    // 登录
    fnLogin () {
      let formdata = new FormData()
      formdata.append('userName', this.user_login)
      formdata.append('password', this.login_pwd)
      this.axios.post(this.$store.state.ip + 'user/login', formdata).then(res => {
        window.sessionStorage.setItem('username', this.user_login)
        window.sessionStorage.setItem('password', this.login_pwd)
        if (this.user_login !== 'admin') {
          // this.$router.push('equipment')
          this.$router.push('greenhouse')
        } else {
          this.$router.push('warm')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //  切换到登录
    show_login () {
      this.login_resgister = true
    },
    //  注册
    fnres () {
      let formdata = new FormData()
      formdata.append('userName', this.user_res)
      formdata.append('password', this.res_pwd)
      this.axios.post(this.$store.state.ip + 'user/reg', formdata).then(res => {
        this.show_login()
      })
    }
  }
}
</script>

<style scoped>
  .bg {
    width: 100%;
    height: 100%;
    position: absolute;
    background:  url('../assets/bg.png') no-repeat center/cover;
  }
  .login_from {
    width: 550px;
    height: 440px;
    margin: 150px auto;
    border: 0px;
    /*background-color: rgba(255,255,255,1);*/
    background-color: white;
    text-align: center;
    border-radius:  0.625rem;
    box-shadow: 6px 11px 41px -28px #a99de7;
  }
  .login_from_h4 {
    height: 120px;
    text-align: center !important;
    text-decoration: none;
    background-color: transparent;
  }
  h4 {
    font-size: 1.15rem;
    font-family: inherit;
    text-align: center;
    color: #222222;
    padding-top: 50px;
    font-weight: bold;
    letter-spacing: 5px;
  }
  /*.Login_h4 {*/
  /*  margin-block-start: 4em;*/
  /*  margin-block-end: 4em;*/
  /*  margin-inline-start: 0px;*/
  /*  margin-inline-end: 0px;*/
  /*}*/
  .Login_input{
    margin: 0 30px 10px 30px;
    box-sizing: inherit;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .Login_from_control {
    outline:none;
    width: 100%;
    height: 45px;
    min-height: 40px;
    display: block;
    border: none;
    background: transparent;
    border-bottom: 1px solid #f5f5f5;
    color: #7A88A1;
    font-size: 0.885rem;
    background-clip: padding-box;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  .loign_padding_left {
    padding-left: 15px;
  }
  input::-webkit-input-placeholder {
    color: #c0c4cc;
  }
  .Login_button {
    width: 100% !important;
    vertical-align: middle;
    padding: 10px 40px;
    background: linear-gradient(to right, #1989fa, rgba(25, 127, 250,0.6));
    font-weight: 700;
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    border-radius: 0.25rem;
    border: 0px solid transparent;
  }
  .Login_from_a {
    font-family: "Roboto", sans-serif;
    color: #76838f;
    font-size: 0.875rem;
    margin-top: 3rem !important;
    margin-bottom: 1rem;
    outline: none;
    text-align: left;
    padding: 0;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  .Login_from_Sign{
    color: #7571f9;
  }
  .Login_from_cursor {
    cursor: pointer;
  }
</style>
