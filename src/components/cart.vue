<template>
    <div class="container-fluid">
        <b-card no-body class="cartCards">
            <b-tabs  v-model="tabIndex" card v-on:activate-tab="tabActivated">
                <b-tab title="步驟一"  active>
                    <b-card header="確認商品數量及規格">
                        <b-table  :items="cartitems" :fields="cartfields"  >
                            <template #cell(ProductTitle)="row">
                                <router-link 
                                    :to="{name:'item',params:{id:row.item.ProductNo}}">
                                    {{row.item.ProductTitle}}
                                </router-link>
                            </template>
                            <template #cell(ProductSpecification)="row">
                                <b-form-select 
                                    v-model="row.item.ProductSpecification" 
                                    v-bind:change="specificationChange(row.index)"
                                    >
                                        <b-form-select-option :value="s.ItemSpecification" v-for="(s,i) in specification[row.index]" :key=i>
                                        {{s.ItemSpecification}}
                                        </b-form-select-option>
                                </b-form-select>
                            </template>
                            <template #cell(ProductMeasurement)="row">
                                <b-form-select 
                                    v-model="row.item.ProductMeasurement" 
                                    >
                                        <b-form-select-option :value="m.ItemMeasurement" v-for="(m,j) in measurement[row.index]" :key=j>
                                        {{m.ItemMeasurement}}
                                        </b-form-select-option>
                                </b-form-select>
                            </template>
                            <template #cell(ProductQuantity)="row">
                                <b-form-spinbutton 
                                    id="sb-inline" 
                                    v-model="row.item.ProductQuantity" 
                                    inline>
                                </b-form-spinbutton>
                            </template>
                            <template #cell(ProductPrice)="row">
                                <p style="color:red;">${{row.item.ProductPrice}}</p>
                            </template>
                            <template #cell(actions)="row">
                                <a v-on:click="cancelCart(row.index)">
                                    <b-icon icon="x-circle-fill" ></b-icon>
                                </a>
                            </template>
                        </b-table>
                        <hr>
                        <section class="sectionTotal">
                            <p>小計： $ {{Sum}}</p><br/>
                            <p>折扣： $ {{Discount}}</p><br/>
                            <p>總計： $ {{Total}}</p>
                        </section>
                        <hr>
                        <section class="sectionBtn">
                            <b-button class="cartNextButton" @click="tabIndex++">下一步</b-button>
                        </section>
                    </b-card>
                </b-tab>
                <b-tab title="步驟二">
                    <b-card header="確認個人資料">
                        <h3>訂購人</h3>
                        <b-form-group
                            class="mb-0" style="margin-top:20px;"
                        >
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label type-email>信箱</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="User.email" type="email" disabled></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="my-1">
                                <b-col sm="2">
                                    <label type-text>姓名</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="User.name" type="text" disabled></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="mz-3">
                                <b-col sm="2">
                                    <label type-tel>手機號碼</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="User.phone" type="tel"></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="my-1">
                                    <b-col sm="2">
                                        <label type-text>地址</label>
                                    </b-col>
                                    <b-col sm="2">
                                        <b-form-select v-model="User.countrySelected" @change="countrychanged_user" >
                                            <b-form-select-option 
                                            :value="country.districts"
                                            v-for="(country,i) in User.countryList" :key="i">
                                                {{country.name}}</b-form-select-option>
                                        </b-form-select>
                                    </b-col>
                                    <b-col sm="2">
                                        <b-form-select v-model="User.districtSelected" >
                                            <b-form-select-option :value="district.name" v-for="(district,i) in User.districtList" :key="i">{{district.name}}</b-form-select-option>
                                        </b-form-select>
                                    </b-col>
                                    <b-col sm="6">
                                        <b-form-input v-model="User.address"  type="text"></b-form-input>
                                    </b-col>
                                </b-row>
                        </b-form-group>
                        <hr>
                        <b-form-group label="選擇物流方式：" v-slot="{ ariaDescribedby }" class="form-radio-group">
                            <b-form-radio-group
                                id="radio-group-1"
                                v-model="ShippingSelected"
                                :aria-describedby="ariaDescribedby"
                                @change="ShippingChanged"
                                name="radio-Shipping"
                            >
                                <b-form-radio value="s1">
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/7-11.jpg')" rounded alt="Image 1"></b-img-lazy>
                                </b-form-radio>
                                <b-form-radio value="s2">
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/cvs.jpg')" rounded alt="Image 1"></b-img-lazy>
                                </b-form-radio>
                                <b-form-radio value="s3">
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/T-cat.jpg')" rounded alt="Image 2"></b-img-lazy>
                                </b-form-radio>
                                <b-form-radio value="s4">
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/Post.png')" rounded alt="Image 3"></b-img-lazy>
                                </b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                        <b-form-group label="選擇付款方式：" v-slot="{ ariaDescribedby }" class="form-radio-group">
                            <b-form-radio-group
                                id="radio-group-2"
                                v-model="PaymentSelected"
                                :aria-describedby="ariaDescribedby"
                                name="radio-Payment"
                            >
                                <b-form-radio :disabled="PaymentDisabled.CreditCard" value="p01">
                                    線上刷卡
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/Credit-Card.png')" rounded alt="Image 1"></b-img-lazy>
                                </b-form-radio>
                                <b-form-radio :disabled="PaymentDisabled.AtmTransfer" value="p02">
                                    ATM轉帳
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/Atm.png')" rounded alt="Image 1"></b-img-lazy>
                                </b-form-radio>
                                <b-form-radio :disabled="PaymentDisabled.CashOnDelivery" value="p03">
                                    貨到付款
                                    <b-img-lazy v-bind="mainProps" :src="require('../assets/Cash-On-Delivery.png')" rounded alt="Image 2"></b-img-lazy>
                                </b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                        <hr>
                        <h3>收件者</h3>
                        <b-form-group
                            class="mb-0" style="margin-top:20px;"
                        >
                            <b-row class="my-1">
                                <b-col sm="2">
                                    <label type-email>信箱</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="Recipient.email" type="email"></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="my-1">
                                <b-col sm="2" >
                                    <label type-text>姓名</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="Recipient.name" type="text"></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="mz-3">
                                <b-col sm="2">
                                    <label type-tel>手機號碼</label>
                                </b-col>
                                <b-col sm="10">
                                    <b-form-input v-model="Recipient.phone"  type="tel"></b-form-input>
                                </b-col>
                                </b-row>
                                <b-row class="my-1">
                                <b-col sm="2">
                                    <label type-text>地址</label>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-select v-model="Recipient.countrySelected" @change="countrychanged_recipient" >
                                        <b-form-select-option 
                                        :value="country.districts"
                                        v-for="(country,i) in Recipient.countryList" :key="i">
                                            {{country.name}}</b-form-select-option>
                                    </b-form-select>
                                </b-col>
                                <b-col sm="2">
                                    <b-form-select v-model="Recipient.districtSelected" >
                                        <b-form-select-option :value="district.name" v-for="(district,i) in Recipient.districtList" :key="i">{{district.name}}</b-form-select-option>
                                    </b-form-select>
                                </b-col>
                                <b-col sm="6">
                                    <b-form-input v-model="Recipient.address"  type="text"></b-form-input>
                                </b-col>
                            </b-row>
                        </b-form-group>
                        <hr>
                        <section class="sectionBtn">
                            <b-button class="cartPreButton" @click="tabIndex--">上一步</b-button>
                            <b-button class="cartNextButton" @click="stepTwoNextStep">下一步</b-button>
                        </section>
                    </b-card>
                </b-tab>
                <b-tab title="步驟三"  >
                    <b-card header="完成訂單">
                        <section class="sectionBtn">
                            <b-button class="cartPreButton" @click="tabIndex--">上一步</b-button>
                            <b-button class="cartNextButton" @click="finishOrder">完成訂單</b-button>
                        </section>
                    </b-card>
                </b-tab>
            </b-tabs>  
        </b-card>
    </div>
