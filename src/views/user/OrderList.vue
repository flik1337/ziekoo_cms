<template>
  <div>
    <el-card>
      <!-- 表格 -->
      <el-table :data="list"
                stripe
                height="70vh"
                style="width: 100%">
        <el-table-column prop="start_time"
                         label="下单时间"
                         width="95">
        </el-table-column>
        <el-table-column prop="user.myWeChat"
                         label="微信"
                         width="120">
        </el-table-column>
        <el-table-column prop="user.phone"
                         label="手机号"
                         width="110">
        </el-table-column>
        <el-table-column label="用户头像和名称">
          <template slot-scope="scope">
            <div class="avatar">
              <div>
                <img :src="scope.row.user.avatar"
                     min-width="60"
                     height="60" />
              </div>
              <span class="name">{{scope.row.user.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="statusTitle"
                         label="订单状态"
                         width="100">
          <template slot-scope="scope">
            <div>
              <span :class="scope.row.style">{{scope.row.statusTitle}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="约TA做什么">
        </el-table-column>
        <el-table-column prop="city_name"
                         label="地点">
        </el-table-column>
        <el-table-column prop="time"
                         label="时间">
        </el-table-column>
        <el-table-column prop="amount"
                         label="愿意支付金额">
        </el-table-column>
        <el-table-column prop="takers"
                         label="接单师"
                         width="130">
          <template slot-scope="scope">
            　　　　 <div class="takersAva">
              <img v-for="item in scope.row.takers"
                   :src="item"
                   width="30"
                   height="30"
                   class="head_pic" />
            </div>
            　　</template>
        </el-table-column>
        <el-table-column label="操作"
                         width="100px">
          <template slot-scope="scope">
            <el-button :disabled="userOrderType==2"
                       @click="handleClick(scope.row)"
                       type="text"
                       size="small">删除订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--/表格  -->

      <!-- 分页栏 -->
      <el-row class="footer"
              type="flex"
              justify="start"
              align="middle">
        <el-col :offset="7"
                :span="10"
                class="pagination">
          <el-pagination @current-change="handleCurrentChange"
                         layout="total, prev, pager, next"
                         :total="total"
                         :page-size="pageSize"
                         >
          </el-pagination>
          <!-- <pagination class="page" :totalCount="totalCount"  :pageSize="pageSize" :tableData="tableData"         
    @tables="getTables" /> -->
        </el-col>
        <el-col v-if="false"
                :push="2"
                class="export">
          <el-button type="primary"
                     @click="handleExportOrder(0)"
                     size="mini">导出上周表格</el-button>
          <el-button type="primary"
                     @click="handleExportOrder(1)"
                     size="mini">导出上月表格</el-button>
          <el-button type="primary"
                     @click="handleExportOrder(2)"
                     size="mini">导出全部表格</el-button>
        </el-col>
      </el-row>
      <!-- /分页栏 -->

    </el-card>
    <el-dialog title="提示"
               :visible.sync="showDownLoadDialog"
               width="30%">
      <span><a :href="excelUrl">{{excelUrl}}</a></span>
      <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { request } from 'network/request'
import { dateFilter } from '@/utils/filter'
import { mapGetters } from 'vuex'

import Pagination from '@/components/pagination/Pagination'
export default {
  name: 'OrderList',
  components: {
    Pagination
  },
  data () {
    return {
      list: [],
      total: 0,
      currentIndex: 1,
      totalCount: 0, // totalCount 这是传递给 分页组件的 total 从而显示多少页数
      pageSize: 20, // 这是每页表格最多显示多少条
      tableView: [], //这个是给表格显示的数据
      tableData: [], //这是接口返回的所有数据
      defaultData: false, //例如用户在第5页，增加后请求数据肯定子啊第1页面那么需要重置组件
      showDownLoadDialog: false,
      excelUrl: ''

    }
  },
  created () {
    const type = this.$store.state.userOrderType
    this.getList()
  },
  computed: {
    userOrderType () {
      return this.$store.state.userOrderType
    }
  },
  watch: {
    userOrderType: 'getList'
  },
  methods: {
    /**
     * 获取列表
     */
    getList () {
      request({
        url: '/private/v2/order/list',
        data: {
          score: 0,
          offset: this.currentIndex - 1,
          type: parseInt(this.userOrderType)
        },
        method: 'post'
      }).then(({ data }) => {
        console.log(data);
        this.total = data.count
        let list = data.list

        list.map(item => {
          //let flag = (item.end_time - item.start_time) < 86400000
          let flag = this.checkLegal(item.end_time)
          let nTime = item.end_time - item.start_time
          item.start_time = dateFilter(item.start_time)
          item.end_time = dateFilter(item.end_time)
          item.time = item.start_time.slice(5) + ' 至 ' + Math.floor(nTime * 24 / 86400000)
          item.amount = item.amount / 100
          item.title = item.title.map(elem => elem.name).join('、')
          if (item.taker == null || (item.status == 0 && item.taker != null)) {
            item.statusTitle = '进行中/未选'
            item.style = 'yellow'
          }
          /* if (item.taker != null ) {
            item.statusTitle = '进行中/已选'
            item.style = 'green'
            if (!flag) {
              item.statusTitle = '进行中/将于24小时后确认完成'
              item.style = 'orange'
            }
          } */
          if (item.status == 1) {
            item.statusTitle = '进行中/已选'
            item.style = 'green'
            if (!flag) {
              item.statusTitle = '进行中/将于24小时后确认完成'
              item.style = 'orange'
            }
          }
          if (item.takers != null) {
            item.takers = item.takers.map(elem => {
              'https://ziekoo.oss-cn-qingdao.aliyuncs.com/' + elem.Avatar
            })
          }
          if (item.status == 2) {
            item.statusTitle = '已完成'
            item.style = 'green'
          }
          if (item.status == 3) {
            if (item.is_end === 0) {
              item.statusTitle = '已取消',
                item.style = 'red'
            } else if (item.is_end === 1) {
              item.statusTitle = '已取消/金额已原路返回',
                item.style = 'red'
            }
          }
        })
        // console.log(data);
        // this.list = data
        // this.tableData = data
        // //记得清除this.tableView 因为搜索的时候也会用这个，会造成上次数据没及时清除掉
        // this.tableView = []
        // this.totalCount = data.length
        // //进入if 因为他有多页码 else 只有1页
        // if(data.length >= this.pageSize) {
        //     for (let i = 0; i < this.pageSize; i++) {
        //         this.tableView.push(data[i]);
        //     }
        // }else {
        //     this.tableView = data
        // }
        this.list = list
        // this.pageSize = Math.ceil(this.total/20)

      })
    },
    /**
     * 删除订单
     */
    handleClick (row) {
      request({
        url: '/private/v2/order/del',
        method: 'post',
        data: {
          order_id: row.id
        }
      }).then(res => {
        console.log(res);
        const msg = res.error.userMsg
        if (res.error.code === 10117) {
          this.$message.error(msg);
        } else if (res.error.code === 200) {
          this.$message.success('删除成功！')
          this.getList()
        }
      }).catch(err => {
        console.log(err);
      })
    },
    /**
     * 点击页面
     */
    handleCurrentChange (val) {
      console.log(val);
      this.currentIndex = val
      this.getList()
    },
    /**
     * 获取页面
     */
    getTables (table) {
      this.tableView = table
    },
    checkLegal: function (endtime) {
      let timestamp = new Date().getTime()
      //console.log(timestamp < endtime)

      if (timestamp < endtime) { /* +6400000 */
        //若超过截止时间还没有确认订单
        //则将于24小时后自动确认
        return true
      } else {
        return false
      }
    },
    /* 导出表格 */
    handleExportOrder (dateType) {
      request({
        url: '/private/v2/order/export',
        method: 'post',
        data: {
          type: dateType
        }
      }).then(res => {
        if (res.error.code == 200) {
          this.excelUrl = res.data.url
        }
        this.showDownLoadDialog = true
        /*  const msg = res.error.userMsg
         if (res.error.code === 10117) {
           this.$message.error(msg);
         } else if (res.error.code === 200) {
           this.$message.success('删除成功！')
           this.getList()
         } */

      }).catch(err => {
        console.log(err);
      })
    },

  }
}
</script>
<style scoped>
.footer {
  position: relative;
  top: 10px;
  left: 100px;
}

.avatar {
  text-align: center;
}

.avatar img {
  border-radius: 50%;
}

.name {
  font-size: 12px;
}

.takersAva img {
  border-radius: 50%;
}

.yellow {
  color: #fcca00;
}

.green {
  color: #33d33f;
}

.orange {
  color: #ff9959;
}

.red {
  color: #ff2525;
}
</style>
