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
		<Link to='/notices'>게시판</Link>
		<Link to='/products/new'>새 제품 추가</Link>
	</header>;
}