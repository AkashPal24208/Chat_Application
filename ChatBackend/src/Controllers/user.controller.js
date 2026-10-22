const UserDataModel = require("../Models/UserData");

/**
 * 
 * @route GET/api/auth/users
 * @description sabhi user ko fetch karo , exclude logged in user
 */
async function UsersController(req,res){
     
    try{   
        // find loggedIn user 
        const loggedInUser = req.user.id;

        const users =await UserDataModel.find({ _id: { $ne: loggedInUser } })

        if(!users || users.length === 0){
            return res.status(404).json({
                message:"No user found.."
            });
        }

    return res.status(200).json({
      message: "Users fetched successfully",
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        email: user.email
      }))
    });

    }catch(err){
        console.log(err)
      return res.status(500).json({
        message:"Error while fetching users.."
      })
    }

}

/**
 * @route GET/api/auth/users/:id
 * @description specific user ki profile fetch karna 
 */

async function UsersControllerId(req,res){

   try{
      const userId = req.params.id;
      const user = await UserDataModel.findById(userId)

      if(!user){
        return res.status(404).json({
            message:"user does not exist.."
        })
      }
 
      return res.status(200).json({
        message:"user exist in database...",
        user:{ 
          id:user._id,
          username:user.username,
          email:user.email  
        }
      })

   }catch(err){
     return res.status(404).json({
        message:"error while fetching user.."
     })
   }
}

/**
 * @route POST/api/auth/add-user
 * @description add contact controller 
 */

async function addContactController(req, res) {
    try {
        console.log("BODY:", req.body);
        const { name, email } = req.body;

        // who made the request 
        const loginUser = req.user.id;

        const friend = await UserDataModel.findOne({
            email: email.trim().toLowerCase()
        });

        if (!friend) {
            return res.status(404).json({
                message: "user with this email does not exist .."
            });
        }

        // 1. Check if user is trying to add themselves
        if (friend._id.toString() === loginUser.toString()) {
            return res.status(400).json({
                message: "You cannot add yourself as a contact!"
            });
        }

        // extract current user 
        const currentUser = await UserDataModel.findById(loginUser);

        // 2. Check if the friend is already in contacts list
        const isAlreadyContact = currentUser.contacts.some(
            (contact) => contact.user.toString() === friend._id.toString()
        );

        if (isAlreadyContact) {
            return res.status(400).json({
                message: "This user is already in your contacts list!"
            });
        }

        // 3. Add to contacts if not already present
        currentUser.contacts.push({
            user: friend._id,
            name: name
        });
        await currentUser.save();

        return res.status(200).json({
            message: "friend added successfully.."
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

/**
 * @route GET/api/auth/contacts
 * @description this api is used to fetch users those are in contact with loggedIn user
 */

async function getContacts(req,res) {
    try{
      const loginUserId = req.user.id;

      const user = await UserDataModel.findById(loginUserId).populate("contacts.user");

      // user exist karta hai tabhi list fetch hogi so,eske liye validation lagan is not important  

      const contacts  = user.contacts;

      return res.status(200).json({
        message:"contacts send succesfully",
        contacts: contacts
      })
    }
    catch(err){
     console.log("error in get contacts api..",err);
    }
}

/**
 * @deleteContactController 
 */
async function deleteContactController(req, res) {
    try {
        const loginUser = req.user.id;
        const { contactId } = req.params; // contact subdocument id ya user id

        const currentUser = await UserDataModel.findById(loginUser);

        // Contact array se filter karke remove karna
        currentUser.contacts = currentUser.contacts.filter(
            (contact) => contact._id.toString() !== contactId
        );

        await currentUser.save();

        return res.status(200).json({
            message: "Contact deleted successfully.."
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {UsersController,UsersControllerId,addContactController,getContacts,deleteContactController}
