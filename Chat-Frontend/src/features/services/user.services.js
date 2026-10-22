import api from '../api/api'

export async function getAllUser(){
    try{
       const response = await api.get('/api/users',{
        withCredentials:true
       })
       return response.data
    }catch(err){
       console.log("error while fecthing user",err.message);
       throw err;
    }
} 

export async function getUser(){
    try{
     const response = await api.get(`/api/users/${userId}`,{
        withCredentials:true
     })
     return response.data;
    }catch(err){
     console.log("error in userId",err);
     throw err;
    }      
}

export async function addContact({name,email}){
  try{
     const user = await api.post('/api/add-user',{
      name,email
     },{
      withCredentials:true
     })
     return user.data;
  }catch(err){
       console.log("Add conatcts ....")
       throw err;
  }
}

/**
 * @route GET/api/contacts
 * @description will fetch all the users that are in contact with parent user
 */


export async function getContacts() {
    console.log("getContacts called");

    try {
        const response = await api.get('/api/contacts', {
            withCredentials: true
        });

        console.log("contact list of users", response.data);

        return response.data;
    } catch (err) {
        console.log("contacts fetching issue", err);
        throw err;
    }
}

/**
 * @deleteContactAPI 
 */

export async function deleteContactApi(contactId){
try {
        const response = await api.delete(`/api/contacts/delete/${contactId}`);
        return response.data;
    } 
    catch (err) {
        console.error("Error deleting contact:", err);
        throw err;
    }
}