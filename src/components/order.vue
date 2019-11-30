<template>
  <div class="page-section">
    <div class="order-main" ref="box">
      <div class="from-ctrl hd"><div class="title">我的订单</div>
        <span :class="flag==0?'active':''" @click="changeFlag(0)">全部</span><span :class="flag==1?'active':''" @click="changeFlag(1)">待付款</span><span :class="flag==2?'active':''" @click="changeFlag(2)">充值成功</span><span :class="flag==3?'active':''" @click="changeFlag(3)">充值失败</span>    
      </div>
      <!-- 订单列表 -->
      <div class="order-list" v-if="orderArr.length!=0">
        <div class="order-item" v-for="(item, index) in orderArr" :key="item.id">
          <div class="o-hd">
            <span>{{item.orderTime}}</span>
            <span>{{item.orderStatusText}}</span>
          </div>
          <div class="o-main flex">
            <div class="pic">
              <img :src="item.productImg" alt />
            </div>
            <div class="o-info">
              <div class="name">
                <span>{{item.productName}}</span>
                <span>￥{{item.faceValue}}</span>
              </div>
              <div class="flex">
                <span>订单编号：{{item.orderNo}}</span>
              </div>
              <div class="flex">
                <span>充值号码：{{item.chargeAccount}}</span>
              </div>
              <div class="flex">
                <span>充值数量：{{item.buyNum}}</span>
              </div>
              <div class="flex">
                <span>商户名称：{{$store.state.merInfo.infoName}}</span>
              </div>
            </div>
          </div>
          <div class="o-footer">
            <div class="money">
              实付金额：
              <span>￥{{(item.surePrice * item.buyNum).toFixed(2)}}元</span>
              (优惠{{((item.faceValue - item.surePrice) * item.buyNum).toFixed(2)}}元)
            </div>
            <div class="btn">
              <span @click="showDetail(index)">查看详情</span>
              <span @click="goCenter(item.childCategoryId)">再来一单</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <div class="paging" v-if="pageObj.pageTotal!=0">
        <span v-if="showPages[0]>=2" @click="goPage(1)"><b>1</b></span>
        <span v-if="showPages[0]>=3" @click="goPage(2)"><b>2</b></span>
        <span v-if="showPages[0]>=4">...</span>
        <span
          v-for="(item, index) in showPages"
          :key="item.id"
          @click="changePage(showPages[index])"
          :class="pageObj.current==item?'active':''"
        >
          <b>{{item}}</b>
        </span>
        <span v-if="showPages[showPages.length -1] < pageObj.pageTotal">...</span>
        <em>共{{pageObj.pageTotal}}页，{{pageObj.total}}条</em>
      </div>
      <!-- 暂无订单 -->
      <div class="nothing" v-else>
        <p>暂无数据</p>
        <!-- <div class="hot-list">
          <div class="from-ctrl">热门推荐</div>
          <div class="server-list">
            <ul>
              <li v-for="item in hotCategory" :key="item.id" @click="goCenter(item.childCategoryId)">
                <img src="static/img/mangguotv@2x.png" alt />
                <span>QQ会员</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>
    <hot></hot>
     <!-- 弹窗 -->
      <modal :isShow="modalIsShow" @gohome='goHome'>
        <span slot="tips-hd">{{tipsText}}</span>
      </modal>
  </div>
