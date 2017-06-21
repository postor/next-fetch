import fetch from 'isomorphic-unfetch'
import Cookies from 'js-cookie'

export default (config = {}) => (url, option, req, res) => {
  const {csrftokenHeaderName = 'csrf-token',csrftokenCookieName = 'csrftoken', cookieHeaderName = 'custom-set-cookie'} = config

  const oldCsrf = Cookies.get(csrftokenCookieName)

  option = option || {}
  option.credentials = 'include',
  option.headers = {
    'Cookie': req ? req.headers.cookie : document.cookie,
    [csrftokenHeaderName]: oldCsrf,
    ...option.headers
  }

  return fetch(url, option)
  .then((r)=>{    
    //cookie
    var setCookie = req?r.headers._headers[cookieHeaderName]:r.headers.get(cookieHeaderName)
    if(req && res){
      //server side 
      setCookie && res.header('set-cookie', setCookie)
    }else{
      //client side
      setCookie && (document.cookie = setCookie)
    }
    
    //csrf
    var csrf = r.headers.get(csrftokenHeaderName)
    if(res){
      //server side, cookie
      csrf && res.cookie(csrftokenCookieName, csrf)
    }else{
      //client side 
      csrf && Cookies.set(csrftokenCookieName, csrf)
    }
    
    return r
  })
}