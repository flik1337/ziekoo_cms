<template>
	<div>

		<div class="search">
			<el-input v-model="condition" placeholder="请输入手机尾号或城市名称" clearable @clear="handleSearchReset"></el-input>
			<el-button type="primary" icon="el-icon-search" @click="handleSearchTaker">搜索</el-button>
			<el-button type="primary"  @click="handleSearchReset">重置</el-button>
		</div>

		<el-card>

			<!-- 表格 -->
			<el-table :data="list" stripe height="70vh" style="width: 100%">
				<el-table-column prop="createdAt" label="申请时间"></el-table-column>
				<el-table-column prop="sex" label="性别"></el-table-column>
				<el-table-column prop="birthday" label="生日"></el-table-column>
				<el-table-column prop="height" label="身高"></el-table-column>
				<el-table-column prop="bodyWeight" label="体重"></el-table-column>
				<el-table-column prop="jobs" label="职业"></el-table-column>
				<el-table-column prop="city_name" label="城市"></el-table-column>
				<el-table-column prop="desc" label="个人简介" width="200">
					<template slot-scope="{row: {desc}}">
						<el-tooltip class="item" effect="dark" :content="desc" placement="top">
							<span class="desc">{{desc}}</span>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column prop="address" label="照片">
					<template slot-scope="scope">
						<div class="picture">
							<el-image style="width: 70px; height: 70px" :src="scope.row.images.url" :preview-src-list="scope.row.images.srcList">
							</el-image>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="phone" label="手机号" width="120"></el-table-column>
				<el-table-column prop="address" label="操作" width="100px">
					<template slot-scope="scope">
						<div v-if="userOrderType < 3">
							<el-button @click="handleClick(scope.row)" type="text" size="small">注销接单师</el-button>
						</div>
						<div v-if="userOrderType >= 3">
							<el-button @click="agreeClick(scope.row)" type="text" size="small">同意</el-button>
							<el-button @click="disAgreeClick(scope.row)" type="text" size="small">拒绝</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<!--/表格  -->

			<!-- 分页栏 -->
			<el-row v-show="showPagination" class="footer" type="flex" justify="start" align="middle">
				<el-col :offset="7" :span="11" class="pagination">
					<!-- <pagination class="page" :totalCount="totalCount"  :pageSize="pageSize" :tableData="tableData"         
    @tables="getTables" /> -->
					<el-pagination @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next"
					 :total="total">
					</el-pagination>
				</el-col>
				<el-col :push="2" class="export">
					<el-button type="primary" @click="handleExportTaker" size="mini">导出全部接单师</el-button>
				</el-col>
			</el-row>
			<!-- /分页栏 -->
		</el-card>
		<el-dialog title="提示" :visible.sync="showDownLoadDialog" width="30%">
			<span><a :href="excelUrl">{{excelUrl}}</a></span>
		</el-dialog>
	</div>
</template>