</template>
<script>
let taiwan_districts = require('../assets/taiwan_districts.js');
export default {
    data(){
        return{
            tabIndex: 0, 
            stepTwoValidate:false,
            //-----第一步
            cartfields: [
                { key: 'ProductNo', label: '商品編號',sortable:true,class: 'field-center'},
                { key: 'ProductTitle', label: '名稱',sortable:true,},
                { key: 'ProductSpecification', label: '規格',class:'field-center'},
                { key: 'ProductMeasurement', label: '尺寸',class:'field-center'},
                { key: 'ProductQuantity', label: '數量',class: 'field-center'},
                { key: 'ProductPrice',label: '單價',sortable:true, class: 'field-center'},
                { key: 'actions', label: '動作' ,class:'field-center'}
            ],
            specification:[],
            measurement: [], // Item 尺寸
            // specification: [{ItemSpecification:'黑'},{ItemSpecification:'白'}], 
            // measurement:  [{ItemMeasurement:'M',ItemNo:'1'},{ItemMeasurement:'L',ItemNo:'1'},{ItemMeasurement:'XL',ItemNo:'1'}], 
            //-----第二步
            //----個人資料確認
            User:{
                email:'',
                name:'',
                phone:'',
                address:'',
                //-----地址下拉選項
                countrySelected:'',
                districtSelected:'',
                countryList:taiwan_districts,
                districtList:[],
            },
            Recipient:{
                email:'',
                name:'',
                phone:'',
                address:'',
                //-----地址下拉選項
                countrySelected:'',
                districtSelected:'',
                countryList:taiwan_districts,
                districtList:[],
            },
            ShippingSelected:'',
            PaymentSelected:'',
            PaymentDisabled:{
                CreditCard:true,
                AtmTransfer:true,
                CashOnDelivery:true
            },
            mainProps: {
                blank: true, width: 100, height: 75, class: 'm1'
            },
            //-----第三步
        }
    },
    computed:{
        //-----第一步
        Sum(){
            var sum=0
            this.$store.state.items.forEach(item => {
                sum+=item.ProductQuantity*item.ProductPrice
            });
            return sum
        },
        Discount(){
            return 0
        },
        Total(){
            return (this.Sum)-(this.Discount)
        },
        cartitems(){
            return this.$store.state.items
        }
        //------第二步
        //------第三步
    
    },mounted() {
        this.User.email = this.$store.state.user
        this.User.name = this.$store.state.name
        
        this.$store.state.items.forEach(item => {
            // console.log(`NO : ${item.ProductNo}`)
            this.$http.get(`https://localhost:44394/Product/GetItemSpecification?no=${item.ProductNo}`)
                .then(response => {
                    this.specification.push(response.data)
                });
        })
    }
    ,methods:{
        tabActivated(newTabIndex,oldTabIndex, event){ 
            if(oldTabIndex==1){
                if(!this.stepTwoValidate&&newTabIndex==2){
                    event.preventDefault();
                }
            }
            console.log(`new : ${newTabIndex} , old : ${oldTabIndex}`)
        },
        
        //-----第一步
         //  選擇規格後 顯示 Item 裡相對應的尺寸資料
        specificationChange(i){
            var item = this.$store.state.items[i]
            //console.log(`NO : ${item.ProductNo} SPE  ${item.ProductSpecification}`)
            if(item.ProductNo!=null&&item.ProductSpecification!='未選'){
                this.$http.get(`https://localhost:44394/Product/GetItemMeasurement?no=${item.ProductNo}&specification=${item.ProductSpecification}`)
                .then(response => {
                this.measurement.push(response.data);
                });
            }
        },
        cancelCart(index){
            // 被取消的 row.index 
            this.$store.commit("cartDelete",index)
        },
        //----第二步
        countrychanged_user(list){
            this.User.districtList=list
        },
        countrychanged_recipient(list){
            this.Recipient.districtList=list
        },
        ShippingChanged(){
            if(this.ShippingSelected!='D')
            {
                this.PaymentSelected = null
                this.PaymentDisabled.CreditCard = false
                this.PaymentDisabled.AtmTransfer = false
                this.PaymentDisabled.CashOnDelivery = false
            }
            else
            {
                this.PaymentSelected = null
                this.PaymentDisabled.CreditCard = false
                this.PaymentDisabled.AtmTransfer = false
                this.PaymentDisabled.CashOnDelivery = true
            }
        },
        stepTwoNextStep(){
            const User = this.User
            const Recipient = this.Recipient
            const ShippingSelected = this.ShippingSelected
            const PaymentSelected = this.PaymentSelected
            if(User.phone!=''&&User.address!=''&&User.countrySelected!=''&&User.districtSelected!=''&&Recipient.email!=''&&Recipient.name!=''&&Recipient.phone!=''&&Recipient.address!=''&&Recipient.districtSelected!=''&&Recipient.countrySelected!=''&&ShippingSelected!=''&&PaymentSelected!=''){
                this.$store.commit({
                    type:"setOrder", 
                    OrdererEmail    : User.email ,
                    OrdererName     : User.name ,
                    OrdererPhone    : User.phone ,
                    OrdererAddress  : User.countrySelected+User.districtSelected+User.address ,
                    ShippingMethod  : ShippingSelected ,
                    PaymentMethod   : PaymentSelected ,
                    RecipientEmail  : Recipient.email ,
                    RecipientName   : Recipient.name ,
                    RecipientPhone  : Recipient.phone ,
                    RecipientAddess : Recipient.countrySelected+Recipient.districtSelected+Recipient.address
                })
                this.stepTwoValidate = true 
                this.tabIndex++
            }
        },
        //----第三步
        finishOrder(){

        }
    }
}
</script>
<style>
    .cartCards{
        width: 100%;
    }
    /* 按鈕樣式 */
    .cartPreButton{
        width:150px;
        border-radius: 50px;
        float:left;
    }
    .cartNextButton{
        width:150px;
        border-radius: 50px;
        float:right;
    }
    /* 固定區域設置 */
    .sectionBtn{
        width:320px;
        margin:auto;
        position: relative;
        margin-right:10px;
    }
    .sectionTotal{
        width:200px;
        margin:auto;
        position: relative;
        margin-right:10px;
    }
    /* 購物車表格置中 */
    .field-center{
        text-align: center;
    }
</style>