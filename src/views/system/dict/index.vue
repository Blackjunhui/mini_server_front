<template>
  <div class="app-container">
    <div class="tools-div">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="add">添加字典</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      row-key="id"
      :expand-row-keys="expands"
      @expand-change="expandChange">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table
              :data="childrenList"
              style="width: 100%">
              <el-table-column
                prop="name"
                label="字典详情名"
                width="180">
              </el-table-column>
              <el-table-column
                prop="dictKey"
                label="key"
                width="180">
              </el-table-column>
              <el-table-column
                prop="dictValue"
                label="value">
              </el-table-column>
              <el-table-column label="操作">
                <div slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" circle @click="updateDetail(scope.row)"></el-button>
                  <el-button type="danger" icon="el-icon-delete" circle @click="removeDetailById(scope.row)"></el-button>
                </div>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
      <el-table-column
        label="字典编号"
        prop="code">
      </el-table-column>
      <el-table-column
        label="字典名称"
        prop="name">
      </el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope">
          <el-button type="success" icon="el-icon-plus" size="mini" @click="addDetail(scope.row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="removeById(scope.row.id)"></el-button>
        </div>
      </el-table-column>
    </el-table>
    <Pagination v-show="total > 0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="fetchData"
    />
    <el-dialog title="添加数据字典" :visible.sync="dialogFormVisible">
      <el-form :model="addDictData">
        <el-form-item label="字典名称" :label-width="formLabelWidth">
          <el-input v-model="addDictData.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="字典编号" :label-width="formLabelWidth">
              <el-input v-model="addDictData.code" autocomplete="off"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDict(addDictData)">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加数据字典详情" :visible.sync="dialogFormDetailVisible">
      <el-form :model="addDictDetailData">
        <el-form-item label="字典编号" :label-width="formLabelWidth">
          <el-input v-model="addDictDetailData.dictInfoCode" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="字典详情名" :label-width="formLabelWidth">
              <el-input v-model="addDictDetailData.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="键" :label-width="formLabelWidth">
              <el-input v-model="addDictDetailData.dictKey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="值" :label-width="formLabelWidth">
              <el-input v-model="addDictDetailData.dictValue" autocomplete="off"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormDetailVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDictDetail(addDictDetailData)">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改数据字典" :visible.sync="dialogFormVisibleUpdate">
      <el-form :model="updateDictData">
        <el-form-item label="字典名称" :label-width="formLabelWidth">
          <el-input v-model="updateDictData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典编号" :label-width="formLabelWidth">
          <el-input v-model="updateDictData.code" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateDict(updateDictData)">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改数据字典详情" :visible.sync="dialogFormDetailVisibleUpdate">
      <el-form :model="updateDictDetailData">
        <el-form-item label="字典编号" :label-width="formLabelWidth">
          <el-input v-model="updateDictDetailData.dictInfoCode" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="字典详情名" :label-width="formLabelWidth">
              <el-input v-model="updateDictDetailData.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="键" :label-width="formLabelWidth">
              <el-input v-model="updateDictDetailData.dictKey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="值" :label-width="formLabelWidth">
              <el-input v-model="updateDictDetailData.dictValue" autocomplete="off"></el-input>
            </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormDetailVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateDictDetail(updateDictDetailData)">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Dict from '@/api/system/dict'
import Pagination from '@/components/Pagination/index'

export default {
  components: {
    Pagination
  },
  data(){
    return {
      list:[],
      total:0,//总记录数
      pageNum:1,//页码
      pageSize:3,//页数
      childrenList:[],
      addDictData:{},
      addDictDetailData:{},
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogFormDetailVisible: false,
      formLabelWidth: '120px',
      dialogFormVisibleUpdate: false,
      dialogFormDetailVisibleUpdate: false,
      updateDictData: {},
      updateDictDetailData: {},

      // 获取row的key值
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
    }
  },
  created() {
    this.fetchData(1,10)
  },
  methods: {
    fetchData(pageNum,pageSize){
      //赋值
      this.pageNum = pageNum
      this.pageSize = pageSize

      let page = {
        'pageNum': pageNum,
        'pageSize': pageSize
      }
      //ajax
      Dict.getDictInfoPage(page).then(res =>{
        this.list = res.data.list
        this.total = res.data.total
      })
    },
    //获取详情数据
    expandChange(row, expandedRows){
      let that=this
			//只展开一行
			if (expandedRows.length) {//说明展开了
        this.childrenList = []
        that.expands = []
        if (row) {
          this.getDictInfoDetails(row.code)
          that.expands.push(row.id)//只展开当前行id
        }
      } else {//说明收起了
        that.expands = []
      }
    },
    //新增字典
    add(){
      this.dialogFormVisible = true
      this.addDictData = {}
    },
    addDict(addDictData){
      var reqVO = addDictData
      Dict.addDictInfo(reqVO).then(res =>{
        this.dialogFormVisible = false
          //刷新页面
          this.fetchData(1,10)
          this.$message.success('新增成功')
      })
    },
    //新增字典详情
    addDetail(row){
      this.dialogFormDetailVisible = true
      this.addDictDetailData = {
        dictInfoCode: row.code
      }
    },
    addDictDetail(addDictDetailData){
      var reqVO = addDictDetailData
      Dict.addDictInfoDetail(reqVO).then(res => {
        this.dialogFormDetailVisible = false
        //刷新页面
        this.getDictInfoDetails(addDictDetailData.dictInfoCode)
        this.$message.success('新增成功')
      })
    },
    //查询详情
    getDictInfoDetails(code){
      Dict.getDictInfoDetails(code).then(res =>{
        this.childrenList = res.data
      })
    },
    //修改字典
    update(row){
      this.updateDictData = row
      this.dialogFormVisibleUpdate = true
    },
    updateDict(updateDictData){
      var reqVO = updateDictData
      Dict.updateDictInfo(reqVO).then(res => {
        this.dialogFormVisibleUpdate = false
        this.fetchData(1,10)
        this.$message.success('修改成功')
      })
    },
    //修改字典详情
    updateDetail(row){
      this.updateDictDetailData = row
      this.dialogFormDetailVisibleUpdate = true
    },
    updateDictDetail(updateDictDetailData){
      var reqVO = updateDictDetailData
      Dict.updateDictInfoDetail(reqVO).then(res => {
        this.dialogFormDetailVisibleUpdate = false
        this.getDictInfoDetails(updateDictDetailData.dictInfoCode)
        this.$message.success('修改成功')
      })
    },
    //删除字典
    removeById(id){
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        ype: 'warning'
      }).then(() => {
          let reqVO = {
            'id':id
          }
          Dict.deleteDictInfo(reqVO).then(res =>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //刷新页面
          this.fetchData(1,10)
        })
      })           
    },
    removeDetailById(row){
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        ype: 'warning'
      }).then(() => {
          let reqVO = {
            'id':row.id
          }
          Dict.deleteDictInfoDetail(reqVO).then(res =>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          //刷新页面
          this.getDictInfoDetails(row.dictInfoCode)
        })
      }) 
    }
  }
}
</script>

<style>

</style>