</template>
<script>
import hot from "@/components/common/hot";
import modal from "@/components/common/modal";
import store from "../store";
export default {
  components: {
    hot,
    modal
  },
  beforeRouteEnter(to, from, next) {
    var fuluId = store.state.fuluId,
      fuluToken = store.state.fuluToken;
    if (fuluId=='' && fuluToken=='') {
      next('/');
    } else {
      next(vm=>{
        vm.getorderlist()
      });
    }
  },
  data() {
    return {
      tipsText:'',
      modalIsShow:false,
      flag:0,
      pageObj: {},
      orderArr: [],
      pageIndex: this.$store.state.pageId || 1,
      pageSize: 10,
      pageTotal:0,
      orderStatus:null,
      hotCategory: [],
      showPages: [1, 2, 3, 4, 5]
    };
  },
  mounted() {
    this.getorderlist();
    //this.gtHotCategory();
  },
  methods: {
    getShowPages(pageTotal,pageIndex) {
      if (pageTotal >= 5) {
        if (pageIndex >= 3 && pageIndex <= pageTotal - 2) {
        // this.pageIndex -2,this.pageIndex -1,this.pageIndex,this.pageIndex +1,this.pageIndex +2
        this.showPages = [pageIndex -2,pageIndex -1,pageIndex,pageIndex +1,pageIndex +2]
        }
        if(pageTotal-pageIndex<=1 && pageTotal>5){
        var max = pageTotal
        this.showPages=[max- 4,max-3,max-2,max-1,max]
        }
        if(pageIndex<3){
          this.showPages = [1,2,3,4,5]
        }
      } else {
        this.showPages = [];
          for (let index = 0; index < pageTotal; index++) {
            this.showPages.push(index + 1);
          }
      }
    },
    getPageTotal(total,pageSize){
      return Math.ceil(total/pageSize);
    },
    goPage(pageIndex){
      this.pageIndex = pageIndex
      // this.getShowPages()
      this.changePage(pageIndex)
    },
    showDetail(idx) {
      this.$store.commit("changeOrderNo", this.orderArr[idx].orderNo);
      this.$router.push("/showOrder");
    },
    changeFlag(flag){
      this.flag = flag;
      this.pageIndex = 1;
      this.orderStatus = flag
      this.getorderlist();
    },
    getorderlist() {
      this.$http
        .get("/order/getorderlist", {
          params: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            orderStatus:this.orderStatus
          },
          headers: {
            fuluId: store.state.fuluId,
            fuluToken: store.state.fuluToken,
            codekey: this.codekey,
            merchantid: this.merchantid
          }
        })
        .then(res => {
          if (res.data.code ==='1013') {
            this.modalIsShow = true
            this.tipsText = '授权已过期，请重新登录'
            return false
          }
          if (res.data.data.list !== undefined) {
            this.pageObj = res.data.data;
            this.orderArr = res.data.data.list;
            this.pageTotal = res.data.data.total
           // console.log(res.data.data, "订单集合")
            this.getShowPages(this.getPageTotal(this.pageTotal,this.pageSize),this.pageIndex);
          }
        });
    },
    goCenter(val) {
      if (config.childCategoryId == val) {
        this.$router.push({
          name: "qb",
          params: {
          ccid: config.childCategoryId
          }
        })
      }
      else{
        this.$store.commit('changeChildCategoryId', val)
        this.$router.push({
          name: "center",
          params: {
          ccid: val
          }
        })
      }
      
    },
    changePage(pageIndex) {
      this.pageIndex = pageIndex;
      this.$store.commit("changePageId", this.pageIndex);
      this.getorderlist();
      this.$refs.box.scrollTop = 0;
    },
    goHome(){
      this.$router.push('/')
    }
/*     gtHotCategory() {
      this.$http
        .get("/Category/GetHotCategory", {
          params: {
            count: ""
          },
          headers: this.headers
        })
        .then(res => {
          // console.log(res, '热门推荐')
          if (!res.data.data.list) {
            this.hotCategory = res.res.list;
          }
        });
    } */
  }
};
</script>
<style scoped>
.order-main {
  flex: 1;
  width: 800px;
  color: #909699;
  font-size: 14px;
  margin-left: 20px;
  padding-right: 10px;
  overflow-y: auto;
  height: 600px;
}
.order-main::-webkit-scrollbar {
  width: 7px;
  height: 1px;
}
.order-main::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px #1c2a32;
  background: #535353;
}
.order-main::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #1c2a32;
}
.order-main .hd {
  padding: 5px 0 10px;
  font-size: 14px;
  position: fixed;
  top: 0;
  background: #010b17;
  width: 696px;
  /* display: initial; */
  line-height: 25px;
}
.hd .title{
  font-weight: bold;
  margin-right: 30px
}
.hd span{
  margin-right: 20px;
  font-size: 12px;
  position: relative;
  bottom: -1px;
  cursor: pointer;
}
.hd .active{
  color: #fff;
}
.order-list{
  margin-top: 40px;
}
.nothing{
  margin-top: 50px;
}
.nothing p{
  text-align: center;
}
.order-item {
  margin: 20px auto;
  background: #072a37;
  border: 1px solid #1e3640;
  padding: 14px 20px;
}
.o-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #1e3640;
  padding-bottom: 14px;
}
.o-hd span:last-child {
  color: #f90;
}
.flex {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
.o-main {
  padding: 10px 0;
}
.o-main .flex {
  line-height: 2.6;
}
.o-main .pic {
  width: 120px;
  margin-right: 10px;
}
.o-main .pic img {
  width: 100%;
  height: 120px !important;
}
.o-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #1e3640;
  padding-top: 10px;
  margin-top: 10px;
}
.o-footer .money span {
  color: #f90;
  margin-right: 20px;
}
.o-footer .btn span {
  margin-left: 20px;
  cursor: pointer;
}
/* 热门推荐 */
.server-list ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-left: 50px;
  margin-top: 20px;
}
.server-list li {
  width: 150px;
  margin: 10px 0;
}
.server-list li span {
  display: block;
}
.server-list li img {
  width: 60px;
  height: 60px;
}

.paging {
  padding: 5px 10px;
  font-size: 14px;
  text-align: center;
}
.paging span {
  padding: 0 5px;
  cursor: pointer;
}
.paging .active {
  color: #fff;
}
.paging em {
  font-style: normal;
  margin-left: 50px;
}
</style>