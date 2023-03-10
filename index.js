const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dbh1aux.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("Genius car db connected");

async function run(){
    try{
        await client.connect();
        const serviceCollection =  client.db('geniusCar').collection('service');
        app.get("/service",async(req,res)=>{
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        })

        app.get("/service/:id",async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service);
        })
        app.post("/service", async(req,res)=>{
                const newservice= req.body;
                console.log(newservice);
                const result = await serviceCollection.insertOne(newservice);
                res.send(result);
        })
        app.delete("/service/:id",async (req,res)=>{
            const id = req.params.id;
            const query= {_id: new ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.send(result);
        })
    }
    finally{

    }

}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Running genius car server");
})
app.listen(port,()=>{
    console.log('listening to port',port);
})