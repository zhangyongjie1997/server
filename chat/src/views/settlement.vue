<template>
  <div class="main">
    <transition name="el-fade-in">
      <div v-if="orderStep == 1">
        <el-table v-if="!editShop" key="mainTable"
          border
          ref="shopTable"
          :data="shopList"
          style="width: 100%">
          <el-table-column prop="name" label="商品名" width="180">
          </el-table-column>
          <el-table-column align="center" prop="price" :formatter="priceFormatter"
            label="价格"  width="180">
          </el-table-column>
          <el-table-column align="center" prop="shopCount"
            label="数量" width="280">
          </el-table-column>
          <el-table-column :formatter="colSumFormatter" align="center"
            prop="shopCount" label="总价">
          </el-table-column>
        </el-table>
        <el-table v-if="editShop" ref="shopTableEdit" :data="backupShopList"
          border style="width: 100%" key="editTable">
          <el-table-column prop="name" label="商品名" width="180">
          </el-table-column>
          <el-table-column align="center" prop="price"
            :formatter="priceFormatter" label="价格" width="180">
          </el-table-column>
          <el-table-column label="数量" align="center" width="280">
            <template slot-scope="scope">
              <el-input-number size="mini" v-model="scope.row.shopCount" :min="1" :max="99" label="描述文字"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column :formatter="colSumFormatter" align="center"
            prop="shopCount" label="总价" width="180">
          </el-table-column>
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger"
                @click="handleDeleteCol(scope.$index, scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-row class="table_footer">
          <el-col :span="6" class="sum text-left color_danger">合计： ￥{{editShop ? editShopSum : shopSum}}</el-col>
          <el-col :span="15" class="text-right" v-if="!editShop">
            <el-button plain
              type="danger"
              @click="handleEditShop">编辑</el-button>
          </el-col>
          <el-col :span="15" class="text-right" v-if="editShop">
            <el-button plain
              type="danger"
              @click="handleEditShopSave">保存</el-button>
            <el-button plain
              @click.stop="handleEditShopCancel">取消</el-button>
          </el-col>
        </el-row>
        <div class="addressInfo">
          <h2>填写订单信息</h2>
          <el-form ref="addressForm" :model="address" :rules="rules">
            <el-form-item size="medium" label="姓名" prop="name">
              <el-input v-model="address.name"></el-input>
            </el-form-item>
            <el-form-item size="medium" label="电话" prop="tel">
              <el-input type="tel" maxlength="11" v-model="address.tel"></el-input>
            </el-form-item>
            <el-form-item size="medium" label="选择地区">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-select @change="provinceChange" v-model="province" placeholder="省">
                    <el-option v-for="item in provinces" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select @change="cityChange" v-model="city" placeholder="市">
                    <el-option v-for="item in citise" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="area" placeholder="区 / 县">
                    <el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="address.address"></el-input>
            </el-form-item>
          </el-form>
          <el-button plain
              type="warning"
              @click="orderCommit">提交</el-button>
        </div>
      </div>
    </transition>
    <transition name="el-zoom-in-center">
      <el-row class="" v-if="orderStep == 2">
        <el-card class="order_success color_success">
          <i class="el-icon-success"></i> 提交成功
          <span class="back" @click="orderPay">去支付</span> / 
          <span class="back cancel" @click="orderCancel">取消订单</span>
        </el-card>
      </el-row>
    </transition>
    <transition name="el-zoom-in-center">
      <el-row class="" v-if="orderStep == 3">
        <el-card class="order_success color_success">
          <i class="el-icon-success"></i> 支付成功！
          <router-link class="back" tag="span" to="/personal">返回</router-link>
        </el-card>
      </el-row>
    </transition>
  </div>
