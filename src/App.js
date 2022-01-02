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
import TableDescription from './components/Dashboard/TableDescription/TableDescription';
import TableStatus from './components/Dashboard/TableStatus/TableStatus';
import TablePosts from './components/Dashboard/TablePosts/TablePosts';
import ProfilePage from './components/Dashboard/ProfilePage/ProfilePage';
import NewsFeed from './components/Dashboard/NewsFeed/NewsFeed';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/table-users" element={<TableUsers />} />
        <Route path="/table-desc" element={<TableDescription />} />
        <Route path="/table-status" element={<TableStatus />} />
        <Route path="/table-posts" element={<TablePosts />} />
        <Route path="/myprofile" element={<ProfilePage />} />
        <Route path="/news-feed" element={<NewsFeed />} />

        <Route path="*" element={<Denied />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
