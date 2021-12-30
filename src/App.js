import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet
} from 'react-router-dom';

import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Denied from './components/Denied/Denied';
import Feed from './components/Feed/Feed';
import TableUsers from './components/Dashboard/Table_Users/TableUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/table-users" element={<TableUsers />} />
        <Route path="*" element={<Denied />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
