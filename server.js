const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const fs = require('fs')

app.use(express.static('public'));

let productos = [{                                                                                                                                                    
    title: "Escuadra",                                                                                                                                 
    price: 123.45,                                                                                                                                     
    foto_url: "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",                                     
    id: 1                                                                                                                                              
  },                                                                                                                                                   
  {                                                                                                                                                    
    title: "Calculadora",                                                                                                                              
    price: 234.56,                                                                                                                                     
    foto_url: "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",                                          
    id: 2                                                                                                                                              
  },                                                                                                                                                   
  {                                                                                                                                                    
    title: "Globo Terráqueo",                                                                                                                          
    price: 345.67,                                                                                                                                     
    foto_url: "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",                                   
    id: 3                                                                                                                                              
  }];

let mensajes = JSON.parse(fs.readFileSync('mensajes.txt','utf-8'))

io.on('connection', function(socket){
    //parte de productos
    socket.emit('productos', productos)
    socket.on('newProduct', function(data){
        productos.push(data)
        io.sockets.emit('productos', productos)
    })
    //parte de mensajes
    socket.emit('mensajes', mensajes)
    socket.on('newMensaje', function(data){
        mensajes.push(data)
        fs.writeFileSync('mensajes.txt', JSON.stringify(mensajes))
        io.sockets.emit('mensajes', mensajes)
    })

})

const PORT = 8080
const srv = server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${srv.address().port}`)
})
server.on('error', error => console.log(`Error en servidor ${error}`))

