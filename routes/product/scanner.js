const db = require('../../config/connection');

const Datastore = require('nedb');
const he = require('he')

const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.coop.nl/product/';
var re = "PageSize=24"; 

const util = require('util')
const setTimeoutPromise = util.promisify(setTimeout)


module.exports = (req, res) => {
	var sqlquery = "SELECT p.* "
		sqlquery += "FROM `Product` as p WHERE p.ean = '" + req.body.ean + "'; "
		db.connection.query(sqlquery, function (err, result){
			if(err) throw err;
			if(result.length != 0){
				var sqlquery = "UPDATE `Product` SET `beschikbaar` = " + req.body.aantal +  ",`schaphoogte` = " + req.body.schaphoogte + ",`schapplaats` = " + req.body.schapplaats + ",`schapcode` = " + req.body.schapcode + " WHERE `ean` = '" + req.body.ean + "'; "
				db.connection.query(sqlquery, function (err, result){
					if(err) throw err;
					else{
						if(result != null){				
							const docs = "product updated";
							res.status(200).json({docs});
						}
					}
				})
			}
			else{
				var url1 = url + req.body.ean	
				rp(url1)
				.then(function(html){
					var	title= $('.crumbs li a span',html)[length -1].children[0].data
					var length = $('.crumbs li a span',html).length;
					var	url2= url1
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
					var	schaphoogte= req.body.schaphoogte
					var	schapplaats= req.body.schapplaats
					var beschikbaar= req.body.aantal
					var schapcode= req.body.schapcode
					var slug = ($('.crumbs li a span',html)[2].children[0].data).replace(/\s+/g, '-').toLowerCase() + '/' + ($('.crumbs li a span',html)[3].children[0].data).replace(/\s+/g, '-').toLowerCase();


					var sqlquery = "INSERT INTO `cooplubbers`.`Product` "
						sqlquery += "(`url`, `title`, `categoryname1`,	`categoryname2`, `imgurl`, `itemtype`, `price`, `variant`, `ean`, `dataproduct`, "
						sqlquery += "`datasyndyproductid`, `discountPrice`, `datasyndyfont`, `schaphoogte`, `schapplaats`, `schapcode`, `beschikbaar`) "
						sqlquery += "VALUES('"+ url2 +"',"+ db.connection.escape(title) +", "+ db.connection.escape(categoryname1) +", "+ db.connection.escape(categoryname2) +", '"+ imgurl +"', '"+ itemtype +"', '"+ price +"', "+ db.connection.escape(variant) +", '"+ ean +"', '"+ dataproduct +"', "
						sqlquery += "'"+ datasyndyproductid +"', 0.00 , '"+ datasyndyfont +"', "+ schaphoogte +", "+ schapplaats +", '"+ schapcode +"', 1); "

						db.connection.query(sqlquery, function (err, result){
						if(err) throw err;

						const message = "Done ripping from website"
						const docs = "product updated";
							res.status(200).json({docs});
					})  
					
				})		
				  .catch(function(err){
					//handle error
				  });
			}
		
		})
}
/*
router.get('/api/coopextra', (req, res) => {
		
		productlinks.find({}, function (err, docs){
			//for(x = 0; x < docs.length; x++){				
			for(x = 0; x < 1700; x++){
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
					coopdepartmentsdb.insert(doc1, function (err, newDoc) { 	// Callback is optional
					});
				}
			})
			coopproductdb.insert(doc, function (err, newDoc) { 	// Callback is optional
			});
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
				sqlquery += "`datasyndyproductid`, `discountPrice`, `datasyndyfont`, `schaphoogte`, `schapplaats`, `schapcode`) "
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