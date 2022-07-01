const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();


const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const ObjectId = require('mongodb').ObjectId;


//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60qwo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        console.log('Databse Connected')
        const tasksCollection = client.db('todo').collection('task');
        // const task= {task:'python django'};
        // const result= await tasksCollection.insertOne(task);
        // console.log(`task added with id: ${result.insertedId}`)
       

        //-------------------------------------tasks----------------------------------
        //---------Insert an task------------
        app.post('/task', async (req, res) => {
            const newtask = req.body;
            console.log('new task added', newtask);
            const result = await tasksCollection.insertOne(newtask);
            // res.send({result : 'success'})
            res.send(result)
            console.log(result)
        });

    
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen(port, () => {
    console.log('Server on port', port)
})