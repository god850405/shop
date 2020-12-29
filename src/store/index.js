import Vue from "vue";
import Vuex from "vuex";
import * as types from "@/types";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: null,// Token
    user: null, // 信箱
    name: null, // 名稱
    //--購物車
    items: [],
    itemsCount:0,
    //--側邊選單
    sideList:[],
    //-- filterlist 篩選方式
    filterString: "99",
    // 暫存訂單
    order:{
      OrdererEmail:'',
      OrdererName:'',
      OrdererPhone:'',
      OrdererAddress:'',
      ShippingMethod:'',
      PaymentMethod:'',
      RecipientEmail:'',
      RecipientName:'',
      RecipientPhone:'',
      RecipientAddess:''
    }
  },
  actions: {},
  mutations: {
    //登入成功將, token儲存在localStorage中
    [types.LOGIN]: (state, data) => {
      localStorage.token = data;
      state.token = data;
    },
    //退出登入將, token清空
    [types.LOGOUT]: state => {
      localStorage.removeItem("token");
      state.token = null;
    },
    //登入成功, USER_ID儲存在在STATE.USER
    setUser(state, data) {
      state.user = data.email;
      state.name = data.name;
    },
    resetUser(state) {
      state.user = null;
      state.name = null;
    },
    //-- 購物車清單事件
    cartDelete(state, data) {
      state.items.splice(data, 1);
      state.itemsCount--
    },
    cartInsert(state, data) {
      var item = {
        ProductNo: data.ProductNo,
        ProductTitle: data.ProductTitle,
        ProductSpecification: (data.ProductSpecification!=null) ? data.ProductSpecification : '未選',
        ProductMeasurement: (data.ProductMeasurement!=null) ? data.ProductMeasurement : '未選',
        ProductQuantity: (data.ProductQuantity!=null) ? data.ProductQantity : 1,
        ProductPrice: data.ProductPrice
      };
      state.items.push(item);
      state.itemsCount++
    },
    //-- 商品清單事件
    setFilterString(state, data) {
      state.filterString = data;
    },
    //-- 完成訂單後，暫存訂單資訊
    setOrder(state, data) {
        state.order.OrdererEmail    =  data.order.OrdererEmail
        state.order.OrdererName     =  data.order.OrdererName
        state.order.OrdererPhone    =  data.order.OrdererPhone
        state.order.OrdererAddress  =  data.order.OrdererAddress
        state.order.ShippingMethod  =  data.order.ShippingMethod
        state.order.PaymentMethod   =  data.order.PaymentMethod
        state.order.RecipientEmail  =  data.order.RecipientEmail
        state.order.RecipientName   =  data.order.RecipientName
        state.order.RecipientPhone  =  data.order.RecipientPhone
        state.order.RecipientAddess =  data.order.RecipientAddess
        state.order.forEach(element => {
          console.log(`ELEMENT :　${element}`)
        });
    },
    resetOrder(state) {
        state.order.OrdererEmail=''
        state.order.OrdererName=''
        state.order.OrdererPhone=''
        state.order.OrdererAddress=''
        state.order.ShippingMethod=''
        state.order.PaymentMethod=''
        state.order.RecipientEmail=''
        state.order.RecipientName=''
        state.order.RecipientPhone=''
        state.order.RecipientAddess=''
    },
    setSideList(state, data) {
      state.sideList = data;
    },
  },
  getters: {}
});
export default store;
