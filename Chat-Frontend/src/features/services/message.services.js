import api from '../api/api';

/**
 * @description send messages 
 */

export async function sendMessage(messageData){
    try{
      const response = await api.post('/api/messages',
      messageData,{
        withCredentials:true
      })
      return response.data;
    }
    catch(err){
      console.log("Error sending message:",err.message);
      throw err;
    }
};

/**
 * @description writing api for fetchinng messages
 */
export async function getMessages(conversationId){
    try{
    const response = await api.get(`/api/messages/${conversationId}`,{
    withCredentials:true 
   })
   return response.data;
    }
    catch(err){
    console.log("error while fetching error",err);
    throw err;
    }
}

/**
 * @description writing api for deleting messages 
 */

export async function deleteMessage(messageId){
  try{
   const response = await api.delete(`/api/messages/${messageId}`)
  return response.data
  }catch(err){
     console.log("error while deleting messages..")
     throw err;
  }
}

/**
 * @description upload chat file 
 */

export async function uploadChatFile(formData) {
  try {
    const response = await api.post(
      '/api/files/upload',
      formData,
      {
        withCredentials: true
      }
    );

    return response.data;
  } catch (err) {
    console.error(
      "Error uploading file:",
      err.response?.data || err.message
    );

    throw err;
  }
}

/**
 * @forwardMessage 
 */

export async function forwardMessage(forwardData){
    try{
     const response = await api.post('/api/messages/forward',forwardData,{
      withCredentials:true
     });
     return response.data;
    }catch(err){
      throw err;
    }
}