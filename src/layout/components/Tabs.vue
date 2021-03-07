<template>
  <div>
    <el-tabs v-if="currentIndex == 1" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部订单" name="all"></el-tab-pane>
        <el-tab-pane label="进行中" name="working"></el-tab-pane>
        <el-tab-pane label="已完成" name="finish"></el-tab-pane>
        <el-tab-pane label="已取消" name="cancel"></el-tab-pane>
    </el-tabs>
    <el-tabs v-if="currentIndex == 2" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="退单管理" name="all"></el-tab-pane>
        <el-tab-pane label="提现管理" name="deposit"></el-tab-pane>
    </el-tabs>
    <el-tabs v-if="currentIndex == 3" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部接单" name="all"></el-tab-pane>
        <el-tab-pane label="女生接单" name="girl"></el-tab-pane>
        <el-tab-pane label="男生接单" name="boy"></el-tab-pane>
        <el-tab-pane label="申请成为接单师" name="sq"></el-tab-pane>
    </el-tabs>
    <el-tabs v-if="currentIndex == 4" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="banner编辑" name="all"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
    name: 'Tabs',
    props: {
        currentIndex: String
    },
    data() {
        return {
            activeName: 'all'
        }
    },
    created() {
        
    },
    methods: {
        /**
         * 标签页转换
         */
        handleClick(tab) {
            const index = tab.index
            this.$emit('tabClick', index)
        }
    }
}
</script>

<style>
.el-tabs__nav-wrap::after {
    display: none;
}
</style>