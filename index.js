const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT  || 5000;

// middleware
app.use(cors());
app.use(express.json());

// User and Password 
// omayer-savor  ZUnIWVw24KeU0E6Q





const uri = "mongodb+srv://omayer-savor:ZUnIWVw24KeU0E6Q@cluster0.ussu9py.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollection = client.db('productDB').collection('product')
    const userProductCollection = client.db('productDB').collection('UserProduct')
    const userCollection = client.db('productDB').collection('user')

    app.get('/products', async (req, res) => {
        const cursor = await productCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    // User Poduct Sed to fontend

    app.get('/user-product', async (req, res) => {
        const cursor = await userProductCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    app.post('/product', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result)
    })



    // Update Product


    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filder = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateProduct = req.body;


      const Product = {

        $set: {

          name: updateProduct.name, 
          brand: updateProduct.brand, 
          type: updateProduct.type,
          price: updateProduct.price,
          rating: updateProduct.rating,
          image: updateProduct.image,
          description: updateProduct.description,
          

        }
      }

      const result = await productCollection.updateOne(filder, Product, options)
      res.send(result)
      
    })





    // Users

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    // User Products

    app.post('/user-product', async (req, res) => {
      const userProduct = req.body;
      console.log(userProduct);
      const result = await userProductCollection.insertOne(userProduct);
      res.send(result);
    })

    app.delete('/user-product/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userProductCollection.deleteOne(query);
      res.send(result)

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
    res.send('My server is running...')
})

app.listen(port, () => {
    console.log(`Omayer, your server in runninig on Port: ${port}`);
})