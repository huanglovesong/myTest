<template>
  <div class="page-section">
    <div class="serverPack hf-main" v-if="serverType==0">
      <span slot="hd">手机话费充值</span>
      <!-- 充值类型 话费  -->
      <div class="tabbar" slot="serverType">
        <span :class="serverType==0?'active':''" @click="getData(0)">话费充值</span>
        <span :class="serverType==1?'active':''" @click="getData(1)">流量充值</span>
      </div>
      <div class="account">
        <div class="from-ctrl">
          <span>充值账户</span>
          <input type="text" placeholder="请输入需要充值的号码" />
        </div>
      </div>
      <div class="items-list">
        <!-- 选中：active @click="getProductTemp(index, items.templateId)" -->
        <div
          class="items"
          :class="classActive==index?'active':''"
          v-for="(items, index) in serverPack"
          :key="items.id"
          @click="getProduct(index, items)"
        >
          <span>{{items.memory}}</span>
          <span>售价:{{items.sellPrice}}元</span>
        </div>
      </div>
      <!-- 充值数量 -->
      <div class="num">
        <div class="from-ctrl">
          <span>充值数量</span>
          <div class="num-box">
            <span @click="subtraction">-</span>
            <input type="number" v-model="num" />
            <span @click="addition">+</span>
          </div>
        </div>
      </div>
      <!-- 立即付款 -->
      <div class="submit-btn">
        <span class="btn">立即付款：￥{{totalPrice.toFixed(2)}}元</span>
      </div>
      <div class="description">
        <div class="d-hd">【商品描述】</div>
        <div slot="desc" class="tips-list">
          <p>（1）支持全国移动、联通、电信手机充值及电信固话充值，固话充值务必填写区号；</p>
          <p>（2）请认真核对充值号码，一旦成功无法退回或转存其他号码；</p>
          <p>（3）支付成功后，话费一般会在1分钟内到账；月初月末为充值高峰，话费到账或有延时；</p>
          <p>（4）本服务不提供机打发票，如有报销需求建议向运营商索取；</p>
          <p>（5）如有任何疑问请联系：400-001-2806或企业QQ：800077631。</p>
        </div>
        <div class="tips">*本服务由第三方提供，不支持使用上网卡支付，售后请咨询400-001-2806或企业QQ：800077631</div>
      </div>
    </div>
    <div class="serverPack hf-main" v-if="serverType==1">
      <span slot="hd">手机流量充值</span>
      <!-- 充值类型  流量 -->
      <div class="tabbar" slot="serverType">
        <span :class="serverType==0?'active':''" @click="getData(0)">话费充值</span>
        <span :class="serverType==1?'active':''" @click="getData(1)">流量充值</span>
      </div>
      <div class="description">
        <div class="d-hd">【商品描述】</div>
        <div class="tips-list">
          <p>（1）支持全国移动、联通、电信手机流量充值；</p>
          <p>（2）充值成功后，交易无法取消，已充值流量无法退回或转存到其他号码；</p>
          <p>（3）如遇流量充值高峰，部分订单到账或有延时，请耐心等待；</p>
          <p>（4）如有任何疑问请联系：400-001-2806或企业QQ：800077631。</p>
        </div>
        <div class="tips">*本服务由第三方提供，不支持使用上网卡支付，售后请咨询400-001-2806或企业QQ：800077631</div>
      </div>
    </div>
    <hot></hot>
  </div>
</template>
<script>
import hot from "@/components/common/hot";
export default {
  components: {
    hot
  },
  data() {
    return {
      classActive: 0, // 激活被选中的服务样式
      serverType: 0, // 0 话费 1 流量
      num: 1, // 最小数量
      totalPrice: 0,
      serverPack: [
        {
          memory: "10元",
          sellPrice: "9.5"
        },
        {
          memory: "20元",
          sellPrice: "19.5"
        },
        {
          memory: "30元",
          sellPrice: "29.5"
        },
        {
          memory: "40元",
          sellPrice: "39.5"
        },
        {
          memory: "50元",
          sellPrice: "49.5"
        },
        {
          memory: "100元",
          sellPrice: "55.5"
        }
      ],
      buyNumber: 10
    };
  },
  mounted() {
    this.getData(this.serverType);
    this.totalPrice = this.serverPack[0].sellPrice * this.num;
  },
  methods: {
    // 数量减
    subtraction() {
      this.num <= this.num && this.num > 1 ? this.num-- : (this.num = this.num);
      this.totalPrice = this.serverPack[this.classActive].sellPrice * this.num;
    },
    // 数量加
    addition() {
      this.num >= this.count ? (this.num = this.count) : this.num++;
      this.totalPrice = this.serverPack[this.classActive].sellPrice * this.num;
      if (this.num >= this.count) {
        this.tipsText = "最大数量为" + this.count;
        this.modalIsShow = true;
      }
    },
    getData(id) {
      this.serverType = id;
      //console.log(id);
    },
    // 点击选中商品
    getProduct(index, obj) {
        this.classActive = index;
        //this.productId = this.serverArr[index].productId;
        this.totalPrice = this.serverPack[index].sellPrice * this.num;
       // this.count = this.serverArr[index].singlePurchaseLimit;
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
.hf-main::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.hf-main::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px #1c2a32;
  background: #535353;
}
.hf-main::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #1c2a32;
}
.hf-main .hd {
  color: #c8b283;
  font-size: 14px;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid #1c2a32;
}
.tabbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
}
.tabbar span {
  display: inline-block;
  border: 1px solid #1c2a32;
  padding: 6px 15px;
  background: #031722;
  margin-left: -1px;
  font-size: 14px;
  color: #2e4f5e;
  cursor: pointer;
}
.tabbar .active {
  color: #939997;
  background: -webkit-linear-gradient(top, #183f4e, #041823);
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
.tips-card {
  padding-left: 10px;
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
.choose {
  width: 250px;
  height: 30px;
  line-height: 30px;
  color: #939997;
  padding: 0 5px;
  background: #27333b;
  outline: none;
  border: 1px solid #1c2a32;
}
.items-list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-items: flex-start;
  min-width: 550px;
}
.items-list .items {
  width: 150px;
  height: 80px;
  text-align: center;
  border: 1px solid #3f5862;
  border-radius: 2px;
  cursor: pointer;
  color: #939997;
  margin: 20px 13px 0px;
  background: #27333b;
  position: relative;
}
.items-list .items:hover {
  background: #c8b283;
}
.items-list .active {
  background: #c8b283;
}
.items-list .active span {
  color: #fff !important;
}
.items-list .items:hover span {
  color: #fff;
}
.items span {
  display: block;
}
.items span:first-child {
  margin-top: 16px;
  font-size: 17px;
  color: #939997;
}
.items span:last-child {
  margin-top: 3px;
  color: #939997;
  opacity: 0.6;
}
/* 充值数量 */
.num-box {
  display: flex;
}
.num-box input {
  width: 60px;
  text-align: center;
  text-indent: 10px;
  background: transparent;
  border: 1px solid #3f5862;
  color: #939997;
  outline: none;
}
.num-box span {
  width: 30px;
  height: 30px;
  background: #27333b;
  text-align: center;
  line-height: 30px;
  margin: 0 5px;
  cursor: pointer;
}
/* 立即付款 */
.submit-btn {
  text-align: right;
  padding: 10px;
}
.submit-btn .btn {
  display: inline-block;
  background: #c8b283;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}
/* 商品描述 */
.description {
  margin-top: 30px;
  padding-left: 40px;
}
.tips-list p {
  line-height: 2;
}
.tips {
  margin-top: 10px;
}
</style>