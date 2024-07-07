
import Form from './Login/login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditorPage from './Quill/EditorPage'
import HomePage from './HomePage/HomePage'

function App() {


 return (
    <Router>
        <Routes>
          <Route exact path='/' element={<Form formType={{isLogin:true,isSignUp:false,isOtp:false}}/>} />
          <Route exact path='/login' element={<Form formType={{isLogin:true,isSignUp:false,isOtp:false}}/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/editor' element={<><EditorPage/></>} />
          <Route path='/signup' element={<Form formType={{isLogin:false,isSignUp:true,isOtp:false}}/>} />
          <Route path='/otp' element={<Form formType={{isLogin:false,isSignUp:false,isOtp:true}}/>} />
        </Routes>
    </Router>
 )
}

export default App
