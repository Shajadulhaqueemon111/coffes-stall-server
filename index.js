const express=require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors=require('cors');
const app=express()

const port=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.USER_PASS}@cluster0.7auoehb.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri)

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
    const coffeCollection= client.db("insertDB").collection("coffe");
    const userCollection=client.db("coffeBD").collection("user");

    app.get('/coffes',async(req,res)=>{
        const cursor=coffeCollection.find()
        const result=await cursor.toArray()
        res.send(result)

    })

    // Login all data get 
    app.get('/users',async(req,res)=>{
        const cursor=userCollection.find()
        const result=await cursor.toArray()
        res.send(result)

    })

    app.get('/coffes/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const result=await coffeCollection.findOne(query)
      res.send(result)

    })
   

    app.put('/coffes/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)}
      const options = { upsert: true };
      const upDateCoffe=req.body;
      const coffe = {
        $set: {
          name:upDateCoffe.name,
           chef:upDateCoffe.chef,
           supplier:upDateCoffe.supplier,
           taste:upDateCoffe.taste,
           category:upDateCoffe.category,
           details:upDateCoffe.details,
           photo:upDateCoffe.photo
        },
      
      };
      const result = await coffeCollection.updateOne(filter, coffe, options);
      res.send(result)
    })

    //Sing in update
    app.patch('/users',async(req,res)=>{
      const user=req.body;
      const filter={email:user.email}
      
      const upDatedDoc={
        $set:{

          lastLogAt:user.lastLogAt

        }
      }
      const result=await userCollection.updateOne(filter,upDatedDoc)
      res.send(result)
    })


    app.post('/coffes',async(req,res)=>{
      const newCoffe=req.body
      console.log(newCoffe)
      const result=await coffeCollection.insertOne(newCoffe);
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user=req.body;
      console.log(user)
      const result=await userCollection.insertOne(user);
      res.send(result)
    })
         
    app.delete('/coffes/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await coffeCollection.deleteOne(query)
        res.send(result)
    })
    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:new ObjectId(id)}
        const result=await userCollection.deleteOne(query)
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
    res.send('Hitting a coffe Shope')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })