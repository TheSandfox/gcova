var mysql      = require('mysql2');
var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: '123456',
	database	: 'gcova',//schema이름임.
	dateStrings	: 'date'
});

const TABLE_NAME_NOTICES = 'notices';
const TABLE_NAME_PRODUCTS = 'products';

function replaceEscape(raw) {
	let rs = raw.replaceAll(`\\`,`\\\\`);
	rs = rs.replaceAll(`\'`,`\\'`);
	return rs;
}

function getNotice(id,callback) {
	if(isNaN(id)) {
		callback([]);
		return;
	}
	connection.query(
		`
		SELECT * FROM ${TABLE_NAME_NOTICES} WHERE id=${id}
		`
		,(err,notice)=>{
			if(err) throw err;
			callback(notice);
		}
	);
}

function countNotices(callback) {
	connection.query(
		`
		SELECT COUNT(*) FROM ${TABLE_NAME_NOTICES}
		`
		,(err,val)=>{
			if(err) throw err;
			callback(val);
		}
	);
}

function getNotices(page,noticesPerPage,callback) {
	connection.query(
		`
		SELECT id,title,date FROM ${TABLE_NAME_NOTICES} ORDER BY id DESC LIMIT ${noticesPerPage*page},${noticesPerPage}
		`
		,(err,notices)=>{
			if(err) throw err;
			callback(notices);
		}
	);
}

function getNewNotice(callback) {
	connection.query(
		`
		SELECT * FROM ${TABLE_NAME_NOTICES} ORDER BY id DESC LIMIT 1
		`
		,(err,notice)=>{
			if(err) throw err;
			callback(notice);
		}
	);
}

function createNotice(title,content,callback) {
	title = replaceEscape(title);
	content = replaceEscape(content);
	connection.query(
		`
		INSERT INTO ${TABLE_NAME_NOTICES}(title,content,date) VALUES('${title}','${content}',NOW())
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	);
}

function clearNotices(callback) {
	connection.query(
		`
		TRUNCATE TABLE ${TABLE_NAME_NOTICES}
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	);
}

function createProduct(name,description,img,callback) {
	name = replaceEscape(name);
	description = replaceEscape(description);
	img = replaceEscape(img);
	connection.query(
		`
		INSERT INTO ${TABLE_NAME_PRODUCTS}(name,description,img,date,update_date) 
		VALUES('${name}','${description}','${img}',NOW(),NOW())
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	);
}

module.exports = {
	getNotice,
	getNotices,
	createNotice,
	clearNotices,
	countNotices,
	getNewNotice,
	createProduct
}
