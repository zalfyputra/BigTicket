import { Routes, Route } from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserManagementPage from "./pages/admin/user/UserManagementPage";
import CreateUserPage from "./pages/admin/user/CreateUserPage";
import EditUserPage from "./pages/admin/user/EditUserPage";
import { useDispatch } from "react-redux";
import { axiosInstance } from "./lib/axios";
import { useEffect, useState } from "react";

function App() {
  const dispatch = useDispatch();
  const [isHydrated, setIsHydrated] = useState(false);

  const hydrateAuth = async () => {
    try {
      const currentUser = localStorage.getItem("current-user");

      if (!currentUser) return;

      const userResponse = await axiosInstance.get("/users/" + currentUser);

      dispatch({
        type: "USER_LOGIN",
        payload: {
          id: userResponse.data.id,
          role: userResponse.data.role,
          fullname: userResponse.data.fullname,
        },
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsHydrated(true);
    }
  };

  useEffect(() => {
    hydrateAuth();
  }, []);

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/register" Component={RegisterPage} />
        <Route path="/login" Component={LoginPage} />

        <Route path="/admin">
          <Route path="users" Component={UserManagementPage} />
          <Route path="users/create" Component={CreateUserPage} />
          <Route path="users/edit/:userId" Component={EditUserPage} />
        </Route>

        <Route path="*" Component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;
