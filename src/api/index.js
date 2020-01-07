import axios from 'axios';
// 创建axios实例

const service = axios.create({
  timeout: 10000, // 请求超时时间
  // baseURL: process.env.BASE_URL
  baseURL: "http://localhost:9090",//本地运行
  // baseURL: "http://192.168.0.102:9090",    //手机访问  前面为同一无线网ip  后为端口
  // operationURl:
  // headers: {
  //   'Content-Type': 'application/json; charset=utf-8'
  // }
})
// 添加request拦截器
service.interceptors.request.use(config => {
  if (config.method == 'get') {
    config.data = true
  }
  return config
}, error => {
  Promise.reject(error)
})
// 添加respone拦截器
service.interceptors.response.use(
  response => {
    // if (response.data.status !== 0) {
    //   return Promise.reject(response.data)
    // }
    return response;
  },
  error => {
    switch (error.response.status) {
      case 400:
        error.response.message = '错误请求';
        alert(error.response.message);
        break;
      case 401:
        error.response.message = '未授权，请重新登录';
        alert(error.response.message);
        break;
      case 403:
        error.response.message = '拒绝访问';
        alert(error.response.message);
        break;
      case 404:
        error.response.message = '请求错误,未找到该资源';
        alert(error.response.message);
        break;
      default:
        error.response.message = '服务繁忙，请稍后再试';
        alert(error.response.message);
        break;
    }
    return Promise.reject(error.response)
  }
)

// get请求封装
export function get(url, params = {}) {
  // params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
  return service({
    url: url,
    method: 'get',
    params
  })
}

export function post(url, params = {}) {
  //默认配置
  let sendObject = {
    url: url,
    method: "post",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: params
  };
  // sendObject.data = JSON.stringify(params);
  return service(sendObject)
}

export function put(url, params = {}) {
  //默认配置
  let sendObject = {
    url: url,
    method: "put",
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: params
  };
  sendObject.data = JSON.stringify(params);
  return service(sendObject)
}

export function deletes(url,params = {}) {
  return service({
    url: url,
    method: 'delete',
    headers: {},
    data:params
  })
}

export {
  service
}
