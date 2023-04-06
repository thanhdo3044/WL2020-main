const {
    Kafka
} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['127.0.0.1:9092']
})

const producer = kafka.producer()
const consumer = kafka.consumer({
    groupId: 'app01',
})

const run = async () => {
    // Producing
    // await producer.connect()
    // await producer.send({
    //     topic: 'test',
    //     messages: [{
    //         value: `number : ${i}`
    //     }, ],
    // })
    await consumer.connect()
    await consumer.subscribe({
        topic: 'inventory',
        fromBeginning: false
    })

    await consumer.run({
        eachMessage: async ({
            topic,
            partition,
            message
        }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
        },

    })
}

// consumer.commitOffsets([
//     { topic: 'test', partition: 0, offset: '163502' },
// ])

run().catch(console.error)