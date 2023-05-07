import OfficerLogin from './components/OfficerLogin';
import OfficerRegistration from './components/OfficerRegistration';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './components/UserLogin';
import UserRegistration from './components/UserRegistration';

function App() {
  return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserLogin />} />
            <Route path="/userRegistration" element={<UserRegistration />} />
            <Route path="/officerLogin" element={<OfficerLogin />} />
            <Route path="/officerRegistration" element={<OfficerRegistration />} />
          </Routes>
      </BrowserRouter>
      </div>
  );
}

export default App;
