import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import {register} from '../services/auth.services'

const Register = () => {
    const [username,setUsername] = useState("") // user object ya null 
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("")
    const navigate = useNavigate();
    // handle submit function 
    const handleSubmit = async (e)=>{
        e.preventDefault();
         setError("");
        if(!email.includes("@")){
            return setError("Invalid email")
        }
       if(password.length < 3){
            return setError("password too short");
       }

       setLoading(true);
        try{
            setError("");
            const response = await register({username,email,password}) 
            console.log("Registered",response);
            navigate("/login"); // redirect after success
            
            // registration become successfull 
       
        }
        catch(err){
           console.log("Register error:", err);
           setError(err.response?.data?.message || "Registration failed. Try again");
           setUsername("");
           setEmail("");
           setPassword("");
        }
        finally{
            setLoading(false);
        }
    };
 return (
  <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-8">

    {/* Decorative background */}
    <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-40"></div>

    <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-40"></div>


    {/* Register Card */}
    <div className="relative w-full max-w-md">

      <div className="bg-white/90 backdrop-blur-xl border border-white shadow-2xl rounded-3xl p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-3xl">
              🚀
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Join the conversation and connect with others
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Name
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                👤
              </span>

              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                value={username}
                name="username"
                id="username"
                placeholder="Enter your name"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-400 transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

            </div>
          </div>


          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>

              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                name="email"
                id="email"
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-400 transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

            </div>
          </div>


          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>

              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                value={password}
                id="password"
                placeholder="Create a password"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-800 placeholder-gray-400 transition focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

            </div>
          </div>


          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200 transition duration-200 hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>

        </form>


        {/* Login */}
        <p className="text-center text-sm text-gray-500 mt-7">
          Already registered?

          <a
            href="/login"
            className="ml-1 font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            Login
          </a>
        </p>

      </div>


      {/* Bottom text */}
      <p className="text-center text-xs text-gray-400 mt-5">
        Create your account and start chatting.
      </p>

    </div>

  </main>
);
}

export default Register
