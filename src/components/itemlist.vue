<!---------------  目錄  -------------------->
<template>
  <div class="container-fluid" >
    <div  class="itemlist-top" >
      <!---------------  上方按鈕群組  -------------------->
      <b-row class="mb-3">
        <b-col>
          <b-button-group  class="itemlist-button-group">
            <b-button @click="onSort(1)" variant="transparent">熱銷排行</b-button>
            <b-button  @click="onSort(2)" variant="transparent">店家推薦</b-button>
            <b-dropdown variant="transparent" right text="價格">
              <b-dropdown-item @click="onSort(3)" >價格由低到高</b-dropdown-item>
              <b-dropdown-item @click="onSort(4)">價格由高到低</b-dropdown-item>
            </b-dropdown>
            <b-dropdown variant="transparent" right text="上架日期">
              <b-dropdown-item  @click="onSort(5)">最新上架</b-dropdown-item>
              <b-dropdown-item  @click="onSort(6)">最早上架</b-dropdown-item>
            </b-dropdown>
          </b-button-group>
        </b-col>
        <b-col>
          <b-input-group
            class="itemlist-input-group"
            @change="onSort(7)"
            size="sm"
          >
            <b-form-input v-model="searchString"></b-form-input>
            <b-input-group-append>
              <b-button @click="onSort(7)" size="sm" style="background-color:transparent;color:black;">
                  <b-icon :icon="'search'"></b-icon>
                </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </div>
    <div  class="itemlist-content">
      <!---------------  商品  -------------------->
      <b-row>
        <b-card-group id="itemlist" class="col-md-3"  v-for="items in filterlist[currentPage-1]" :key="items.ProductNo" deck>
          
            
            <b-card
              id="card"
              no-body
              bg-variant="transparent"
              class="border-0"
              >
              <router-link :to="{name:'item',params:{id:items.ProductNo}}">
                <b-card-img :src="items.ImageSrc" img-alt="商品封面照片" img-top></b-card-img>
              </router-link>
                <b-card-body>
                  <p>{{items.ProductTitle}}
                  <a class="card-text">${{items.ProductPrice}}</a></p>
                  <b-button class="CartAddButton" v-on:click="CartClick(items)" variant="danger">
                    加到購物車
                  </b-button>
                </b-card-body>
            </b-card>
        </b-card-group>
      </b-row>
    </div>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="card"
      class="pageController"
    ></b-pagination>
  </div>
</template>

