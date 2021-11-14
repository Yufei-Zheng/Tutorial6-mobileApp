const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/issuetracker';

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('customers');

    // Create
    const customer = [{ serial: 1, name: 'Alice', contact: '12345678' }, {serial: 2, name: 'Bob', contact: '87654321' }];
    const create_1 = await collection.insertMany(customer);
    const create_2 = await collection.insertOne({serial: 3, name: 'Cindy', contact: '56781234'})
    console.log('Result of insertMany and insertOne:\n', await collection.find().toArray());

    await collection.createIndex({ serial: 1 }, { unique: true });
    await collection.createIndex({ name: 1 });

    // Read
    const find_1 = await collection.find({ serial:1 }).toArray();
    console.log('Result of find sno.1:\n', find_1);
    const find_2 = await collection.find({serial:2}, { _id: 0,'serial': 1, 'name': 1 }).toArray();
    console.log('Result of find sno.2 (using projection):\n', find_2)

    // Update
    await collection.updateOne({ serial: 2 }, { $set: {name: 'Updated_Bob' } })
    //console.log('Result of updateOne:\n', update_1);
    await collection.updateMany({}, { $set: { timestamp: 'Wed Oct 27 2021' } })
    //console.log('Result of updateMany:\n', update_2);
    await collection.replaceOne({ serial: 3 }, {
    serial: 3,
    name : 'Updated_Cindy',
    contact: 'Updated_56781234'
    });
    console.log('Result of updateOne, updateMany and replaceOne:\n', await collection.find().toArray());

    // Delete
    await collection.deleteOne({ serial: 3 })

    // Aggerate
    cnt = await collection.aggregate([ { $group: { _id: null, count: { $sum: 1 } } }]).toArray();
    console.log('Result of delete sno.3 (using aggerate):\n', cnt)


  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithAsync();
