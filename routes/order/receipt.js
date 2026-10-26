
const {Order, OrderHasProduct, Product, Productinformation, ProductHasDiscount, Discounts, OrderInformation}= require('../../models/index');
const {JobOffer, Shop, Information, Address, Socials, Business_Hours}= require('../../store_models/index');
const { Op } = require("sequelize");
const Logger = require('../../config/logging.js');
const bwipjs = require('bwip-js');
var pdf = require('html-pdf');


const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.CRYPTR_KEY);

const getName = (first, last) => {
    if(!first && !last) {
        return null
    }
    return `${first || ''} ${last || ''}`
}

const generateCustomerDetails = (details, invoice_details) => {
    var html = `    
        <p style="margin-bottom:3px; font-size: 12px;">Naam: ${invoice_details?.customerName || 
                    getName(invoice_details?.first_name, invoice_details?.surname) || 
                    details?.customerName || 
                    getName(details?.first_name, details?.surname) ||
                    ''}</p>`
    if(invoice_details?.klantenkaart || details?.klantenkaart){html += `<p style="margin-bottom:3px; font-size: 12px;">Klant nr.: ${invoice_details?.klantenkaart || details?.klantenkaart || ''}</p>`}
    if(invoice_details?.business){html += `<p style="margin-bottom:3px; font-size: 12px;">Bedrijf: ${invoice_details?.business || ''}</p>`}
    if(invoice_details?.contactperson){html += `<p style="margin-bottom:3px; font-size: 12px;">Telefoon: ${invoice_details?.contactperson || ''}</p>`}
    if(invoice_details?.businessphone){html += `<p style="margin-bottom:3px; font-size: 12px;">Telefoon: ${invoice_details?.businessphone || ''}</p>`}
    html += `<p style="margin-bottom:3px; font-size: 12px;">Telefoon: ${invoice_details?.customerPhone || details?.customerPhone || ''}</p>
        <p style="margin-bottom:3px; font-size: 12px;">Adres: ${invoice_details.street || details.street || ''} ${invoice_details.house_number || details.house_number || ''} ${invoice_details.house_addition || details.house_addition || ''}</p>
        <p style="margin-bottom:3px; font-size: 12px;">${invoice_details.zipcode || details.zipcode || ''} ${invoice_details.city || details.city || ''}</p>
    `
    return html
}

const getDateTime = ((date) =>{
    var new_date = {
        date: '',
        time: ''
    }
    date = new Date(date)    
    const optie = { hour12: false };
    new_date.time = date.toLocaleTimeString('nl-NL', optie);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Add 1 since getMonth() returns a zero-based index
    const day = date.getDate();

    new_date.date = `${day}-${month}-${year}`
    
    return new_date
})


const generateInvoiceDetails = (details, first = false) => {
    var html = `     
        <p style="margin-bottom:3px; font-size: 12px;">${isPicked(details.status) ? 'Proforma' : 'Factuur nr.' }: ${details.invoice_number || ''}${first ? 'A' : 'B'}</p>
        <p style="margin-bottom:3px; font-size: 12px;">Datum: ${getDateTime(details?.orderDate).date || ''}</p>
        <p style="margin-bottom:3px; font-size: 12px;">Tijd: ${getDateTime(details?.orderDate).time || ''}</p>
        <p style="margin-bottom:3px; font-size: 12px;">Winkelbon: ${details?.winkelbon || ''}</p>
    `
    return html
}

const isPicked = (status) => {
    if(status == 'ordered'){
        return true
    }
    return false
}
//isPicked ? 'Proforma' : 'Factuur'

const getStoreInfo = async (shop_id) => {
    
    return new Promise((resolve) => {
        var where = {'shop_id': shop_id}
        Shop.findAll({        
            logging: false,
            where: where,
            include: [
                {
                    model: Information,
                    as: 'information',
                    include:[{
                        model: Address,
                        as: 'address'
                    }]
                },
                {
                    model: Socials,
                    as: 'socials'
                },
                {
                    model: Business_Hours,
                    as: 'business_hours'
                }
            ],
        })
        .then((store_info) => {
            resolve(store_info[0])
        })
        .catch((err) =>{        
            resolve(null)
        })
    })
}

