import request from '@/utils/request'

//常量
const api_name = '/system/sysUser/'

export default {
    getPage(page){
        return request({
            url: `${api_name}` + 'getListPage',
            method: 'post',
            data: page
        })
    },
    getUserById(id){
        return request({
            url: `${api_name}` + 'getUserById/'+id,
            method: 'get'
        })
    },
    addUser(user){
        return request({
            url: `${api_name}` + 'addUser',
            method: 'post',
            data: user
        })
    },
    updateUser(user){
        return request({
            url: `${api_name}` + 'updateUser',
            method: 'post',
            data: user
        })
    },
    deleteUserById(id){
        return request({
            url: `${api_name}` + 'deleteUserById',
            method: 'post',
            data: id
        })
    },
    batchDelete(ids){
        return request({
            url: `${api_name}` + 'batchDelete',
            method: 'post',
            data: ids
        })
    }
}