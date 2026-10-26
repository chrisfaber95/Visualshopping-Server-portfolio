//const Logger = require('/config/logging.js');



const getProductDiscount = () => {

}

const getProductInfo = async (cart) => {
    const productIds = cart.map(obj => obj.product_id);
    const products = await Product.findAll({
        logging: false,
        where: { id: productIds},
        include: [
            Product.ProductVariant,
            {
            model: ProductHasDiscount,
            as: 'product_has_discount_list',
            required: false,
            include: [
                { model: Discounts, as: 'discount_info' }
            ]}
        ]
    })

    return products
}

const updateProductPrice = async (item) => {
    item.price = item.product.price
}

const calculateDiscountPrices = async (product_list, discount_list, date) => {
    let productList = product_list
    const discountList = discount_list
    
    // loop through products
    productList.forEach(product => {
      // filter applicable discounts
      const applicableDiscount = product.product.product_has_discount_list.filter(discount => {
        const currentDate = date || new Date()
        const startDate = new Date(discount.discount_info.starting_date)
        const endDate = new Date(discount.discount_info.end_date)
        return currentDate >= startDate && currentDate <= endDate
      })[0]
    // group products by discount ID

    let discount_number = 0;
    if(applicableDiscount){
        if(applicableDiscount.discount_info.isCombination == true && applicableDiscount.isPercentage == true) discount_number = 1
        if(applicableDiscount.discount_info.isCombination == false && applicableDiscount.isPercentage == true) discount_number = 2
        if(applicableDiscount.discount_info.isCombination == true && applicableDiscount.isPercentage == false) discount_number = 3
        if(applicableDiscount.discount_info.isCombination == false && applicableDiscount.isPercentage == false) discount_number = 4
    }

    const minAmount = applicableDiscount?.discount_info.discount_type.min_amount || 0
    var totals = {
        discount: 0,
        remainder: 0
    }

    const discountFromList = discountList.find(obj => obj.discount_id === applicableDiscount?.discount_id)
    switch (discount_number) {
        case 0:
            discountPrice = +product.product.price * +product.amount
            break;    
        case 1:
            totals = discountPercentageCombination(product, discountFromList, product.amount, productList, applicableDiscount)
            discountPrice = +totals.discount + +totals.remainder
            break;    
        case 2:            
            totals = discountPercentageNoCombination(product, discountFromList, product.amount, productList, applicableDiscount)
            discountPrice = +totals.discount + +totals.remainder
            break;    
        case 3:
            totals = discountNoPercentageCombination(product, discountFromList, product.amount, productList, applicableDiscount)
            discountPrice = +totals.discount + +totals.remainder            
            break;    
        case 4:
            totals = discountNoPercentageNoCombination(product, discountFromList, product.amount, productList, applicableDiscount)
            discountPrice = +totals.discount + +totals.remainder
            break;    
        default:
            break;
    }
      product.discounted_price = discountPrice
      product.normal_total_price = +product.price * +(product.picked || product.amount)
    })
    return productList
}

const discountPercentageNoCombination = ((cartItem, discount, amount, applicableDiscount) => {

    const minAmount = discount.discount_type.min_amount

    let remainder = amount % minAmount
    let amountWithDiscount = amount - remainder

    let priceWithDiscount = +amountWithDiscount * +cartItem.price * (1 - +applicableDiscount.discount_price /100)
    let priceRemainder = (+remainder * +cartItem.price)

    return {remainder: priceRemainder, discount: priceWithDiscount}
})

const discountNoPercentageNoCombination = ((cartItem, discount, amount, applicableDiscount) => {

    const minAmount = discount.discount_type.min_amount
    let remainder = amount % minAmount
    let amountWithDiscount = amount - remainder
    

    let priceWithDiscount = +amountWithDiscount * (+applicableDiscount.discount_price / +minAmount)
    let priceRemainder = +remainder * +cartItem.price

    return {remainder: priceRemainder.toFixed(2), discount: priceWithDiscount.toFixed(2)}
})

