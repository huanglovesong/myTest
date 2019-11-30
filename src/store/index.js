// npm install vuex --save
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
    //state mutations getters actions
    state: {
        codekey: 'Y53liJNx',
        merInfo:{
            merchantid: '',     // 商户id
            infoName:'',        // 商户名称
            templateId:'',      // 模板id
            infoTitle:'',       // 页面标题
            urlAddress:'',      // 页面地址
            tel:'',             // 商户电话
            qq:'',              // 商户QQ
            payMent:{           // 支付方式
                alipay:'',
                wechatpay:'',
                ownpay:''
            },
        },
        fuluId: '',
        fuluToken: '',
        userId:'',
        categoryId:'',
        childCategoryId:'',
        productId:'',
        orderNo:'',
        pageId:''
    },
    mutations: {
        setMerInfo(state, value){
            state.merInfo = {
                merchantid: value.merchantid,
                infoName:value.infoName,
                infoTitle:value.infoTitle,
                templateId:value.templateId,
                urlAddress:value.urlAddress,
                tel:value.tel,
                qq:value.qq,
                payMent:{
                    alipay:value.payMent.alipay,
                    wechatpay:value.payMent.wechatpay,
                    ownpay:value.payMent.ownpay
                },
            }
        },
        setToken(state, value){
            state.fuluId = value.fuluId
            state.fuluToken = value.fuluToken
        },
        changeUserId(state, value) {
            state.userId = value
        },
        changeCategoryId(state, value) {
            state.categoryId = value
        },
        changeChildCategoryId(state, value) {
            state.childCategoryId = value
        },
        changeProductId(state, value) {
            state.productId = value
        },
        changeOrderNo(state, value) {
            state.orderNo = value
        },
        changePageId(state, value) {
            state.pageId = value
        }
    }
})

export default store