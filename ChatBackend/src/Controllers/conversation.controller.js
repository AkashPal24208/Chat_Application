const conversationModel = require('../Models/Conversation.model')

/**
 * @route POST/api/conversations
 * @description logged-In user kisi doosre user ke sath chat kare.
 * @acess private
 */

async function createConversations(req, res) {
  try {
    const { participantId } = req.body;
    const loggedInUserId = req.user.id;

    if (!participantId) {
      return res.status(400).json({
        message: "participantId is required"
      });
    }

    // Check if conversation already exists
    let existingConversation = await conversationModel.findOne({
      participants: { $all: [loggedInUserId, participantId] }
    });

    if (existingConversation) {

      await existingConversation.populate(
        "participants",
        "username"
      );

      return res.status(200).json({
        message: "Conversation already exists",
        conversation: existingConversation
      });
    }

    // Create new conversation
    const newconversation = new conversationModel({
      participants: [loggedInUserId, participantId]
    });

    await newconversation.save();

    await newconversation.populate(
      "participants",
      "username"
    );

    return res.status(200).json({
      message: "Conversation created successfully",
      conversation: newconversation
    });

  } catch (err) {
    console.error(err.message);

    return res.status(500).json({
      message: "Error creating conversation"
    });
  }
}

/**
 * @route GET/api/conversations
 * @description get all conversation of logged-In user ..
 */
async function getConversations(req, res) {
  try {
    const loggedInUserId = req.user.id;

    const conversations = await conversationModel.find({
      participants: loggedInUserId
    }).populate("participants", "username").sort({updatedAt:-1});
   
   
    return res.status(200).json({
      message: "Conversations fetched successfully",
      conversations
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Error fetching conversations" });
  }
}

/**
 * @route GET/api/conversations/:id
 * @description ek specific converation fetch karne ke liye 
 */

async function getConversationById(req, res) {
  try {
    const { conversationId } = req.params;

    const conversation = await conversationModel
      .findById(conversationId)
      .populate("participants", "username");

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    return res.status(200).json({
      message: "Conversation fetched successfully",
      conversation
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Error fetching conversation"
    });
  }
}

module.exports = {
  createConversations,
  getConversations,
  getConversationById
};

