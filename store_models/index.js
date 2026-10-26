    const {Shop} = require('./shops.js')
    const {JobApplication} = require('./job_application.js')
    const {JobOffer} = require('./job_offer.js')
    const {Address} = require('./address.js')
    const {Information} = require('./information.js')
    const {Timeslots} = require('./timeslot.js')
    const {DeliveryLocation} = require('./delivery_location.js')
    const {Socials} = require('./socials.js')
    const {Business_Hours} = require('./business_hours.js')
    const {Terms_And_Conditions} = require('./terms_and_conditions.js')

    JobOffer.Shop = JobOffer.belongsTo(Shop, { as: 'shop', foreignKey: 'shop_id', targetKey: 'shop_id'})
    JobApplication.JobOffer = JobApplication.belongsTo(JobOffer, { as: 'job_offer', foreignKey: 'job_offer_id', targetKey: 'job_offer_id'})

    Shop.Information = Shop.belongsTo(Information, { as: 'information', foreignKey: 'information_id', targetKey: 'information_id'})
    Information.Address = Information.belongsTo(Address, { as: 'address', foreignKey: 'address_id', targetKey: 'address_id'})
    
    Shop.Socials = Shop.hasMany(Socials, {foreignKey: 'shop_id', sourceKey: 'shop_id'})
    Socials.Shop = Socials.belongsTo(Shop, {as: 'socials', foreignKey: 'shop_id', targetKey: 'shop_id'})
    
    Shop.Business_Hours = Shop.hasMany(Business_Hours, {foreignKey: 'shop_id', sourceKey: 'shop_id'})
    Business_Hours.Shop = Business_Hours.belongsTo(Shop, {as: 'business_hours', foreignKey: 'shop_id', targetKey: 'shop_id'})

    Timeslots.Shop = Timeslots.belongsTo(Shop, {as: 'shop', foreignKey: 'shop_id', targetKey: 'shop_id'})
    DeliveryLocation.Shop = DeliveryLocation.belongsTo(Shop, {as: 'shop', foreignKey: 'shop_id', targetKey: 'shop_id'})
    
    module.exports = {
        Shop ,
        JobApplication,
        JobOffer,
        Information,
        Timeslots,
        DeliveryLocation,
        Address,
        Socials,
        Business_Hours,
        Terms_And_Conditions
    }