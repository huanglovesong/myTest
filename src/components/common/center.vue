<template>
  <div class="page-section">
    <div class="hf-main">
      <div class="hd">
        <span @click="$router.go(-1)"><img src="static/img/left_arr.png"></span>
        <span>{{addressName}}</span>
      </div>
      <div class="account">
        <div v-if="productType=='直充'" >
          <div class="from-ctrl" v-for="(item, index) in inputs" :key="item.id" :data-index="index">
            <span>{{item.name}}</span>
            <input  type="text" :placeholder="'请输入'+item.name"   v-model="inputs[index].val" @blur="setIdState" />
          </div>
        </div>
        <div class="from-ctrl card" v-if="productType=='卡密'">
          <span>提取码</span>
          <input type="text" placeholder="请输入对应的提取码" v-model="cardId" />
          <div class="tips-card">*请任意输入并牢记提取码，以便在提取卡密时验证身份</div>
        </div>
      </div>
      <div class="from-ctrl" v-if="isServiceArea">
          <span>充值游戏名称</span>
          <select v-model="ChargeGame" class="choose" @change="changeGame">
            <option
              v-for="(item, index) in gameTempaltePreviewList"
              :key="item.id"
              :value="index"
            >{{item.ChargeGame}}</option>
          </select>
        </div>
      <div class="from-ctrl" v-if="isServiceArea&&ChargeRegionList.length>0">
        <span>充值区域</span>
        <select v-model="ChargeRegion" class="choose"  @change="changeRegion">
          <option
            v-for="(region,index) in ChargeRegionList"
            :key="region.id"
            :value="index"
          >{{region.name}}</option>
        </select>
      </div>
      <div class="from-ctrl" v-if="isServiceArea&&ChargeServerList.length>0">
        <span>充值服务器</span>
        <select v-model="ChargeServer" class="choose"  @change="changeServer">
          <option
            v-for="(server,index) in ChargeServerList"
            :key="server.id"
            :value="index"
          >{{server.name}}</option>
        </select>
      </div>
      <div class="from-ctrl" v-if="isServiceArea&&ChargeTypeList.length>0">
        <span>充值游戏类型</span>
        <select v-model="ChargeType" class="choose"  @change="changeType">
          <option
            v-for="(type,index) in ChargeTypeList"
            :key="type.id"
            :value="index"
          >{{type.name}}</option>
        </select>
      </div>
      <div class="items-list">
        <!-- 选中：active @click="getProductTemp(index, items.templateId)" -->
        <div
          class="items" :title="items.productName"
          :class="classActive==index?'active':''"
          v-for="(items, index) in serverArr"
          :key="items.id"
          @click="getProduct(index, items)"
        >
          <span class="product-name">{{items.productName}}</span>
          <span>售价:{{items.price}}元</span>
        </div>
      </div>
      <!-- 充值数量 -->
      <div class="num">
        <div class="from-ctrl">
          <span>充值数量</span>
           <select v-model="defaultNum" class="choose"  @change="changeNum">
            <option v-for="(item,index) in numList" :key="index" >{{item}}</option>
          </select>
        </div>
      </div>
      <!-- 立即付款 -->
      <div class="submit-btn">
        <span class="btn" @click="submitSend">立即付款：￥{{totalPrice.toFixed(2)}}元</span>
      </div>
      <!-- 商品描述 -->
      <div class="description">
        <div class="d-hd">【商品描述】</div>
        <!-- 描述 -->
       <div class="tips-list" v-html="serverArr[classActive].content"></div>
        <div class="tips">*本服务由第三方提供，不支持使用上网卡支付，售后请咨询{{$store.state.merInfo.tel}}或企业QQ：{{$store.state.merInfo.qq}}</div>
      </div>
      <!-- 弹窗 -->
      <modal :isShow="modalIsShow">
        <span slot="tips-hd">{{tipsText}}</span>
      </modal>
    </div>
    <hot @updatedata='getProductList'></hot>
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
      userId: this.$store.state.userId || "", // 账号
      cardId: "", //  卡密

      serverArr:[{'content':''}],
      classActive: 0, // 激活被选中的服务样式
      modalIsShow: false, // 模态框隐藏
      tipsText: "",
      inputs:[],
      // selectedName: 0,
      // selected: "游戏点数",
      notAllowChange:false,
      //gameType: 1,
      price:0,
      defaultNum:1,
      numList:[],
      addressName: "",
      productType: "",
      singlePurchaseLimit:0,
      gameTempaltePreviewList:[
      ],
      productId:'',
      /*new index*/  
      ChargeRegion: 0,
      ChargeServer: 0,
      ChargeGame:0,
      ChargeType:0,
      /*new attr*/
      gameList:[],
      chargeNumList: [],
      ChargeGameList: [],
      ChargeRegionList: [],
      ChargeServerList: [],
      ChargeTypeList: [],
      allowChange:false,
      isServiceArea: false,
      postIndex: {
        // numIndex: 0,
        gameIndex: null,
        regionIndex: null,
        serverIndex: null,
        typeIndex: null,
      }
    };
  },
  computed:{
      totalPrice:function(){
        return this.defaultNum * this.price
        //return  parseInt(this.defaultNum) * parseFloat(this.price);
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
   getProductList() {
      this.$http
        .get("/Product/GetProductList", {
          params: {
            childCategoryId: this.$store.state.childCategoryId || this.$route.params.ccid
          },
          headers: this.headers
        })
        .then(res => {
          console.log(res, "商品集合");
          this.productType = res.data.data.productType;
          this.addressName = res.data.data.childCategoryName;
          if (res.data.data.productType == "卡密") {
              var arr = res.data.data.productList;
              this.serverArr = arr;
              if (arr) {
                // 默认选中第一项
              this.productId = arr[0].productId
              this.price = this.serverArr[0].price
              this.singlePurchaseLimit = this.serverArr[0].singlePurchaseLimit
              this.getNumListCharge(this.singlePurchaseLimit);
            }
          }
          else{
            var arr = res.data.data.productList;
            this.serverArr = arr;
            if (arr) {
              // 默认选中第一项
              this.getProductTemp(0, arr[0].templateId);
              this.productId = arr[0].productId
              this.singlePurchaseLimit = this.serverArr[0].singlePurchaseLimit
              this.price = this.serverArr[0].price
            }
          }
        });
    },
       // 点击选中商品
    getProduct(index, obj){
      if (obj.templateId) {
        this.getProductTemp(index, this.serverArr[index].templateId);
        this.productId = this.serverArr[index].productId
        this.price = this.serverArr[index].price
        this.singlePurchaseLimit = this.serverArr[index].singlePurchaseLimit
      } 
      else if(obj.productId){
        this.classActive = index;
        this.productId = this.serverArr[index].productId
        this.price = this.serverArr[index].price
        
        this.placeholder = this.serverArr[index].inputTips || '请输入充值账号'
        this.singlePurchaseLimit = this.serverArr[index].singlePurchaseLimit
        this.getNumListCharge(this.singlePurchaseLimit);
      }
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
          this.isServiceArea = res.data.data.isServiceArea;
          this.gameTempaltePreviewList = res.data.data.gameTempaltePreviewList;
          let inputs = res.data.data.elementInfo.inputs;
          for(let i=0;i<inputs.length;i++)
          {
            inputs[0].val=''
          }
          this.inputs = inputs;
          //============
          this.changeGame();
          //this.gameMethods(this.gameTempaltePreviewList);
          //============
          //console.log(this.gameTempaltePreviewList[0].gameList.ChargeRegion[0].name)
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
      let tmpArr = new Array();

      str.split('|').forEach((item,index)=>{
        let tmp = item.split('-');
        if(tmp.length==2)
          for(let i=parseInt(tmp[0]);i<=parseInt(tmp[1]);i++)
            arr.push(i);
        else
          arr.push(parseInt(tmp[0]));
      })
      this.defaultNum = arr[0];
      
      for(let i=0;i<arr.length;i++)
      {
        if(arr[i]<=this.singlePurchaseLimit)
         tmpArr.push(arr[i]);
      }

    
      if(tmpArr.length>0)
        this.numList=tmpArr;
      else
        this.numList=arr;
    },
    /* 区服解析开始 */
    // 解析区服
    changeGame() {

      var val = this.ChargeGame;
      var ChargeGameList = this.gameTempaltePreviewList;
      this.ChargeGameList = ChargeGameList;
      if(ChargeGameList.length==0)
        return;
      var postIndex = this.postIndex;
      postIndex.gameIndex = val;

      this.ChargeServerList = ChargeGameList[val].gameList.ChargeServer || []
      this.ChargeTypeList = ChargeGameList[val].gameList.ChargeType || []
      this.ChargeRegionList = ChargeGameList[val].gameList.ChargeRegion || []
      this.postIndex = postIndex;
      this.notAllowChange = ChargeGameList[val].gameList.ChargeServer.length>0;
      this.ChargeRegion = 0;
      this.ChargeServer = 0;
      this.ChargeType = 0;
      if (ChargeGameList[val].gameList.ChargeRegion.length) {
        this.changeRegion();
      }
    },
    changeRegion() {
      var val = this.ChargeRegion;
      var ChargeRegionList = this.ChargeRegionList;
      var postIndex = this.postIndex;
      postIndex.regionIndex = val;

      if(this.notAllowChange)
        return ;


      this.ChargeServer = 0;
      this.ChargeType = 0;
      if (ChargeRegionList[val].ChargeServer.length) {
        this.ChargeServerList = ChargeRegionList[val].ChargeServer
        this.postIndex = postIndex;
        this.changeServer();
      }
      else
      {
        this.ChargeServerList  = [];
        this.ChargeTypeList = [];
      }
  

    },
    changeServer(e) {
      var val = this.ChargeServer;
      var ChargeServerList = this.ChargeServerList;
      var postIndex = this.postIndex;
      postIndex.serverIndex = val;

      if(this.notAllowChange)
        return ;

      this.ChargeType = 0;
      if (ChargeServerList[val].ChargeType.length) {
        this.ChargeTypeList = ChargeServerList[val].ChargeType
        this.postIndex = postIndex;
        this.changeType();
      }
      else
      {
         this.ChargeTypeList = [];
      }
      
    },
    changeType(e) {
      var val = this.ChargeType;
      var postIndex = this.postIndex;
      postIndex.typeIndex = val;
      this.postIndex = postIndex;
    },

    /* 区服解析结束 */


    // 卡密
    sendCardOrder(){
      this.$http
        .post(
          "/order/SendCardOrder",
          {
            productId: this.productId,
            childCategoryId: this.$store.state.childCategoryId,
            buyNum: this.defaultNum,
            salePrice: this.serverArr[this.classActive].price,
            extractCode: this.cardId,
          },
          {
            headers: this.headers
          }
        )
        .then( res => {
            console.log(res, '卡密')
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
                  productId: this.serverArr[this.classActive].productId,
                  type:this.productType
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
        })
    },

  // “立即购买”
    submitSend() {   
      this.checkLogin();
    
      if (this.productType == '卡密') {
         if (this.cardId == "") {
           return this.showToast("请输入提取码");
        }
        this.sendCardOrder()
      } else {
        var goodsDetail = this.serverArr[this.classActive];
        
        for(let i=0 ; i<this.inputs.length;i++)
        {
          var item = this.inputs[i];

          if (!item.val) {
            return this.showToast(item.name+"不能为空");
          }

          // 校验账号规则
          let validTxt = '', validText = "";
          if (goodsDetail.validType == 1) {  //手机
            validTxt = /^1(3|4|5|6|7|8|9)\d{9}$/;
            validText = '手机号';
          } else if (goodsDetail.validType == 2) { // qq
            validTxt = /^[1-9][0-9]{4,9}$/;
            validText = 'QQ号';
          } else if (goodsDetail.validType == 3) {  // 邮箱
            validTxt = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            validText = '邮箱';
          }
          if (validTxt &&item.id=="ChargeAccount"&&!validTxt.test(item.val)) {
            return this.showToast(`请输入正确格式的${validText}`);
          }

          if ('ContactType' == item.id) {
            // 手机
            if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(item.val)) {
              return this.showToast('手机号格式错误');
            }
          }
          if ('ContactQQ' == item.id) {
            // qq
            if (!/^[1-9][0-9]{4,11}$/.test(item.val)) {
              return this.showToast('qq格式错误');
            }
          }
          if ('ChargePWD' == item.id) {
            // 密码
            if (!/^[a-zA-Z0-9_-]{4,16}$/.test(item.val)) {
              return this.showToast('密码由4到16位（字母，数字，下划线，减号）组成');
            }
          }
          if ('ChargeWeiXin' == item.id) {
            // 微信
            if (!/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/.test(item.val)) {
              return this.showToast('微信格式错误');
            }
          }
        }
        this.sendorder();
      }
    },
    // 发起订单
    sendorder() {
      /* productId childCategoryId buyNum salePrice chargeAccount chargePassword
      chargeGameName chargeGameRole chargeGameRegion chargeGameSrv chargeType contactTel contactQq */
      const {ChargeGameList, ChargeRegionList, ChargeServerList, ChargeTypeList, postIndex} = this;

      this.$http.post("/order/sendorder",
        {
          productId: this.serverArr[this.classActive].productId,
          childCategoryId: this.$store.state.childCategoryId,
          buyNum: parseInt(this.defaultNum),
          salePrice: this.price,
          chargeAccount: this.getInputVal('ChargeAccount'),
          chargePassword: this.getInputVal('ChargePWD'),
          chargeGameName: ChargeGameList && ChargeGameList[0] ? ChargeGameList[postIndex.gameIndex] && ChargeGameList[postIndex.gameIndex].ChargeGame : null,//this.ChargeGameList[this.ChargeGame].name,
          chargeGameRole: '',
          chargeGameRegion: ChargeRegionList && ChargeRegionList[0] ? ChargeRegionList[postIndex.regionIndex] && ChargeRegionList[postIndex.regionIndex].name : null,
          chargeGameSrv: ChargeServerList && ChargeServerList[0] ? ChargeServerList[postIndex.serverIndex] && ChargeServerList[postIndex.serverIndex].name : null,
          chargeType: ChargeTypeList && ChargeTypeList[0] ? ChargeTypeList[postIndex.typeIndex] && ChargeTypeList[postIndex.typeIndex].name : null,
          contactTel: this.getInputVal('ContactType'),
          contactQq: this.getInputVal('ContactQQ')
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
  box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
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

.from-ctrl span {
  margin-right: 20px;
  width: 100px;
  text-align: right;
}
.card{
  flex-wrap: wrap;
}
.tips-card{
  padding: 5px 0 0 120px;
  color: #666;
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
@media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
	/*兼容IE11*/
	.items span:first-child {
    height: 38px;
    overflow: hidden;
  }
}
.items span:first-child {
  margin-top: 10px;
  padding: 0 15px;
  font-size: 16px;
  color: #939997;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1;
  overflow: hidden;
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