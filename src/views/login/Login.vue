<template>
  <div class="home-container">
    <div class="box">
      <!-- logo -->
      <div class="logo">
        <span>ZIEKOO</span>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px"
               :rules="rules"
               :model="user"
               ref="formRef">
        <!-- 账号密码输入 -->
        <el-form-item label="账号："
                      prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="密码："
                      prop="password">
          <el-input type="password"
                    v-model="user.password"
                    @keyup.enter.native="login"></el-input>
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span> -->
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button :loading="loading"
                     @click="login">登录</el-button>
          <!-- <el-button type="info" @click="btnClick">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      user: {
        username: "",
        password: ""
      },
      passwordType: 'password',
      loading: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符以内",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 3 到 10 个字符以内",
            trigger: "blur"
          }
        ]
      },
    };
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    btnClick () {
      this.$refs.formRef.resetFields();
      console.log(this);
    },
    login (event) {
      console.log(this.user)
      if (this.user.username == "" || this.user.password == "") {
        this.$message.error('账号或密码不能为空');
        return
      }
      if (this.user.password != 'dazz666') {
        this.$message.error('密码错误');
        return
      }
      this.$message({
        message: '登录成功',
        type: 'success'
      });
      this.$router.push('/userorderlist')
    }
    // handleLogin() {
    //   this.$refs.formRef.validate(valid => {
    //     if (valid) {
    //       this.loading = true
    //       this.$store.dispatch('user/login', this.user).then(() => {
    //         this.$router.push('/home')
    //         this.loading = false
    //       }).catch(() => {
    //         this.loading = false
    //       })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.home-container {
  background-color: #fff;
}

.box {
  height: 500px;
  width: 400px;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  display: flex;
  border: 1px solid rgba(187, 187, 187, 1);
  /* background-color: #2d3a4b; */
}

.logo {
  position: absolute;
  color: #fcca00;
  left: 50%;
  top: 10%;
  transform: translate(-50%, 50%);
  background-color: #fff;
}

.logo span {
  font-size: 28px;
}

.el-form {
  width: 100%;
  margin: 150px 20px 0;
  padding-left: 30px;
}

.el-form-item /deep/ .el-form-item__label {
  font-size: 18px;
}

.el-form-item /deep/ .el-input__inner {
  width: 200px;
  height: 28px !important;
  border-radius: 10px;
  border: 1px solid rgba(187, 187, 187, 1);
}

.el-button {
  border-radius: 10px;
  width: 245px;
  height: 40px;
  font-size: 18px;
  border: 1px solid rgba(187, 187, 187, 1);
}

.el-button:hover {
  background-color: rgba(252, 202, 0, 0.5);
  color: #606266;
}

.btns {
  display: flex;
  position: absolute;
  bottom: 77px;
  left: 0px;
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
}
</style>