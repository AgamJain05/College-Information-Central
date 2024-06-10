import { lookInSession } from './common/session';
import Navbar from './components/NavbarComponent'
import UserAuthForm from './pages/userAuthForm.page';
import { createContext, useState, useEffect } from "react"
import HomePage from './pages/home.page';
import SearchPage from './pages/search.page';
import PageNotFound from './pages/404.page';
import ProfilePage from './pages/profile.page';
import BlogPage from './pages/blog.page';
import SideNav from './components/sidenavbar.component';
import ManageBlogs from './pages/manage-blogs.page';
import {
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Editor from './pages/editor.pages';

export const Usercontext = createContext();

function App() {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userInSession = lookInSession("user");
    const userData = userInSession ? JSON.parse(userInSession) : { access_token: null };
    setUserAuth(userData);
  }, []);  

  return (
    <Usercontext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:blog_id" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage/>} />
          <Route path="dashboard" element={<SideNav />} > 
              <Route path="blogs" element={<ManageBlogs />} />
              {/* <Route path="notifications" element={<Notifications />} /> */}
          </Route>
          <Route path="settings" element={<SideNav />} >  
              {/* <Route path="edit-profile" element={<EditProfile />} /> */}
              {/* <Route path="change-password" element={<ChangePassword />} /> */}
              </Route>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path = "/search/:query" element = {<SearchPage />} />
          <Route path = "*" element = {<PageNotFound />}/>
          <Route path = "/user/:id" element = {<ProfilePage />}/>
          <Route path = "/blog/:blog_id" element = {<BlogPage />}/>

        </Route>
      </Routes>
    </Usercontext.Provider>
  );
}

export default App;
