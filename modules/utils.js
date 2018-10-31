function checkCookie(req,cookieName){
    const userCookie = req.cookies[cookieName]
    if(userCookie)
    {
      //!WILL NEED TO CONNECT TO DB IF DELETE ACCOUNT POSSIBLE
      return userCookie.split('::')
    }
    return [null,null]
}

exports.checkCookie = (req,cookieName) => checkCookie(req,cookieName)