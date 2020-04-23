import { get,post } from './index.js';//导入axios实例文件中方法

export const getHotword = (param) => {
  return get('/searchWords', param);//获取引导词
}

export const postWord = (param) => {
  return post('/words', param);//发送
}

export const postWordUseful = (param) => {
  return post('/word/useful', param);//已解决
}
export const postWordUnuseful = (param) => {
  return post('/word/unuseful', param);//未解决
}