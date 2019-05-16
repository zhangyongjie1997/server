<template>
  <div class="main">
    <div class="container">
      <div class="status_container">
        <h3 class="status">当前订单状态: {{order.status | statusFormatter}}</h3>
        <div class="status_tip">
          <li>交易成功，请给卖家评价</li>
          <li>如果没有收到货，或收到货后出现问题，您可以联系卖家协商解决</li>
          <li>如果卖家没有履行应尽的承诺，您可以联系客服</li>
        </div>
      </div>
      <div class="order_info_contaier">
        <ul class="info_title">
          <li><a href="javascript:;" data-reactid=".0.8.1.$nav.$0/=1$0.0">订单信息</a></li>
        </ul>
        <div class="info_item">
          <h3 class="info_item_title">收货信息</h3>
          <div class="info_item_container">
            <li class="info_list">
              收货人： {{address.name}}
            </li>
            <li class="info_list">
              收货人手机号： {{address.tel}}
            </li>
            <li class="info_list">
              收货地址： {{address.area}}
            </li>
            <li class="info_list">
              详细地址： {{address.address}}
            </li>
            <li class="info_list">
              运送方式： 快递
            </li>
          </div>
        </div>
        <div class="info_item">
          <h3 class="info_item_title">订单信息</h3>
          <div class="info_item_container">
            <li class="info_list">
              订单编号： {{order.id}}
            </li>
            <li class="info_list">
              订单金额： {{order.amount + '元'}}
            </li>
            <li class="info_list">
              订单时间： {{order.id | dateFormatter}}
            </li>
            <li class="info_list">
              订单状态： {{order.status | statusFormatter}}
            </li>
          </div>
        </div>
        <div class="info_item">
          <h3 class="info_item_title">商品信息</h3>
          <div class="info_item_container">
            <el-table key="mainTable"
              ref="shopTable"
              :data="order.goods"
              style="width: 100%">
              <el-table-column label="" width="100">
                <template slot-scope="scope">
                  <img :src="baseUrl + scope.row.cover" width="30px">
                </template>
              </el-table-column>
              <el-table-column prop="name" label="商品名">
              </el-table-column>
              <el-table-column align="center" prop="price" :formatter="priceFormatter"
                label="价格"  width="180">
              </el-table-column>
              <el-table-column align="center" prop="class" :formatter="classFilter"
                label="类别" width="">
              </el-table-column>
              <el-table-column align="center" prop="shopCount"
                label="数量" width="280">
              </el-table-column>
              <el-table-column label="" align="center">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="showM($event, scope.row)">卖家信息</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="amount text_right">
          订单总金额：<span class="amount_num">{{order.amount}}</span> 元
        </div>
      </div>
    </div>
    <el-dialog
      title="卖家信息"
      :visible.sync="delDialogVisible"
      width="30%">
      <div class="text_left seller_info">
        <li>
          卖家头像：<img class="avatar" :src="baseUrl + seller.avatar" alt="">
        </li>
        <li>
          卖家昵称：<span>{{seller.nick_name}}</span>
        </li>
        <li>
          卖家手机号：<span>{{seller.phone}}</span>
        </li>
        <li>
          注册时间：<span>{{seller.time}}</span>
        </li>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getOrderDetail, getGoodsClass } from "../api/api.js";
export default {
  data() {
    return {
      order: {},
      orderId: "",
      address: {},
      goodsClass: [],
      delDialogVisible: false,
      seller: {}
    };
  },
  created() {
    this.orderId = this.$route.query.id;
    this.getGoodsClass();
    this.getOrder();
  },
  methods: {
    showM(e, data){
      this.seller = data;
      this.delDialogVisible = true;
    },
    classFilter(row, column, cellValue, index){
      let result;
      this.goodsClass.some((item) => {
        if(item.id == cellValue){
          result = item.name;
          return true;
        }
        return false;
      });
      return result;
    },
    getGoodsClass(){
      let that = this;
      getGoodsClass().then(res => {
        if(res.code == 0){
          that.goodsClass = res.data;
        }
      });
    },
    priceFormatter(row, column, cellValue, index){
      return '￥' + Number(cellValue).toFixed(2);
    },
    getOrder() {
      let that = this;
      getOrderDetail({ orderId: this.orderId }).then(res => {
        if(res.code != 0) return that.$message.error(res.msg);
        that.order = res.data;
        that.address = typeof that.order.address == 'string' ? JSON.parse(that.order.address) : that.order.address;
      });
    }
  },
  filters: {
    statusFormatter(val){
      let str = '';
      switch(true){
        case val == '-1':
          str = '已取消';
          break;
        case val == '0':
          str = '已支付';
          break;
        case val == '1':
          str = '已完成';
          break;
        case val == '2':
          str = '待支付';
          break;
      }
      return str;
    },
    dateFormatter(val){
      return String(new Date(Number(val)).format());
    }
  }
};
</script>
<style scoped>
.amount_num{
  font-weight: 700;
  font-size: 18px;
  color: #f50;
}
.amount{
  font-size: 12px;
  margin-top: 20px;
}
.seller_info li{
  margin-bottom: 10px;
}
.avatar{
  width: 30px;
}
.info_item_container{
  padding-left: 20px;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
  color: #404040;
}
.info_title li a{
  font-weight: 700;
  font-size: 14px;
  color: #333;
  display: block;
  width: 130px;
}
.info_title li{
  float: left;
  width: 130px;
  height: 27px;
  margin-right: 3px;
  padding-top: 8px;
  line-height: 21px;
  text-align: center;
  background: url('//assets.alicdn.com/app/trade/img/tabview_bg.gif') 0 6px no-repeat;
  cursor: pointer;
  background-position: 0 -40px;
}
.info_item{
  padding-bottom: 15px;
  border-bottom: 1px solid #D1D7DC;
}
.info_title{
  position: absolute;
  left: 20px;
  top: -46px;
  z-index: 50;
}
.info_list{
  margin-top: 5px;
}
.order_info_contaier{
  text-align: left;
  position: relative;
  margin-top: 60px;
  padding: 15px 20px 20px 20px;
  border: 1px solid #AEC7E5;
}
.info_item_title{
  font-size: 13px;
}
.main{
  display: inline-block;
  width: 100%;
  min-height: 100%;
}
.container{
  margin: 20px auto;
  width: 70%;
  height: 100%;
}
.status_container{
  font-size: 14px;
  text-align: left;
  padding: 10px 20px 20px 60px;
  background: #FFF7EB;
  border: 1px solid #000;
}
.status_tip{
  margin-top: 10px;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
  color: #404040;
}
.status_tip li{
  list-style: square;
  line-height: 25px;
}
</style>