import axios from 'axios';
import { useEffect, useState } from 'react';

import { Routes, Route } from 'react-router-dom';

const NOTICES_PER_PAGE = 20;

function NoticeList({props}) {
	const [notices,setNotices] = useState([]);
	useEffect(()=>{

		async function getNotices(page) {
			await axios.get('http://localhost:3001/api/getNotices',{params:{page:page,threshold:NOTICES_PER_PAGE}})
			.then((res)=>{
				setNotices(res.data?res.data:[]);
			})
			.catch(
			)
		}

		getNotices(props?props.page:0);

		return ()=>{}
	},[props]);
	return <>
		{notices.map((notice,index)=>{
			return <>{`${index}, ${notice.title}, ${notice.date}`}</>
		})}
	</>
}

export default function Notices() {
	return <main className="notices"> 
		<Routes>
			<Route exact path='/' element={<NoticeList />}/>
		</Routes>
	</main>
}