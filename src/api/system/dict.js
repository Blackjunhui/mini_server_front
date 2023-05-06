import request from '@/utils/request'

//常量
const api_name = '/dict/'

export default {
    //获取数据字典分页数据
    getDictInfoPage(params) {
        return request({
            url: `${api_name}`+'getDictInfoPage',
            method: 'post',
            data: params
        })
    },
    //查询数据字典详情
    getDictInfoDetails(params){
        return request({
            url: `${api_name}` + 'getDictDetails/'+params,
            method: 'get'
        })
    },
    //新增数据字典
    addDictInfo(params) {
        return request({
            url: `${api_name}` + 'addDictInfo',
            method: 'post',
            data: params
        })
    },
    //新增数据字典详情
    addDictInfoDetail(params) {
        return request({
            url: `${api_name}` + 'addDictInfoDetail',
            method: 'post',
            data: params
        })
    },
    //修改数据字典
    updateDictInfo(params) {
        return request({
            url: `${api_name}` + 'updateDictInfo',
            method: 'post',
            data: params
        })
    },
    //修改数据字典详情
    updateDictInfoDetail(params) {
        return request({
            url: `${api_name}` + 'updateDictInfoDetail',
            method: 'post',
            data: params
        })
    },
    //删除数据字典
    deleteDictInfo(params) {
        return request({
            url: `${api_name}` + 'deleteDictInfo',
            method: 'post',
            data: params
        })
    },
    //删除数据字典详情
    deleteDictInfoDetail(params) {
        return request({
            url: `${api_name}` + 'deleteDictInfoDetail',
            method: 'post',
            data: params
        })
    }
}