var mysql      = require('mysql2');
var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: '123456',
	database	: 'gcova',//schema이름임.
	dateStrings	: 'date'
});

const TABLE_NAME = 'notices';

function replaceEscape(raw) {
	let rs = raw.replaceAll(`\\`,`\\\\`);
	rs = rs.replaceAll(`\'`,`\\'`);
	return rs;
}

function countNotices(callback) {
	connection.query(
		`
		SELECT COUNT(*) FROM ${TABLE_NAME}
		`
		,(err,val)=>{
			if(err) throw err;
			callback(val['COUNT(*)']);
		}
	);
}

function getNotices(page,noticesPerPage,callback) {
	connection.query(
		`
		SELECT * FROM ${TABLE_NAME} LIMIT ${noticesPerPage*page},${noticesPerPage}
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
		SELECT * FROM ${TABLE_NAME} ORDER BY id DESC LIMIT 1
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
		INSERT INTO ${TABLE_NAME}(title,content,date) VALUES('${title}','${content}',NOW())
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
		TRUNCATE TABLE ${TABLE_NAME}
		`
		,(err)=>{
			if(err) throw err;
			callback();
		}
	);
}

module.exports = {
	getNotices,
	createNotice,
	clearNotices,
	countNotices,
	getNewNotice
}
