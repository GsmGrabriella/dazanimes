import React from 'react';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



const App: React.FC = () => (
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/login" element={<Login />} />
			<Route path="/Register" element={<Register />} />
		</Routes>
	</BrowserRouter>
);

export default App;
