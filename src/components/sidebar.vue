<template>
    <div class="sidebar">
        <div class="sideHeader">

        </div>
        <div class="sideContent">
            <b-list-group>
                <b-list-group-item 
                v-for="item in  items"
                :key="item.itemNo"
                @click="itemSelected(item.itemNo)"
                href="#"
                v-b-toggle.sidebar>
                {{item.itemName}}
                </b-list-group-item>
            </b-list-group>
        </div>
        
    </div>
</template>
<script>
export default {
    data() {
        return {
            items:[
                {itemNo:99,itemName:'所有商品'},
                {itemNo:2,itemName:'保暖圍巾'},
                {itemNo:3,itemName:'百搭外套'},
                {itemNo:4,itemName:'百搭襯衫'},
                {itemNo:5,itemName:'百搭上衣'},
                {itemNo:6,itemName:'百搭褲款'},
                {itemNo:7,itemName:'鞋包配件'},
                {itemNo:66,itemName:'優惠專區'},
                {itemNo:88,itemName:'活動特區'},
            ]
        }
    },
    computed:{

    },
    methods: {
        itemSelected(i){
            this.$router.push({
                name:'itemlist'
            }).catch(err => {})
            this.$store.commit("setFilterString",i)
        }
    },
}
</script>
<style>
    a, a:link, a:visited{
        text-decoration: none;
        font-weight: bold;
    }
    #sidebar a:hover{
        color:#eee;
        background-color: #3490C5;
        text-decoration: none;
    }
    .sidebar{
        height: calc(inherit - 20vh); /*自動填滿瀏覽器高度*/
        /*第一層flex--header、center、footer標籤垂直排列*/
        display: flex;
        flex-direction: column;
    }
    .sideHeader{
        height: 20vh;
        background-color: #3490C5;
    }
    .sideContent{
        flex: 1;
        background-color: #eee;
    }
</style>