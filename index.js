const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b9hatji.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const productCollection = client.db("autoConnectDB").collection("product");
    const cartCollection = client.db("autoConnectDB").collection("cart");

    // 1) Create / Post for products
    app.post("/products", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      const result = await productCollection.insertOne(newData);
      res.send(result);
    });

    // Add /Post/ to Cart
    app.post("/cart", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      const result = await cartCollection.insertOne(newData);
      res.send(result);
    });

    // Read mycart

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find(); // cursor mane ekta pointer set kortesi oi collection er moddhe
      const result = await cursor.toArray(); // joto gula item ase sob diye dibe
      res.send(result);
    });

    //Delete from cart

    // 3) Delete

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    // 1.1) Update product

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      const car = {
        $set: {
          name: updatedCar.name,
          image: updatedCar.image,
          brandName: updatedCar.brandName,
          type: updatedCar.type,
          price: updatedCar.price,
          description: updatedCar.description,
          rating: updatedCar.rating,
        },
      };
      const result = await productCollection.updateOne(filter, car, options);
      res.send(result);
    });

    // 2) Read

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find(); // cursor mane ekta pointer set kortesi oi collection er moddhe
      const result = await cursor.toArray(); // joto gula item ase sob diye dibe
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("AutoConnect Server is Running!");
});

app.listen(port, () => {
  console.log(`AutoConnect ser is running on port ${port}`);
});
