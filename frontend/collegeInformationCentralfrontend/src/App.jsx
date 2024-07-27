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
import Notifications from './pages/notifications.page';
import EditProfile from './pages/edit-profile.page';
import ChangePassword from './pages/change-password.page';

import {
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import Editor from './pages/editor.pages';

export const Usercontext = createContext();
export const ThemeContext = createContext({});

const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: light)").matches;
function App() {
  const [userAuth, setUserAuth] = useState({});
  const [ theme, setTheme ] = useState(() => darkThemePreference() ? "dark" : "light" );

  useEffect(() => {

    let userInSession = lookInSession("user");
    let themeInSession = lookInSession("theme");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
    
    if (themeInSession) {
        setTheme(() => {

            document.body.setAttribute('data-theme', themeInSession);

            return themeInSession;
        
        })
    } else {
        document.body.setAttribute('data-theme', theme)
    }

}, []);  

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>

    <Usercontext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:blog_id" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage/>} />
          <Route path="dashboard" element={<SideNav />} > 
              <Route path="blogs" element={<ManageBlogs />} />
              <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="settings" element={<SideNav />} >  
              { <Route path="edit-profile" element={<EditProfile />} />}
              {<Route path="change-password" element={<ChangePassword />} />}
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
    </ThemeContext.Provider>
  );
}

export default App;
