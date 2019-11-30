<template>
  <div class="page-section">
    <div class="hf-main">
      <div class="hd">
        <span>提取卡密</span>
      </div>
      <div class="account">
        <div class="from-ctrl" style="border:none">
          <span>卡号</span>
          <input type="text" v-model="orderno" />
        </div>
        <div class="from-ctrl">
          <span>提取码</span>
          <input type="text" v-model="extractCode" /> 
          <button @click="getCode" class="get-btn">提取卡密</button>
        </div>
        <div class="show-card">
          <div class="hds">充值卡信息：</div>
          <p>卡号:{{cardNo}}</p>
          <p>卡密:{{cardCode}}</p>
        </div>
      </div>
    </div>
    <hot></hot>
  </div>
</template>
<script>
import hot from "@/components/common/hot"
export default {
  components: {
    hot
  },
  data() {
      return {
          orderno: this.$route.params.orderno || this.$store.state.orderNo,
          extractCode:'',
          cardNo:'',
          cardCode:''
      }
  },
  methods:{
      getCode(){
          this.$http
        .post(
          "/order/extractcard",
          {
            orderno: this.orderno,
            extractCode: this.extractCode
          },
          {
            headers: this.headers
          }
        )
        .then( res => {
            console.log(res, '提取卡密')
            //this.cardNo = res.data.
        })
      }
  }
};
</script>
<style scoped>
.hf-main {
  flex: 1;
  padding-top: 10px;
  color: #999;
  font-size: 12px;
  margin-left: 20px;
  overflow-y: auto;
  height: 600px;
}
.hf-main .hd {
  color: #c8b283;
  font-size: 14px;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid #1c2a32;
}
.from-ctrl {
  padding: 15px 20px;
  border-bottom: 1px solid #1c2a32;
  display: flex;
  align-items: center;
}
.from-ctrl span {
  margin-right: 20px;
  width: 100px;
  text-align: right;
}
.account .from-ctrl input {
  border: 1px solid #1c2a32;
  outline: none;
  font-family: "microsoft yahei";
  width: 240px;
  height: 27px;
  line-height: 27px;
  color: #939997;
  padding: 0 5px;
  background: #27333b;
}
.get-btn{
    background: #1c2a32;
    color: #939997;
    border: none;
    width: 65px;
    margin-left: 10px;
    padding: 5px 0;
    outline: none;
    cursor: pointer;
}
.show-card{
    width: 544px;
    margin: 20px auto;
}
.show-card .hds{
    margin-bottom: 20px;
}
.show-card p{
    line-height: 3;
    background: rgba(39, 51, 59, 0.397);
    margin-bottom: 5px;
    font-size: 14px;
    padding: 0 10px;
    margin-top: 10px;
}
</style>