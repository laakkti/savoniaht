const infoRouter = require('express').Router()

infoRouter.get('/queryAddress', async (request, response) => {

    var ip = require("ip");

    let server=request.connection.server

    const data={

        ip_address:ip.address(),
        port:server.address().port,
        url:request.headers.host
    }

    console.log("ip.address==== " + data.ip_address+"    "+data.port+"   "+data.url)

    response.send(data);

})

module.exports = infoRouter