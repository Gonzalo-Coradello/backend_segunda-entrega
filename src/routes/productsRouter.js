import { Router } from 'express'
import ProductManager from '../ProductManager.js'

const router = Router()
const productManager = new ProductManager('./products.json')

router.get('/', async (req, res) => {
    
    const products = await productManager.getProducts()

    const limit = req.query.limit

    if(limit) products.splice(limit)
    
    res.json({status: "success", products})
})

router.get('/:pid', async (req, res) => {

    const pid = req.params.pid
    const product = await productManager.getProductById(pid)

    if(product) res.json(product)
    else res.send({status: "error", error: 'No se ha encontrado el producto'})
})

router.post('/', async (req, res) => {

    const product = req.body

    const productAdded = await productManager.addProduct(product)

    res.json({ status: "success", productAdded })
    
})

router.put('/:pid', async (req, res) => {

    const pid = req.params.pid
    console.log(pid)

    const fieldsToUpdate = req.body

    await productManager.updateProduct(pid, fieldsToUpdate)

    res.send({status: "success", msg: "Product updated"})

})

router.delete('/:pid', async (req, res) => {

    const pid = req.params.pid

    await productManager.deleteProduct(pid)

    res.send({status: "success", msg: "Product deleted"})
})

export default router