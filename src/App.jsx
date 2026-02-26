import Header from './layouts/Header'
import { Routes, Route } from 'react-router'
import './App.css'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Footer from './layouts/Footer'
import Signup from './pages/Login/Signup'
import Detail from './pages/Detail/Detail'
import List from './pages/List/List'
import Help from './pages/Help/Help'

function App() {

  return (
    <>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path="/detail/:id" element={<Detail />} />
        <Route path='/list' element={<List />}></Route>
        <Route path='/Help' element={<Help />}></Route>
      </Routes>
      <Footer></Footer>

    </>
  )
}

export default App
