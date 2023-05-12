import OfficerLogin from './components/OfficerLogin';
import OfficerRegistration from './components/OfficerRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import UserRegistration from './components/UserRegistration';
import FileComplaint from './components/FileComplaint';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApprovePending from './components/ApprovePending';
import Admin from './components/Admin';
import PublicPage from './components/PublicPage';
import Resolution from './components/Resolution';


function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/userRegistration" element={<UserRegistration />} />
            <Route path="/officerLogin" element={<OfficerLogin />} />
            <Route path="/officerRegistration" element={<OfficerRegistration />} />
            <Route path="/fileComplaint" element = {<FileComplaint />} />
            <Route path='/approvePending' element={<ApprovePending />} />
            <Route path='/admin' element={<Admin />} />
            <Route path = "/publicPage" element = {<PublicPage />}/>
            <Route path = "/resolution" element = {<Resolution />}/>
          </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
