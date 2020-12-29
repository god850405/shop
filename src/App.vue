<template>
  <div id="app">
    <div class="header">
      <b-navbar  variant="light" class="header-navbar">
        <b-navbar-brand>
          <b-button v-b-toggle.sidebar variant="Info" size="lg">
            <b-icon icon="list"></b-icon>
          </b-button>
          <router-link to="/" >購物網站</router-link>
          </b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto"> 
            <b-nav-item id="CartPopover" @click="Cart" right>
              <b-icon icon="Cart4" aria-hidden="true"></b-icon>
              購物車
              <b-badge variant="danger">{{itemsCount}}</b-badge>
            </b-nav-item>
            <b-popover
              target="CartPopover"
              placement="bottomleft"
              triggers="hover focus"
              custom-class="popoverCart"
            >
              <template #title><b-icon icon="Cart4" aria-hidden="true"></b-icon>我的購物車</template>
              <b-table  :items="items" :fields="fields"  >
                <template #cell(ProductPrice)="row">
                  <p style="color:red;">${{row.item.ProductPrice}}</p>
                </template>
                <template #cell(actions)="row">
                  <a v-on:click="cancelCart(row.index)">
                    <b-icon icon="x-circle-fill" ></b-icon>
                  </a>
                </template>
              </b-table>
            </b-popover>
            <b-nav-item-dropdown  right>
              <!-- Using 'button-content' slot -->
              <template #button-content>
                <b-icon icon="person-fill"></b-icon>會員
              </template>
              <b-dropdown-item v-if="LoginStatus"> <router-link to="/member" >會員中心</router-link></b-dropdown-item>
              <b-dropdown-item  @click="Login">{{LoginStatusText}}</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-modal id="modal" ref="modal-center" size="md" hide-footer centered title="會員登入/註冊">
              <account></account>
            </b-modal>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>
    <div class="content">
      <!---------------  內容  -------------------->
      <router-view></router-view>
    </div>
    <div class="footer">
        <center><p>Author:Marcus<br>Email:god850405@gmail.com</p></center>
    </div>
    <b-sidebar  id="sidebar" aria-labelledby="sidebartitle" no-header-close shadow>
      <!---------------  左側選單  -------------------->
        <template #default="{ hide }">
              <div class="d-flex bg-dark text-light align-items-center px-3 py-2">
                  <b-button variant="transparent" @click="hide" style="width:100vh">
                    <b-icon icon="arrow-left-circle-fill" variant="light"></b-icon>
                    <span style="color:#eee;">隱藏</span>
                  </b-button>
              </div>
              <sidebar></sidebar>
        </template>
      
    </b-sidebar>
  </div>
</template>

<script>
import account from "./components/account.vue";
import sidebar from "./components/sidebar.vue";
import * as types from '@/types'
export default {
  name: "App",
  data(){
    return{
        fields: [
          {key: 'ProductNo', label: '商品編號',class: 'field-center'},
          { key: 'ProductTitle', label: '名稱'},
          { key: 'ProductSpecification', label: '規格',class:'field-center'},
          { key: 'ProductMeasurement', label: '尺寸',class:'field-center'},
          { key: 'ProductQuantity', label: '數量',class: 'field-center'},
          { key: 'ProductPrice',label: '單價', class: 'field-center'},
          { key: 'actions', label: '動作' ,class:'field-center'}
        ]
    }
  },components:{
    account,
    sidebar
  }
  ,computed:{
    items(){
      return this.$store.state.items
    },
    itemsCount(){
      return this.$store.state.itemsCount
    },
    LoginStatusText(){
      return (this.$store.state.token!=null) ? '登出' : '登入/註冊'
    }
    ,
    LoginStatus(){
      return (this.$store.state.token!=null) ? true : false
    }
  },methods:{
    Cart(){
      this.$router.push({
          name:'cart'
      }).catch(err => {console.log(err)})
    },
    Login(){
      if(this.$store.state.token!=null){
          this.$store.commit(types.LOGOUT)
          this.$store.commit("resetUser")
          this.$root.$bvToast.toast(
            '登出成功', 
            {
              title: '小提醒',
              autoHideDelay: 2000,
              appendToast: true
            }
          )
          this.$router.push({
              name:'itemlist'
          }).catch(err => {console.log(err)})
      }else{
          this.$refs['modal-center'].toggle('#toggle-btn')
      }
    },
    cancelCart(index){
      // 被取消的 row.index 
      console.log(`取消第 (${index}) 筆` );  
      this.$store.commit("cartDelete",index)
    }
  }
}
</script>

<style>
*{
    margin: 0;
    padding: 0;
    list-style: none;
    font-family: arial,san-serf;
}
html,body{
    background-color: #eee;
    margin: 0;
    height: 100%;
}
#app {
    height:inherit; /*自動填滿瀏覽器高度*/
    /*第一層flex--header、center、footer標籤垂直排列*/
    display: flex;
    flex-direction: column;
}
.content{
    flex: 1; /*第一層flex--center中間包含nav與main填滿剩餘高度*/
    display: flex; /*第二層flex--將nav與main標籤水平排列*/
    background-color: #DAE6EC;
}
.footer{
    height: 50px; /*第一層flex--footer固定高度*/
    background-color: #3490C5;
    font-weight:bold;
    color: rgb(53, 53, 53);
}

.popoverCart{
  max-width: 800px; 
}
.field-price{
  color:red;
}
.field-center{
  text-align: center;
}

</style>
