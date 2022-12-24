import express from 'express'
import io from '../app.js'
import ProductManager from '../ProductManager.js'

const router = express.Router()
const productManager = new ProductManager('products.json')

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('index', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    let products = await productManager.getProducts()
    io.on('connection', socket => {
        console.log('New client connected')

        socket.on('addProduct', async data => {
            const productAdded = await productManager.addProduct(data)
            products.push(productAdded)
            io.emit('showProducts', products)
        })
        
        socket.on('deleteProduct', async data => {
            let products = await productManager.getProducts()
            await productManager.deleteProduct(data.id)

            const filtered = products.filter(prod => prod.id != data.id)
            io.emit('showProducts', filtered)
        })
    })
    res.render('realTimeProducts', {products})
})

router.post('/realtimeproducts', async (req, res) => {
    let products = await productManager.getProducts()

    const product = req.body
    const productAdded = await productManager.addProduct(product)
    products.push(productAdded)

    res.json({ status: "success", productAdded })
    io.emit('showProducts', products)    
})

router.delete('/realtimeproducts/:pid', async (req, res) => {
    const pid = req.params.pid
    await productManager.deleteProduct(pid)
    const products = await productManager.getProducts()

    res.send({status: "success", msg: "Product deleted"})
    io.emit('showProducts', products)
})

export default router