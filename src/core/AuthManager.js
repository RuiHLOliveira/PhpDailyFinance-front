export default {
  eraseTokens(){
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refreshToken');
  },
  storeToken (token) {
    window.localStorage.setItem('token',token);
  },
  storeRefreshToken (refreshToken) {
    window.localStorage.setItem('refreshToken',refreshToken);
  },
  getRefreshToken() {
    return window.localStorage.getItem('refreshToken');
  },
  getToken(){
    return window.localStorage.getItem('token');
  },
  getHeader(){
    if(!this.isLoggedIn()){
      throw 'User not Logged In'
    }
    let token = this.getToken()
    return new Headers({'Authorization': token});
  },
  isLoggedIn(){
    console.log(this.getToken());
    return this.getToken() != null
  }
}
