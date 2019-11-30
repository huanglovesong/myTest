// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import axios from 'axios'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import {showFullScreenLoading, tryHideFullScreenLoading} from './axiosHelperLoading'
import store from "./store"

// Vue.use(ElementUI)
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  showFullScreenLoading();
  config.timeout = 24000

  //console.log(config)
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  tryHideFullScreenLoading();
  //console.log(response)
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
});

axios.defaults.baseURL = 'https://it-h5-open-api-admin.suuyuu.cn/api'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.merchantid = config.merchantid
Vue.prototype.codekey = config.codekey

Vue.prototype.headers = {
  merchantid: config.merchantid,
  codekey: config.codekey,
  fuluId: store.state.fuluId,
  fuluToken: store.state.fuluToken
}

// 首页中间区域三张图片地址
Vue.prototype.advUrls = {
  'url1':config.url1,
  'url2':config.url2,
  'url3':config.url3
}

// 首页热门充值栏目id：
Vue.prototype.hotId = config.hotId
// 首页特价推荐栏目id：
Vue.prototype.specialPrice = config.specialPrice

// Q币栏目相关配置信息：
Vue.prototype.qCoin = {
  childCategoryId: config.childCategoryId,
  productId: config.productId,
  templateId: config.templateId
}
// Q币商品数据
Vue.prototype.qCoinProducts = 
  { 
    productId: config.productId,
    templateId: config.templateId
  }
Vue.prototype.qCoinCountList = config.qCoinCountList

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})