const generateBarcode = async (code, type = 'code128') => {
    return new Promise((resolve) => {
        bwipjs.toBuffer({
            bcid: type,
            text: code,
            scale: 2,
            height: 15,
            includetext: true,
            textxalign: 'center',
            textsize: 12,
            paddingwidth: 10,
        }, function (err, png) {
            if (err) {
                console.log(err)
            resolve(``)
            } else {
            const base64Image = Buffer.from(png).toString('base64');
            const dataUri = `data:image/png;base64,${base64Image}`;
            resolve(`<img width: 100%; height: auto;" src="${dataUri}" alt="EAN barcode">`);
            }
        });
    })
} 

const generatePDF = async (order, delivery = false) => {
    const totals = await getTotalPrice(order.product_list, order)
    const shop_info = await getStoreInfo('31bc6562-6672-11ed-b67e-0242ac110003')

    if(delivery === true){
        return firstPaymentPDF()
    }


    var html = `<html>
    <!DOCTYPE html>
    <html>
       <head>
          <meta charset="UTF-8">
          <title>Factuur</title>
          </head>
        <body style="
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;">
            <div class="invoice-container"
                style="
                width: 100%;
                min-height: calc(100% - 50px);
                margin: 0 auto;
                background-color: rgba(255, 255, 255, 1);">
                <div class="invoice-header" 
                    style="text-align: left;
                    margin-bottom: 20px;">
                    <table style="width: 100%;" border:"1">
                        <tr>
                            <td class="logo" style="width: 30%;">
                                `
                                if(shop_info.information.logo_url){
                                    html += `<img
                                        style="width: 100%; height: auto;"
                                        src="${shop_info.information.logo_url}"/>`
                                }
                                else{
                                    html += `
                                    <h1 style="
                                        font-size: 36px;
                                        color: rgba(51, 51, 51, 1);">
                                        ${shop_info.shopname}
                                    </h1>`
                                }
                              html +=  `
                            </td>                            
                            <td style="width:40%">    
                                &nbsp;                            
                            </td>
                            <td class="invoice_info" style="width: 30%;">      
                                <div class="invoice-info" style="margin-bottom: 10px">
                                    <h3 style="
                                        font-size: 16px;
                                        color: rgba(51, 51, 51, 1);">
                                        Details factuur
                                    </h3>
                                    ${generateInvoiceDetails(order)}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td  style="width: 30%;">                                
                                <h3 style="
                                    font-size: 16px;
                                    color: rgba(51, 51, 51, 1);
                                    margin-bottom: 10px;">
                                    Klant
                                </h3>
                                ${generateCustomerDetails(order.order_information, order.invoice_order_information)}
                            </td>
                            <td  style="width: 40%;">    
                                &nbsp;                            
                            </td>
                            <td style="width: 30%;">`
                            if(order.winkelbon){
                                const barcode = await generateBarcode(order.winkelbon)
                                html += `${barcode}`
                            }                                  
                            html += `</td>
                        </tr>
                    </table>
                </div>
                        
            <table class="invoice-table" style="
            width: 100%;
            margin-bottom: 40px;
            border-collapse: collapse;">
            <thead>
                <tr>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Product</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Aantal</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">btw</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Prijs excl.</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Prijs incl.</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Totaal</th>
                </tr>
            </thead>
            <tbody>
                    ${generateProductList(order.product_list, order.status)}
                    `
                    if(totals.discount_total > 0){
                    
                        html+= `
                            <tr>
                                <td style="border: 1px solid rgba(221, 221, 221, 1);
                                padding: 12px;
                                text-align: left;
                                font-size: 14px;
                                color: rgba(85, 85, 85, 1); text-align: right;
                                font-weight: bold;" colspan="5" class="total">Totaal korting</td>
                                <td style="border: 1px solid rgba(221, 221, 221, 1);
                                padding: 12px;
                                text-align: left;
                                font-size: 14px;
                                color: rgba(85, 85, 85, 1); text-align: right;
                                font-weight: bold;" class="total">
                                    -&euro;${totals.discount_total.toFixed(2)}
                                </td>
                            </tr>`
                    }
                    for (const [key, value] of Object.entries(totals.no_vat)){
                    html+= ` 
                    <tr>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" colspan="5" class="total">Totaal BTW ${key}%</td>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" class="total">&euro;${value.vat.toFixed(2)}</td>
                   </tr>`
                }   
                    for (const [key, value] of Object.entries(totals.no_vat)){
                    html+= ` 
                    <tr>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" colspan="5" class="total">Totaal excl. BTW ${key}%</td>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" class="total">&euro;${value.price.toFixed(2)}</td>
                   </tr>`
                }               
               html+=  `<tr>
                  <td style="border: 1px solid rgba(221, 221, 221, 1);
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  color: rgba(85, 85, 85, 1); text-align: right;
                  font-weight: bold;" colspan="5" class="total">Totaalbedrag</td>
                  <td style="border: 1px solid rgba(221, 221, 221, 1);
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  color: rgba(85, 85, 85, 1); text-align: right;
                  font-weight: bold;" class="total">&euro;${totals.total.toFixed(2)}</td>
               </tr>
                </tbody>
            </table>           
	    </div>
        <div class="invoice-footer" 
        style="text-align: left;
        font-size: 14px;
        height: 50px;
        position: absolute;
        bottom: 0;
        width: 100%;
        color: rgba(85, 85, 85, 1); border-top: 2px solid #999999;">
                      
        <p style="margin-bottom:3px; font-size: 12px;">
            <b>${shop_info.shopname || ''},</b>
            <b>Adres: </b>${shop_info.information.address.street || ''} ${shop_info.information.address.house_number || ''}${shop_info.information.address.house_addition || ''}, 
            ${shop_info.information.address.zipcode || ''} ${shop_info.information.address.city || ''},
            <b>KVK: </b>${shop_info.information.kvk || ''},
            <b>BTW: </b>${shop_info.information.btw || ''},
            <b>Telefoon :</b>${shop_info.information.phone || ''},
            <b>Mobiel: </b>${shop_info.information.mobile || ''},
            <b>Email: </b>${shop_info.information.mail || ''},
            <b>Administratie E-mail: </b>${shop_info.information.admin_mail || ''}
        </p>
    </div>
    </body>
    </html>`
    return html
}

