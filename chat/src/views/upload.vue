<template>
  <div class="main">
    <div class="step_container">
      <el-steps :active="step" finish-status="success">
        <el-step title="选择分类"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3">
          <el-upload
            class="upload-demo"
            :action='baseUrl + "goods/upload"'
            :limit="3"
            :data="uploadData"
            name="avatar"
          >
            <el-button
              size="small"
              type="primary"
            >点击上传</el-button>
            <div
              slot="tip"
              class="el-upload__tip"
            >只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-step>
      </el-steps>
    </div>
    <div class="content">
      <div class="class_container" v-if="step == 0">
        <div @click="clickClass($event, item.id)" v-for="item in goodsClass" :key="item.id" class="class_item">
          <img src="../assets/classCover.png" height="100%">
          <div class="item_cover">
            <span>{{item.name}}</span>
            <p>这是一段描述性的文字</p>
          </div>
        </div>
      </div>
      <div class="class_container class_container2" v-if="step == 1">
        <el-form ref="goodsForm" :model="goods" :rules="rules" label-position="left" label-width="60px" class="goodsForm">
          <h3>填写信息</h3>
          <el-form-item label="名称" prop="name">
            <el-input v-model="goods.name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="goods.price"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input type="textarea" v-model="goods.describe"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="formConfirm">确认</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="class_container class_container2" v-if="step == 2">
        <el-row class="upload_row">
          <h2>上传作品图片</h2>
          <el-row class="item">
            <el-col :span="10">
              <h3>1. 选择封面</h3>
            </el-col>
            <el-col :span="14" class="text_left">
              <el-upload
                class="upload-demo"
                ref="upload1"
                list-type="picture"
                :file-list="fileList"
                :limit="1"
                name="cover"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="10">
              <h3>1. 选择图片</h3>
            </el-col>
            <el-col :span="14" class="text_left">
              <el-upload
                class="upload-demo"
                ref="upload2"
                list-type="picture"
                :file-list="fileList"
                name="detail"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-col>
          </el-row>
          <el-row class="item">
            <el-button @click="submitUpload" plain type="primary"> 上 传   </el-button>
          </el-row>
        </el-row>
      </div>
      <div class="class_container class_container3" v-if="step == 3">
        <el-row class="upload_row">
          <span class="upload_success"><i class="el-icon-success color_success"></i>上传成功</span>
          <span class="upload_success_a pointer" @click="uploadSuccessHref">点击查看</span>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../lib/config.js";
import { getGoodsClass, uploadGoods } from '../api/api.js';
import utils from '../lib/utils.js';
export default {
  data() {
    return {
      baseUrl: baseUrl,
      uploadData:{
        token: utils.getLocalStorage('token'),
        phone: utils.getLocalStorage('phone')
      },
      step: 0,
      goodsClass:[],
      classId: Number,
      goods: {},
      fileList:[],
      rules:{
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        price:[
          { required: true, message: '请输入价格', trigger: 'blur' },
        ]
      }
    };
  },
  created(){
    this.getGoodsClass()
  },
  methods:{
    uploadSuccessHref(){
      this.$router.push({path: '/personal', query: {tab: 'goods'}});
    },
    submitUpload(){
      let that = this;
      let fileData = new FormData();
      this.$refs.upload1.uploadFiles.forEach(item => {
        fileData.append("cover", item.raw, item.name);
      });
      this.$refs.upload2.uploadFiles.forEach(item => {
        fileData.append("detail", item.raw, item.name);
      });
      uploadGoods({
        file: fileData,
        data: {
          ...that.goods,
          goodsClass: that.classId,
        }
      }).then(res => {
        if(res.data.code != 0){
          that.$message.warning(res.data.msg);
          that.step = 0;
        }else{
          that.$message.success(res.data.msg);
          that.step++;
        }
      });
    },
    getGoodsClass(){
      let that = this;
      getGoodsClass().then(res => {
        if(res.code == 0){
          that.goodsClass = res.data;
        }
      });
    },
    clickClass(e, id){
      this.classId = id;
      this.step++;
    },
    formConfirm(){
      this.$refs['goodsForm'].validate((valid) => {
        if(valid){
          this.step++
        }else{
          this.$message.error('请填写正确的信息');
        }
      })
    }
  }
};
</script>
<style scoped lang="less">
.main{
  padding: 30px 50px;
  .step_container{
    width: 70%;
    margin: 0 auto 70px;
  }
}
.content{
  width: 70%;
  margin: 0 auto;
}
.class_container{
  border-radius: 10px;
  box-shadow: 0 5px 20px 0 #ccc;
  padding: 10px 40px 30px 30px;
  display: flex;
  justify-content: space-between;
  justify-items: center;
  align-content: stretch;
  align-items: center;
  flex-wrap: wrap;
}
.class_container .class_item{
  cursor: pointer;
  margin-top: 30px;
  margin-left: 20px;
  height: 130px;
  position: relative;
}
.class_item .item_cover{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  justify-items: center;
  justify-content: space-around;
  align-items: center;
  align-content: space-around;
  width: 100%;
  height: 100%;
  transition: all .2s ease-in-out;
  font-size: 0;
  overflow: hidden;
}
.item_cover span{
  position: relative;
  display: block;
  font-size: 20px;
  font-weight: bold;
  transition: all .2s ease-in-out;
}
.item_cover p{
  position: absolute;
  font-size: 14px;
  z-index: 10;
  top: 120px;
  transition: all .2s ease-out;
}
.class_item .item_cover:hover{
  background-color: rgba(0, 0, 0, 0.2);
}
.class_item .item_cover:hover span{
  color: #000;
}
.class_item .item_cover:hover p{
  top: 80px;
  color: rgb(112, 60, 39);
}
.class_container.class_container2{
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
.class_container.class_container3{
  box-sizing: border-box;
  width: 100%;
  height: 456px;
}
.goodsForm{
  margin: 20px 0;
  width: 70%;
}
.upload_row{
  width: 100%;
}
.upload_row .item{
  margin: 50px 0;
}
.upload_success{
  font-size: 30px;
}
.upload_success_a{
  color: #409EFF;
}
</style>