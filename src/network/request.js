import Axios from 'axios'
import store from '@/store'

export function request(config) {
    // 1.创建axios实例
    const instance = Axios.create({
        baseURL: 'https://api.ziekoo.cn',
        timeout: 5000
    })
    // 2.axios 拦截器
    // 请求拦截
    instance.interceptors.request.use(config => {
        
        return config
        
    }, err => {
        console.log(err);
        console.log('请求拦截错误');
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        console.log(err);
        console.log('响应拦截错误');
    })
    return instance(config)
}