<script>
	import {
		request
	} from 'network/request'
	import Pagination from '@/components/pagination/Pagination'
	export default {
		name: "ReceiverManage",
		components: {
			Pagination
		},
		data() {
			return {
				list: [],
				currentIndex: 1,
				total: 20,
				totalCount: 0, // totalCount 这是传递给 分页组件的 total 从而显示多少页数
				pageSize: 20, // 这是每页表格最多显示多少条
				tableView: [], //这个是给表格显示的数据
				tableData: [], //这是接口返回的所有数据
				defaultData: false, //例如用户在第5页，增加后请求数据肯定子啊第1页面那么需要重置组件
				excelUrl: '',
				showDownLoadDialog: false,
				showPagination : true,
				condition: '',
				
			}
		},
		computed: {
			userOrderType() {
				return this.$store.state.userOrderType
			}
		},
		created() {
			this.getList()
			console.log(this.userOrderType);

		},
		watch: {
			userOrderType: 'getList'
		},
		
		methods: {
			isChn(str) {
				
				let reg=/^[\u4e00-\u9fa5]+$/i;
				if (!reg.test(str)) {
					return false;
				} else {
					// 全是中文
					return true;
				}
			},
			isNum(str) {
				let reg = /^[0-9]*$/i;
				if (!reg.test(str)) {
					return false;
				} else {
					return true;
				}
			},
			handleSearchTaker () {
				if(!this.condition){
					this.$message.error('不能为空！')
					return
				}
				let params = {
					phone : '',
					cityName :'',
					status : this.userOrderType < 3 ? 1 : 0
				}
				if(this.isNum(this.condition)){
					// 全是数字
					console.log('num')
					params.phone = this.condition
				}else if (this.isChn(this.condition)){
					console.log('ch')
					params.cityName = this.condition
					
				}else{
					this.$message.error('请输入全数字或全中文！')
					console.log('wrong')
				}
				request({
					url: '/private/v2/taker/condition',
					data: params,
					method: 'post'
				}).then((res) => {
					console.log(res);
					
					// console.log(data);
					this.total = res.data.count
					let list = res.data.list
					list.map(item => {
						item.jobs = item.jobs.map(elem => elem).join('、')
					})
					this.list = list
					this.showPagination = false
				})
			},
			handleSearchReset () {
				this.condition = ''
				this.getList()
				this.showPagination = true
			},
			/**
			 * 获取列表
			 */
			getList() {
				console.log(this.userOrderType);

				if (this.userOrderType == 0 || this.userOrderType == 1 || this.userOrderType == 2) {
					request({
						url: '/private/takerAdmin/list',
						data: {
							score: 0,
							offset: this.currentIndex - 1,
							type: parseInt(this.userOrderType)
						},
						method: 'post'
					}).then(({
						data
					}) => {
						console.log(data);
						this.total = data.count
						let list = data.list
						list.map(item => {
							item.jobs = item.jobs.map(elem => elem).join('、')
						})
						this.list = list
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
					})
				} else {
					request({
						url: '/private/v2/taker/check/list',
						data: {
							score: 0,
							offset: this.currentIndex - 1,
							limit: 20

						},
						method: 'post'
					}).then((res) => {
						console.log(res);

						// console.log(data);
						this.total = res.data.count
						let list = res.data.list
						list.map(item => {
							item.jobs = item.jobs.map(elem => elem).join('、')
						})
						this.list = list
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

					})
				}
			},
			/**
			 * 改变记录条数
			 */
			handleSizeChange() {

			},
			/**
			 * 选择页面
			 */
			handleCurrentChange(val) {
				this.currentIndex = val
				this.getList()
			},
			/**
			 * 注销接单师
			 */
			handleClick(row) {
				console.log(row);
				request({
					url: '/private/takerAdmin/refuse',
					method: 'post',
					data: {
						id: row.id
					}
				}).then(res => {
					console.log(res);
					const msg = res.error.userMsg
					if (res.error.code === 200) {
						this.$message.success('操作成功！')
						this.getList()
					} else {
						this.$message.error(msg)
					}
				})
			},
			/**
			 * 同意成为接单师
			 */
			agreeClick(row) {
				console.log(row);
				request({
					url: '/private/takerAdmin/agree',
					method: 'post',
					data: {
						id: row.id
					}
				}).then(res => {
					console.log(res);
					const msg = res.error.userMsg
					if (res.error.code === 200) {
						this.$message.success('操作成功！')
						this.getList()
					} else {
						this.$message.error(msg)
					}
				})
			},
			/**
			 * 拒绝成为接单师
			 */
			disAgreeClick(row) {
				console.log(row);
				request({
					url: '/private/takerAdmin/refuse',
					method: 'post',
					data: {
						id: row.id
					}
				}).then(res => {
					console.log(res);
					const msg = res.error.userMsg
					if (res.error.code === 200) {
						this.$message.success('操作成功！')
						this.getList()
					} else(
						this.$message.error(msg)
					)
				})
			},
			getTables(table) {
				this.tableView = table
			},
			handleExportTaker() {
				request({
					url: '/private/v2/taker/export',
					method: 'post',

				}).then(res => {
					if (res.error.code == 200) {
						this.excelUrl = res.data.url
					}
					this.showDownLoadDialog = true
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
		left: 40px;
	}

	.desc {
		/* overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap; */
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.search {

		margin: 10px 40px;
		display: flex;
		width: 400px;
	}
</style>
