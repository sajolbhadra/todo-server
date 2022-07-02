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
        console.log('Database Connected')
        const tasksCollection = client.db('todo').collection('task');
        const completedTasksCollection = client.db('todo').collection('completedTask');
        // const task= {task:'python django'};
        // const result= await tasksCollection.insertOne(task);
        // console.log(`task added with id: ${result.insertedId}`)


        //-------------------------------------tasks----------------------------------
        //---------Insert an task------------
        app.post('/task', async (req, res) => {
            const newtask = req.body;
            console.log('new task added', newtask);
            const result = await tasksCollection.insertOne(newtask);
            // res.send(result)
            res.send(result)
        });

        //---------Get all tasks----------
        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = tasksCollection.find(query)
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        //--- Get Individual task Details-------------
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.findOne(query);
            res.send(result)
        })

        //-----Update Individual task-----------
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatetask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updatetask.quantity
                }
            };
            const result = await tasksCollection.updateOne(filter, updateDoc, options);
            res.send(result)
            console.log(result)
        })

        //--------Delete Individual task---------------
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
            console.log(id, result)
        })





        //Get COmpleted Task
        app.get('/completed-task', async (req, res) => {
            const query = {};
            const cursor = completedTasksCollection.find(query)
            const tasks = await cursor.toArray();
            res.send(tasks);
        })
        //------Insert to Completed Task-----------
        app.post('/completed-task', async (req, res) => {
            const query = { _id: ObjectId(req.params) };
            console.log('new task added', query);
            const result = await completedTasksCollection.insertOne(query);
            // res.send(result)
            res.send(result)
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