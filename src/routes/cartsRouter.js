import { Router } from 'express'
import CartManager from '../CartManager.js'
import ProductManager from '../ProductManager.js'

const router = Router()
const cartManager = new CartManager('./carts.json')
const productManager = new ProductManager('./products.json')

router.post('/', async (req, res) => {

    const cart = await cartManager.createCart()
    res.json({status: "success", cart})
})

router.get('/:cid', async (req, res) => {

    const cid = req.params.cid

    const products = await cartManager.getProducts(cid)
    
    res.json({status: "success", products})
})


router.post('/:cid/products/:pid', async (req, res) => {

    const cid = req.params.cid
    const pid = req.params.pid
    const product = await productManager.getProductById(pid)

    if(!product) res.send({status: "error", error: 'No se ha encontrado el producto'})
    const updatedCart = await cartManager.addProduct(cid, pid)
    if(!updatedCart) res.send({status: "error", error: "No se encontró el carrito"})
    else res.send({status: "success", msg: "Producto agregado"}) 
})

export default router