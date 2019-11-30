<template>
  <div class="page-section">
    <div class="serverPack hf-main">
      <div class="hd">
        <span @click="$router.go(-1)"><img src="static/img/left_arr.png"></span>
        <span>Q币</span>
      </div>
      <div class="account">
        <div class="from-ctrl">
          <span>充值账户</span>
          <input type="text" placeholder="请输入需要充值的QQ号码" v-model="userId"/>
        </div>
      </div>
      <div class="items-list">
        <!-- 选中：active @click="getProductTemp(index, items.templateId)" -->
        <div
          class="items"
          :title="items.productName"
          :class="classActive==index?'active':''"
          v-for="(items, index) in serverArr"
          @click="getProduct(index)"
          :key="items.id">
          <span>{{items.productName}}</span>
          <span>售价:{{items.price * items.faceValue}}元</span>
        </div>
      </div>
      <!-- 充值数量 -->
        <div class="num">
        <div class="from-ctrl">
          <span>充值数量</span>
           <select v-model="defaultNum" class="choose">
            <option v-for="(item,index) in numList" :key="index" >{{item}}</option>
          </select>
        </div>
      </div>
      <!-- 立即付款 -->
      <div class="submit-btn">
        <span class="btn" @click="submitSend">立即付款：￥{{totalPrice.toFixed(2)}}元</span>
      </div>
      <div class="description">
        <div class="d-hd">【商品描述】</div>
        <!-- <div class="tips-list" v-html="serverArr[classActive].content"></div> -->
        <div class="tips-list">
          <p>基本信息：本商品是Q币直充</p>
          <p>充值账号：QQ号</p>
          <p>计费比例：1元/1Q币</p>
          <p>运营公司：腾讯</p>
          <p>到账方式：Q币</p>
          <p>查询方式：登录腾讯充值中心http://pay.qq.com/→点击右上角【我的账户】→【查询交易明细】看存入记录！</p>
          <p>特殊说明：请勿填写手机号、昵称、群号</p>
          <p>
            温馨提示：充值前请确保核对充值账户的正确性，虚拟产品，一经售出充值成功，概不退还，还望理解
            如有疑问，请联系客服QQ:{{$store.state.merInfo.qq}},电话:{{$store.state.merInfo.tel}}
          </p>
        </div>
        <div class="tips">*本服务由第三方提供，不支持使用上网卡支付，售后请咨询{{$store.state.merInfo.tel}}或企业QQ：{{$store.state.merInfo.qq}}</div>
      </div>
      <!-- 弹窗 -->
      <modal :isShow="modalIsShow">
        <span slot="tips-hd">{{tipsText}}</span>
      </modal>
    </div>
    <hot></hot>
    <login :isLogin="showLogin"></login>
  </div>
