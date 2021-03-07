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
        <el-table-column prop="status"
                         label="订单状态"
                         width="100">
          <template slot-scope="scope">
            <div>
              <span :class="scope.row.style">{{scope.row.status}}</span>
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
                         align="center"
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
            <el-button @click="agreeClick(scope.row)"
                       type="text"
                       size="small">同意</el-button>
            <el-button @click="disAgreeClick(scope.row)"
                       type="text"
                       size="small">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--/表格  -->

      <!-- 分页栏 -->
      <!-- <button @click="test">test</button> -->
      <el-row class="footer"
              type="flex"
              justify="start"
              align="middle">
        <el-col :offset="7"
                :span="11"
                class="pagination">
          <el-pagination @current-change="handleCurrentChange"
                         :page-size="pageSize"
                         layout="total, prev, pager, next"
                         :total="total">
          </el-pagination>
          <!-- <pagination class="page" :totalCount="totalCount"  :pageSize="pageSize" :tableData="tableData"         
    @tables="getTables" /> -->
        </el-col>
      </el-row>
      <!-- /分页栏 -->
    </el-card>
  </div>
</template>

<script>
import { request } from 'network/request'
import { dateFilter } from '@/utils/filter'
import Pagination from '@/components/pagination/Pagination'
export default {
  name: 'ReceiverOrderList',
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
      defaultData: false //例如用户在第5页，增加后请求数据肯定子啊第1页面那么需要重置组件
    }
  },
  created () {
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
      if (this.userOrderType == 0) {
        request({
          url: '/private/v2/order/back/list',
          data: {
            score: 0,
            offset: this.currentIndex - 1
          },
          method: 'post'
        }).then(({ data }) => {
          console.log(data);
          this.total = data.count
          let list = data.list
          list.map(item => {
            let flag = (item.end_time - item.start_time) < 86400000
            let nTime = item.end_time - item.start_time
            item.start_time = dateFilter(item.start_time)
            item.end_time = dateFilter(item.end_time)
            item.time = item.start_time.slice(5) + ' 至 ' + Math.floor(nTime * 24 / 86400000)
            item.amount = item.amount / 100
            item.title = item.title.map(elem => elem.name).join('、')
            /* if(item.taker == null) {
                item.status = '进行中/未选'
                item.style = 'yellow'
            }
            if(item.taker != null) {
                item.status = '进行中/已选'
                item.style = 'green'
                if(flag){
                    item.status = '进行中/将于24小时后确认完成'
                    item.style = 'orange'
                }
            } */
            item.status = '退款中'
            item.style = 'yellow'
            if (item.takers != null) {
              item.takers = item.takers.map(elem => {
                'https://ziekoo.oss-cn-qingdao.aliyuncs.com/' + elem.Avatar
              })
            }
          })
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
        })
      } else if (this.userOrderType == 1) {
        request({
          url: '/private/v2/withdrawal/list',
          data: {
            score: 0,
            limit: 9999
          },
          method: 'post'
        }).then(({ data }) => {
          console.log(data);
          this.total = data.count
          let list = data.list
          list.map(item => {
            //let flag = (item.order.end_time - item.order.start_time) < 86400000
            let flag = this.checkLegal(item.end_time)
            let nTime = item.order.end_time - item.order.start_time
            item.start_time = dateFilter(item.order.start_time)
            item.end_time = dateFilter(item.order.end_time)
            item.time = item.start_time.slice(5) + ' 至 ' + Math.floor(nTime * 24 / 86400000)
            item.amount = item.amount / 100
            item.title = item.order.title.map(elem => elem.name).join('、')
            item.user = item.order.user
            item.city_name = item.order.city_name
            if (item.order.taker == null) {
              item.status = '进行中/未选'
              item.style = 'yellow'
            }
            if (item.order.taker != null) {
              item.status = '进行中/已选'
              item.style = 'green'
              if (!flag) {
                item.status = '进行中/将于24小时后确认完成'
                item.style = 'orange'
              }
            }
            if (item.order.takers != null) {
              item.takers = item.order.takers.map(elem => {
                'https://ziekoo.oss-cn-qingdao.aliyuncs.com/' + elem.Avatar
              })
            }
          })
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
        })
      }
    },
    /**
     * 改变记录条数
     */
    handleSizeChange () {

    },
    /**
     * 选择页面
     */
    handleCurrentChange (val) {
      this.currentIndex = val
      this.getList()
    },
    /**
     * 删除订单
     */
    handleClick (row) {

    },
    /**
     * 同意退单
     */
    agreeClick (row) {
      console.log(row.id);
      console.log('tongyi');

      if (this.userOrderType == 0) {
        console.log('tongyi1');

        request({
          url: '/private/v2/order/cancel/agree',
          data: {
            order_id: row.id
          },
          method: 'post'
        }).then(res => {
          console.log(res);
          const msg = res.error.userMsg
          if (res.error.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(msg);
          }
        })
      } else {
        request({
          url: '/private/v2/withdrawal/agree',
          data: {
            order_id: row.id
          },
          method: 'post'
        }).then(res => {
          console.log(res);
          const msg = res.error.userMsg
          if (res.error.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(msg);
          }
        })
      }

    },
    /**
     * 拒绝退单
     */
    disAgreeClick (row) {
      console.log(row.id);
      if (this.userOrderType == 0) {
        request({
          url: '/private/v2/order/cancel/back',
          data: {
            order_id: row.id
          },
          method: 'post'
        }).then(res => {
          console.log(res);
          const msg = res.error.userMsg
          if (res.error.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(msg);
          }
        })
      } else {
        request({
          url: '/private/v2/withdrawal/refuse',
          data: {
            order_id: row.id
          },
          method: 'post'
        }).then(res => {
          console.log(res);
          const msg = res.error.userMsg
          if (res.error.code === 200) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(msg);
          }
        })
      }

    },
    test () {
      console.log(this.userOrderType);

    },
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

  }
}
</script>

<style scoped>
.footer {
  position: relative;
  top: 10px;
  left: 40px;
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