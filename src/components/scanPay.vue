<template>
  <div class="page-section">
    <div class="pay-main">
      <div class="hd">
        <span @click="$router.go(-1)"><img src="static/img/left_arr.png"></span>
        <span>扫码支付</span>
      </div>
      <div class="pay-way">
        <div class="paylist" @click="changeIdx(1)" v-if="$store.state.merInfo.payMent.alipay">
          <span class="defalut" :class="idx==1?'active':''"></span>
          <span>
            <img src="static/img/alipay.png" />支付宝
          </span>
        </div>
        <div class="paylist" @click="changeIdx(2)" v-if="$store.state.merInfo.payMent.wechatpay">
          <span class="defalut" :class="idx==2?'active':''"></span>
          <span>
            <img src="static/img/wechatpay.png" />微信
          </span>
        </div>
  <!--    <div class="paylist" @click="changeIdx(3)">
            <span class="defalut" :class="idx==3?'active':''"></span><span><img src="static/img/post.png">自有支付</span>
        </div> -->
      </div>
      <!-- code -->
      <div class="code">
        <div id="qrcode" ref="qrcode"></div>
        <img src="static/img/zfb.png"  class="tips-pic" v-if="idx==1">
        <img src="static/img/wx.png"  class="tips-pic" v-if="idx==2">
      </div>
      <div class="pay-tips">
        扫我完成支付
        <span>￥{{orderObj.payPrice}}</span>
      </div>
      <!-- 扫码完成后的页面的地址是 /pay  -->

      <!-- goods details -->
      <div class="goods-details">
        <ul>
          <li>
            <span>商品名称</span>
            <span>{{orderObj.productName}}</span>
          </li>
          <li>
            <span>商品面值</span>
            <span>{{orderObj.faceValue}}元</span>
          </li>
          <li>
            <span>商品数量</span>
            <span>{{orderObj.buyNum}}</span>
          </li>
          <li v-if="$route.params.type!='卡密'">
            <span>充值账号</span>
            <span>{{orderObj.chargeAccount}}</span>
          </li>
          <li>
            <span>订单编号</span>
            <span>{{orderObj.orderNo}}</span>
          </li>
          <li>
            <span>付款金额</span>
            <span>{{(orderObj.surePrice * orderObj.buyNum).toFixed(2)}}元</span>
          </li>
        </ul>
      </div>
    </div>
    <hot></hot>
  </div>
</template>

<script>
import hot from "@/components/common/hot";
import QRCode from "qrcodejs2";
import store from "../store"
export default {
  components: {
    hot
  },
  name: "scanPay",
  data() {
    return {
      idx: 1,
      orderno: this.$route.params.orderno || this.$store.state.orderNo,
      productId: this.$route.params.productId,
      payment: 1, //  1.支付宝  2.微信  3.自有支付
      platform: 1, // 1.pc  2.mobile  3.公众号  4.自有平台  5.app（支付宝小程序使用此支付方式）
      openId: "", // 公众号支付需要
      ReturnUrl: "", // h5支付前端回调地址
      orderObj: {},
      timer: null,
      orderStatusText: "",
      chargeType:this.$route.params.type
    };
  },
  created() {
    this.merchantpay(1);
  },
  mounted() {
    // console.log(this.orderno, this.productId)
    this.getOrderDetail();
    this.timer = setInterval(() => {
      this.getOrderDetail();
    }, 10000);
  },
  // 离开组件时，销毁定时器
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    changeIdx(id) {
      this.idx = id;
      this.payment = id;
      this.merchantpay(id);
    },
    merchantpay(paymentId = 1) {
      if (!this.productId) {
        this.$router.push('/')
        return;
      }
      this.$http
        .post(
          "/merchantpay/unifiedorder",
          {
            orderno: this.orderno,
            productId: this.productId,
            payment: paymentId,
            platform: this.platform,
            openId: "",
            ReturnUrl: ""
          },
          {
            headers: this.headers
          }
        )
        .then(res => {
          console.log(res, "支付串");
          //this.qrcode(res.data.data)
          this.$nextTick(() => {
            this.$refs.qrcode.innerHTML = "";
            var qrcode = new QRCode("qrcode", {
              width: 150,
              height: 150,
              text: res.data.data // 二维码地址
            });
          });
        });
    },
    // 获取订单详情
    getOrderDetail() {
      this.$http
        .get("/order/GetOrderDetail?times="+new Date().getTime(), {
          params: {
            orderNo: this.orderno
          },
          headers: this.headers
        })
        .then(res => {
          console.log(res, "订单详情");
    /*       if (res.data.code == "1015") {
            // 授权失败
            this.$alert(res.data.message, {
              confirmButtonText: "确定",
              callback: action => {
                this.$router.push("/login");
              }
            });
            return false;
          } */
          this.orderObj = res.data.data;
          this.orderStatusText = res.data.data.orderStatusText;
          console.log(this.orderStatusText);
          if (res.data.data.orderStatus !== 11) {
            this.$router.push({
              name: "pay",
              params: { 
                orderNo: this.orderno,
                type:this.$route.params.type,
                statusCode:res.data.data.orderStatus 
              }
            });
          }
        });
    }
  }
};
</script>

<style scoped>
.pay-main {
  flex: 1;
  padding-left: 10px;
}
.hd {
  color: #c8b283;
  font-size: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #1c2a32;
}
.hd span:first-child {
  background:linear-gradient(180deg, #183f4e, #041823);
  background:-webkit-linear-gradient(top, #183f4e, #041823);
  display: inline-block;
  padding: 4px 7px;
  border-radius: 3px;
  margin-right: 6px;
  cursor: pointer;
}
.hd span:first-child img{
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.arr {
  display: inline-block;
  width: 36px;
  height: 26px;
  padding: 4px 0 0 10px;
  border: 1px solid #1c2a32;
  margin-right: 10px;
  box-sizing: border-box;
  cursor: pointer;
  background: linear-gradient(180deg, #052733, #03161e);
  background: -webkit-linear-gradient(top, #052733, #03161e);
}
.arr img {
  width: 50%;
}
.from-ctrl {
  padding: 0 20px 10px;
  border-bottom: 1px solid #1c2a32;
  display: flex;
  align-items: center;
}
.pay-way {
  width: 180px;
  margin: 20px auto;
  border: 1px solid #3b4c54;
  background-color: #21353f;
}
.paylist span,
.paylist img {
  vertical-align: middle;
  color: #909699;
  width: 20px;
  height: 20px;
  margin-right: 10px
}
.paylist {
  cursor: pointer;
}
.defalut {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 1px solid #3b4c54;
  border-radius: 50%;
  margin: 15px 10px;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
}
.active::before {
  display: inline-block;
  content: "";
  background: #37be02;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.paylist img {
  width: 40px;
  height: 40px;
}
/* code */
.code {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  position: relative;
}
.code .tips-pic{
  position: absolute;
  z-index: 20;
  width: 50px;
  height: 50px;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
}
.code img {
  width: 150px;
  height: 150px;
}
.pay-tips {
  width: 150px;
  margin: 10px auto;
  background: #21353f;
  color: #909699;
  text-align: center;
  border: 1px solid #3b4c54;
  padding: 10px 0;
}
.pay-tips span {
  display: block;
  color: #fc610c;
}
.goods-details {
  color: #909699;
  font-size: 14px;
  border-top: 1px solid #1c2a32;
  padding-top: 15px;
  margin-top: 30px;
}
.goods-details li {
  display: flex;
  line-height: 3;
  justify-content: space-between;
  align-items: center;
}
</style>