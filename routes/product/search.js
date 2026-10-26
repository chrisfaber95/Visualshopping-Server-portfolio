const db = require('../../config/connection');

module.exports = (req, res) => {
    let search = db.connection.escape(req.params.search)
    let cat = ""
    if (req.query.dep) {
        cat = db.connection.escape(req.query.dep)
    }
    /*var sqlquery = "SELECT *, MATCH (title, ean, categoryname2, categoryname1, omschrijving) AGAINST ('" + req.params.search + "') AS relevance FROM cooplubbers.productView WHERE MATCH(title, ean, categoryname2, categoryname1, omschrijving)"
    sqlquery += "AGAINST('" + req.params.search + "' IN NATURAL LANGUAGE MODE) and beschikbaar >= 2 AND ASCII(categoryname1) BETWEEN 97 AND 122 "
    if (req.query.dep) {
        sqlquery += "AND categoryname1 = '" + req.query.dep + "' "
    }
    sqlquery += "ORDER BY relevance DESC Limit 25; "
    */
    var sqlquery = `
    use cooplubbers;
        set @product_multiplier=3;
        set @info_multiplier=2.5;
        set @target=${search};
        select info.*, productView.* from (
        SELECT eancode, sum(relevance) as totalrelevance from (
        SELECT 
            'product' as 'table_name', 
            ean as eancode,
            @product_multiplier * (MATCH(ean,categoryname2, categoryname1) AGAINST (@target)) as relevance
            from Product as p
            UNION
            SELECT 
                'info' as 'table_name', 
                ean as eancode,
                @info_multiplier * (MATCH(omschrijving, title, variant) AGAINST (@target)) as relevance
                from Product_Information as pi
            )
            as sitewide 
            WHERE relevance > 0            
            group by eancode
            order by totalrelevance desc
            limit 0,30
            ) as info, productView
            where info.eancode = productView.ean
            and productView.stock >= 1
			and beschikbaar is not null
        `
    if (cat != '') {
        sqlquery += `and productView.categoryname1 = ${cat}`
    }
    sqlquery += `
            ;       
        `
        console.log(sqlquery)
    db.connection.query(sqlquery, function(err, result) {
        if (err) throw err;
        const prods = result[4];
        //console.log(prods)
        res.status(200).json(prods);
    })
};
