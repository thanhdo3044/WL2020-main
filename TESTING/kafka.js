const { Kafka } = require('kafkajs')
 
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['moped-01.srvs.cloudkafka.com:9094'],
  ssl: true,
  sasl: {
    mechanism: 'SCRAM-SHA-256', // scram-sha-256 or scram-sha-512
    username: '425kn9zq',
    password: 'KsTM0W4PP8jDmCxFhrN2jdAhS3zeqHIS'
  },
})
 
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'test-group' })
 
const run = async () => {
  // Producing
  await producer.connect()
  await producer.send({
    topic: '425kn9zq-woodsland',
    messages: [
      { value: 'Hello KafkaJS user!' },
    ],
  })
 
  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: '425kn9zq-woodsland', fromBeginning: true })
 
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })
}
 
run().catch(console.error)