import axios from 'axios';

import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';

const NOTICES_PER_PAGE = 20;
const PAGES_PER_PAGE = 10;

//상세보기
function NoticeDetail() {
	const params = useParams();
	const [notice,setNotice] = useState([{
		title:'',
		content:'',
		date:'',
	}]);
	const handleNotice = {
		get:()=>{
			return notice[0];
		},
		set:(newVal)=>{
			let arr = [];
			arr.push(newVal)
			setNotice(arr);
		}
	};
	// console.log(qs.parse(window.location.search));
	//공지 가져오기
	useEffect(()=>{
		async function getNotice(id) {
			await axios.get('http://localhost:3001/api/getNotice',{params:{id:id}})
			.then((res)=>{
				handleNotice.set(res.data[0]);
			})
			.catch(

			)
		}
		getNotice(params.id);
		return ()=>{}
	},[]);
	return <>
		<h2>게시물 상세보기</h2><br/><br/>
		<h3>{handleNotice.get().title}</h3><br/><br/>
		{handleNotice.get().content}<br/><br/>
		{handleNotice.get().date}<br/>
		<br/>
		<Link to={`/notices`}>목록으로◀</Link>
	</>
}

//공지작성창
function NewNotice() {
	const titleInput = useRef();
	const contentInput = useRef();
	const enterCallback = useRef((event)=>{
		if (event.keyCode!==13) {return;}
		async function createNotice(title,content) {
			await axios.get('http://localhost:3001/api/createNotice',{params:{
				title:title,
				content:content
			}})
			.then((res)=>{
				
			})
			.catch(

			)
		}
		createNotice(titleInput.current.value,contentInput.current.value);
	});
	return <>
		<input type='text' ref={titleInput} onKeyDown={enterCallback.current}></input>
		<input type='text' ref={contentInput} onKeyDown={enterCallback.current}></input>
		<Link to={`/notices`}>목록으로</Link>
	</>
}

//공지리스트
function NoticeList() {
	const [pageDisplay,setPageDisplay] = useState([0]);
	const handlePageDisplay = {
		get:()=>{
			return pageDisplay[0];
		},
		set:(val)=>{
			if (val<0) {
				setPageDisplay([0]);
			} else {
				setPageDisplay([val]);
			}
		},
		previous:()=>{
			if (pageDisplay[0]>0) {
				setPageDisplay([pageDisplay[0]-1]);
			}
		},
		next:()=>{
			if (pageDisplay[0]<maxPages.current-1) {
				setPageDisplay([pageDisplay[0]+1]);
			}
		}
	}
	const [notices,setNotices] = useState([]);
	const [pages,setPages] = useState([]);
	const maxPages = useRef(0);
	//맥스페이지 계산
	useEffect(()=>{

		async function carculateMaxPages() {
			await axios.get('http://localhost:3001/api/countNotices')
			.then((res)=>{
				maxPages.current = parseInt(res.data[0]/NOTICES_PER_PAGE)+1;
				let arr = [];
				let startPage = handlePageDisplay.get()
				if ((startPage+PAGES_PER_PAGE)>(maxPages.current)) {
					startPage = maxPages.current-PAGES_PER_PAGE;
				}
				if (startPage<0) {
					startPage = 0;
				}
				for(let i=0;i<PAGES_PER_PAGE;i++) {
					if (startPage+i<maxPages.current) {
						arr.push(startPage+i);
					}
				}
				// console.log(arr);
				setPages(JSON.parse(JSON.stringify(arr)));
			})
			.catch(

			)
		}
		carculateMaxPages()
		return()=>{}
	// eslint-disable-next-line
	},[])
	//공지들 가져오기
	useEffect(()=>{
		async function getNotices(page) {
			await axios.get('http://localhost:3001/api/getNotices',{params:{page:page,threshold:NOTICES_PER_PAGE}})
			.then((res)=>{
				// console.log('?');
				// console.log(res.data);
				setNotices(res.data?res.data:[]);
			})
			.catch(
			)
		}
		getNotices(handlePageDisplay.get());
		return ()=>{}
	// eslint-disable-next-line
	},[pageDisplay]);
	return <>
		{/*게시물 위젯*/}
		<div className='' style={{height:'480px'}}>
			{notices.map((notice,index)=>{
				return <div key={'n'+index}>
					<Link to={`/notices/detail/${notice.id}`}>
					{`${(NOTICES_PER_PAGE*handlePageDisplay.get())+index+1}, ${notice.title}, ${notice.date}`}
					</Link>
				</div>
			})}
		</div>
		{/*페이지네이션*/}
		<div className='pagenationContainer' style={{display :'flex',gap:'16px'}}>
			<div
				onClick={()=>{handlePageDisplay.previous()}}
			>
				◀
			</div>
			{pages.map((page)=>{
				return <div key={'p'+page}
					style={{
						fontWeight:	(page===handlePageDisplay.get())?'bold':'initial'					
					}}
					onClick={()=>{handlePageDisplay.set(page);}}
				>
					{page+1}
				</div>
			})}
			<div
				onClick={()=>{handlePageDisplay.next()}}
			>
				▶
			</div>
		</div>
		<Link to={`/notices/new`}>글쓰기</Link>
	</>
}

export default function Notices() {
	return <main className="notices"> 
		<Routes>
			<Route path='/' element={<NoticeList />}/>
			<Route path='/new' element={<NewNotice/>}/>
			<Route path='/detail/:id' element={<NoticeDetail/>}/>
		</Routes>
	</main>
}