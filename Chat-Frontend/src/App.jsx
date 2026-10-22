import { useState } from 'react'
import React from "react"
import AppRoute from './features/app.routes';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../src/features/context/AuthContext"

function App() {
    return (
      <BrowserRouter>
      <AuthProvider>  
        <AppRoute/>
         </AuthProvider>
     </BrowserRouter>
       
    
    );
}

export default App
