const express =require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express();
const port =process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Mongodb userName & Password are here...
// user: userProfileDB
// password: m1SMElK81JEEY5f5

// Mongodb connection starts from here....



const uri = `mongodb+srv://userProfileDB:m1SMElK81JEEY5f5@cluster0.va5ejui.mongodb.net/?retryWrites=true&w=majority`;

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
         client.connect();

        const totalUser=client.db('userProfileDB').collection('userProfileCollection');

        const sectorCollection=client.db('userProfileDB').collection('sectorsCollection');

    // Read or Find/Query Method.::::

    app.get('/users',async(req,res)=>{
        const query={};
        const cursor=totalUser.find(query);
        const users=await cursor.toArray();
        res.send(users)
    })

    // Read or Find/Query method in case of sector collection...

    app.get('/userSector', async(req,res)=>{
        const query={};
        const cursor=sectorCollection.find(query);
        const users=await cursor.toArray();
        res.send(users)
    })


    // Create method done here::::Post method..
        app.post('/users', async(req,res)=>{
            const user=req.body;
            
            const result=await totalUser.insertOne(user);
            res.send(result);
            
        })

    // Update method done here...
    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id;
        

        const query={ _id: new ObjectId(id) };
        const user=await totalUser.findOne(query);
        res.send(user);
        console.log(user)
    })

    // Put method for updating data....
    app.put('/users/:id', async(req,res)=>{
        const id=req.params.id;
        const updatedUser=req.body;
        const filter={ _id: new ObjectId(id) };
        const options= { upsert: true };
        const updateDoc={
            $set:{
                name: updatedUser.name,
                sector: updatedUser.sector,
                checkbox: updatedUser.checkbox
            }
        }
        const result = await totalUser.updateOne(filter,updateDoc, options);
        console.log("updated user",updatedUser);
        res.json(result)
    })


    
    // const result= await totalUser.insertMany(user);
    // console.log(result);
    
    } finally {
      
    }
  }


run().catch(err=>console.log(err));




app.get('/',(req,res)=>{
    res.send("Hellow from node mongo crud server. Sing hey ho, sing hey ho. This is something so profound.")
});


app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})

