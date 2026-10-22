import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
   
    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });
   console.log("AUTH PROVIDER USER:", user);
   // loogin user 

const loginUser = (userData) => {
    console.log("🔥 AUTH CONTEXT loginUser:", userData);

    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
};

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};