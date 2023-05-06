<template>
    <div class="app-container">
        <div style="padding: 20px 20px 0 20px;">
            授权角色：{{$route.query.roleName}}
        </div>
        <el-tree :data="menuList" 
            style="margin: 20px 0" 
            ref="tree" 
            node-key="id" 
            show-checkbox 
            default-expand-all 
            :props="defaultProps"/>
            <div style="padding: 20px 20px;">
                <el-button type="primary" :loading="loading" icon="el-icon-check" size="mini" @click="save">保存</el-button>
                <el-button @click="$router.push('/system/role')" size="mini" icon="el-icon-refresh-right">返回</el-button>
            </div>
        </div>
</template>

<script>
import menu from '@/api/system/menu'
export default {
    name: 'roleAuth',
    data(){
        return {
            loading: false, //用来标识是否正在保存请求中的标识，防止重复提交
            menuList: [], //所有菜单
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    created(){
        this.fetchData()
    },
    methods: {
        /**
         * 初始化
         */
        fetchData(){
            const roleId = this.$route.query.id
            menu.toAssign(roleId).then(res => {
                const menuList = res.data
                this.menuList = menuList
                const checkedIds = this.getCheckedIds(menuList)
                console.log('getPermission() checkIds', checkedIds)
                this.$refs.tree.setCheckedKeys(checkedIds)
            })
        },
        /**
         * 得到所有选中的id列表
         */
        getCheckedIds(auths, initArr = []){
            return auths.reduce((pre,item) => {
                if(item.isSelect && item.children.length === 0){
                    pre.push(item.id)
                }else if(item.children){
                    this.getCheckedIds(item.children,initArr)
                }
                return pre
            }, initArr)
        },
        /**
         * 保存权限列表
         */
        save() {
            //获取当前子节点
            // const allCheckedNodes = this.$refs.tree.getCheckedNodes(true)
            //获取到当前子节点及父节点
            const allCheckedNodes = this.$refs.tree.getCheckedNodes(false)
            console.log(allCheckedNodes)
            let idList = allCheckedNodes.map(node => node.id)
            console.log(idList)
            let reqVO = {
                roleId: this.$route.query.id,
                menuIds: idList
            }
            this.loading = true
            menu.doAssign(reqVO).then(res => {
                this.loading = false
                this.$message({
                    type: 'success',
                    message: '分配权限成功'
                })
                this.$router.push('/system/role')
            })
        }
    }
}
</script>