const discountPercentageCombination =((cartItem, discount, amount, cart, applicableDiscount) => {
    
    var combination = []
    var totalAmount = 0
    var highestPriceProduct = cartItem

    for(const [key, value] of Object.entries(cart)){
        const isObjectInArray = discount.product_discount_list.some(obj => obj.product_id === value.product_id);
        //let discount2 = isDiscounted(value.product)
        if(isObjectInArray === true){
            combination.push({product: value.product, amount: value.amount, price: value.product.price})
            totalAmount += value.amount
            if(value.product.price > highestPriceProduct.price){
                highestPriceProduct = value.product
            }
            else if(value.product.price == highestPriceProduct.price && value.product.product_id > highestPriceProduct.product_id){
                highestPriceProduct = value.product
            }
        }
    }
    
    combination = combination.sort((a, b) =>  b.price - a.price)
    const minAmount = discount.discount_type.min_amount
    if(cartItem.id != highestPriceProduct.id){
        if((amount - totalAmount % minAmount) < 0){
            let totalAmountCopy = totalAmount
            for(var i = 0; i < combination.length; i++){
                let remind = totalAmountCopy - combination[i].amount
                if(remind <= 0){
                    break;
                }
                else if(remind > 0){                        
                    let priceWithDiscount = +amount * +cartItem.price * (1 - +applicableDiscount.discount_price/100)
                    let priceWithoutDiscount = +remind * +cartItem.price
                    return {remainder: priceWithoutDiscount.toFixed(2), discount: priceWithDiscount.toFixed(2)}
                }
                else{
                    totalAmountCopy -= combination[i].amount
                }
            }
        }
        
        let priceWithDiscount = +amount * +cartItem.price * (1 - +applicableDiscount.discount_price/100)
        return {remainder: +0.00, discount: priceWithDiscount.toFixed(2)}
    }
    else{
        let remainder = totalAmount % minAmount
        if(remainder > 0){
            let nonDiscountAmount = amount - remainder
            if(nonDiscountAmount <= 0 ){
                nonDiscountAmount = 0
                let priceWithDiscount = +nonDiscountAmount * +cartItem.price * (1 - +applicableDiscount.discount_price/100)
                let priceWithoutDiscount = +remainder * +cartItem.price
                return {remainder: priceWithoutDiscount.toFixed(2), discount: priceWithDiscount.toFixed(2)}
            }
            else{
                let priceWithDiscount = +nonDiscountAmount * +cartItem.price * (1 - +applicableDiscount.discount_price/100)
                let priceWithoutDiscount = +remainder * +cartItem.price
                return {remainder: priceWithoutDiscount.toFixed(2), discount: priceWithDiscount.toFixed(2)}
            }
        }
        else{
            let priceWithDiscount = +amount * +cartItem.price * (1 - +applicableDiscount.discount_price/100)
            return {remainder: +0.00, discount: priceWithDiscount.toFixed(2)}
        }
    }        
})

const discountNoPercentageCombination =((cartItem, discount, amount, cart, applicableDiscount) => {
    
    var combination = []
    var totalAmount = 0
    var highestPriceProduct = cartItem

    for(const [key, value] of Object.entries(cart)){
        const isObjectInArray = discount.product_discount_list.some(obj => obj.product_id === value.id);
        //let discount2 = isDiscounted(value.product)
        if(isObjectInArray === true){
            combination.push({product: value.product, amount: value.amount, price: value.product.price})
            totalAmount += value.amount
            if(value.product.price > highestPriceProduct.price){
                highestPriceProduct = value.product
            }
            else if(value.product.price == highestPriceProduct.price && value.product.product_id > highestPriceProduct.product_id){
                highestPriceProduct = value.product
            }
        }
    }
    
    combination = combination.sort((a, b) =>  b.price - a.price)
    const minAmount = discount.discount_info.discount_type.min_amount
    if(cartItem.id != highestPriceProduct.id){
        if((amount - totalAmount % minAmount) < 0){
            let totalAmountCopy = totalAmount
            for(var i = 0; i < combination.length; i++){
                let remind = totalAmountCopy - combination[i].amount
                if(remind <= 0){
                    break;
                }
                else if(remind > 0){                        
                    let priceWithDiscount = +amount * (+applicableDiscount.discount_price / +applicableDiscount.discount_info.discount_type.min_amount)
                    let priceWithoutDiscount = +remind * +cartItem.price

                    return {remainder: priceWithoutDiscount.toFixed(2), discount: priceWithDiscount.toFixed(2)}
                }
                else{
                    totalAmountCopy -= combination[i].amount
                }
            }
        }
        
        let priceWithDiscount = +amount * (+applicableDiscount.discount_price / +applicableDiscount.discount_info.discount_type.min_amount)
        return {remainder: +0.00, discount: priceWithDiscount.toFixed(2)}
    }
    else{
        let remainder = totalAmount % minAmount
        if(remainder > 0){
            let nonDiscountAmount = amount - remainder
            if(nonDiscountAmount <= 0 ){
                //let priceWithDiscount = parseFloat(amount) * (parseFloat(discount.discount_price) / parseInt(discount.discount_info.discount_type.min_amount))
                let priceWithoutDiscount = +remainder * +cartItem.price
                return {remainder: priceWithoutDiscount.toFixed(2), discount: +0.00}
            }
            else{
                let priceWithDiscount = +nonDiscountAmount * (+applicableDiscount.discount_price / +discount.discount_type.min_amount)
                let priceWithoutDiscount = +remainder * +cartItem.price

                return {remainder: priceWithoutDiscount.toFixed(2), discount: priceWithDiscount.toFixed(2)}
            }
        }
        else{
            let priceWithDiscount = +amount * (+applicableDiscount.discount_price / +discount.discount_type.min_amount)
            return {remainder: +0.00, discount: priceWithDiscount.toFixed(2)}
        }
    }        
})

module.exports = {
    updateProductPrice,
    calculateDiscountPrices
};