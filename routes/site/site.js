const db = require('../../config/connection');

const Datastore = require('nedb');
const he = require('he')
productlinks = new Datastore({filename: 'productlinks.db', autoload: true });

const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.coop.nl/boodschappen';
var re = "PageSize=24"; 

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)


module.exports = (req, res) => {
	
	var interval = 500;
		productlinks.find({}, function (err, docs){
			var doclength = docs.length
			for(x = 0; x < doclength; x++){				
			//for(x = 0; x < 10; x++){
				var url1 = docs[x].url
				setTimeoutPromise(interval * x, url1).then((value) => {
					//searchProduct(value);
					//console.log(x)
					
					rp(value)
						.then(function(html){

							var length = $('.crumbs li a span',html).length;
					//	console.log($('.crumbs li a span',html)[length -1].children[0].data);			
							 	
							var	url2= value
							var	title= $('.crumbs li a span',html)[length -1].children[0].data
							var	categoryname1= $('.crumbs li a span',html)[2].children[0].data
							var	categoryname2= $('.crumbs li a span',html)[3].children[0].data
							var	imgurl= (($('article picture img', html)[0].attribs['data-srcset']).match(/^(\S+)\s(.*)/).slice(1)[0])
							var	itemtype= $('article ', html).parent()[0].attribs.itemtype
							var	price= JSON.parse($('article ', html).parent()[0].attribs['data-product'])['price']
							var	variant= JSON.parse($('article ', html).parent()[0].attribs['data-product'])['variant']
							var	ean= JSON.parse($('article ', html).parent()[0].attribs['data-product'])['id']
							var	dataproduct= $('article ', html).parent()[0].attribs['data-product']
							var	datasyndyproductid= $('.syndy-nutrients', html)[0].attribs['data-syndy-productid']
							var	datasyndyfont= $('.syndy-nutrients', html)[0].attribs['data-syndy-font']
							var	datasyndyculturedid= $('.syndy-nutrients', html)[0].attribs['data-syndy-culturedid']
							var	schaphoogte= getRandomInt(5)
							var	schapplaats= getRandomInt(30)
							
							//	console.log(title)
							var slug = ($('.crumbs li a span',html)[2].children[0].data).replace(/\s+/g, '-').toLowerCase() + '/' + ($('.crumbs li a span',html)[3].children[0].data).replace(/\s+/g, '-').toLowerCase();


							var sqlquery = "INSERT INTO `cooplubbers`.`Product` "
								sqlquery += "(`url`, `title`, `categoryname1`,	`categoryname2`, `imgurl`, `itemtype`, `price`, `variant`, `ean`, `dataproduct`, "
								sqlquery += "`datasyndyproductid`, `discountPrice`, `datasyndyfont`, `schaphoogte`, `schapplaats`) "
								sqlquery += "VALUES('"+ url2 +"',"+ db.connection.escape(title) +", "+ db.connection.escape(categoryname1) +", "+ db.connection.escape(categoryname2) +", '"+ imgurl +"', '"+ itemtype +"', '"+ price +"', "+ db.connection.escape(variant) +", '"+ ean +"', '"+ dataproduct +"', "
								sqlquery += "'"+ datasyndyproductid +"', 0.00 , '"+ datasyndyfont +"', "+ schaphoogte +", "+ schapplaats +"); "
						//	console.log(sqlquery);
								db.connection.query(sqlquery, function (err, result){
								if(err) throw err;
							//	console.log(result);
								const message = "Done ripping from website"
							})  
						})		
					  .catch(function(err){
						//handle error
					  });
					
				});
			}
		})
			const message = "Done ripping from website"
			res.status(200).json({message});	
	/*	rp(url)
		  .then(function(html){
			//success!
			//console.log($('.main .categoryItem > a ', html).length);
			var catSize = $('.main .categoryItem > a ', html).length;
			for (let i = 0; i < catSize; i++) {
		//	for (let i = 0; i < 2; i++) {
				console.log($('.main .categoryItem > a ', html)[i].attribs.href);

				rp($('.main .categoryItem > a ', html)[i].attribs.href)
				  .then(function(html){
					//success!
					//console.log($('.pagination__listItem > a', html).length);
					//console.log($('.pagination__listItem > a', html)[1].attribs.href);
					var catHref = ($('.pagination__listItem > a', html)[1].attribs.href).replace(re, "PageSize=1700");
					console.log(catHref);
						rp(catHref)
						.then(function(html){
							//success!
							console.log($('article header h2', html).length);
							const catlength = $('article header h2', html).length;
							//console.log($('article header h2', html)[3]);
							//for(let j = 0; j < $('article header h2', html).length; j++){
							for(let j = 0; j < catlength; j++){
									setTimeout( function (i) {
										hrefs = $('article > .formfields > a', html)[j].attribs.href;

											const doc = { 	
												url: hrefs
											}

										productlinks.insert(doc, function (err, newDoc) { 	// Callback is optional
										//	console.log(	doc );
										});
									}, interval * i * j, i * j);
								}
							})
						  .catch(function(err){
							//handle error
						  });
					})
				  .catch(function(err){
					//handle error
				  });

			}
		  })
		  .catch(function(err){
			//handle error
		  });
	*/
	
		
   /*
		var sqlquery = "INSERT INTO `cooplubbers`.`Product` "
		sqlquery += "(`url`, `title`, `categoryname1`,	`categoryname2`, `imgurl`, `itemtype`, `price`, `variant`, `ean`, `dataproduct`, "
		sqlquery += "`datasyndyproductid`, `discountPrice`, `datasyndyfont`, `schaphoogte`, `schapplaats`) "
		sqlquery += "VALUES(<{url: }>,	<{title: }>, <{categoryname1: }>, <{categoryname2: }>, <{imgurl: }>, <{itemtype: }>, <{price: }>, <{variant: }>, <{ean: }>,	<{dataproduct: }>, "
		sqlquery += "<{datasyndyproductid: }>, <{discountPrice: 0.00}>, <{datasyndyfont: }>,	<{schaphoogte: }>,	<{schapplaats: }>); "
	
	
		db.connection.query(sqlquery, function (err, result){
		if(err) throw err;
		console.log(result);
		const message = result;*/
	//	const message = "Done ripping from website"
     //   res.status(200).json({message});
//	})   
};

