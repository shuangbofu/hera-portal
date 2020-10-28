import axios from 'axios'
import { message } from 'ant-design-vue'

const service = axios.create({
    baseURL: '/',
    timeout: 30000
})

service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        // 下载
        if (response.config.url.indexOf('/download') !== -1) {
            let filename = response.headers['content-disposition'].split('; ')[1].replace('filename=', '')
            let blob = new Blob([response.data]);
            return { blob, filename }
        }

        const res = response.data
        if (!response.status === 200) {
            message.error(res.message || 'Error')
            return null;
        } else {
            if (response.config.responseType === 'blob') {
                return response.data
            }
            if (!res.success) {
                message.error(res.message)
                return Promise.reject(res.message)
            } else {
                return res.data
            }
        }
    },
    error => {
        console.log('err' + error) // for debug
        let msg = error.message
        if ((error + '').indexOf('500') !== -1) {
            msg = '服务异常'
        } else if ((error + '').indexOf('501') !== -1) {
            msg = '502 BAD GATEWAY!'
        } else if ((error + '').indexOf('502') !== -1) {
            msg = '正在部署升级中，请稍等……'
        }
        message.error(msg)
        return Promise.reject(error)
    }
)

export default service
