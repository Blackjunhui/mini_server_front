<template>
    <div class="app-container">
        <div class="tools-div">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('btn.role.add') === false">添加角色</el-button>
            <el-button class="btn-add" size="mini" @click="batchRemove()" :disabled="$hasBP('btn.role.delete') === false">批量删除</el-button>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
                type="selection">
            </el-table-column>
            <el-table-column
                type="index"
                width="50">
            </el-table-column>
            <el-table-column
                prop="name"
                label="角色名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="code"
                label="编码"
                width='180'>
            </el-table-column>
            <el-table-column
                prop="description"
                label="描述">
            </el-table-column>
            <el-table-column label="操作">
                <div slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)" :disabled="$hasBP('btn.role.update') === false"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="removeById(scope.row.id)" :disabled="$hasBP('btn.role.delete') === false"></el-button>
                    <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限" :disabled="$hasBP('btn.role.assignAuth') === false"></el-button>
                </div>
            </el-table-column>
        </el-table>
        <!-- <el-pagination
            @current-change="fetchData"
            :current-page="pageNum"
            :page-sizes="[1,2,3]"
            :page-size="pageSize"
            style="padding: 30px 0; text-align: center;"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination> -->
        <Pagination v-show="total > 0"
            :total="total"
            :page.sync="pageNum"
            :limit.sync="pageSize"
            @pagination="fetchData"
        />
        <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
            <el-form :model="addRoleData">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="addRoleData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" :label-width="formLabelWidth">
                    <el-input v-model="addRoleData.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="addRoleData.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole(addRoleData)">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改角色" :visible.sync="dialogFormVisibleUpdate">
            <el-form :model="updateRoleData">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="updateRoleData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色编码" :label-width="formLabelWidth">
                    <el-input v-model="updateRoleData.code" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" :label-width="formLabelWidth">
                    <el-input v-model="updateRoleData.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
                <el-button type="primary" @click="updateRole(updateRoleData)">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
//引入定义接口的js文件
import role from '@/api/system/role'
import Pagination from '@/components/Pagination/index'

export default {
    components: {
        Pagination
    },
    //定义初始值
    data() {
        return {
            list:[],//角色列表
            total:0,//总记录数
            pageNum:1,//页码
            pageSize:3,//页数
            addRoleData:{},
            updateRoleData:{},
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogFormVisibleUpdate: false,
            selectionValue:[]
        }
        
    },

    //页面渲染之前执行
    created() {
        //调用列表方法
        this.fetchData(1,10)
    },

    methods: {//具体方法部分
        //列表
        fetchData(pageNum,pageSize) {
            //赋值
            this.pageNum = pageNum
            this.pageSize = pageSize

            let page = {
                'pageNum': pageNum,
                'pageSize': pageSize
            }
            //ajax
            role.getPageList(page)
                .then(res =>{
                    this.list = res.data.list
                    this.total = res.data.total
                })
        },
        removeById(id){
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(() => {
                let reqId = {
                    'id':id
                }
                role.removeById(reqId)
                .then(res =>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新页面
                    this.fetchData(1,10)
                })
            })           
        },
        add(){
            this.dialogFormVisible = true
            this.addRoleData = {}
        },
        addRole(addRoleDataReq){
            role.addRole(addRoleDataReq)
            .then(res=>{
                this.dialogFormVisible = false
                //刷新页面
                this.fetchData(1,10)
            })
        },
        update(row){
            this.updateRoleData = row
            this.dialogFormVisibleUpdate = true
        },
        updateRole(updateRoleDataReq){
            role.updateRole(updateRoleDataReq)
            .then(res=>{
                this.dialogFormVisibleUpdate = false
                //刷新页面
                this.fetchData(1,10)
            })
        },
        batchRemove(){
            if(this.selectionValue.length==0) {
                this.$message({
                            type: 'warning',
                            message: '请选择需要删除的数据!'
                        });
                return
            }else{
                this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(() => {
                    var idList = this.selectionValue.map(s =>{
                        return s.id
                    })
                    role.batchDelete(idList)
                    .then(res=>{
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //刷新页面
                        this.fetchData(1,10)
                    })
                })
            }
        },
        handleSelectionChange(selection){
            this.selectionValue = selection
            console.log(this.selectionValue)
        },
        showAssignAuth(row){
            this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.name)
        }
    }

}
</script>