import { CartMongoManager } from "../dao/mongo/CartMongoManager.js";


// Mongo

const cartMongo = new CartMongoManager()


router.get('/:cid', async(req,res)=> {
    try {
        const cid = req.params.cid
        const getCartId = await cartMongo.getCartById(cid)

        if(!getCartId){
            res.status(404).json({error: 'Carrito no encontrado'})
        }

        console.log(getCartId)

        res.status(200).json({
            status: 'Success',
            getCartId
        })

        console.log(getCartId)

    } catch (error) {
        if(error instanceof Error){
            res.status(404).json({error: error.message})
        } else{
            res.status(500).json({error: 'Error al buscar el carrito'})
        }
    }
})

// Crear un carrito
router.post('/', async(req, res)=> {
    try {
        const newCart =  await cartMongo.createCart();
        res.status(201).json({
            status: 'Success',
            idCart: newCart._id})

    } catch (error) {
        if(error instanceof Error) {
            res.status(404).json({error: error.message})
        } else {
            res.status(500).json({error: 'Error al crear el carrito'})

        }
    }
})

// Eliminar el carrito
router.delete('/:cid', async(req,res)=> {
    try {
        const cid = req.params.cid
        await cartMongo.deleteCart(cid)
        res.status(200).json({
            status: 'Success',
            message: 'Carrito eliminado correctamente'})

    } catch (error) {
        if(error instanceof Error){
            res.status(404).json({error: error.message})
        } else {
            res.status(500).json({error: 'Error al eliminar el carrito'})
        }
    }
})


// Agregar productos al carrito
router.post('/:cid/product/:pid/:quantity', async(req, res)=> {
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = parseInt(req.params.quantity)

        if(isNaN(quantity)){
            return res.status(400).json({error: 'La cantidad debe ser un numero valido'})
        }

        const updateCart = await cartMongo.addProductToCart(cid, pid, quantity)

        res.status(200).json({
            status: 'Success',
            message: 'Producto agregado al carrito correctamente',
            cart: updateCart
        })

    } catch (error) {
        if(error instanceof Error){
            res.status(404).json({error: error.message})
        } else {
            res.status(500).json({error: 'Error al agregar el producto'})
        }
    }
})


// Elimina del carrito el producto seleccionado.
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const cartProducts = await cartController.deleteProductFromCart(cid, pid);
      res.json(cartProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
  });

// Actualiza el carrito
router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const cartProducts = await cartController.updateProductQuantity(cid, pid, quantity);
      res.json(cartProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
  });

// Actualiza SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
rrouter.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      const cartProducts = await cartController.updateProductQuantity(cid, pid, quantity);
      res.json(cartProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
  });

// Elimina todos losproductos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
  
    try {
      await cartController.deleteAllProducts(cid);
      res.json({ message: 'Todos los productos han sido eliminados del carrito' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
  });

export {router as cartRouter};