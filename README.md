# next-fetch

fetch for next.js

- cookie push through for both server side and client side
- csrf push through for both server side and client side

## usage

use fetch as unfetch, refer https://github.com/developit/unfetch, notice the `req` and `res` from next.js context

```
const getFetch = require('next-fetch')
const fetch = getFetch()

Page.getInitialProps = ({req,res})=>{
    return fetch('http://xxx/currentuser', {}, req, res)
    .then(r=>r.json())
    .then((user)=>{
        return {about:{user, cookieDate: Cookies.get('date')}}
    })
}

```

getFetch function can take a config argument, by default:
```
{
  csrftokenHeaderName: 'csrf-token', //header name for csrf token
  csrftokenCookieName: 'csrftoken',  //cookie name for csrf token
  cookieHeaderName: 'custom-set-cookie' //set-cookie header can not read by js, so you have to copy set-cookie header to another key
}
```

how to copy set-cookie header to custom-set-cookie
```
// in express
app.post('/auth', csrfProtection, csrfSetHeader, (req, res) => {
  if(req.body && req.body.username === user.username && req.body.passwd === user.passwd){
    res.cookie('user',JSON.stringify(user))

    //-------------------------here-----------------------------
    res.header('custom-set-cookie',res.getHeader('set-cookie'))
    //---------------------------------------------------------- 

    res.json(user)
  }else{
    res.json({error: 'wrong pass or no such account',body:req.body})
  }
})

```