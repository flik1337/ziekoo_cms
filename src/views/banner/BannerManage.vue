<template>
  <div>
    <el-card style="height: 75vh">
      <div class="upload">
        <!-- <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture">
          <el-button size="small" type="primary" class="upload-btn">点击上传</el-button>
        </el-upload> -->
        <div class="content">
          <el-image :src="imgUrl">
            <div slot="placeholder"
                 class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <el-input v-model="key"
                  placeholder="请输入图片标识"
                  style="margin-bottom:10px;"></el-input>
        <div class="btn">
          <el-button size="small"
                     type="success"
                     @click="submitUpload">上传到服务器</el-button>
        </div>
        <div class="btn-s">
          <el-button size="small"
                     type="primary"
                     @click="bannerClick">查找banner</el-button>
        </div>
        <el-upload class="upload-demo"
                   action=""
                   :limit="1"
                   :on-change="getFile"
                   :auto-upload="false"
                   list-type="picture"
                   :file-list="fileList">
          <el-button size="small"
                     type="primary">点击上传</el-button>
          <div slot="tip"
               class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>

      </div>
    </el-card>
  </div>
</template>

<script>
import { request } from '@/network/request'
import { image2Base64 } from '@/utils/filter'
export default {
  name: 'BannerManage',
  data () {
    return {
      key: '',
      imgUrl: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      fileList: []
    };
  },
  created () {
    // this.getImage()
  },
  methods: {
    /**
     * 获取图片
     */
    getImage () {
      request({
        url: '/public/v2/banner/info',
        method: 'post',
        data: {
          key: this.key
        }
      }).then(({ data }) => {
        console.log(data);
        this.imgUrl = data.url
      })
    },
    /**
     * 上传图片
     */
    submitUpload () {
      console.log(123);

      // console.log(this.fileList);
      request({
        url: '/private/v2/banner/update',
        method: 'post',
        data: { key: this.key, data: this.imgUrl }
      }).then(res => {
        console.log(res);
        if (res.error.code === 200) {
          this.$message.success('上传成功！')
        } else {
          this.$message.error('上传失败！')
        }
      })

    },
    getFile (file, fileList) {
      this.getBase64(file.raw).then(res => {
        this.imgUrl = res
        console.log(res)
      })
    },
    getBase64 (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    bannerClick () {
      this.getImage()
    }
  }
}
</script>

<style scoped>
.upload {
  width: 400px;
  margin: 10px 40px;
  /* overflow: scroll; */
  background-color: #eee;
  height: 260px;
}

.upload-demo {
  width: 500px;
  height: 300px;
  /* border: 1px solid #BBB; */
  /* border-radius: 10px; */
}

.upload-btn {
  margin: 20px;
}

.content {
  width: 450px;
  height: 260px;
  overflow: scroll;
  margin-bottom: 10px;
}

.btn {
  position: absolute;
  left: 160px;
}

.btn-s {
  position: absolute;
  left: 280px;
}
</style>