</template>
<script>
import { orderCancel, orderPay, getShop, editShopSubmit, orderCommit, orderStatus, getCityList } from '../api/api.js';
import utils from '../lib/utils.js';
 export default {
  data() {
    return {
      shopList: [],
      backupShopList: [],
      editShop: false,
      order:{},
      orderPolling: null,
      orderStep: 1,
      orderForm: {},
      cityId: 0,
      provinces: [],
      citise: [],
      areas: [],
      province: '',
      city: '',
      area: '',
      address: {},
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      }
    };
  },
  created(){
    this.getShop();
    this.getCityList();
  },
  methods: {
    orderCancel(){
      let that = this;
      orderCancel({orderId: this.order.id, userPhone: this.$store.state.user.phone})
        .then(res => {
          if(res.code != 0) return that.$message.error(res.msg);
          that.$router.push('/personal');
        });
    },
    orderPay(){
      let that = this;
      orderPay({orderId: this.order.id, userPhone: this.$store.state.user.phone})
        .then(res => {
          if(res.code != 0) return that.$message.error(res.msg);
          that.orderStatusPolling();
          window.open(res.data.url);
        });
    },
    provinceChange(val){
      let that = this;
      this.citise.length = 0;
      this.areas.length = 0;
      this.city = '';
      this.area = '';
      getCityList({cityId: this.province}).then(res => {
        if(res.code != 0) return that.$message.error(res.msg);
        that.citise = res.data;
      });
    },
    cityChange(val){
      let that = this;
      this.areas.length = 0;
      this.area = '';
      getCityList({cityId: this.city}).then(res =>{
        if(res.code != 0) return that.$message.error(res.msg);
        that.areas = res.data;
      });
    },
    getCityList(){
      let that = this;
      getCityList({cityId: 0}).then(res => {
        if(res.code != 0) return that.$message.error(res.msg);
        that.provinces = res.data;
      });
    },
    orderCommit(){
      let that = this;
      this.$refs['addressForm'].validate((valid) => {
        if(valid){
          if(!that.area){
            this.$message.error('请选择城市');
          }
          orderCommit({userPhone: this.$store.state.user.phone})
        .then(res => {
          that.orderStep = 2;
          that.order = res.data;
          //that.orderStatusPolling();
          //window.open(res.data.url);
        });
        }else{
          this.$message.error('请填写订单信息');
        }
      });
    },
    orderStatusPolling(){
      let that = this;
      orderStatus({orderId: this.order.id})
        .then(res => {
          console.log(res);
          if(res.code != 0) return that.$message.error(res.msg);
          that.order.status = res.data.status;
          if(res.data.status == 1){
            clearTimeout(that.orderPolling);
            that.orderStep = 3;
            that.$message.success('支付成功');
            return;
          }
          that.orderPolling = setTimeout(that.orderStatusPolling, 1000);
        });
    },
    getShop(){
      let that = this;
      getShop({userPhone: this.$store.getters.get('user[phohe]')})
        .then(res => {
          if(res.code != 0) return that.$message(res.msg);
          that.shopList = res.data;
          that.backupShopList = utils.deepCopy(res.data);
        });
    },
    colSumFormatter(row, column, cellValue, index){
      return '￥' + (row.price * row.shopCount).toFixed(2);
      console.log(row);
    },
    priceFormatter(row, column, cellValue, index){
      return '￥' + Number(cellValue).toFixed(2);
    },
    getSubmitShopList(){
      let list = [];
      this.backupShopList.forEach(item => {
        list.push({
          id: item.id,
          count: item.shopCount
        });
      });
      return list;
    },
    handleEditShopSave(){
      let that = this;
      editShopSubmit({userPhone: this.$store.state.user.phone, shopList: JSON.stringify(this.getSubmitShopList())})
        .then(res => {
          if(res.code != 0){
            that.$message.error(res.msg);
            that.backupShopList = utils.deepCopy(that.shopList);
          }else{
            that.$message.success(res.msg);
            that.getShop();
          }
          that.editShop = false;
        });
    },
    handleEditShopCancel(){
      this.backupShopList = utils.deepCopy(this.shopList);
      this.editShop = false;
    },
    handleDeleteCol(index, row){
      //this.backupShopList.splice(index, 1);
      this.backupShopList = this.backupShopList.filter(item => item.id != row.id);
    },
    handleEditShop(index, row){
      this.editShop = true;
    },
    getSubmitShopList(){
      let list = [];
      this.backupShopList.forEach(item => {
        list.push({
          id: item.id,
          count: item.shopCount
        });
      });
      return list;
    },
    handleEditShopSave(){
      let that = this;
      editShopSubmit({userPhone: this.$store.state.user.phone, shopList: JSON.stringify(this.getSubmitShopList())})
        .then(res => {
          if(res.code != 0){
            that.$message.error(res.msg);
            that.backupShopList = utils.deepCopy(that.shopList);
          }else{
            that.$message.success(res.msg);
            that.getShop();
          }
          that.editShop = false;
        });
    },
  },
  computed:{
    user(){
      return this.$store.state.user
    },
    shopSum(){
      let sum = 0;
      this.shopList.forEach((item) => {
        sum += item.price * item.shopCount;
      });
      return Number(sum).toFixed(2);
    },
    editShopSum(){
      let sum = 0;
      this.backupShopList.forEach((item) => {
        sum += item.price * item.shopCount;
      });
      return Number(sum).toFixed(2);
    }
  }
};
</script>
<style scoped>
.main{
  padding: 30px;
  margin: 30px;
  border: 1px solid #ccc;
  background-color: whitesmoke;
}
.table_footer{
  line-height: 40px;
  margin-top: 20px;
}
.table_footer .sum {
  font-weight: bold;
  font-size: 20px;
}
.order_success{
  line-height: 400px;
  height: 400px;
  width: 70%;
  margin: 0 auto;
  font-size: 40px;
  color: #67C23A;
}
.back{
  font-size: 16px;
  color: #409EFF;
  cursor: pointer;
}
.addressInfo{
  width: 500px;
  margin: 0 auto;
  color: #909399;
}
.cancel{
  color: #999;
}
</style>