const generateFirstPDF = async (order) => {
    const shop_info = await getStoreInfo('31bc6562-6672-11ed-b67e-0242ac110003')
try{

    var html = `<html>
    <!DOCTYPE html>
    <html>
       <head>
          <meta charset="UTF-8">
          <title>Factuur</title>
          </head>
        <body style="
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;">
            <div class="invoice-container"
                style="
                width: 100%;
                min-height: calc(100% - 50px);
                margin: 0 auto;
                background-color: rgba(255, 255, 255, 1);">
                <div class="invoice-header" 
                    style="text-align: left;
                    margin-bottom: 20px;">
                    <table style="width: 100%;" border:"1">
                        <tr>
                            <td class="logo" style="width: 30%;">
                                `
                                if(shop_info.information.logo_url){
                                    html += `<img
                                        style="width: 100%; height: auto;"
                                        src="${shop_info.information.logo_url}"/>`
                                }
                                else{
                                    html += `
                                    <h1 style="
                                        font-size: 36px;
                                        color: rgba(51, 51, 51, 1);">
                                        ${shop_info.shopname}
                                    </h1>`
                                }
                              html +=  `
                            </td>                            
                            <td style="width:40%">    
                                &nbsp;                            
                            </td>
                            <td class="invoice_info" style="width: 30%;">      
                                <div class="invoice-info" style="margin-bottom: 10px">
                                    <h3 style="
                                        font-size: 16px;
                                        color: rgba(51, 51, 51, 1);">
                                        Details factuur
                                    </h3>
                                    ${generateInvoiceDetails(order, true)}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td  style="width: 30%;">                                
                                <h3 style="
                                    font-size: 16px;
                                    color: rgba(51, 51, 51, 1);
                                    margin-bottom: 10px;">
                                    Klant
                                </h3>
                                ${generateCustomerDetails(order.order_information, order.invoice_order_information)}
                            </td>
                            <td  style="width: 40%;">    
                                &nbsp;                            
                            </td>
                            <td style="width: 30%;">`
                            if(order.winkelbon){
                                const barcode = await generateBarcode(order.winkelbon)
                                html += `${barcode}`
                            }                                  
                            html += `</td>
                        </tr>
                    </table>
                </div>
                        
            <table class="invoice-table" style="
            width: 100%;
            margin-bottom: 40px;
            border-collapse: collapse;">
            <thead>
                <tr>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Product</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Aantal</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">btw</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Prijs excl.</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Prijs incl.</th>
                <th style="border: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                text-align: left;
                font-size: 14px;
                color: rgba(85, 85, 85, 1);
                background-color: rgba(242, 242, 242, 1);
	font-weight: bold;
	color: rgba(51, 51, 51, 1);">Totaal</th>
                </tr>
            </thead>
            <tbody>
            <tr class="product" style="">
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            text-align: left;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1);" class="title">
                Personal Shopper
            </td>
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1); text-align: right;" class="amount" >
                1 
            </td>
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1); text-align: right;" class="btw" >
                21
            </td>
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            text-align: right;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1);" class="prijs excl">
                &euro;${(+2 / (1 + (+21/100))).toFixed(2)}</td>
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
                &euro;${parseFloat(2).toFixed(2)}<br/>`
                //if(element.discounted_price > 0)html+= `&euro;${+element.discounted_price - +element.price}<br/>`                 
            html+= `</td>
            <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
            padding: 12px;
            padding-top: 3px;
            font-size: 14px;
            vertical-align: top;
            color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
            &euro;
                ${parseFloat(2).toFixed(2)}<br/></td></tr>`                 
            if(order.picking_price > 2){
                html+= `<tr><td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                text-align: left;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1);" class="title">
                    Bezorging
                </td>
                <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1); text-align: right;" class="amount" >
                    1 
                </td>
                <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1); text-align: right;" class="btw" >
                    21
                </td>
                <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                text-align: right;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1);" class="prijs excl">
                    &euro;${parseFloat((order.picking_price - 2) / (1 + (+21/100))).toFixed(2)}</td>
                <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
                    &euro;${parseFloat(+order.picking_price - 2).toFixed(2)}<br/>`
                    //if(element.discounted_price > 0)html+= `&euro;${+element.discounted_price - +element.price}<br/>`                 
                html+= `</td>
                <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                padding: 12px;
                padding-top: 3px;
                font-size: 14px;
                vertical-align: top;
                color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
                &euro;
                    ${parseFloat(+order.picking_price - 2).toFixed(2)}<br/></td></tr>`         
            }        
            html+= `
                    <tr>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" colspan="5" class="total">Totaal BTW ${21}%</td>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" class="total">&euro;${parseFloat(+order.picking_price - ( order.picking_price / (1 + (+21/100)))).toFixed(2)}</td>
                   </tr>
                    <tr>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" colspan="5" class="total">Totaal excl. BTW ${21}%</td>
                      <td style="border: 1px solid rgba(221, 221, 221, 1);
                      padding: 12px;
                      text-align: left;
                      font-size: 14px;
                      color: rgba(85, 85, 85, 1); text-align: right;
                      font-weight: bold;" class="total">&euro;${parseFloat( order.picking_price / (1 + (+21/100))).toFixed(2)}</td>
                   </tr>`    
               html+=  `<tr>
                  <td style="border: 1px solid rgba(221, 221, 221, 1);
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  color: rgba(85, 85, 85, 1); text-align: right;
                  font-weight: bold;" colspan="5" class="total">Totaalbedrag</td>
                  <td style="border: 1px solid rgba(221, 221, 221, 1);
                  padding: 12px;
                  text-align: left;
                  font-size: 14px;
                  color: rgba(85, 85, 85, 1); text-align: right;
                  font-weight: bold;" class="total">&euro;${parseFloat(order.picking_price).toFixed(2)}</td>
               </tr>
                </tbody>
            </table>           
	    </div>
        <div class="invoice-footer" 
        style="text-align: left;
        font-size: 14px;
        height: 50px;
        position: absolute;
        bottom: 0;
        width: 100%;
        color: rgba(85, 85, 85, 1); border-top: 2px solid #999999;">
                      
        <p style="margin-bottom:3px; font-size: 12px;">
            <b>${shop_info.shopname || ''},</b>
            <b>Adres: </b>${shop_info.information.address.street || ''} ${shop_info.information.address.house_number || ''}${shop_info.information.address.house_addition || ''}, 
            ${shop_info.information.address.zipcode || ''} ${shop_info.information.address.city || ''},
            <b>KVK: </b>${shop_info.information.kvk || ''},
            <b>BTW: </b>${shop_info.information.btw || ''},
            <b>Telefoon :</b>${shop_info.information.phone || ''},
            <b>Mobiel: </b>${shop_info.information.mobile || ''},
            <b>Email: </b>${shop_info.information.mail || ''},
            <b>Administratie E-mail: </b>${shop_info.information.admin_mail || ''}
        </p>
    </div>
    </body>
    </html>`
        }
        catch(err){
console.log(err)
        }
    return html
}

