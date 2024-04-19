import axios from "axios";
import { Buffer } from "buffer";
import { useEffect, useRef, useState } from "react";
import { Routes, Route, useParams, Link, useNavigate } from "react-router-dom";

const PRODUCTS_PER_PAGE = 16;

function ProductDetail() {
	const params = useParams();
	const [item,setItem] = useState([{
		name:'제품명',
		description:'제품설명',
		img:process.env.PUBLIC_URL+'/img/missing.png'
	}]);
	const handleItem = {
		get:()=>{
			return item;
		},
		set:(name,desc,img)=>{
			let newObj = {
				name:name,
				description:desc,
				img:img
			};
			setItem(newObj);
		}
	}
	//마운트시 항목 불러오기
	useEffect(()=>{
		async function getProduct(id) {
			await axios.get('http://localhost:3001/api/getProduct',{
				params:{id:id},
				responseType: 'json'
			})
			.then((res)=>{
				let buffer = Buffer.from(res.data[0].img.data);
				handleItem.set(
					res.data[0].name,
					res.data[0].description,
					buffer.toString('utf-8')
				);
			})
			.catch(

			)
		}
		if(params&&params.id){
			getProduct(params.id);
		}
		return ()=>{}
	},[])
	return <div className={'productDetail'}>
		<div className="name">{handleItem.get().name}</div>
		<div className="description">{handleItem.get().description}</div>
		<img 
			src={process.env.PUBLIC_URL+'/img/'+handleItem.get().img}
			alt={"제품 사진"}
		/>
		<Link to={'/product/edit/'+params.id}>
			수정하기!
		</Link>
	</div>
}

function ProductWidget({product}) {
	let imgName = Buffer.from(product.img).toString('utf-8');
	// let imgName = 'missing.png'
	// console.log(product.img);
	return <Link to={'/product/detail/'+product.id}
		className="productWidget"
	>
		<div>{product.name}</div>
		<div>{product.description}</div>
		<img 
			src={process.env.PUBLIC_URL+'/img/'+imgName}
			alt={"제품 사진"}
		/>
	</Link>
}

function ProductList() {
	const params = useParams();
	const [list,setList] = useState([]);
	//제품들
	useEffect(()=>{
		async function getProducts(page) {
			await axios.get('http://localhost:3001/api/getProducts',{params:{page:page,threshold:PRODUCTS_PER_PAGE}})
			.then((res)=>{
				// console.log('?');
				// console.log(res.data);
				setList(res.data?res.data:[]);
			})
			.catch(
			)
		}
		getProducts(params.page||0);
		return ()=>{}
	// eslint-disable-next-line
	},[]);
	return <>
		{list.map((product,index)=>{
			return <ProductWidget product={product} key={Date.now()+index}/>
		})}
	</>
}

function CreateProduct({mode}) {
	const navigate = useNavigate();
	const params = useParams();
	const nameInput = useRef();
	const descriptionInput = useRef();
	const fileInput = useRef();
	async function createProduct() {
		let file = fileInput.current.files[0]
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name",nameInput.current.value)
		formData.append("description",descriptionInput.current.value)
		// console.log("얏호우");
		await axios.post('http://localhost:3001/api/createProduct',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		.then((res)=>{
			console.log(res);
			// console.log(res);
			navigate('/product/detail/'+res.data[0]);
		})
		.catch(
		)
	}

	async function editProduct() {
		let file = fileInput.current.files[0]
		const formData = new FormData();
		formData.append("id",params.id);
		formData.append("file", file);
		formData.append("name",nameInput.current.value)
		formData.append("description",descriptionInput.current.value)
		// console.log("얏호우");
		await axios.post('http://localhost:3001/api/editProduct',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		.then(()=>{
			navigate('/product/detail/'+params.id);
		})
		.catch(
		)
	}

	return <>
		<div>
			{mode==='create'?'새 제품 등록':(mode==='edit'?'제품 정보 수정':'')}
		</div>
		<input ref={nameInput} type="text" name="name"/>
		<input ref={descriptionInput} type="text" name="description"/>
		<input ref={fileInput} type="file" className="form-control-file" name="file"/>
		<div 
			onClick={mode==='edit'?(event)=>{editProduct();}:(event)=>{createProduct();}}
		>
			누르기
		</div>
			{/* <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers"/> */}
	</>;
}

export default function Product() {
	return <main className="product">
		<Routes>
			<Route exact path='/create' element={<CreateProduct mode={'create'}/>}/>
			<Route path='/edit/:id' element={<CreateProduct mode={'edit'}/>}/>
			<Route path='/list' element={<ProductList/>}/>
			<Route path='/list/:page' element={<ProductList/>}/>
			<Route path='/detail/:id' element={<ProductDetail/>}/>
		</Routes>
	</main>
}