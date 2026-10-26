//const db = require('../../config/connection');
const {Product}= require('../../models/index');
const { Op, QueryTypes  } = require("sequelize");
const sequelize = require('../../config/connection');
var SqlString = require('sequelize/lib/sql-string')
const Logger = require('../../config/logging.js');
    
module.exports = (req, res) => {
    let search = SqlString.escape(req.query.search); // Assuming the search parameter is in the request body
    let cat = req.query.department_id;
    
    let product_multiplier = 3;
    let ean_multiplier = 4;
    let info_multiplier = 2.2;
    
    console.log(req.query.search);
    console.log(search);
    
    var sqlquery = `
        SELECT info.*, Product.* FROM (
            SELECT eancode, SUM(relevance) AS totalrelevance FROM (
                SELECT 
                    'product' AS 'table_name', 
                    ean AS eancode,
                    ${product_multiplier} * (MATCH(ean, categoryname2, categoryname1) AGAINST (${search})) AS relevance
                FROM Product AS p
                UNION
                SELECT 
                    'info' AS 'table_name', 
                    ean AS eancode,
                    ${info_multiplier} * (MATCH(omschrijving, title, variant, ingredients) AGAINST (${search})) AS relevance
                FROM Product_Information AS pi
            ) AS sitewide 
            WHERE relevance > 0            
            GROUP BY eancode
            ORDER BY totalrelevance DESC
            LIMIT 0, 50
        ) AS info, Product
        WHERE info.eancode = Product.ean
        AND Product.stock >= 1
        AND beschikbaar IS NOT NULL
        AND department_id IS NOT NULL`;
    
    // Check if the search term looks like an EAN-8 or Code 128 (assuming specific lengths for these codes)
    if (/^\d{8}$/.test(req.query.search)) {
        // If it looks like EAN-8, filter by it
        sqlquery += ` AND (Product.ean = ${SqlString.escape(req.query.search)} OR Product.ean LIKE '${SqlString.escape(req.query.search)}%')`;
    } else if (/^code_128/.test(req.query.search)) {
        // If it looks like Code 128, filter by it
        sqlquery += ` AND Product.ean = ${SqlString.escape(req.query.search)}`;
    } else {
        // If it doesn't match the above patterns, perform a general search
        // You can add additional conditions or change the query as needed to perform a broader search
    }
    
    if (req.query.department_id != null) {
        sqlquery += ` AND Product.department_id = ${cat}`;
    }
    
    sqlquery += `
        LIMIT 0, 50;
    `;
    
    sequelize.connection
        .query(sqlquery, {
            logging: false,
            nest: true,
            raw: false,
            type: QueryTypes.SELECT,
            model: Product,
            mapToModel: true
        })
        .then((products) => {
            console.log(products);
    
            if (products.length == 1) {
                // Extract the EAN code of the first found product
                const firstProductEAN = products[0].ean;
            
                // Extract the categoryname of the first found product
                const firstProductCategory = products[0].categoryname1;
            
                // Extract the title of the first found product from Product_Information table
                const firstProductInfoQuery = `
                    SELECT title
                    FROM Product_Information
                    WHERE ean = ${SqlString.escape(firstProductEAN)}
                    LIMIT 1
                `;
            
                sequelize.connection
                    .query(firstProductInfoQuery, {
                        nest: true,
                        raw: false,
                        type: QueryTypes.SELECT
                    })
                    .then((infoResults) => {
                        
                        console.log(infoResults);
                        if (infoResults.length > 0) {
                            const firstProductTitle = infoResults[0].title;
            
                            // Create a new SQL query to find similar products based on title and category
                            const similarProductsQuery = `
                            SELECT info.*, Product.* FROM (
                                SELECT eancode, SUM(relevance) AS totalrelevance FROM (
                                    SELECT 
                                        'product' AS 'table_name', 
                                        ean AS eancode,
                                        ${product_multiplier} * (MATCH(ean, categoryname2, categoryname1) AGAINST (${SqlString.escape(firstProductCategory)})) AS relevance
                                    FROM Product AS p
                                    UNION
                                    SELECT 
                                        'info' AS 'table_name', 
                                        ean AS eancode,
                                        ${info_multiplier} * (MATCH(omschrijving, title, variant, ingredients) AGAINST (${SqlString.escape(firstProductTitle)})) AS relevance
                                    FROM Product_Information AS pi
                                ) AS sitewide 
                                WHERE relevance > 0            
                                GROUP BY eancode
                                ORDER BY totalrelevance DESC
                                LIMIT 0, 50
                            ) AS info, Product
                            WHERE info.eancode = Product.ean
                            AND Product.stock >= 1
                            AND beschikbaar IS NOT NULL
                            AND department_id IS NOT NULL;
                            `;
            
                            sequelize.connection
                                .query(similarProductsQuery, {
                                    nest: true,
                                    raw: false,
                                    type: QueryTypes.SELECT,
                                    model: Product,
                                    mapToModel: true
                                })
                                .then((similarProducts) => {
                                    console.log(similarProducts);
                                    // Combine the original products and similar products, ensuring the first product is at the top
                                    const finalResult = [products[0], ...similarProducts];
                                    res.status(200).json(finalResult);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    Logger.log(1, err);
                                });
                        } else {
                            // No product information found, return an empty response or handle as needed
                            res.status(200).json([]);
                        }
                    })
                    .catch((err) => {
                        Logger.log(1, err);
                    });
            } else {
                console.log(products)
                res.status(200).json(products);
            }
        })
        .catch((err) => {
            Logger.log(1, err);
        });
};
