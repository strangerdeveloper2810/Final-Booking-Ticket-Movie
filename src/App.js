import './App.css';
import { createBrowserHistory } from 'history';
import { Router, Switch } from 'react-router';
import { HomeTemplate } from './templates/HomeTemplate/HomeTemplate'
import Home from './pages/Home/Home';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Detail from './pages/Detail/Detail';
import CheckoutTemplate from './templates/CheckoutTemplate/CheckoutTemplate';
import Checkout from './pages/Checkout/Checkout';
import { UserTemplate } from './templates/UserTemplate/UserTemplate';
import Loading from './components/Loading/Loading';
import Profile from './pages/Profile/Profile';
import AdminTemplate from './templates/AdminTemplate/AdminTemplate';

import Users from './pages/Admin/User/User';
import AddUser from './pages/Admin/User/AddUser/AddUser';
import EditUser from './pages/Admin/User/EditUser/EditUser';
import Showtime from './pages/Admin/Showtime/Showtime';
import AddNewFilm from './pages/Admin/Films/AddNew/AddNewFilms';
import EditFilm from './pages/Admin/Films/Edit/EditFilm';
import Films from './pages/Admin/Films/Film';
import EditProFile from './pages/Profile/EditProfile/EditProfile';




export const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Loading />
      <Switch>
        <UserTemplate path="/profile/edit/:id" Component={EditProFile} />
        <AdminTemplate path="/admin/films/showtime/:id/:tenphim" exact Component={Showtime} />



        <AdminTemplate path="/admin/films/addnew" exact Component={AddNewFilm} />
        <AdminTemplate path="/admin/films/edit/:id" exact Component={EditFilm} />
        <AdminTemplate path="/admin/films" Component={Films} />
        <AdminTemplate path="/admin/users/edit/:taiKhoan" exact Component={EditUser} />
        <AdminTemplate path="/admin/users/addnew" exact Component={AddUser} />
        <AdminTemplate path="/admin/users" exact Component={Users} />
        <AdminTemplate path="/admin" exact Component={Users} />

        <CheckoutTemplate path="/checkout/:id" exact component={Checkout} />
        <CheckoutTemplate path="/profile" Component={Profile} />
        <HomeTemplate path="/home" exact Component={Home} />
        <HomeTemplate path="/detail/:id" exact Component={Detail} />

        <UserTemplate path="/register" exact Component={Register} />


        <UserTemplate path="/login" exact Component={Login} />
        <HomeTemplate path="/" exact Component={Home} />

      </Switch>
    </Router>
  );
}

export default App;