const generateProductList = (products, status) => {
    var html = ""
    try{
        products.forEach(element => {
            let quantity = 0
            if(status == 'ordered'){
                quantity = element.amount
            }
            else{
                quantity = element.picked
            }
            console.log(quantity, element, status)
            let price = element.normal_total_price || (element.price * quantity)
            let disc_price = element.discounted_price || (element.price *quantity)
            let vat = element.product.btw
            let deposit = +element.product.statiegeld * quantity

            if(quantity > 0){
                html += `
                <tr class="product" style="">
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        text-align: left;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1);" class="title">
                            ${element.product.product_information.title}<br/>
                            <i style="font-size: 11px;">${element.product.product_information.ean}</i>`
                        if(deposit > 0)
                            html+= `<br/><br/><i>Statiegeld</i>`                 
                            
                        html+= `</td>
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1); text-align: right;" class="amount" >
                            ${quantity} 
                        </td>
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1); text-align: right;" class="btw" >
                            ${element.product.btw}
                        </td>
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        text-align: right;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1);" class="prijs excl">
                            &euro;${(+element.price / (1 + (+element.product.btw/100))).toFixed(2)}</td>
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
                            &euro;${parseFloat(element.price).toFixed(2)}<br/>`
                            //if(element.discounted_price > 0)html+= `&euro;${+element.discounted_price - +element.price}<br/>`                 
                        html+= `</td>
                        <td style="border-bottom: 1px solid rgba(221, 221, 221, 1);
                        padding: 12px;
                        padding-top: 3px;
                        font-size: 14px;
                        vertical-align: top;
                        color: rgba(85, 85, 85, 1); text-align: right;" class="prijs incl" >
                        &euro;
                            ${parseFloat(price).toFixed(2)}<br/>`
                        if(+element.discounted_price != null && disc_price != price)
                            html+= `- &euro;${parseFloat(+price - +disc_price).toFixed(2)}<br/>`                 
                        if(deposit > 0)
                            html+= `<br/> 
                                &euro;${parseFloat(deposit).toFixed(2)}`                 
                        html+= `</td></tr>`
                    
            }        
        })
    }
    catch(err){
        console.log(err)
    }
    return html
}

