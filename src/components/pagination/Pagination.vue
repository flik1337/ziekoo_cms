<template>
  <div>
        <el-pagination
            background
            layout="prev, pager, next"
            :total="totalCount"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handleCurrentChange">
        </el-pagination>
  </div>
</template>

<script>
export default {
    name: 'Pagination',
    props: {
    totalCount: {
      type: Number,
      default: 10
    },
    pageSize: {
      type: Number,
      default: 10
    },
    tableData: {
      type: Array,
      default: []
    },
    defaultData: {
      type: Boolean,
      default: false
    }
  },
   data() {
    return {
      tableView: [],
      currentPage: 1
    };
  },
  watch: {
    defaultData(newValue) {
        //数据已经被更新
        this.handleCurrentChange(1);
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);
      //为什么必须不是1 呢 因为点击1是返回初始数据
      if (val != 1){
        val =(val-1) * this.pageSize //比如点击是2，并且pageSize是10的时候 那么数据下标是 10开始就是10
      }
      let number = this.tableData.length;
      // 当点击2的时候如果第二页是最后一页进入else全部展示
      if (number > val + this.pageSize) {
        this.tableView = this.tableData.slice(val, val + this.pageSize);
      } else {
        this.tableView = this.tableData.slice(val, this.tableData.length);
      }
      
      
      this.$emit("tables", this.tableView);
    },
    save() {
    //假设已经增加成功了
        if(res.success){
            this.tableData = []
            this.tableView = []
            this.tableData = res.data
            this.totalCount = res.data.length
            //进入if 因为他有多页码 else 只有1页
            if (res.data.length >= this.pageSize) {
            for (let i = 0; i < this.pageSize; i++) {
                this.tableView.push(res.data[i]);
            }
            } else {
                this.tableView = res.data;
            }
            this.defaultData = true //那么就会调用handleCurrentChange(1)
            
        }
    }
  }

}
</script>

<style>

</style>