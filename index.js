const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middileware 

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtmwivk.mongodb.net/?retryWrites=true&w=majority`;

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
    

    const productdatabase = client.db("Easy_fashion").collection("products");
    const bookingsCollection = client.db("Easy_fashion").collection("bookings");

    app.get('/products', async(req, res) => {
        const result = await productdatabase.find().toArray()
        res.send(result);
    })


    app.get('/products/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const result = await productdatabase.findOne(filter)
        res.send(result);
    })

    // total number of product count

    

    app.post('/bookings/:id', async(req, res) => {
        const id = req.params.id;
        const bookings = req.body;
        console.log(bookings);
        const result = await bookingsCollection.insertOne(bookings);
        res.send(result);

    })

    app.delete('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);

    })

    app.get('/bookings', async(req, res) => {
      let query = {}
       if(req.query?.email){
         query = {email : req.query.email}
       }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})