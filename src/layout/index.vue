<template>
  <div>
    <el-container class="home-container">
      <el-header height="120px"
                 class="header">
        <div class="">
          <el-menu router
                   :default-active="activeIndex"
                   class="el-menu-demo"
                   mode="horizontal"
                   @select="handleSelect">
            <el-menu-item index="/userorderlist">下单用户的订单管理</el-menu-item>
            <el-menu-item index="/receiverorderlist">退款和提现管理</el-menu-item>
            <el-menu-item index="/receivermanage">接单师管理</el-menu-item>
            <el-menu-item index="/bannermanage">banner管理</el-menu-item>
          </el-menu>
        </div>
        <div class="tab">
          <tabs :currentIndex="activeTab"
                @tabClick="setTabIndex" />
        </div>
      </el-header>
      <!-- <el-divider></el-divider> -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Tabs from './components/Tabs'
import OrderList from 'views/user/OrderList'
import { mapActions } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Tabs,
    OrderList
  },
  data () {
    return {
      activeIndex: '/userorderlist',
      tabIndex: '0',
      activeTab: '1'
    }
  },
  methods: {
    ...mapActions(['setUserOrderType']),
    /**
     * 选择导航栏
     */
    handleSelect (key) {
      switch (key) {
        case '/userorderlist':
          this.activeTab = '1'
          break
        case '/receiverorderlist':
          this.activeTab = '2'
          break
        case '/receivermanage':
          this.activeTab = '3'
          break
        case '/bannermanage':
          this.activeTab = '4'
          break
      }
      this.activeIndex = key
    },
    /**
     * 设置tabIndex
     */
    setTabIndex (index) {
      this.tabIndex = parseInt(index)
      this.$store.dispatch('setUserOrderType', index)
    }
  }
}
</script>

<style>
.tab {
  margin: 20px;
}

.el-menu.el-menu--horizontal {
  border-bottom: 0px;
}

.el-main {
  padding: 0;
  /* background-color: #E9EEF3; */
}

.home-container {
  height: 100vh;
}
</style>