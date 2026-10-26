
const header = require ("../../config/mailTemplates/header.js")
const top = require ("../../config/mailTemplates/top.js")
const mailName = require ("../../config/mailTemplates/mailName.js")
const divider = require ("../../config/mailTemplates/divider.js")
const footer = require ("../../config/mailTemplates/footer.js")
module.exports.header = () => {
    return header()
}
module.exports.top = (name) => {
    return top(name)
}
module.exports.mailName = (name) => {
    return mailName(name)
}
module.exports.divider = () => {
    return divider()
}
module.exports.footer = () => {
    return footer()
}