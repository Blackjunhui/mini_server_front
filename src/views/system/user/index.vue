<template>
    <div class="app-container">
        <div class="tools-div">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('btn.user.add') === false">添加用户</el-button>
            <el-button class="btn-add" size="mini" :disabled="$hasBP('btn.user.delete') === false" @click="batchRemove()">批量删除</el-button>
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
                prop="username"
                label="用户名"
                width="180">
            </el-table-column>
            <el-table-column label="操作">
                <div slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)" :disabled="$hasBP('btn.user.update') === false"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="removeById(scope.row.id)" :disabled="$hasBP('btn.user.delete') === false"></el-button>
                    <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色" :disabled="$hasBP('btn.user.doAccessRole') === false"></el-button>
                </div>
            </el-table-column>
        </el-table>
        <Pagination v-show="total > 0"
            :total="total"
            :page.sync="pageNum"
            :limit.sync="pageSize"
            @pagination="fetchData"
        />
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
            <el-form :model="addUserData">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="addUserData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" :label-width="formLabelWidth" disabled>
                    <el-input v-model="addUserData.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser(addUserData)">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改用户" :visible.sync="dialogFormVisibleUpdate">
            <el-form :model="updateUserData">
                <el-form-item label="用户名称" :label-width="formLabelWidth">
                    <el-input v-model="updateUserData.username" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
                <el-button type="primary" @click="updateUser(updateUserData)">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
            <el-form label-width="80px">
                <el-form-item label="用户名">
                <el-input disabled :value="users.username"></el-input>
                </el-form-item>
                <el-form-item label="角色列表">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" 
                    @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
                        <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogRoleVisible = false">取消</el-button>
                <el-button type="primary" @click="assignRole" size="small">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
//引入定义接口的js文件
import user from '@/api/system/user'
import role from '@/api/system/role'
import Pagination from '@/components/Pagination/index'
import Dict from '@/api/system/dict'

export default {
    //定义初始值
    data() {
        return {
            list:[],//角色列表
            total:0,//总记录数
            pageNum:1,//页码
            pageSize:3,//页数
            addUserData:{},
            updateUserData:{},
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogFormVisibleUpdate: false,
            selectionValue:[],
            users:{},
            dictUserTypes:[],

            dialogRoleVisible: false,
            allRoles: [],
            userRoleIds:[],
            isIndeterminate: false,
            checkAll: false
        }
        
    },
    components: {
        Pagination
    },

    //页面渲染之前执行
    created() {
        //调用列表方法
        this.fetchData(1,10)
        // this.getDictInfoDetails()
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
            user.getPage(page)
                .then(res =>{
                    this.list = res.data.list
                    this.total = res.data.total
                })
        },
        removeById(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(() => {
                let reqId = {
                    'id':id
                }
                user.deleteUserById(reqId)
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
            this.addUserData = {password:'123456'}
        },
        addUser(addUserDataReq){
            user.addUser(addUserDataReq)
            .then(res=>{
                this.dialogFormVisible = false
                //刷新页面
                this.fetchData(1,10)
            })
        },
        update(row){
            this.updateUserData = row
            this.dialogFormVisibleUpdate = true
        },
        updateUser(updateUserDataReq){
            user.updateUser(updateUserDataReq)
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
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(() => {
                    var idList = this.selectionValue.map(s =>{
                        return s.id
                    })
                    user.batchDelete(idList)
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
        //展示分配角色
        showAssignRole(row){
            this.users = row
            this.dialogRoleVisible =true
            role.getRolesByUserId(row.id).then(res=>{
                this.allRoles = res.data.roles
                this.userRoleIds = res.data.userRoleIds
                this.checkAll = this.userRoleIds.length===this.allRoles.length
                this.isIndeterminate = this.userRoleIds.length>0 &&
                this.userRoleIds.length<this.allRoles.length
            })
        },
        /**
         * 全部勾选状态发生改变的监听
         */
        handleCheckAllChange(value) {//value当前勾选状态true/false
            //如果当前全选，userRoleIds就是所有角色id的数组，否则是空数组
            this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
            //如果当前不是全选也不全不选时，指定为false
            this.isIndeterminate = false
        },
        /**
         * 角色列表选中项发生改变的监听
         */
        handleCheckedChange(value){
            const {userRoleIds,allRoles} = this
            this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
            this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
        },
        //分配角色
        assignRole(){
            let assignRoleVO = {
                userId: this.users.id,
                roleIds: this.userRoleIds
            }
            role.doAssign(assignRoleVO).then(res=>{
                this.$message.success(res.message || '分配角色成功')
                this.dialogRoleVisible = false
                this.fetchData(1,10)
            })
        },
        getDictInfoDetails(){
            const code = "user_type"
            Dict.getDictInfoDetails(code).then(res => {
                this.dictUserTypes = res.data
                console.log(this.dictUserTypes)
            })
        }
    }

}
</script>