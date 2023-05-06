<template>
    <div class="app-container">
        <div class="tools-div">
            <el-button type="success" icon="el-icon-plus" size="mini" @click="add(null)" :disabled="$hasBP('btn.menu.add') === false">添加</el-button>
        </div>
        <el-table
            :data="list"
            style="width: 100%"
            row-key="id"
            border
            
            :tree-props="{children: 'children'}">
            <el-table-column
                prop="name"
                label="菜单名称"
                width="180">
            </el-table-column>
            <el-table-column
                prop="path"
                label="路由地址">
            </el-table-column>
            <el-table-column
                prop="component"
                label="组件路径">
            </el-table-column>
            <el-table-column
                prop="perms"
                label="权限标识">
            </el-table-column>
            <el-table-column
                prop="icon"
                label="图标">
            </el-table-column>
            <el-table-column
                prop="sortValue"
                label="排序">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status===1" @change="switchStatus(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <div slot-scope="scope">
                    <el-button type="success" icon="el-icon-plus" v-if="scope.row.type !== 2" size="mini" @click="add(scope.row)" :disabled="$hasBP('btn.menu.add') === false"></el-button>
                    <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)" :disabled="$hasBP('btn.menu.update') === false"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="removeById(scope.row.id)" :disabled="$hasBP('btn.menu.delete') === false"></el-button>
                </div>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="addMenuData">
                <el-form-item label="上级部门" v-if="addMenuData.id===''" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.parentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="addMenuData.type" :disabled="typeDisabled">
                        <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
                        <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
                        <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路由地址" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.path" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件路径" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.component" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.perms" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" :label-width="formLabelWidth">
                    <el-select v-model="addMenuData.icon" clearable>
                      <el-option v-for="item in iconList" :label="item.class" :key="item.class" :value="item.class">
                        <span style="float: left;">
                            <i :class="item.class"></i>
                        </span>
                        <span style="padding-left: 6px;">{{item.class}}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input v-model="addMenuData.sortValue" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMenu(addMenuData)">保存</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisibleUpdate">
            <el-form :model="updateMenuData">
                <el-form-item label="上级部门" v-if="updateMenuData.id===''" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.parentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型" :label-width="formLabelWidth">
                    <el-radio-group v-model="updateMenuData.type" :disabled="typeDisabled">
                        <el-radio :label="0" :disabled="type0Disabled">目录</el-radio>
                        <el-radio :label="1" :disabled="type1Disabled">菜单</el-radio>
                        <el-radio :label="2" :disabled="type2Disabled">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路由地址" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.path" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件路径" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.component" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限标识" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.perms" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon" v-if="updateMenuData.type !==2" :label-width="formLabelWidth">
                    <el-select v-model="updateMenuData.icon" clearable>
                      <el-option v-for="item in iconList" :label="item.class" :key="item.class" :value="item.class">
                        <span style="float: left;">
                            <i :class="item.class"></i>
                        </span>
                        <span style="padding-left: 6px;">{{item.class}}</span>
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" :label-width="formLabelWidth">
                    <el-input v-model="updateMenuData.sortValue" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
                <el-button type="primary" @click="updateMenu(updateMenuData)">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
//引入定义接口的js文件
import menu from '@/api/system/menu'
const defaultForm = {
    id: '',
    parentId: '',
    name: '',
    type: '',
    path: '',
    component: '',
    perms: '',
    icon: '',
    sortValue: 1,
    status: 1
}

export default {
    //定义初始值
    data() {
        return {
            list:[],//菜单列表
            expandKeys: [],  //需要自动展开的项

            typeDisabled: false,
            type0Disabled: false,
            type1Disabled: false,
            type2Disabled: false,
            dialogTitle: '',

            iconList: [
                {
                    class: "el-icon-s-tools"
                },
                {
                    class: "el-icon-s-custom"
                },
                {
                    class: "el-icon-setting"
                },
                {
                    class: "el-icon-user-solid"
                },
                {
                    class: "el-icon-house"
                },
                {
                    class: "el-icon-menu"
                }
            ],

            addMenuData:defaultForm,
            updateMenuData:defaultForm,
            dialogTableVisible: false,
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogFormVisibleUpdate: false
        }
        
    },

    //页面渲染之前执行
    created() {
        //调用列表方法
        this.fetchData()
    },

    methods: {//具体方法部分
        //列表
        fetchData() {
            
            //ajax
            menu.menuTree()
                .then(res =>{
                    this.list = res.data
                })
        },
        removeById(id){
            this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(() => {
                let reqId = {
                    'id':id
                }
                menu.removeById(reqId)
                .then(res =>{
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    //刷新页面
                    this.fetchData()
                })
            })           
        },
        add(row){
            this.typeDisabled = false
            this.dialogTitle = '添加下级节点'
            this.dialogFormVisible = true
            this.addMenuData = Object.assign({},defaultForm)
            this.addMenuData.id = ''
            if(row){
                this.addMenuData.parentId = row.id
                this.addMenuData.parentName = row.name

                if(row.type === 0){
                    this.addMenuData.type = 1
                    this.typeDisabled = false
                    this.type0Disabled = false
                    this.type1Disabled = false
                    this.type2Disabled = true
                }else if(row.type === 1){
                    this.addMenuData.type = 2
                    this.typeDisabled = true
                }
            }else{
                this.dialogTitle = '添加目录节点'
                this.addMenuData.type = 0
                this.addMenuData.component = 'Layout'
                this.addMenuData.parentId = 0
                this.typeDisabled = true
            }
        },
        addMenu(addMenuDataReq){
            menu.addMenu(addMenuDataReq)
            .then(res=>{
                this.dialogFormVisible = false
                //刷新页面
                this.fetchData()
            })
        },
        update(row){
            this.dialogTitle = '修改菜单'
            this.updateMenuData = Object.assign({},row)
            this.dialogFormVisibleUpdate = true
            this.typeDisabled = true
        },
        updateMenu(updateMenuDataReq){
            menu.updateMenu(updateMenuDataReq)
            .then(res=>{
                this.dialogFormVisibleUpdate = false
                //刷新页面
                this.fetchData()
            })
        },
        switchStatus(row){
            let req = {
                "id": row.id,
                "state": row.status===1?0:1
            }
            menu.updateMenuState(req).then(res=>{
                //刷新页面
                    this.fetchData()
            })
        }
    }

}
</script>