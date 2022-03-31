import axios from "axios";

let uri = 'http://localhost:8080';
let headers = {
    'Content-Type':'application/json'
}

 let api = axios.create({
    baseURL: uri,
    headers: headers
})


api.interceptors.request.use(
    config => {
      const token = sessionStorage.getItem('token');
  
      if (token) {
        config.headers = {
           'token': token,
           'Content-Type':'application/json'
       }
      } else{
        config.headers = {
            'Content-Type':'application/json'
        }
      }
      
      return config;
    },
  );
  
export default api;