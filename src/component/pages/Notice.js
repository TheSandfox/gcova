import axios from 'axios';

import { useEffect, useRef, useState } from 'react';
import { Routes, Route, Link, useParams, useHistory } from 'react-router-dom';

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
		<Link to={`/notice/list`}>목록으로◀</Link>
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
function NoticeList({handlePageDisplay,page}) {
	const params = useParams();
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
	},[page])
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
		getNotices(/*params.page||*/handlePageDisplay.get());
		return ()=>{}
	// eslint-disable-next-line
	},[page]);
	//param 있으면 page값 변경
	useEffect(()=>{
		if(params.page) {
			handlePageDisplay.set(params.page);
		}
	},[]);
	return <>
		{/*게시물 위젯*/}
		<div className='' style={{height:'480px'}}>
			{notices.map((notice,index)=>{
				return <div key={'n'+index}>
					<Link to={`/notice/detail/${notice.id}`}>
					{`${(NOTICES_PER_PAGE*handlePageDisplay.get())+index+1}, ${notice.title}, ${notice.date}`}
					</Link>
				</div>
			})}
		</div>
		{/*페이지네이션*/}
		<div className='pagenationContainer' style={{display :'flex',gap:'16px'}}>
			{/*이전*/}
			<div
				onClick={()=>{handlePageDisplay.previous()}}
			>
				◀
			</div>
			{/* <Link 
				to={`/notice/list?page=${handlePageDisplay.getPrevious()}`}
				onClick={()=>{refresh([])}}
			>
				◀
			</Link> */}
			{/*선택*/}
			{pages.map((page)=>{
				// return <div key={'p'+page}
				// 	style={{
				// 		fontWeight:	(page===handlePageDisplay.get())?'bold':'initial'					
				// 	}}
				// 	onClick={()=>{handlePageDisplay.set(page);}}
				// >
				// 	{page+1}
				// </div>
				return <Link 
					to={'/notice/list/'+page} key={'p'+page}
					style={{
						fontWeight:	(page===handlePageDisplay.get())?'bold':'initial'					
					}}
				>
					{page+1}
				</Link>
			})}
			{/*다음*/}
			<div
				onClick={()=>{handlePageDisplay.next(maxPages.current)}}
			>
				▶
			</div>
			{/* <Link 
				to={`/notice/list?page=${handlePageDisplay.getNext()}`}
				onClick={()=>{refresh([])}}
			>
			▶
			</Link> */}
		</div>
		<Link to={`/notice/new`}>글쓰기</Link>
	</>
}

export default function Notice() {
	const [pageDisplay,setPageDisplay] = useState([0]);
	const [refresher,refresh] = useState([]);
	const handlePageDisplay = {
		get:()=>{
			return parseInt(pageDisplay[0]);
		},
		set:(newVal)=>{
			setPageDisplay([parseInt(newVal)]);
		},
		// getPrevious:()=>{
		// 	if (pageDisplay[0]>0) {
		// 		return parseInt(pageDisplay[0])-1;
		// 	} else {
		// 		return 0;
		// 	}
		// },
		// getNext:(maxPages)=>{
		// 	if (pageDisplay[0]<maxPages-1) {
		// 		return parseInt(pageDisplay[0])+1
		// 	} else {
		// 		return maxPages-1
		// 	}
		// },
		previous:()=>{
			if (pageDisplay[0]>0) {
				setPageDisplay([pageDisplay[0]-1]);
			}
			refresh([]);
		},
		next:(maxPages)=>{
			if (pageDisplay[0]<maxPages-1) {
				setPageDisplay([pageDisplay[0]+1]);
			}
			refresh([]);
		}
	}
	return <main className="notice"> 
		<Routes>
			<Route path='/list' element={<NoticeList handlePageDisplay={handlePageDisplay} page={handlePageDisplay.get()}/>}/>
			{/* <Route path='/list/:page' element={<NoticeList handlePageDisplay={handlePageDisplay}/>}/> */}
			<Route path='/new' element={<NewNotice/>}/>
			<Route path='/detail/:id' element={<NoticeDetail/>}/>
		</Routes>
	</main>
}