/*
router.get('/api/coopextra', (req, res) => {
		
		productlinks.find({}, function (err, docs){
			//for(x = 0; x < docs.length; x++){				
			for(x = 0; x < 1700; x++){
				//console.log(docs[x].url);
				searchProduct(docs[x].url);
			}
		});
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


const  searchProduct  = (url, cb) => {
	rp(url)
		.then(function(html){
				
			var length = $('.crumbs li a span',html).length;
		//	console.log($('.crumbs li a span',html)[length -1].children[0].data);			
			const doc = { 	
				url: url,
				title: $('.crumbs li a span',html)[length -1].children[0].data,
				categoryname1: $('.crumbs li a span',html)[2].children[0].data,
				categoryname2: $('.crumbs li a span',html)[3].children[0].data,
				imgurl: (($('article picture img', html)[0].attribs['data-srcset']).match(/^(\S+)\s(.*)/).slice(1)[0]),
				itemtype: $('article ', html).parent()[0].attribs.itemtype,
				price: JSON.parse($('article ', html).parent()[0].attribs['data-product'])['price'],
				variant: JSON.parse($('article ', html).parent()[0].attribs['data-product'])['variant'],
				ean: JSON.parse($('article ', html).parent()[0].attribs['data-product'])['id'],
				dataproduct: $('article ', html).parent()[0].attribs['data-product'],
				datasyndyproductid: $('.syndy-nutrients', html)[0].attribs['data-syndy-productid'],
				datasyndyfont: $('.syndy-nutrients', html)[0].attribs['data-syndy-font'],
				datasyndyculturedid: $('.syndy-nutrients', html)[0].attribs['data-syndy-culturedid'],
				schaphoogte: getRandomInt(5),
				schapplaats: getRandomInt(30)
			}
			
			var slug = ($('.crumbs li a span',html)[2].children[0].data).replace(/\s+/g, '-').toLowerCase() + '/' + ($('.crumbs li a span',html)[3].children[0].data).replace(/\s+/g, '-').toLowerCase();
			coopdepartmentsdb.ensureIndex({ fieldName: 'slug', unique: true }, function (err) {
			});
			coopdepartmentsdb.findOne({slug: slug}, function (err, docs1){
				if(docs1 == null){
					const doc1 = { 	
						mainlabel: ($('.crumbs li a span',html)[2].children[0].data),
						sec_label: ($('.crumbs li a span',html)[3].children[0].data),
						slug: slug
					}
					console.log(doc1);
					coopdepartmentsdb.insert(doc1, function (err, newDoc) { 	// Callback is optional
					});
				}
			})
			coopproductdb.insert(doc, function (err, newDoc) { 	// Callback is optional
				console.log(url );
			});
	//		console.log($('#main > section', html));
		})		
	  .catch(function(err){
		//handle error
	  });
}*/


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