const getTotalPrice = (async (products, order) => {
    return new Promise((resolve) => {
        var total = {
            no_vat: {},
            total: 0.00,
            discount_total: 0.00
        }
        try {
            console.log(products)
            console.log(order)
            if(order.status == 'ordered'){
                products.forEach(element => {
                    let price = element.normal_total_price || (element.price * element.amount)
                    let disc_price = element.discounted_price || (element.price * element.amount)
                    let quantity = element.amount
                    let vat = element.product.btw
                    let deposit = +element.product.statiegeld * element.amount

                    if(quantity > 0){
                        total.total += +price + +deposit
                        if(vat in total.no_vat){
                            total.no_vat[vat].price = total.no_vat[vat].price + (+price / (1 + (+vat / 100)))
                            total.no_vat[vat].vat = total.no_vat[vat].vat + (+price - (+price / (1 + (+vat / 100))))
                        }
                        else{
                            total.no_vat[vat] = {}
                            total.no_vat[vat]['price'] = (+price / (1 + (+vat / 100)))
                            total.no_vat[vat]['vat'] = (+price - (+price / (1 + (+vat / 100))))
                        }
                        total.discount_total += +price - +disc_price
                    }
                })
                resolve(total)
            }
            else{
                products.forEach(element => {
                    if(element.picked > 0){
                        let price = element.normal_total_price || (element.price * element.picked)
                        let disc_price = element.discounted_price || (element.price * element.picked)
                        let quantity = element.picked
                        let vat = element.product.btw
                        let deposit = +element.product.statiegeld * element.picked
        
                        if(quantity > 0){
                            total.total += +price + +deposit
                            if(vat in total.no_vat){
                                total.no_vat[vat].price = total.no_vat[vat].price + (+price / (1 + (+vat / 100)))
                                total.no_vat[vat].vat = total.no_vat[vat].vat + (+price - (+price / (1 + (+vat / 100))))
                            }
                            else{
                                total.no_vat[vat] = {}
                                total.no_vat[vat]['price'] = (+price / (1 + (+vat / 100)))
                                total.no_vat[vat]['vat'] = (+price - (+price / (1 + (+vat / 100))))
                            }
                            total.discount_total += +price - +disc_price
                        }
                    }
                })
                resolve(total)
            }
        } catch (error) { 
            resolve(total)
            console.log(error)
        }
    })
})


