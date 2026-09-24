const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())


const uri = process.env.MONGODB_URI
const PORT = process.env.PORT || 5050

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req,res)=>{
  res.send(`Server Pinged`)
})


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const db = client.db('mediaqueue')
    const tutorCollection = db.collection('tutors')
    const userCollections = db.collection('user')

    app.get('/tutors', async (req,res)=>{
      const result = await tutorCollection.find().toArray()
      res.send(result)
    })

    app.get('/tutors/:id', async(req,res)=>{
      const {id} = req.params;
      const tutor = await tutorCollection.findOne({_id: new ObjectId(id)})
      res.send(tutor)
    })

    app.patch('/useredit/:id', async (req,res)=>{
      const {id} = req.params;
      const updatedData = req.body;
      const result = await userCollections.updateOne({_id: new ObjectId(id)}, {$set: updatedData})
      res.json(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close(); 
  }
}
run().catch(console.dir);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
