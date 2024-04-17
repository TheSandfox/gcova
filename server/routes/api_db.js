const express = require('express');
const router = express.Router()
const db = require('./db');


router.get('/test',(req,res)=>{
	res.send('Hello World!');
})

router.get('/getNotices',(req,res)=>{
	let page = req.query.page;
	let threshold = req.query.threshold;
	db.getNotices(page,threshold,(notices)=>{
		res.send(JSON.parse(JSON.stringify(notices)));
	})
})

router.get('/getNewNotice',(req,res)=>{
	db.getNewNotice((notice)=>{
		res.send(JSON.parse(JSON.stringify(notice)));
	})
})

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
			res.send(String(val)+'개')
		}
	)
})

module.exports = router;