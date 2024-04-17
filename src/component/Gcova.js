import 'css/index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Main from './pages/Main';
import Notices from './pages/Notices';

export default function Gcova() {
	return <BrowserRouter basename="/gcova">
		<Header/>
		<Routes>
			<Route exact path='/' element={<Main/>} />
			<Route path='/notices/*' element={<Notices/>} />
		</Routes>
		<Footer/>
	</BrowserRouter>;
}