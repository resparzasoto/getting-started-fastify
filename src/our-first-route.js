async function routes(fastify, options) {
  const collection = fastify.mongo.db.collection('pizzas');

  fastify.get('/pizzas', async function (request, reply) {
    const result = await collection.find().toArray();
    if (result.length === 0) {
      throw new Error('No documents found');
    }
    return result;
  });

  fastify.get('/pizzas/:id', async function (request, reply) {
    const result = await collection.findOne({
      _id: fastify.mongo.ObjectId(request.params.id),
    });
    if (result === null) {
      throw new Error('Invalid value');
    }
    return result;
  });

  fastify.post('/pizzas', async function (request, reply) {
    const result = await collection.insertOne(request.body);
    if (result === null) {
      throw new Error('Unexpected error');
    }
    return result;
  });

  fastify.put('/pizzas/:id', async function (request, reply) {
    const query = { _id: fastify.mongo.ObjectId(request.params.id) };
    const update = { $set: request.body };
    const options = { upsert: true };
    const result = await collection.updateOne(query, update, options);
    if (result === null) {
      throw new Error('Unexpected error');
    }
    return result;
  });

  fastify.delete('/pizzas/:id', async function (request, reply) {
    const result = await collection.deleteOne({
      _id: fastify.mongo.ObjectId(request.params.id),
    });
    if (result === null) {
      throw new Error('Invalid value');
    }
    return result;
  });
}

module.exports = routes;
