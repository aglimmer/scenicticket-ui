import axios from 'axios'
// import {getHeader} from 'axios/header'
//配置全局的请求路径
const service = axios.create({
    baseURL:"http://localhost:8080/scenicticket",
    timeout:6000
})

service.interceptors.request.use(
    config=>{
        //const url = config.url;
        // const code  = config.code;
        console.log("headers=",config.headers)
        config.headers = {...config.headers,AUTHORIZATION:"123456"};
        return config;
    },
    error=>{
        console.log("request----error=",error)
        Promise.reject(error)
    }
)

service.interceptors.response.use(
    response=>{
            //如果二进制数据（比如图片）直接返回
            if(response.config.responseType==="blob"){
                if(response.status===200){
                    return response;
                }else{
                    Promise.reject();
                }
            }
            if(response.status===200){
                return response.data;
            }else{
                console.log("response-1---error")
                return Promise.reject()
            }
    },
    error=>{
        console.log("response-1---error=",error)
        return Promise.reject(error)
    }
)
export default service;

