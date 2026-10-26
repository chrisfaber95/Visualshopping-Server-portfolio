

const mailName = (mailName) => {
    return `<table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
        <tr style="vertical-align: top;" valign="top">
            <td style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                <h2 style="color:#000000;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:18px;font-weight:normal;letter-spacing:normal;line-height:150%;text-align:center;margin-top:0;margin-bottom:0;">
                    ${mailName}
                </h2> 
            </td>
        </tr>
    </table>`
}
module.exports = (mailname) => {
    return mailName(mailname)
}