</template>
<script>
import modal from "@/components/common/modal";
import hot from "@/components/common/hot";
import login from "@/components/common/login";
export default {
  components: {
    modal,
    hot,
    login
  },
  name: "center",
  data() {
    return {
      showLogin: false,
      userId: "", // 账号
      price:0,
      defaultNum:1,
      numList:[],
      serverArr:[],
      classActive: 0, // 激活被选中的服务样式
      modalIsShow: false, // 模态框隐藏
      tipsText: "",
      childId: this.$route.params.ccid,
      productId:'',
      qProduct:null
    };
  },
  computed:{
    totalPrice:function(){
      return  parseInt(this.defaultNum) * parseFloat(this.price);
    }
  },
mounted() {
    this.getProductList()
  },
  methods: {
    setIdState() {
      this.$store.commit("changeUserId", this.userId);
    },

   
    // 获取商品集合
   async getProductList() {
      this.$http
        .get("/Product/GetProductList", {
          params: {
            childCategoryId: this.qCoinProducts.templateId
          },
          headers: this.headers
        })
        .then(res => {
          var arr = res.data.data.productList;
          this.getqProduct(arr);     
          const { qProduct,qCoinCountList } =  this;
          //this.serverArr = arr;
          this.getProductTemp(0, qProduct.templateId);
          this.productId = qProduct.productId
          this.price = qProduct.price
                      
          //2.循环数组生成其他Q币数量
          let list = new Array();
          for(let i=0;i<qCoinCountList.length;i++)
          {
            list.push({
              productName:qCoinCountList[i]+qProduct.productName,
              faceValue:qProduct.faceValue,
              productId:qProduct.productId,
              quantity:qCoinCountList[i],
              singlePurchaseLimit:qProduct.singlePurchaseLimit,
              price:qProduct.price*qCoinCountList[i]
            })
          }
          this.serverArr =list;

            // 默认选中第一项
        })
    },
    getqProduct(arr)
    {
       //1.提出1Q币对应商品
      for(let i=0;i<arr.length;i++)
      {
        if(arr[i].productId == '10000615')
        {
          this.qProduct = arr[i];
        }
      }
    },
       // 点击选中商品
    getProduct(index, obj){
      this.productId = this.serverArr[index].productId
      this.price = this.serverArr[index].price
      this.classActive = index;
    },
    // 根据商品集合获取充值模板 && 点击设置样式
    getProductTemp(index = 0, tempId) {
      this.$http
        .get("/Product/GetProductTemp", {
          params: {
            productTemplateId: tempId
          },
          headers: this.headers
        })
        .then(res => {
          console.log(res.data.data, "商品模板");
          this.addressName = res.data.data.addressName;
          this.isServiceArea = res.data.data.isServiceArea;
          //this.gameTempaltePreviewList = res.data.data.gameTempaltePreviewList;

          let numStrings = res.data.data.elementInfo.chargeNum.value;
          this.getNumList(numStrings)
        });
      this.classActive = index;
    },
    getNumListCharge(count)
    {
        let arr = new Array();
        for(let i=1;i<=count;i++)
        {
          arr.push(i);
        }
        this.defaultNum = arr[0];
        this.numList=arr;
    },
    getNumList(str)
    {
      let arr = new Array();

      str.split('|').forEach((item,index)=>{
        let tmp = item.split('-');
        if(tmp.length==2)
          for(let i=parseInt(tmp[0]);i<=parseInt(tmp[1]);i++)
            arr.push(i);
        else
          arr.push(parseInt(tmp[0]));
      })
      this.defaultNum = arr[0];
      this.numList=arr;
    },
  // “立即购买”
    submitSend() {   
      this.checkLogin();
      const {qProduct,userId,classActive,serverArr} =  this;

      if (!/^[1-9][0-9]{4,11}$/.test(userId)) {
        return this.showToast('qq格式错误');
      }

      var current = serverArr[classActive];

      this.sendorder(current);

    },
    // 发起订单
    sendorder(current) {
      /* productId childCategoryId buyNum salePrice chargeAccount chargePassword
      chargeGameName chargeGameRole chargeGameRegion chargeGameSrv chargeType contactTel contactQq */
      const {qProduct, defaultNum, userId,qCoinProducts} = this;
      // console.log(parseInt(defaultNum)*parseInt(current.quantity)+"="+defaultNum+"|"+current.quantity)
      // return ;
      this.$http.post("/order/sendorder",
        {
          productId: qCoinProducts.productId,
          childCategoryId: qCoinProducts.templateId || this.$route.params.ccid,
          buyNum: parseInt(defaultNum)*parseInt(current.quantity),
          salePrice: qProduct.price,
          chargeAccount: userId
        },
        {
          headers: this.headers
        }
      )
      .then(res => {
        if (res.data.code == "1015") {
          //this.$alert(res.data.message);
          this.showLogin = true;
          return false;
        }
        if (res.data.code == "1000") {
          console.log(res.data.data, "订单编号");
          this.$store.commit("changeOrderNo", res.data.data);
          this.$router.push({
                name: "scanPay",
                params: {
                  orderno: res.data.data,
                  productId: this.serverArr[this.classActive].productId
                }
          });
        }
        if (res.data.code == "1013") {
            this.showLogin = true;
            return false
        }
        else{
          this.tipsText = res.data.message;
          this.modalIsShow = true;
        }
      });
    },
    changeNum() {
      console.log(this.defaultNum)
    },
    checkLogin()
    {
      if(this.$store.state.fuluId == '' && this.$store.state.fuluToken == ''){
        // this.showLogin = true;
        return false
      }
    },
    getInputVal(name)
    {
      for(let i=0;i<this.inputs.length;i++)
      {
        var item = this.inputs[i];
        if(item.id==name)
          return item.val
      }
      return "";
    },
    showToast(content){
      this.tipsText = content;
      this.modalIsShow = true;
      return false;
    },
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
  padding-bottom: 10px;
  border-bottom: 1px solid #1c2a32;
}

.hf-main .hd span:first-child {
  background:linear-gradient(180deg, #183f4e, #041823);
  background:-webkit-linear-gradient(top, #183f4e, #041823);
  display: inline-block;
  padding: 4px 7px;
  border-radius: 3px;
  margin-right: 6px;
  cursor: pointer;
}
.hf-main .hd span:first-child img{
  width: 16px;
  height: 16px;
  vertical-align: middle;
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
  background: linear-gradient(180deg, #183f4e, #041823);
  background: -webkit-linear-gradient(top, #183f4e, #041823);
}
.from-ctrl {
  padding: 15px 20px;
  border-bottom: 1px solid #1c2a32;
  display: flex;
  align-items: center;
}
.from-ctrl select::-ms-expand{
  background: transparent;
  color: #eee;
  height: 20px;
  border: none;
}
.from-ctrl select option::-ms-expand{
  width: 200px;
  background: red;
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
  width: 145px;
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