import OfficerLogin from './components/OfficerLogin';
import OfficerRegistration from './components/OfficerRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import UserRegistration from './components/UserRegistration';
import FileComplaint from './components/FileComplaint';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
