import 'css/index.css'

import { Routes, Route } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Main from './pages/Main';
import Notice from './pages/Notice';
import Product from './pages/Product';

export default function Gcova() {
	return <>
		<Header/>
		<Routes>
			<Route exact path='/' element={<Main/>} />
			<Route path='/notice/*' element={<Notice/>} />
			<Route path='/product/*' element={<Product/>} />
		</Routes>
		<Footer/>
	</>;
}