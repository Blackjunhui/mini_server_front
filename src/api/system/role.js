import request from '@/utils/request'

//常量
const api_name = '/system/sysRole/'

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
            url: `${api_name}`+'deleteRoleById',
            method: 'post',
            data: params
        })
    },
    //新增角色
    addRole(params) {
        return request({
            url: `${api_name}`+'addRole',
            method: 'post',
            data: params
        })
    },
    //根据id查询
    getRoleById(params){
        return request({
            url: `${api_name}`+'getRoleById/'+`${params}`,
            method: 'get'
        })
    },
    //修改角色
    updateRole(params){
        return request({
            url: `${api_name}`+'updateRole',
            method: 'post',
            data: params
        })
    },
    //批量删除
    batchDelete(idlIst){
        return request({
            url: `${api_name}`+'batchDelete',
            method: 'post',
            data: idlIst
        })
    },
    //获取用户角色
    getRolesByUserId(params){
        return request({
            url: `${api_name}`+'getRolesByUserId/'+`${params}`,
            method: 'get'
        })
    },
    //用户添加角色
    doAssign(params){
        return request({
            url: `${api_name}`+'doAssign',
            method: 'post',
            data: params
        })
    }
}