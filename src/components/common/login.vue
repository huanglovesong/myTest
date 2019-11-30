<template>
  <div class="mask" v-if="isLogin">
    <div class="modal-wparpper">
      <div class="l-title">手机验证码登陆</div>
      <div class="login-form">
        <div class="form-ctrl" :class="flag?'err':''">
          <span class="code">+86：|</span>
          <input class="tel" type="text" placeholder="手机号码" v-model="tel" @blur="isTest" @focus="clearErrTips"/>
          <em class="err-tips" v-if="flag">&times;请输入正确的手机号</em>
        </div>
        <div class="code-group" :class="flag2?'err':''">
          <div class="form-ctrl yzm-input">
            <input type="text" placeholder="验证码" v-model="code" @focus="clearErrTips"/>
          </div>
          <div class="form-ctrl yzm">
            <span @click="sendCode" v-if="isSend">获取验证码</span>
            <span v-else class="e-tips">{{second}}s</span>
          </div>
          <em class="err-tips" v-if="flag2">&times;验证码错误</em>
        </div>
        <div class="btn" @click="loginIn">立即登陆</div>
      </div>
      <div class="close-btn" @click="closeModal">&times;</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["isLogin"],
  data() {
    return {
      tel: "",
      code: "",
      isSend: true,
      second: 30,
      flag: false,
      flag2: false
    };
  },
  mounted() {

  },
  methods: {
    closeModal() {
      this.$parent.showLogin = false;
    },
    isTest(){
        let testReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!testReg.test(this.tel)) {
         this.flag = true
        return false;
        }
    },
    clearErrTips(){
        this.flag = false
        this.flag2 = false
    },
    sendCode() {
      // 验证手机号
      let testReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!testReg.test(this.tel)) {
        this.flag = true
        return false;
      }
      this.isSend = false;
      this.timerInterval();
      // 发送手机号，请求验证码
      this.$http
        .post(
          "/Other/Verificationcode",
          {
            mobile: this.tel,
            loginKey: "login"
          },
          { headers: this.headers }
        )
        .then(res => {
          console.log(res, "发送验证码");
        });
    },
    // 登录及验证
    loginIn() {
      let testReg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!testReg.test(this.tel)) {
        this.flag = true;
        return false;
      }
      if (this.code == "") {
        this.flag2 = true;
        return false;
      }
      this.$http
        .post(
          "/Other/Touristlogincode",
          {
            mobile: this.tel,
            verCode: this.code
          },
          { headers: this.headers }
        )
        .then(res => {
          if (res.data.code == "1001") {
            this.flag2 = true;
            return false;
          }
          console.log(res, "登录成功");
          this.headers.fuluId = res.data.data.fuluId;
          this.headers.fuluToken = res.data.data.fuluToken;
          this.$store.commit('setToken',{fuluId:res.data.data.fuluId,fuluToken:res.data.data.fuluToken})
          // console.log(this.$store.state, 'login')
          this.$parent.showLogin = false;
          //this.$router.go(0)
        });
    },
    timerInterval() {
      var timer = null;
      clearInterval(timer);
      timer = setInterval(() => {
        if (this.second <= 1) {
          clearInterval(timer);
          this.isSend = true;
          this.second = 30;
        } else {
          this.second--;
        }
      }, 1000);
    },
  }
};
</script>
<style scoped>
.mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
}
/* .modal-wparpper {
  width: 400px;
  height: 300px;
  position: fixed;
  padding: 20px;
  border: 1px solid #c5a265;
  box-sizing: border-box;
  margin: auto;
  left: 0;
  right: 0;
  top: 160px;
  z-index: 1001;
  background: url(../img/duduniubg.jpg) no-repeat;
  background-size: 100% 100%;
  text-align: center;
} */
.btn {
  width: 100%;
  margin: 30px auto 0;
  padding: 5px 0;
  background: #c8b283;
  cursor: pointer;
  color: #112429;
}
.l-title {
  color: #c5a265;
  font-size: 20px;
  margin-top: 20px;
}
.login-form {
  width: 240px;
  margin: 20px auto;
}
.form-ctrl {
  background: #000;
  border: 1px solid #c8b283;
  padding: 5px 0;
  color: #c5a265;
  font-size: 14px;
}
.form-ctrl .tel{
  width: 160px;
}
.yzm-input{
  width: 150px !important;
}
.yzm{
  width: 80px !important;
  padding: auto 0 !important;
}
.form-ctrl input {
  background: none;
  border: none;
  outline: none;
  color: #c5a265;
  padding: 2px 8px;
}
.form-ctrl input::placeholder {
  color: #645233;
}
.code-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22px;
}
/* @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
  .form-ctrl .code{
    margin-left: 0px;
  }
} */
.code-group .form-ctrl:first-child {
  width: 150px;
}
.code-group .form-ctrl:nth-child(2) {
  width: 80px;
  flex-shrink: 0;
  align-self: stretch;
  cursor: pointer;
}
.code-group .yzm:nth-child(2) span {
  padding: 0;
  font-size: 12px;
  display: inline-block;
  text-align: center;
}
.close-btn {
  position: absolute;
  right: 0;
  top: 0;
  width: 25px;
  height: 25px;
  line-height: 25px;
  background: #c8b283;
  color: #fff;
  font-size: 22px;
  cursor: pointer;
}
/* 错误提示 */
.err{
    position: relative;
    border-color: #F65942;
}
.err .form-ctrl:first-child{
    position: relative;
    border-color: #F65942;
}
.err .err-tips{
    position: absolute;
    bottom: -18px;
    left: -50px;
    color: #F65942;
    width: 100%;
    font-size: 10px;
    font-style: normal;
}
</style>