module.exports = (req, res) => {
    const first_payment = req.query.first
    Order.findOne({     
        logging: false,
        paranoid: false,
        where: {
            uuid_id: req.params.orderId
        },
        include: [
            { all: true}, 
            {model: OrderHasProduct, 
                as: "product_list", 
                include: [{
                    model: Product, 
                    as: "product", 
                    include: [{
                        model: Productinformation,
                        as: 'product_information',
                       attributes: ['title', 'ean']
                    },
                {
                    model: ProductHasDiscount,
                    as: 'product_has_discount_list',
                    required: false,
                    include: [
                        {
                            model: Discounts,
                            as: 'discount_info'
                        }
                    ]  
                }]
                }]
            },
            {model: OrderInformation, 
                as: "order_information",
                include: []
            },
            {model: OrderInformation, 
                as: "invoice_order_information",
                include: []
            }
        ]
       
    })
    .then(async (order) => {

        var html = ''
        if(first_payment == '1'){
            html = await generateFirstPDF(order)
        }
        else{
            html = await generatePDF(order)
        }

        var options = { 
            format: 'A4',
            "directory": "/tmp",
            "orientation": "portrait",
            "border": {
                "top": "0.5in",
                "right": "0.5in",
                "bottom": "0.5in",
                "left": "0.5in"
            },
            "type": "pdf",
            "phantomArgs": ["--ignore-ssl-errors=yes"],
            "timeout": 30000,
        };
         pdf.create(html, options).toStream(function(err, stream){
            if (err) return res.send(err);            
            res.setHeader('Content-type', 'application/pdf')
            stream.pipe(res, 'binary')
            Logger.log(2, stream)
            Logger.log(2, res)
        });
      /* pdf.create(html, options).toFile('test.pdf', function(err, res) {
          if (err) return console.log(err);
          console.log(res);
        });*/
    })
    .catch((err) =>{     
        if (err) return res.send(err);             
        Logger.log(1, err)
    })
};
