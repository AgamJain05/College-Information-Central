import Navbar from './components/NavbarComponent'
import UserAuthForm from './pages/userAuthForm.page';
import {
  Route,
  Routes,
} from "react-router-dom";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="signin" element={<UserAuthForm type = "sign-in"/>}/>
        <Route path="signup" element={<UserAuthForm type = "sign-up" />}/>
      </Route>
   </Routes>

  )
}

export default App