<template>
  <div class="right">
    <div class="main">
      <div class="carousel">
        <div class="banner">
          <transition-group name="fade">
            <span v-for="(item, index) in bannerImg" :key="item.id" v-show="idx==index">
              <img :src="item.bannerUrl" :alt="item.bannerName" @click="goLink(item)"/>
            </span>
          </transition-group>
          <div class="tips-dot">
            <span v-for="(dot, index) in bannerImg" :key="dot.id" :class="idx==index?'active':''"></span>
          </div>
        </div>
      </div>
      <!-- 中间三区域 -->
      <div class="content">
        <router-link :to="{name:'server',params:{'id':this.advUrls.url1}}"><img src="static/img/area1.png" alt /></router-link>
        <router-link :to="{name:'server',params:{'id':this.advUrls.url2}}"><img src="static/img/area2.png" alt /></router-link>
        <router-link :to="{name:'server',params:{'id':this.advUrls.url3}}"><img src="static/img/area3.png" alt /></router-link>
      </div>
      <!-- 特价 & 热门 -->
      <div class="wrapper">
        <div class="recommend">
          <div class="hd"></div>
          <div class="rec">
            <div class="item" v-for="item in PopularArr" :key="item.id">
              <img :src="item.iconPath" alt />
              <div class="info">
                <div>{{item.childCategoryName}}</div>
                <div>
                  <span>￥{{item.price}}</span>
                  <span>￥{{item.faceValue}}</span>
                </div>
                <div class="buy" @click="goCenter(item.childCategoryId)">购买</div>
                <!-- 打折 -->
                <div class="discount">{{item.cornerMark}}</div>
              </div>
            </div>
          </div>
        </div>
        <hot></hot>
      </div>
    </div>
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
      idx: 0,
      bannerImg: [],
      PopularArr: [],
      bannerType:1
    };
  },
  created() {
    this.getMerinfo();
  },
  mounted() {
    this.topCategories();
  },
  methods: {
    // 特价推荐
    topCategories() {
      this.$http
        .get("/Category/GetChildCategory", {
          params: {
            categoryId: this.specialPrice
          },
          headers: this.headers
        })
        .then(res => {
          //console.log(res.data.data, "首页推荐分类");
          this.PopularArr = res.data.data.list;
        });
    },
    // 获取商户模板
    getMerinfo() {
      this.$http
        .get("/Merchant/GetMerinfo", {
          params: {
            codeKey: this.headers.codekey,
            payType:2
          }
        })
        .then(res => {
          // console.log(res, "商户模板");
          this.$store.commit("setMerInfo", {
            merchantid: res.data.data.id,
            infoName: res.data.data.infoName,
            infoTitle: res.data.data.merInfoTemplates.infoTitle,
            templateId: res.data.data.merInfoTemplates.templateId,
            urlAddress: res.data.data.merInfoTemplates.urlAddress,
            tel: res.data.data.merInfoTemplates.merTemplatesMobile,
            qq: res.data.data.merInfoTemplates.merTemplatesQq,
            payMent: {
              alipay: res.data.data.merPayment.alipay,
              wechatpay: res.data.data.merPayment.wechatpay,
              ownpay: res.data.data.merPayment.ownpay
            }
          });

          // console.log(this.$store.state.merInfo);
          this.getBanner();
        });
    },
    // banner
    getBanner() {
      this.$http
        .get("/Advertisement/GetBanner", {
          params: {
            sysTemplateId: this.$store.state.merInfo.templateId,
            locationType: "home"
          },
          headers: this.headers
        })
        .then(res => {
         // console.log(res.data.data.list, "banner");
          this.bannerImg = res.data.data.list;
          setInterval(() => {
            if (this.idx < this.bannerImg.length - 1) {
              this.idx++;
            } else {
              this.idx = 0;
            }
          }, 4000);
        });
    },
    goCenter(idx) {
      this.$store.commit("changeChildCategoryId", idx);
      this.$router.push({
        name: "center",
        params: {
          ccid: idx
        }
      });
    },
    goLink(obj){
      if (obj.bannerType == 1) {
        window.open(obj.linkurl)
      }
      if (obj.bannerType == 2) {
        this.$store.commit('changeChildCategoryId', obj.childCategoryId)
        this.$router.push({
          name: "center",
          params: {
          ccid: obj.childCategoryId
          }
        });
      }
    }
  }
};
</script>