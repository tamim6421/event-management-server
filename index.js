const express = require('express')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000 

// middleware
app.use(cors())
app.use(express.json())

// event_management
// SVUHaxIt3JQk4DmQ



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.iimwc2a.mongodb.net/?retryWrites=true&w=majority`;

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
    
    const userInfoCollection = client.db("eventInfoDB").collection("eventInfo")
    const userCollection = client.db("eventInfoDB").collection("users")
    const foodCollection = client.db("eventInfoDB").collection("allFoods")
    const addFoodCollection = client.db("eventInfoDB").collection("addFoods")

    
// food related api and get the data from the database
app.get('/allFoods', async(req, res) =>{
    const cursor = foodCollection.find()
    const result = await cursor.toArray()
    res.send(result)
})


// post from data to the database 

app.post('/foods', async(req, res) =>{
     try{
        const body = req.body 
        const result = await foodCollection.insertOne(body)
        res.send(result)
     }
     catch(error){
        console.log(error)
     }

})

    // userInfo CRUD operation 
    //create user 1
    app.post('/eventInfo', async(req, res) =>{
        const info = req.body 
        console.log(info)
        const result = await userInfoCollection.insertOne(info)
        res.send(result)
    })

    // read user 2
    app.get('/eventInfo', async(req, res) =>{
        const query = userInfoCollection.find()
        const result = await query.toArray()
        res.send(result)
    })

    // delete info 3
    app.delete('/eventInfo/:id', async(req, res) =>{
        const id = req.params.id 
        const query = {_id: new ObjectId(id)}
        const result = await userInfoCollection.deleteOne(query)
        res.send(result)
    })

    // get update info 
    app.get('/eventInfo/:id', async(req, res) =>{
        const id = req.params.id 
        const query = {_id: new ObjectId(id)}
        const result = await userInfoCollection.findOne(query)
        res.send(result)

    } )

    app.put('/eventInfo/:id', async(req, res) =>{
        const id = req.params.id 
        const users = req.body
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateInfo = {
            $set:{
                bName:users.bName,
                 gName:users.gName,
                 phone:users.phone,
                 address:users.address,
                email:users.email,
                 date:users.date,
                 photo:users.photo
            }
        }
        const result = await userInfoCollection.updateOne(filter, updateInfo, options)
        res.send(result)
    })


    // auth verified users CRUD operations
    // create user 1
    app.post('/users', async(req, res) =>{
        const user = req.body 
        const query = await userCollection.insertOne(user)
        res.send(query)
    })

    // red 2
    app.get('/users', async(req, res) =>{
        const query = userCollection.find()
        const result = await query.toArray()
        res.send(result)
    })

    app.delete('/users/:id', async (req, res) =>{
        const id = req.params.id 
        const query ={_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
      })

    app.patch('/users', async(req, res) =>{
        const user = req.body 
        const filter = {email: user.email}
        const updateData = {
            $set:{
                lastLogIn : user.lastLogIn
            }
        }
        const result = await userCollection.updateOne(filter, updateData)
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





app.get('/', (req, res) =>{
    res.send("BIYESADI EVENT MANAGEMENT")
})
app.listen(port, () =>{
    console.log(`server is running on port: ${port}`)
})