import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "./features/authSlice";
import RegisterPage from "./pages/Register";
import SetEmployeeInfo from "./pages/SetEmployeeInfo";
import HomePage from "./pages/Home";
import ClockPage from "./pages/ClockPage";
import AttendanceLog from "./pages/AttendanceLog";
import GeneratePayroll from "./pages/GeneratePayroll";
import Navibar from "./components/Navibar";
import NavibarAdmin from "./components/NavibarAdmin";


function App() {
  const dispatch = useDispatch();
  
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    
    if (token) {
      dispatch(setToken(token));
    }

  },);

const [userData, setUserData] = useState({});

useEffect(() => {
  axios(
      "http://localhost:8000/api/auth/keeplogin",
      {
          headers:{
              Authorization: `Bearer ${token}`,
          },
      }
  )
  .then((response) => {
    setUserData(response.data.data)
  })
  .catch((err) => console.log(err))

}, [])


const Layout = () => {
  return (
    <>
    {userData.role_id === 1 ? (<NavibarAdmin/>) : (<Navibar/>)}
    <Outlet/>
    </>
  );
};  


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children:[
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/clock",
        element: <ClockPage />,
      },
      {
        path: "/log",
        element: <AttendanceLog />,
      },
      {
        path: "/generatepayroll",
        element: <GeneratePayroll />,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/access",
    element: <SetEmployeeInfo />,
  },
]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
