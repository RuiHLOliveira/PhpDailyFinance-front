import config from "./config.js";
import AuthManager from "./AuthManager.js"
export default {

    processRequestBodyConsideringContentType(params){

        let data = null;
        if(params.forceDefaultContentType !== true) {
            console.log('json mode');
            data = JSON.stringify(params.data) //converte para json
            params.headers.append('Content-Type','application/json');
        } else {
            console.log('form mode');
            data = params.data
        }
        return data;
    },

    fetch(params){

        params.method = params.method !== undefined ? params.method : 'GET' //default
        params.headers = params.headers != null ? params.headers : new Headers;

        if(params.notAuthenticated !== true) {
            params.headers.append("Authorization", AuthManager.getToken()); //set authorization
        }

        //content headers
        params.headers.append('Accept','application/json');

        let data = this.processRequestBodyConsideringContentType(params);

        return new Promise((resolve, reject) => {
            try {
                console.log(data);
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data,
                }).then( (response) => {
                    //error but authorized
                    if(!response.ok && response.status != 401) {
                        console.log('[Warning] [Error non-401]')
                        console.log(response);
                        response.text().then((text) => {
                            console.log('[Log] [decoded text]', text)
                            try {
                                let json = JSON.parse(text);
                                let message = json.hasOwnProperty('message') ? json.message : json;
                                reject('[Warning] [' + message  + "]")
                            } catch (error) {
                                console.error('[Warning] [catch json.parse]', error)
                                reject(text)
                            }
                        })
                        .catch((error) => {
                            console.error('[Warning] [catch response.text]', error)
                            reject(error)
                        })
                        return;
                    }

                    //converts json
                    response.json().then((json) => {
                        
                        //REQUEST SUCCESS
                        if(response.ok) {
                            resolve([response,json]);
                        } else {
                            //TRY TOKEN REFRESH
                            if(response.status == 401){
                                this.refreshToken(resolve,reject).then((responseData) => {
                                    //TOKEN REFRESH SUCCESS, REPEAT REQUEST
                                    this.requestRepeat(params)
                                    .then(([response,json]) => {
                                        resolve([response,json]);
                                    })
                                    .catch((error) => {
                                        console.error('[Warning] [invalid refresh token (1)]', error)
                                        reject(error);
                                    });
                                }).catch((error) => {
                                    //TOKEN REFRESH ERROR, QUIT
                                    // console.log(error);
                                    console.error('[Warning] [invalid refresh token (2)]', error)
                                    reject(error);
                                });
                            } else {
                                //ELSE, THATS A REQUEST ERROR
                                reject('[Warning] [' +  json.message ? json.message : json.detail ? json.detail : "an error ocurred" + "]")
                            }
                        }
                    })
                })
                .catch ((error) => {
                    console.error('catch 89', error);
                    reject(error);
                })
            } catch (error) {
                console.error('catch 93', error);
                reject(error);
            }
        });
    },
    
    refreshToken(){
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const data = JSON.stringify({
            'refreshToken': AuthManager.getRefreshToken(),
            'token': AuthManager.getToken()
        });
        console.log('[Warning] [refreshing token]');
        return new Promise((resolve, reject) => {
            try {
                if(AuthManager.getToken() == null || AuthManager.getRefreshToken() == null){
                    reject("Token not found. Reset session.")
                }
                fetch(config.serverUrl + "/auth/refreshToken",{
                    headers: headers,
                    method: "POST",
                    body: data
                })
                .then( (response) => {
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            AuthManager.storeToken(json.token);
                            AuthManager.storeRefreshToken(json.refreshToken);
                            resolve({response,json});
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        }
                    })
                })
            } catch (error) {
                //NETWORK ERROR
                reject(error);
            }
        });
    },
    
    requestRepeat(params){
        // const data = params.forceDefaultContentType !== true ? params.data : JSON.stringify(params.data);
        params.method = params.method !== undefined ? params.method : 'GET';
        params.headers.delete('Authorization');
        params.headers.set("Authorization", AuthManager.getToken());
        
        if((params.method == 'POST' || params.method == 'PUT') && params.forceDefaultContentType !== true)
            params.headers.append('Content-Type','application/json');

        let data = this.processRequestBodyConsideringContentType(params);

        return new Promise((resolve, reject) => {
            try {
                fetch(params.url, {
                    headers: params.headers,
                    method: params.method,
                    body: data
                })
                .then( (response) => {
                    if(!response.ok && response.status != 401) {
                        console.log('erro non-401 ao repetir request')
                        response.json().then((json) => {
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        })
                        .catch((error) => {
                            reject(response)
                        })
                        return;
                    }
                    response.json().then((json) => {
                        if(response.ok) {
                            //REQUEST SUCCESS
                            resolve([response,json]);
                        } else {
                            //ELSE, THATS A REQUEST ERROR
                            // console.log(json.message);
                            reject(json.message ? json.message : json.detail ? json.detail : "an error ocurred")
                        }
                    })
                })
                .catch ((error) => {
                    reject(error);
                })
            } catch (error) {
                //NETWORK ERROR
                // console.log(error);
                reject(error);
            }
        });
    }
};