function searchProduct (url){
	rp(url)
		.then(function(html){
				
			var length = $('.crumbs li a span',html).length;
		//	console.log($('.crumbs li a span',html)[length -1].children[0].data);			
			const doc = { 	
				url: url,
				title: he.encode($('.crumbs li a span',html)[length -1].children[0].data),
				categoryname1: he.encode($('.crumbs li a span',html)[2].children[0].data),
				categoryname2: he.encode($('.crumbs li a span',html)[3].children[0].data),
				imgurl: he.encode((($('article picture img', html)[0].attribs['data-srcset']).match(/^(\S+)\s(.*)/).slice(1)[0])),
				itemtype: he.encode($('article ', html).parent()[0].attribs.itemtype),
				price: JSON.parse($('article ', html).parent()[0].attribs['data-product'])['price'],
				variant: he.encode(JSON.parse($('article ', html).parent()[0].attribs['data-product'])['variant']),
				ean: JSON.parse($('article ', html).parent()[0].attribs['data-product'])['id'],
				dataproduct: he.encode($('article ', html).parent()[0].attribs['data-product']),
				datasyndyproductid: he.encode($('.syndy-nutrients', html)[0].attribs['data-syndy-productid']),
				datasyndyfont: he.encode($('.syndy-nutrients', html)[0].attribs['data-syndy-font']),
				datasyndyculturedid: he.encode($('.syndy-nutrients', html)[0].attribs['data-syndy-culturedid']),
				schaphoogte: getRandomInt(5),
				schapplaats: getRandomInt(30)
			}
			
			var slug = ($('.crumbs li a span',html)[2].children[0].data).replace(/\s+/g, '-').toLowerCase() + '/' + ($('.crumbs li a span',html)[3].children[0].data).replace(/\s+/g, '-').toLowerCase();
		
		
			var sqlquery = "INSERT INTO `cooplubbers`.`Product` "
				sqlquery += "(`url`, `title`, `categoryname1`,	`categoryname2`, `imgurl`, `itemtype`, `price`, `variant`, `ean`, `dataproduct`, "
				sqlquery += "`datasyndyproductid`, `discountPrice`, `datasyndyfont`, `schaphoogte`, `schapplaats`) "
				sqlquery += "VALUES('"+ doc.url +"','"+ doc.title +"', '"+ doc.categoryname1 +"', '"+ doc.categoryname2 +"', '"+ doc.imgurl +"', '"+ doc.itemtype +"', '"+ doc.price +"', '"+ doc.variant +"', '"+ doc.ean +"',	'"+ doc.dataproduct +"', "
				sqlquery += "'"+ doc.datasyndyproductid +"', 0.00 , '"+ doc.datasyndyfont +"', "+ doc.schaphoogte +", "+ doc.schapplaats +"); "

				db.connection.query(sqlquery, function (err, result){
				if(err) throw err;
				const message = "Done ripping from website"
			})  
		})		
	  .catch(function(err){
		//handle error
	  });
}