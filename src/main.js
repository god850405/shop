// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'
// import $ from 'jquery';
router.beforeEach((to, from, next) => {
  //matched的陣列中包含$route物件的檢查元欄位
  //arr.some() 表示判斷該陣列是否有元素符合相應的條件, 返回布林值
    if (to.matched.some(record => record.meta.requiresAuth)) {
      //判斷當前是否有登入的許可權
        if (!store.state.token) {
            next({
                name:'itemlist',
                params:{str:'login'}
                //query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
    } else {
      next() // 確保一定要呼叫 next()
    }
})
// http request 攔截器
axios.interceptors.request.use(
    config => {
        if (store.state.token) {  // 判斷是否存在token，如果存在的話，則每個http header都加上token
            config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 攔截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token資訊並跳轉到登入頁面
                    store.commit(types.LOGOUT);
                    router.replace({
                        name:'itemlist',
                        params:{str:'login'}
                        // query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
      return Promise.reject(error.response.data)   // 返回介面返回的錯誤資訊
});
Vue.config.productionTip = false
Vue.use(VueRouter)
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    axios,
    components: { App },
    template: '<App/>'
})
