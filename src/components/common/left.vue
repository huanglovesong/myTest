<template>
  <div class="left">
      <div class="hd">
        <router-link to="/">{{this.$store.state.merInfo.infoTitle}}</router-link>
        </div>
    <ul>
       <router-link active-class="active" :to="{name:'qb'}" tag="li"
        exact><a href="#" class="q-link"><img src="static/img/QB@3x.png">Q币</a></router-link>
      <router-link
        :to="{name:'server',params:{'id':menu.id}}"
        active-class="active"
        exact
        tag="li"
        v-for="menu in navbar"
        :key="menu.id"
      >
        <a href="#"><img :src="menu.iconPath">{{menu.className}}</a>
      </router-link>
    </ul>
    <!-- 联系方式 -->
    <div class="contact">
      <div class="tel">{{$store.state.merInfo.tel}}</div>
      <div class="box">
        <div class="qq" @click="qq">联系客服</div>
        <div class="order" @click="goOrder">我的订单</div>
      </div>
    </div>
    <login :isLogin="showLogin"></login>
  </div>
</template>
<script>
import login from "@/components/common/login";
export default {
  components: {
    login
  },
  data() {
    return {
      showLogin: false,
      navbar: []
    }
  },
  mounted() {
    this.homeCategory();
  },
  methods: {
    // 获取一级分类
    homeCategory() {
      this.$http
        .get("/Category/GetCategory", {
          params: {
            isHome: true,
            count: ''
          },
          headers: this.headers
        })
        .then(res => {
          // console.log(res,'一级分类')
          this.navbar = res.data.data.list;
        });
    },
    goOrder(){
      this.$router.push('/order').catch(err =>{})
      var fuluId = this.$store.state.fuluId, fuluToken = this.$store.state.fuluToken
      if(fuluId && fuluToken){
        this.$router.push('/order').catch(err =>{})
      }else{
        this.showLogin = true
      }
    },
    qq(){
      window.open('tencent://message/?uin='+ this.$store.state.merInfo.qq);
    }
  }
};
</script>