<script>
export default {
  data(){
      return{
        // ---routere接收的參數------
        items:[], 
         //-- pagination 用參數
        currentPage:'1',// 目前頁數
        perPage: 8,     //決定分頁器總共有幾頁 備註：因為功能是自己寫的，數字不實際影響Card 
        //這數字只決定分頁器的頁數 (rows 總數 / perPage 一頁幾個 ) = 有幾頁
        
        //--itemlist 上方篩選器
        sortMethod:'', // itemlist 排序方式，空 => 不排序
        searchString:''
      }
    },watch:{
      $route(now){ 
        if(this.$route.params.str=='login'){
            this.$root.$emit('bv::show::modal', 'modal')
          }
      }
    } ,mounted() {
        this.$http.get('https://localhost:44394/Product/GetProduct')
        .then(response => {
            this.items = response.data;
        });
    },computed:{
      ProductPanel(){
        return this.ProductPanelVisible
      },
      DescriptionPanel(){
        return !this.ProductPanelVisible
      },
      rows(){ // 頁數總數
        var sum=0
        this.filterlist.forEach((value, index) => {
          sum =sum + value.length 
        });
        return sum
      },
      /*
      itemNo:99,itemName:'所有商品
      itemNo:2,itemName:'保暖衣物
      itemNo:3,itemName:'百搭外套
      itemNo:4,itemName:'百搭襯衫
      itemNo:5,itemName:'百搭上衣
      itemNo:6,itemName:'百搭褲款
      itemNo:7,itemName:'鞋包配件
      itemNo:66,itemName:'優惠專區
      itemNo:88,itemName:'活動特區
      * */

      filterlist(){ //篩選過後的 新LIST
        if(this.$store.state.filterString=='99'){   //所有商品
          return this.initList(this.initSort(this.items))
        }else if(this.$store.state.filterString=='66'){
          var filterlist = this.items.filter(item => {  //篩選出所有優惠中商品
            return item.OnSale===1
          })
          return this.initList(this.initSort(filterlist))
        }else if(this.$store.state.filterString=='88'){
            //尚未有功能
            console.log('活動特區')
        }else{
          var filterlist = this.items.filter(item => { //衣著分類 
            return item.CategoryNo=== this.$store.state.filterString 
          })
          return this.initList(this.initSort(filterlist)) //先做完 「篩選」 再做「分頁處理」
        }
      }
    },methods:{
      CartClick(items){ //加到購物車，第一下，加入，第二下，取消
        if(this.$store.state.items.some(item => item.ProductNo === items.ProductNo)){
            var i = this.$store.state.items.findIndex(x => x.ProductNo === items.ProductNo);
            this.$store.commit("cartDelete",i)
        }else{
          this.$store.commit({
              type:"cartInsert", 
              ProductNo: items.ProductNo,
              ProductTitle:items.ProductTitle,
              ProductSpecification:'未選',
              ProductMeasurement:'未選',
              ProductPrice:items.ProductPrice
          })
        }
      },
       //-- 手動處理 items 分頁問題------
      initList(oldList){
        var newList = []
        var templist=[] // 每集滿八個暫存，PUSH 到 LIST 後 ， 清空
        var cnt=7 //  一頁呈現 cnt + 1 個
        oldList.forEach((value, index) => {
            templist.push(value)
            if((index%cnt==0&index!=0)|oldList.length==1|index==oldList.length-1){
              newList.push(templist)
              templist=[]
            }
        });
        return newList
      },
      // itemlist 排序方式
      onSort(s){
        this.sortMethod = s
        console.log(`排序方式(${s})`)
      },
      initSort(oldList){
        var key 
        if(this.sortMethod==1){        //熱銷排行
          return oldList.filter(item => { 
            key = 'Sold'
            return oldList.sort(function(a,b){
              var x = parseInt(a[key]);
              var y = parseInt(b[key]);
              return x<y?1:-1
            })
          })
        }else if(this.sortMethod==2){  //店家推薦
          return oldList.filter(item => { 
            return item.Recommend===1
          })
        }else if(this.sortMethod==3){  //價格低到高
          key = 'ProductPrice'
          return oldList.sort(function(a,b){
            var x = parseInt(a[key]);
            var y = parseInt(b[key]);
            return x>y?1:-1
          })
        }else if(this.sortMethod==4){ //價格高到低
          key = 'ProductPrice'
          return oldList.sort(function(a,b){
            var x = parseInt(a[key]);
            var y = parseInt(b[key]);
            return x<y?1:-1
          })
        }else if(this.sortMethod==5){  //日期越新越前面
          key = 'OnDate'
          return oldList.sort(function(a, b) {
            var x = new Date(b[key]) 
            var y = new Date(a[key])
            return x>y?1:-1
          })
        }else if(this.sortMethod==6){ //日期越久遠越前面
          key = 'OnDate'
          return oldList.sort(function(a, b) {
            var x = new Date(b[key]) 
            var y = new Date(a[key])
            return x<y?1:-1
          })
        }else if(this.sortMethod==7){
          return oldList.filter(
            item => {return (item.ProductTitle.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1) | (item.ProductSubTitle.indexOf(this.searchString) > -1)
          })
        }else{
          this.sortMethod=''
          return oldList
        }
      }
    }
}
</script>
<style>
.itemlist-top{
  width: 100%;
  margin: auto;
  margin-top: 2vh;
}
.itemlist-button-group{
  width: 50vh;
  margin:auto;
}
.itemlist-input-group{
  width: 30vh;
  margin: auto;
  margin-right: 3vh;
}
.ButtonBackGroundTransparent{
  background-color: transparent;
}
.itemlist-content{
  width:95%;
  margin: auto;
}
#itemlist{
  margin: auto;
  margin-top: 3vh;
}
.card-text{
  color: red;
}
.CartAddButton{
  height: 5vh;
  width: 100%;
}
.pageController{
  width:30vh;
  margin:auto;
  margin-top: 3vh;
  margin-bottom: 3vh;
}
</style>