import logo from './logo.svg';
import './App.css';

import {BrowserRouter,Route,Routes} from "react-router-dom"
import { Signup } from './page/Signup';
import { Login } from './page/Login';
import LandingPage from './page/LandingPage';
import CoursePage from './page/CoursePage';
import AdminDashboard from './page/AdminDashboard';
import AddCourse from './components/addCourse';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element = {<LandingPage/>} />
            <Route path='/signup' element = {<Signup/>} />
            <Route path='/login' element = {<Login/>} />
             <Route path='/course' element = {<CoursePage/>} />
             <Route path='/admin' element = {<AdminDashboard/>} />
             <Route path='/addcourse' element = {<AddCourse/>} />
        </Routes>

    </BrowserRouter>
  );
}

export default App;
