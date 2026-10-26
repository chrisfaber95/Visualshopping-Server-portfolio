    const {User} = require('./user.js')
    const {Customer} = require('./customer.js')
    const {CustomerSettings} = require('./customer_settings.js')
    const {Userrole} = require('./userroles.js')
    const {Product} = require('./product.js')
    const {Productinformation} = require('./productinformation.js')
    const {ProductVariant} = require('./product_variant.js')
    const {Levertijden} = require('./levertijd.js')
    const {Order} = require('./order.js')
    const {OrderHasProduct} = require('./order_has_products.js')
    const {Department} = require('./department.js')
    const {CustomerHasSpaaractie} = require('./customer_has_spaaractie.js')
    const {CustomerInformation} = require('./customer_information.js')
    const {CustomerHasFavorite} = require('./customer_has_favorite.js')
    const {Spaaractie} = require('./spaaractie.js')
    const {OrderInformation} = require('./order_information.js')
    const {SpaaractieHasProduct} = require('./spaaractie_has_product.js')
    const {ActieOrder} = require('./actie_order.js')
    const {ActieOrderHasProduct} = require('./actie_order_has_product.js')
    const {actieOrderProductHasVariant} = require('./actie_order_product_has_variant.js')
    const {Daytotals} = require('./daytotal.js')
    const {Cookies} = require('./cookies.js')
    const {Discounts} = require('./discounts.js')
    const {DiscountType} = require('./discounttype.js')
    const {ProductHasDiscount} = require('./product_has_discount.js')
    const {Terms_And_Conditions} = require('./terms_and_conditions.js')
    const {ShoppingList} = require('./shopping_list.js')
    const {ShoppingListHasProduct} = require('./shopping_list_has_product.js')
    
    const {Nutrients} = require('./nutrients/nutrients.js')
    const {NutrientRecords} = require('./nutrients/nutrient_records.js')
    const {NutrientTypes} = require('./nutrients/nutrient_types.js')
    const {PortionUoMs} = require('./nutrients/portion_uoms.js')
    const {PrecisionTypes} = require('./nutrients/precision_types.js')
    const {RecordUoMs} = require('./nutrients/record_uoms.js')
    const {ProductAdditionInformation} = require('./product_addtional_information.js')
    

    User.Userrole = User.belongsTo(Userrole, { as: 'user_role', foreignKey: 'role_id', targetKey: 'roleId'})

    Product.Productinformation = Product.belongsTo(Productinformation, { as: 'product_information', foreignKey: 'ean', targetKey: 'ean'})
    Productinformation.Product = Productinformation.hasOne(Product, {as: 'product_info', foreignKey: 'ean'})
    Product.OrderHasProduct = Product.hasMany(OrderHasProduct, {as: 'order_list', foreignKey: 'product_id'})
    Product.ProductVariant = Product.hasMany(ProductVariant, {as: 'variant_list', foreignKey: 'product_id'})

    ProductAdditionInformation.Productinformation = ProductAdditionInformation.belongsTo(Productinformation, { as: 'product_additional_information', foreignKey: 'product_information_id', targetKey: 'id'})
    Productinformation.ProductAdditionInformation = Productinformation.hasMany(ProductAdditionInformation, {as: 'product_additional_information_list', foreignKey: 'product_information_id'})
    
    Discounts.DiscountType = Discounts.belongsTo(DiscountType, {as:'discount_type', foreignKey: 'discounttype_id', targetKey: 'discounttype_id'})
    Discounts.ProductHasDiscount = Discounts.hasMany(ProductHasDiscount, {as: 'product_discount_list', foreignKey: 'discount_id'})
    Product.ProductHasDiscount = Product.hasMany(ProductHasDiscount, { as: 'product_has_discount_list', foreignKey: 'product_id'})
    ProductHasDiscount.Product = ProductHasDiscount.belongsTo(Product, { as: 'product_discount', foreignKey: 'product_id'})
    
    ProductHasDiscount.Discounts = ProductHasDiscount.belongsTo(Discounts, {as:'discount_info', foreignKey: 'discount_id', targetKey: 'discount_id'})

    Levertijden.Product = Levertijden.hasMany(Product, { foreignKey: 'product_list', as: 'product'})
    Product.Levertijden = Product.belongsTo(Levertijden, { as: 'levertijd', foreignKey: 'levertijd_id'})

    Department.Product = Department.hasMany(Product, { foreignKey: 'product_list', as: 'product'})
    Product.Department = Product.belongsTo(Department, {as: 'department', foreignKey: 'department_id'})
  
    Order.PickingUser = Order.belongsTo(User, { foreignKey: 'picking_user', as: 'pickingUser', targetKey: 'user_id'})
    Order.ScanningUser = Order.belongsTo(User, { foreignKey: 'scanning_user', as: 'scanningUser', targetKey: 'user_id'})
    Order.PickupUser = Order.belongsTo(User, { foreignKey: 'pickup_user', as: 'pickupUser', targetKey: 'user_id'})
    Order.Customer = Order.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer', targetKey: 'customer_id'})
    Order.OrderInformation = Order.belongsTo(OrderInformation, { foreignKey: 'order_information_id', as: 'order_information', targetKey: 'order_information_id'})
    Order.OrderInformation = Order.belongsTo(OrderInformation, { foreignKey: 'invoice_order_information_id', as: 'invoice_order_information', targetKey: 'order_information_id'})
    OrderInformation.Order = OrderInformation.hasMany(Order, { foreignKey: 'order_information_id', as: 'order'})
    OrderInformation.Order = OrderInformation.hasMany(Order, { foreignKey: 'invoice_order_information_id', as: 'invoice_order'})

    Order.OrderHasProduct = Order.hasMany(OrderHasProduct, {as: 'product_list', foreignKey: 'order_id', sourceKey: 'id'})
    OrderHasProduct.Product = OrderHasProduct.belongsTo(Product, {as: 'product', foreignKey: 'product_id', target_key: 'id'})
    OrderHasProduct.Order = OrderHasProduct.belongsTo(Order, {as: 'order', foreignKey: 'order_id', target_key: 'id'})

    //ActieOrder.Customer = ActieOrder.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer', targetKey: 'customer_id'})
    ActieOrder.OrderInformation = ActieOrder.belongsTo(OrderInformation, { foreignKey: 'order_information_id', as: 'actie_order_information', targetKey: 'order_information_id'})
    OrderInformation.ActieOrder = OrderInformation.hasMany(ActieOrder, { foreignKey: 'order_information_id', as: 'actie_order'})
    
    ActieOrder.PickingUser = ActieOrder.belongsTo(User, { foreignKey: 'picking_user', as: 'pickingUser', targetKey: 'user_id'})
    ActieOrder.PickupUser = ActieOrder.belongsTo(User, { foreignKey: 'pickup_user', as: 'pickupUser', targetKey: 'user_id'})
    ActieOrder.OrderInformation = ActieOrder.belongsTo(OrderInformation, { foreignKey: 'invoice_order_information_id', as: 'invoice_actie_order_information', targetKey: 'order_information_id'})
    
    OrderInformation.ActieOrder = OrderInformation.hasMany(ActieOrder, { foreignKey: 'invoice_order_information_id', as: 'invoice_actie_order'})

    ActieOrder.ActieOrderHasProduct = ActieOrder.hasMany(ActieOrderHasProduct, {as: 'product_list', foreignKey: 'actie_order_id'})
    ActieOrderHasProduct.Product = ActieOrderHasProduct.belongsTo(Product, {as: 'product', foreignKey: 'product_id'})
    ActieOrderHasProduct.ActieOrder = ActieOrderHasProduct.belongsTo(ActieOrder, {as: 'actie_order', foreignKey: 'actie_order_id'})
    
    ActieOrderHasProduct.actieOrderProductHasVariant = ActieOrderHasProduct.hasMany(actieOrderProductHasVariant, {as: 'actie_order_product_variant_list', foreignKey: 'actie_order_has_product_id'})
    actieOrderProductHasVariant.ActieOrderHasProduct = actieOrderProductHasVariant.belongsTo(ActieOrderHasProduct, {as: 'actie_order_product', foreignKey: 'actie_order_has_product_id'})
    
    actieOrderProductHasVariant.ProductVariant = actieOrderProductHasVariant.belongsTo(ProductVariant, { as: 'product_variant', foreignKey: 'product_variant_id', targetKey: 'product_variant_id'})
    ProductVariant.actieOrderProductHasVariant = ProductVariant.hasMany(actieOrderProductHasVariant, {as: 'actie_order_product_variant_list', foreignKey: 'product_variant_id'})

    CustomerHasSpaaractie.Customer = CustomerHasSpaaractie.belongsTo(Customer, {as: 'customer', foreignKey: 'customer_id'})
    Customer.CustomerHasSpaaractie = Customer.hasMany(CustomerHasSpaaractie, {as: 'spaaractie_list', foreignKey: 'customer_id'})
    CustomerHasSpaaractie.Spaaractie = CustomerHasSpaaractie.belongsTo(Spaaractie, {as: 'spaaractie', foreignKey: 'spaaractie_id'})

    CustomerHasFavorite.Customer = CustomerHasFavorite.belongsTo(Customer, {as: 'customer', foreignKey: 'customer_id'})
    Customer.CustomerHasFavorite = Customer.hasMany(CustomerHasFavorite, {as: 'favorite_list', foreignKey: 'customer_id'})
    CustomerHasFavorite.Product = CustomerHasFavorite.belongsTo(Product, {as: 'product', foreignKey: 'product_id'})

    OrderInformation.Customer = OrderInformation.belongsTo(Customer, {as: 'customer', foreignKey: 'customer_id'})
    Customer.OrderInformation = Customer.hasMany(OrderInformation, {as: 'order_information', foreignKey: 'customer_id'})

    CustomerSettings.Customer = CustomerSettings.belongsTo(Customer, {as: 'customer', foreignKey: 'customer_id'})
    Customer.CustomerSettings = Customer.hasOne(CustomerSettings, {as: 'customer_settings', foreignKey: 'customer_id', required: false})

    CustomerInformation.Customer = CustomerInformation.belongsTo(Customer, {as: 'customer', foreignKey: 'customer_id'})
    Customer.CustomerInformation = Customer.hasMany(CustomerInformation, {as: 'customer_information', foreignKey: 'customer_id', required: false})


    SpaaractieHasProduct.Spaaractie = SpaaractieHasProduct.belongsTo(Spaaractie, {as: 'spaaractie', foreignKey: 'spaaractie_id'})
    SpaaractieHasProduct.Product = SpaaractieHasProduct.belongsTo(Product, {as: 'product', foreignKey: 'product_id'})
    Spaaractie.SpaaractieHasProduct = Spaaractie.hasMany(SpaaractieHasProduct, {as: 'spaaractie_products', foreignKey: 'spaaractie_id'})

    Terms_And_Conditions.Spaaractie = Terms_And_Conditions.hasMany(Spaaractie, {as: 'spaaractie', foreignKey: 'TAC_id'})
    Spaaractie.Terms_And_Conditions = Spaaractie.belongsTo(Terms_And_Conditions, {as: 'terms', foreignKey: 'TAC_id', targetKey: 'TAC_id'})
    
    CustomerHasFavorite.Customer = CustomerHasFavorite.belongsTo(Customer, {as: 'customer_favorite', foreignKey: 'customer_id'})
    CustomerHasFavorite.Product = CustomerHasFavorite.belongsTo(Product, {as: 'favorite_product', foreignKey: 'product_id'})
    Product.CustomerHasFavorite = Product.hasMany(CustomerHasFavorite, {as: 'favorite_products_list', foreignKey: 'product_id'})

    Daytotals.User = Daytotals.belongsTo(User, { as: 'daytotals_user', foreignKey: 'user_id', targetKey: 'user_id'})
    
    Cookies.Customer = Cookies.belongsTo(Customer, { as: 'cookie_user', foreignKey: 'customer_id', targetKey: 'customer_id'})


    ShoppingList.Customer = ShoppingList.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer', targetKey: 'customer_id'})
    Customer.ShoppingList = Customer.hasMany(ShoppingList, {as: 'shopping_lists', foreignKey: 'customer_id'})
    
    ShoppingList.ShoppingListHasProduct = ShoppingList.hasMany(ShoppingListHasProduct, {as: 'shoppinglist_products', foreignKey: 'shopping_list_id'})
    ShoppingListHasProduct.ShoppingList = ShoppingListHasProduct.belongsTo(ShoppingList, {as: 'shoppinglist', target_key: 'shopping_list_id', foreignKey: 'shopping_list_id'})

    ShoppingListHasProduct.Product = ShoppingListHasProduct.belongsTo(Product, {as: 'product', foreignKey: 'product_id', targetKey: 'id'})
    
    Nutrients.Product = Nutrients.belongsTo(Product, { foreignKey: 'product_id', as: 'product', targetKey: 'id'})
    Product.Nutrients = Product.hasMany(Nutrients, {as: 'nutrients', foreignKey: 'product_id'})
    Nutrients.PortionUoMs = Nutrients.belongsTo(PortionUoMs, { foreignKey: 'portion_uom_id', as: 'portion_uom', targetKey: 'PortionUoMs_id'})
    
    NutrientRecords.Nutrients = NutrientRecords.belongsTo(Nutrients, { foreignKey: 'nutrient_id', as: 'nutrient', targetKey: 'NutrientId'})
    Nutrients.NutrientRecords = Nutrients.hasMany(NutrientRecords, {as: 'nutrient_records', sourceKey: 'NutrientId', foreignKey: 'nutrient_id'})
    NutrientRecords.PrecisionTypes = NutrientRecords.belongsTo(PrecisionTypes, { foreignKey: 'precision_type_id', as: 'precision_type', targetKey: 'PrecisionTypes_id'})
    NutrientRecords.RecordsUoMs = NutrientRecords.belongsTo(RecordUoMs, { foreignKey: 'record_uom_id', as: 'record_uom', targetKey: 'RecordUoMs_id'})
    NutrientRecords.NutrientTypes = NutrientRecords.belongsTo(NutrientTypes, { foreignKey: 'nutrient_type_id', as: 'nutrient_type', targetKey: 'nutrient_type_id'})

   // Daytotals.User = Daytotals.belongsTo(User, {as: 'daytotals_user', foreignKey: 'user_id'})

    //User.Daytotals = User.hasMany(Daytotals, { foreignKey: 'daytotals_list', as: 'daytotals'})
    
  //entities.A.belongsToMany(entities.B, {through: 'AB'});
  //entities.B.belongsToMany(entities.A, {through: 'AB'});
    module.exports = {
        User ,
        Userrole,
        Product,
        Productinformation,
        Order,
        OrderHasProduct,
        Department,
        Customer,
        CustomerSettings,
        Spaaractie,
        CustomerHasSpaaractie,
        OrderInformation,
        SpaaractieHasProduct,
        Levertijden,
        CustomerHasFavorite,
        ActieOrder,
        ActieOrderHasProduct,
        ProductVariant,
        actieOrderProductHasVariant,
        Daytotals,
        Cookies,
        Discounts,
        DiscountType,
        ProductHasDiscount,
        Terms_And_Conditions,
        ShoppingList,
        ShoppingListHasProduct,
        Nutrients,
        NutrientRecords,
        NutrientTypes,
        PortionUoMs,
        PrecisionTypes,
        RecordUoMs,
        CustomerInformation,
        ProductAdditionInformation

    }