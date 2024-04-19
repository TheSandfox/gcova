const express = require('express');
const path = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, '../public/img')
	},
	filename: function (req, file, callback) {
	  const uniqueSuffix = Date.now()+path.extname(file.originalname);// + '-' + Math.round(Math.random() * 1E9)
	  console.log(/*path.basename(file.originalname)+*/uniqueSuffix);
	  callback(null,Date.now()+path.extname(file.originalname)/*file.originalname*/);
	}
});
const upload = multer({ 
	storage: storage,
	limits: {
		fileSize:1024*1024*2
	} 
});
const router = express.Router()
const db = require('./db');


router.get('/test',(req,res)=>{
	res.cookie('id2','TEEEEST22');
	console.log(req.cookies);
	res.send('Hello World!');
})

//게시물=======================================================================
router.get('/getNotices',(req,res)=>{
	let page = req.query.page;
	let threshold = req.query.threshold;
	console.log('//')
	console.log('게시물가져오기')
	console.log('//')
	db.getNotices(page,threshold,(notices)=>{
		res.send(JSON.parse(JSON.stringify(notices)));
	})
})

router.get('/getNotice',(req,res)=>{
	db.getNotice(req.query.id,(notice)=>{
		res.send(JSON.parse(JSON.stringify(notice)));
	})
});

router.get('/getNewNotice',(req,res)=>{
	db.getNewNotice((notice)=>{
		res.send(JSON.parse(JSON.stringify(notice)));
	})
});

router.get('/createNotice',(req,res)=>{
	db.createNotice(
		req.query.title,
		req.query.content,
		()=>{
			console.log('notice has been created')
			res.send('포스트 추가 완료!')
		}
	)
})

router.get('/countNotices',(req,res)=>{
	db.countNotices(
		(val)=>{
			res.send(Object.values(val[0]));
		}
	)
})
//제품=======================================================================
router.post('/createProduct', upload.single('file'), function (req, res) {
	let params = req.body;
	// console.log(params);
	// console.log(req.file);
	db.createProduct(
		params.name,
		params.description,
		req.file.filename,
		(result)=>{
			console.log(result);
			console.log(result.insertId);
			res.send([String(result.insertId)]);
			// res.send(JSON.stringify(result));
		}
	)
})

router.post('/editProduct', upload.single('file'), function (req, res) {
	let params = req.body;
	// console.log(params);
	// console.log(req.file);
	db.editProduct(
		params.id,
		params.name,
		params.description,
		req.file.filename,
		()=>{
			res.send("");
		}
	)
})

router.get('/getProduct',(req,res)=>{
	let id = req.query.id
	db.getProduct(
		id,
		(product)=>{
			res.send(product);
		}
	)
	// res.send([{
	// 	name:'김김김',
	// 	description:'나나나',
	// 	img:'missing.png'
	// }]);
})

router.get('/getProducts',(req,res)=>{
	let page = req.query.page;
	let threshold = req.query.threshold;
	db.getProducts(page,threshold,(notices)=>{
		res.send(JSON.parse(JSON.stringify(notices)));
	})
})

router.post('/editProduct',(req,res)=>{

})

module.exports = router;