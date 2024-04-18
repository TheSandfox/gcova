import axios from "axios";

import { useRef } from "react";
import { Routes, Route } from "react-router-dom";

function NewProduct() {
	const nameInput = useRef();
	const descriptionInput = useRef();
	const fileInput = useRef();
	async function newProduct() {
		let file = fileInput.current.files[0]
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name",nameInput.current.value)
		formData.append("description",descriptionInput.current.value)
		console.log("얏호우");
		await axios.post('http://localhost:3001/api/newProduct',
			formData,
			{
				params: {
					name:nameInput.current.value,
					description:descriptionInput.current.value
				},
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		.then(()=>{
		})
		.catch(
		)
	}

	return <>
		<div>새 제품 등록</div>
		<input ref={nameInput} type="text" name="name"/>
		<input ref={descriptionInput} type="text" name="description"/>
		<input ref={fileInput} type="file" className="form-control-file" name="file"/>
		<button 
			onClick={(event)=>{newProduct();}}
		>
			누르기
		</button>
			{/* <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers"/> */}
	</>;
}

export default function Products() {
	return <main className="products"> 
		<Routes>
			<Route exact path='/new' element={<NewProduct/>}/>
		</Routes>
	</main>
}