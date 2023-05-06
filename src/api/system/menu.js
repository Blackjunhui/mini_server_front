import request from '@/utils/request'

//常量
const api_name = '/system/sysMenu/'

export default {
    //列表
    getPageList(params) {
        return request({
            url: `${api_name}`+'getListPage',
            method: 'post',
            data: params
        })
    },
    //根据id删除
    removeById(params) {
        return request({
            url: `${api_name}`+'deleteMenuById',
            method: 'post',
            data: params
        })
    },
    //新增菜单
    addMenu(params) {
        return request({
            url: `${api_name}`+'addMenu',
            method: 'post',
            data: params
        })
    },
    //根据id查询
    getMenuById(params){
        return request({
            url: `${api_name}`+'getMenuById/'+`${params}`,
            method: 'get'
        })
    },
    //修改菜单
    updateMenu(params){
        return request({
            url: `${api_name}`+'updateMenu',
            method: 'post',
            data: params
        })
    },
    //批量删除
    // batchDelete(idlIst){
    //     return request({
    //         url: `${api_name}`+'batchDelete',
    //         method: 'post',
    //         data: idlIst
    //     })
    // }
    
    //查询树形列表
    menuTree(){
        return request({
            url: `${api_name}`+'menuTree',
            method: 'get'
        })
    },
    //更改菜单状态
    updateMenuState(params){
        return request({
            url: `${api_name}`+'updateMenuState',
            method: 'post',
            data: params
        })
    },
    //查看角色权限
    toAssign(roleId){
        return request({
            url: `${api_name}`+'getMenuByRoleId/'+`${roleId}`,
            method: 'get'
        })
    },
    //分配权限
    doAssign(params){
        return request({
            url: `${api_name}`+'doAssign',
            method: 'post',
            data: params
        })
    }
}