import api from "../api/api"

/**
 *  @description register api 
 */
export  async function register({username,email,password}){
    try{
        const response = await api.post('/api/auth/register',{
            username:username,
            email:email,
            password:password
        },{withCredentials:true});
        return response.data; // token cookies main automatically attach ho jayega 
    }
  catch(err) {
    console.log("REGISTER ERROR:", err.response?.data);
    throw err;
}
}
/**
 * @description login api 
 */
export  async function login(userdata){
  try{
    const response = await api.post('/api/auth/login',userdata,{
        withCredentials:true
    });
    return response.data;
  }
  catch(err){
    console.log("error in login api..",err);
    throw err;
  }
}
/**
 * @description logout api 
 */
export  async function logout(){
    try{
      const response = await api.post('/api/auth/logout',{
        withCredentials:true
      });
     return response.data;
    }catch(err){
        console.log("logout error..",err);
        throw err;
    }
}
/**
 * @description get-me api 
 */
export async function getMe(){
    try{
        const response = await api.get('/api/auth/get-me')
        return response.data;
    }        
    catch(err){
        console.log("get-me api error ..",err);
        throw err;
    }
}