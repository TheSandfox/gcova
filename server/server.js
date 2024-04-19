// express 모듈 호출
const express = require('express');
const cookies = require('cookie-parser');
const path = require('path');
const multer  = require('multer');
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, '../public/img')
	},
	filename: function (req, file, callback) {
	  const uniqueSuffix = '-'+Date.now()+path.extname(file.originalname);// + '-' + Math.round(Math.random() * 1E9)
	  callback(null,path.basename(file.originalname)+uniqueSuffix);
	}
});
const upload = multer({ 
	dest: '../public/img',
	storage: storage,
	limits: {
		fileSize:1024*1024*2
	} 
});
const cors = require('cors');
const app = express();
const api = require('./routes/api_db');
const PORT = process.env.PORT || 3001;

app.use(cookies());
app.use(express.json());
app.use(cors({
		origin: "*", // 출처 허용 옵션
		credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  })
)
app.use(express.static(path.join(__dirname,'/public')));
//
app.use(express.urlencoded({extended:false}));
app.use('/api',api);
 
app.listen(PORT, () => {
    console.log(`Server run : http://localhost:${PORT}/`)
})