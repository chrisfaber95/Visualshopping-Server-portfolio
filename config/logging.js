require('dotenv').config();
const fs = require("fs");
/*
	Levels:
		1: Error
		2: Info
		3: -

*/
const log = function(level, data){
	const timestamp =  new Date().toLocaleString()
	try{		
		switch (level){
			case 1:
				console.log(level, data)
				fs.writeFileSync('./logs/LogError.txt', "\n ERROR|" + timestamp +'|'+ data,{flag:'a+'}); 
				break;
			case 2:				
				fs.writeFileSync('./logs/LogInfo.txt', "\n Info|" + timestamp +'|'+ data,{flag:'a+'});
				break;
			default:
				break;
		}
	}
	catch(err){
		console.error(err)
	}
}

const setMailOptions = async function(r){
	
	try{
		return false
	}
	catch(err){
		console.error(err)
	}
}

module.exports = {
    setMailOptions: setMailOptions,
	log: log
};
 