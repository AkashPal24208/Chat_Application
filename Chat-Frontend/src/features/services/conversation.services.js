import api from '../api/api'

// create new conversation
export async function createConversation(receiverId) {
  try {
    const response = await api.post('/api/conversations', {
      participantId: receiverId
    }, { withCredentials: true });
    return response.data;
  } catch (err) {
    console.log("conversation room error", err);
    throw err;
  }
}

// get all conversations of logged-in user
export async function getConversation() {
  try {
    const response = await api.get('/api/conversations', {
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    console.log("error in fetching result", err);
    throw err;
  }
}

// get specific conversation by id
export async function getConversationById(conversationId) {
  try {
    const response = await api.get(`/api/conversations/${conversationId}`, {
      withCredentials: true
    });
    return response.data;
  } catch (err) {
    console.log("error in fetching conversation", err);
    throw err;
  }
}
