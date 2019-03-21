<template>
  <div class="main">
    <el-tabs :value="activeTab" tab-position="left" style="" @tab-click="tabClick">
      <el-tab-pane name="info" label="个人信息">
        <el-row class="avatar" v-line_mid>
          <el-col :span="2"><span>头像</span></el-col>
          <el-col :span="2">
            <img :src="user.avatar" height="50px">
          </el-col>
          <el-col :span="4">
            <el-upload
              :show-file-list="false"
              name="avatar"
              class="upload-demo"
              :data="uploadData"
              :on-success="avatar_upload_success"
              :action='baseUrl + "user/avatar"'>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-col>
        </el-row>
        <el-row v-line_mid>
          <el-col :span="2"><span>手机号</span></el-col>
          <el-col :span="10">
            <el-input readonly v-model="user.phone"></el-input>
          </el-col>
        </el-row>
        <el-row v-line_mid>
          <el-col :span="2"><span>昵称</span></el-col>
          <el-col :span="10">
            <el-input readonly v-model="user.nick_name"></el-input>
          </el-col>
        </el-row>
        <el-row class="text_left">
          <el-button @click="showEdit" size="medium">编辑</el-button>
          <el-button @click="showEdit" size="medium">修改密码</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="goods" label="我的商品">
        <div class="pane_goods">
          <el-row class="text_left">
            <el-button plain type='primary' @click="$router.push('/upload')">添加作品</el-button>
          </el-row>
          <el-row class="goods_container">
            <p v-if="goodsList.length == 0" style="font-size:26px;color:#ccc;">您还没有发布过商品 . . .</p>
            <el-row v-line_mid class="collect-item pointer" v-for="(item, index) in goodsList" :key="index">
              <el-col v-if="goodsList.length > 0" :span="9">
                <router-link class="collect-link" tag="a" :to="'/detail?id=' + item.id">{{item.name}}</router-link>
              </el-col>
              <el-col :span="4">价格：￥{{item.price}}</el-col>
              <el-col :span="2">分类：{{classFilter(item.class)}}</el-col>
              <el-col class="text-right" :span="6">发布时间：{{item.time}}</el-col>
              <el-col class="text-center" :span="3">
                <el-button plain @click="delDialogVisible = true;clickGoodsId = item.id;" type="danger" size="mini">取消上架</el-button>
              </el-col>
            </el-row>
          <div class="block pagination_container">
            <el-pagination
              @size-change="handleSizeChange($event, 'goods')"
              @current-change="handleCurrentChange($event, 'goods')"
              :current-page="1"
              :page-sizes="[5, 10]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="goodsCount">
            </el-pagination>
          </div>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane name="collect" label="我的收藏">
        <el-row class="pane_goods">
            <el-row v-line_mid class="collect-item pointer" v-for="(item, index) in collectList" :key="index">
              <el-col :span="11">
                <router-link class="collect-link" tag="a" :to="'/detail?id=' + item.id">{{item.name}}</router-link>
              </el-col>
              <el-col :span="4">价格：￥{{item.price}}</el-col>
              <el-col class="text-right" :span="6">收藏时间：{{item.collectTime}}</el-col>
              <el-col class="text-center" :span="3">
                <el-button plain @click="cancelCollect($event, item.id)" type="danger" size="mini">取消收藏</el-button>
              </el-col>
            </el-row>
          <div class="block pagination_container">
            <el-pagination
              @size-change="handleSizeChange($event, 'collect')"
              @current-change="handleCurrentChange($event, 'collect')"
              :current-page="1"
              :page-sizes="[5, 10]"
              :page-size="5"
              layout="total, sizes, prev, pager, next, jumper"
              :total="collectCount">
            </el-pagination>
          </div>
        </el-row>
      </el-tab-pane>
      <el-tab-pane name="shop" label="购物车">
        <el-row>
          <el-table v-if="!editShop" key="mainTable"
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
            style="width: 100%" key="editTable">
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
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="编辑信息"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form label-width="80px" :model="userForm">
        <el-form-item label="昵称">
          <el-input v-model="userForm.formName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.formPhone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="commitEdit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      width="30%">
      <el-row class="color_danger">删除商品之前，请输入当前账户的密码进行验证！</el-row>
      <el-form :rules="delRules" :model="delForm" ref="delForm">
        <el-form-item prop="password">
          <el-input v-model="delForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDelDialogVisible">取 消</el-button>
        <el-button type="primary" @click="deleteGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>;
