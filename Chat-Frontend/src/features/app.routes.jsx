import Login from './pages/Login';
import Register from './pages/Register';
import {Routes,Route} from "react-router-dom";
import Home from './pages/Home';
// import ChatBox from './pages/ChatBox';
import AddUser from './pages/AddUser';
import Contacts from './components/Contacts';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorPage from './components/ErrorPage';
const AppRoutes = ()=>{
    return(
        <>
       <Routes>
        {/* public routes  */}
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
        {/* protected routes  */}
         <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={ <ProtectedRoute >
        <Home/>
        </ProtectedRoute>}
        />
        <Route path="/add-user" element={ <ProtectedRoute >
        <AddUser/>
        </ProtectedRoute>}
        />
        {/* contacts route  */}
         <Route path="/contacts" element={ <ProtectedRoute >
        <Contacts/>
        </ProtectedRoute>}
        />
       </Routes>
        </>
    )
}
export default AppRoutes;