<template>
  <div class="page-section">
    <div class="pay-main">
        <div class="from-ctrl hd"><span class="arr" @click="$router.back(-1)"><img src="static/img/left_arr.png" alt="" ></span>查看详情</div>
       <div class="show-more">
           <div class="icon2"><img :src="orderDetails.productImg" alt=""></div>
           <div class="info">
               <div class="t1">{{orderDetails.productName}}</div>
               <div class="t2"><span>￥{{orderDetails.surePrice}}</span><span>{{orderDetails.faceValue}}元</span></div>
           </div>
       </div>
        <!-- goods details -->
        <div class="goods-details">
          <ul>
            <li><span>订单状态：</span><span>{{orderDetails.orderStatusText}}</span></li>
            <li><span>订单编号：</span><span>{{orderDetails.orderNo}}</span></li>
            <li><span>商户名称：</span><span>武汉福禄网络科技</span></li>
            <li><span>充值账号：</span><span>{{orderDetails.chargeAccount}}</span></li>
            <!-- <li><span>支付时间：</span><span>{{orderDetails.orderPayTime}}</span></li> -->
            <li><span>充值时间：</span><span>{{orderDetails.orderTime}}</span></li>
            <li><span>支付金额：</span><span>{{orderDetails.payPrice}}元</span></li>
          </ul>
        </div>
    </div>
    <hot></hot>
  </div>
</template>

<script>
import hot from "@/components/common/hot";
import store from "../store";
export default {
  components: {
    hot
  },
  data() {
    return {
      orderDetails:{}
    }
  },
  beforeRouteEnter(to, from, next) {
    var fuluId = store.state.fuluId,
      fuluToken = store.state.fuluToken;
    if (fuluId=='' && fuluToken=='') {
      next('/');
    } else {
      next();
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  methods: {
    getOrderDetail() {
      this.$http
        .get("/order/GetOrderDetail", {
          params: {
            orderNo: this.$store.state.orderNo
          },
          headers: {
            fuluId: store.state.fuluId,
            fuluToken: store.state.fuluToken,
            codekey: this.codekey,
            merchantid: this.merchantid
          }
        })
        .then(res => {
            console.log(res,'订单详情')
            this.orderDetails = res.data.data
        });
    }
  },
}
</script>

<style scoped>
.pay-main{
    flex: 1;
    padding-left: 20px
}
.hd {
  color: #909699;
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

/* 详情 */
.show-more{
    width: 400px;
    margin: 20px auto;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.show-more .icon2{
    width: 100px;
    margin-right: 30px;
}
.icon2 img{
    width: 100%;
}
.info .t1{
    font-size: 18px;
    color: #394449;
}
.info .t2 span:first-child{
    color: red;
    margin-right: 10px;
}
</style>