<script>
import { baseUrl } from "../lib/config.js";
import utils from '../lib/utils.js';
import { editShopSubmit, getShop, deleteGoods, collect, editPersonalInfo, getCollect, getPersonalGoods, getGoodsClass } from "../api/api.js";
export default {
  data() {
    return {
      activeTab: 'info',
      //user:{},
      uploadData:{
        token: utils.getLocalStorage('token'),
        phone: utils.getLocalStorage('phone')
      },
      baseUrl: baseUrl,
      dialogVisible: false,
      userForm: {},
      collectCount: 0,
      collectList: [],
      goodsCount: 0,
      goodsList: [],
      collectPageSize: 5,
      goodsPageSize: 5,
      currentCollectPage: 0,
      currentGoodsPage: 0,
      goodsClass: [],
      clickGoodsId: '',
      delDialogVisible: false,
      delForm: {},
      delRules:{
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, message: '请输入正确的密码'}
        ]
      },
      shopList: [],
      editShop: false,
      backupShopList:[]
    };
  },
  created(){
    if(this.$route.query && this.$route.query.tab){
      this.getPersonalGoods();
      this.activeTab = this.$route.query.tab;
    }
    this.getGoodsClass();
    this.getShop();
  },
  methods: {
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
    colSumFormatter(row, column, cellValue, index){
      return '￥' + (row.price * row.shopCount).toFixed(2);
      console.log(row);
    },
    priceFormatter(row, column, cellValue, index){
      return '￥' + Number(cellValue).toFixed(2);
    },
    changeDelDialogVisible(){
      this.delDialogVisible = !this.delDialogVisible;
      this.delForm.password = '';
    },
    deleteGoods(e, id){
      let that = this;
      this.$refs.delForm.validate(valid => {
        if(!valid) return;
        deleteGoods({
          goodsId: that.clickGoodsId,
          password: that.delForm.password
        }).then(res => {
          if(res.code != 0) return that.$message.error(res.msg);
          that.changeDelDialogVisible();
          that.$message.success(res.msg);
          that.getPersonalGoods();
        });
      });
    },
    cancelCollect(e, id){
      let that = this;
      this.$confirm('确定不再收藏此商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        collect({phone: this.$store.state.user.phone, id}).then(res => {
          //this.getHot('hot');
          if(res.code == 0) that.$message.success(res.msg);
          that.getCollect();
        });
      }).catch(() => {});
    },
    classFilter(value){
      let result;
      this.goodsClass.some((item) => {
        if(item.id == value){
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
    handleSizeChange(size, type){
      switch(type){
        case 'collect':
          this.collectPageSize = size;
          this.getCollect();
          break;
        case 'goods':
          this.goodsPageSize = size;
          this.getPersonalGoods();
          break;
      }
    },
    handleCurrentChange(current, type){
      switch(type){
        case 'collect':
          this.currentCollectPage = current - 1;
          this.getCollect();
          break;
        case 'goods':
          this.currentGoodsPage = current - 1;
          this.getPersonalGoods();
          break;
      }
    },
    tabClick(e){
      let that = this;
      switch(e.index){
        case '2':
          that.getCollect();
          break;
        case '1':
          that.getPersonalGoods();
          break;
        case '3':
          that.getShop();
          break;
      }
    },
    getShop(){
      let that = this;
      getShop({userPhone: this.$store.getters.get('user[phone]')})
        .then(res => {
          if(res.code != 0) return that.$message.error(res.msg);
          that.shopList = res.data;
          that.backupShopList = utils.deepCopy(res.data);
        });
    },
    getCollect(){
      let that = this;
      getCollect({
        userPhone: this.$store.getters.get('user[phone]'),
        pageSize: that.collectPageSize,
        currentPage: that.currentCollectPage,
      }).then(res => {
        if(res.code != 0){
          that.$message.error(res.msg);
        }else{
          that.collectCount = res.data.count;
          that.collectList = res.data.data;
        }
      });
    },
    getPersonalGoods(){
      let that = this;
      getPersonalGoods({
        phone: this.$store.getters.get('user[phone]'),
        pageSize: that.goodsPageSize,
        currentPage: that.currentGoodsPage,
      }).then(res => {
        if(res.code != 0){
          that.$message.error(res.msg);
        }else{
          that.goodsList = res.data.data;
          that.goodsCount = res.data.count;
        }
      });
    },
    avatar_upload_success(res){
      if(res.code == 0){
        this.$store.commit('setUser', Object.assign(this.user, {
          avatar: res.data.path
        }));
        this.$message.success(res.msg);
      }
    },
    showEdit(){
      this.dialogVisible = true;
      this.userForm.formName = this.user.nick_name;
      this.userForm.formPhone = this.user.phone;
    },
    commitEdit(){
      let that = this;
      editPersonalInfo({
        nick_name: this.userForm.formName,
        phone: this.userForm.formPhone
      }).then(res => {
        if(res.code == 0){
          that.user = res.data;
          that.$store.commit('setUser', res.data)
          that.dialogVisible = false
        }
      })
    }
  },
  computed: {
    user(){
      return this.$store.state.user;
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
  width: 80%;
  margin: 50px auto 0;
}
.avatar{
  height: 50px;
}
#pane-0, #pane-1{
  padding: 30px;
}
.el-row{
  margin-bottom: 30px;
}
.el-col{
  text-align: left;
}
.collect-container{
  height: auto;
}
.collect-item{
  height: 50px;
  margin-bottom: 10px;
  padding: 0 10px;
  font-size: 12px;
  border: 1px solid #ccc;
}
.collect-link:hover{
  color: #409EFF;
}
.pane_goods{
  padding: 30px;
}
.goods_container{
  height: auto;
}
.pagination_container{
  margin-top: 10px;
}
.table_footer{
  line-height: 40px;
  margin-top: 20px;
}
.table_footer .sum {
  font-weight: bold;
  font-size: 20px;
}
</style>