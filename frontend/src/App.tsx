import React from 'react';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import NewPost from './pages/NewPost';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';



const App: React.FC = () => (
	<UserProvider>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/Register" element={<Register />} />
				<Route path="/Profile/:id" element={<Profile />} />
				<Route path="/newpost" element={<NewPost />} />
			</Routes>
		</BrowserRouter>
	</UserProvider>
);

export default App;
