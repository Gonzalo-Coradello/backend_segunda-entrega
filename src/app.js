import express from "express"
import productsRouter from "./routes/productsRouter.js"
import cartsRouter from "./routes/cartsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import handlebars from 'express-handlebars'
import __dirname from "./utils.js"
import { Server } from "socket.io"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

const httpServer = app.listen(8080, () => console.log('Server on port 8080'))
const io = new Server(httpServer)

export default io