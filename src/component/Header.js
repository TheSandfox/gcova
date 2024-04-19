import { Link } from "react-router-dom";

export default function Header() {
	return <header style={{
			display:'flex', 
			gap:'16px',
			width:'100%',
			padding:'16px 0',
			backgroundColor:'#ffcc00'
		}}>
		<Link to='/'>메인페이지</Link>
		<Link to='/notice/list'>게시판</Link>
		<Link to='/product/list'>제품</Link>
	</header>;
}