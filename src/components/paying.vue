<template>
  <div class="page-section">
    <div class="pay-main">
        <div class="from-ctrl hd">
          <!-- <span class="arr" @click="$router.back(-1)"><img src="static/img/left_arr.png" alt="" srcset=""></span> -->
          </div>
        <!-- 支付进度 -->
        <div class="pay-wrapper">
          <div class="icon"><img src="static/img/status2.png" alt="" ></div>
          <div class="pay-progress">
              <div class="tips-txts">请耐心等待1~10分钟</div>
              <div class="loading-bar">
                <!-- 充值中等待CSS名为： active  充值失败: fail-->
                <span class="active"></span><span class="active"></span><span class="active"></span><span class="active"></span><span :class="orderStatus==21 ?'active':'fail'"></span>
              </div>
              <div class="text-group">
                <span>已支付<b>￥{{orderObj.payPrice}}</b></span>
                <span class="active">充值中</span>
                <span class="fail" v-if="orderStatus!=21">{{orderStatusText}}</span>
                <span class="active" v-if="orderStatus==21">{{orderStatusText}}</span>
              </div>
          </div>
        </div>
        <!-- goods details -->
        <div class="goods-details">
          <ul>
            <li><span>订单编号</span><span>{{orderObj.orderNo}}</span></li>
            <li><span>商品名称</span><span>{{orderObj.productName}}</span></li>
            <li v-if="$route.params.type != '卡密'"><span>充值账号</span><span>{{orderObj.chargeAccount}}</span></li>
            <li><span>商品面值</span><span>{{orderObj.faceValue}}元</span></li>
            <li><span>商品数量</span><span>{{orderObj.buyNum}}</span></li>
            <!-- <li><span>支付时间</span><span>{{orderObj.orderPayTime}}</span></li> -->
            <li><span>充值时间</span><span>{{orderObj.orderTime}}</span></li>
            <li><span>付款金额</span><span>{{orderObj.payPrice}}元</span></li>
          </ul>
        </div>
        <!-- 再来一单 -->
        <div class="rePay" v-if="$route.params.type=='卡密' && $route.params.statusCode == 51" @click="getCardCode">
          <span>提取卡密</span>
        </div>
        <div class="rePay" @click="goCenter" v-if="orderStatus==21">
          <span>再来一单</span>
        </div>
    </div>
    <hot></hot>
  </div>
</template>

<script>
import hot from "@/components/common/hot";
import store from "../store"
export default {
  components: {
    hot
  },
  beforeRouteEnter (to, from, next) {
  var fuluId = store.state.fuluId, fuluToken = store.state.fuluToken
  var orderNo = store.state.orderNo
  if(fuluId && fuluToken && orderNo){
    next()
  }
  else{
    next('/')
  }
},
  data() {
    return {
      orderObj:{},
      timer: null,
      orderStatus:11,
      orderStatusText:'等待中'
    }
  },
  // 离开组件时，销毁定时器
  beforeDestroy(){
    clearInterval(this.timer)
  },
  mounted() {
     if (!this.$route.params.orderNo) {
        this.$router.push('/')
        return;
      }
    this.timer = setInterval(()=>{
      this.getOrderDetail()
    },10000)
   // console.log(this.$route.params.type, 'paying')
   // console.log(this.$route.params.statusCode, 'paying')
  },
  methods: {
    getOrderDetail(){
      this.$http
        .get(
          "/order/GetOrderDetail",{
            params:{
              'orderNo':this.$route.params.orderNo
            },
            headers: this.headers
          }
        )
        .then(res=>{
          // 21 充值成功   11 待付款  31 待充值  51 卡密充值成功  61 充值失败  71 退款成功
            console.log(res, '订单详情')
            this.orderObj = res.data.data
            this.orderStatusText = res.data.data.orderStatusText
            this.orderStatus = res.data.data.orderStatus
            console.log(this.orderStatusText)
            if (res.data.data.orderStatus != 11 || res.data.data.orderStatus != 31) {
              clearInterval(this.timer)
            }
        })
    },
    goCenter() {
      if (config.childCategoryId == orderObj.childCategoryId) {
        this.$router.push({
          name: "qb",
          params: {
          ccid: config.childCategoryId
          }
        })
      }
      else{
        this.$router.push({
            name: "center",
            params: {
            ccid:this.$store.state.childCategoryId
            }
          });
      }
    },
    getCardCode(){
      this.$router.push('/getcard');
    }
  }
}
</script>

<style scoped>
.pay-main{
    flex: 1;
    padding-left: 20px;
}
.hd {
  color: #c8b283;
  font-size: 14px;
  border-bottom: 1px solid #1c2a32;
}
.arr{
    display: inline-block;
    width: 36px;
    height: 26px;
    padding: 4px 0 0 10px;
    border: 1px solid #1c2a32;
    margin-right: 10px;
    box-sizing: border-box;
    cursor: pointer;
    background:linear-gradient(180deg, #052733, #03161E);
    background:-webkit-linear-gradient(top, #052733, #03161E);
}
.arr img{
  width: 50%;
}
.from-ctrl {
  padding: 0 20px 10px;
  border-bottom: 1px solid #1c2a32;
  display: flex;
  align-items: center;
}

.goods-details{
  color: #909699;
  font-size: 14px;
  border-top: 1px solid #1c2a32;
  padding-top: 15px;
  margin-top: 30px;
}
.goods-details li{
  display: flex;
  line-height: 3;
  justify-content: space-between;
  align-items: center;
}
/* 支付进度 */
.pay-wrapper{
  padding-top: 10px;
  width: 500px;
  margin: 10px auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #c8b283;
}
.icon{
  width: 80px;
  text-align: center;
  margin-right: 10px;
}
.pay-progress{
  margin-right: auto;
  text-align: center;
  width: 480px;
  font-size: 14px;
  margin-left: 50px;
}
.loading-bar{
  margin-top: 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.loading-bar span:nth-child(odd){
  width: 10px;
  height: 10px;
  background: #737779;
  border-radius: 50%;
}
.loading-bar span:nth-child(even){
  flex: 1;
  height: 1px;
  background: #737779;
}
.loading-bar .active{
  background: #c8b283 !important;
  box-shadow: 0 0 5px #c8b283;
}
.loading-bar .fail::before{
  display: block;
  content: url("/static/img/err.png");
  width: 10px;
  height: 10px;
  position: relative;
  left: -2px;
  top: -1px;
}
.text-group{
  margin-top: 5px;
  width: 113%;
  display: flex;
  color: #737779;
  justify-content: space-between;
  margin-left: -30px;
}
.text-group span:first-child b{
  color: #ce6767;
}
.text-group .active{
    color: #c8b283 !important;
}
.text-group .fail{
    color: red !important;
}
.rePay{
  text-align: right;
  border-top: 1px solid #1c2a32;
  font-size: 12px;
  padding-top: 10px;
  cursor: pointer;
}
.rePay span{
  width: 70px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 3px;
  background: #c8b283;
  display: inline-block;
}
</style>