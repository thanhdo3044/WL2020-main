const {
    Kafka
} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['127.0.0.1:9092']
})
const admin = kafka.admin()



// remember to connect and disconnect when you are done
const run = async () => {
    await admin.connect()

    // console.log( await admin.createTopics({
    //     topics: [{
    //         topic: 'inventory',
    //     }],
    // }))

    let topic = await admin.fetchTopicOffsets('inventory')
    console.log(topic)

    // await admin.setOffsets({
    //     groupId: 'test-group2',
    //     topic: 'test',
    //     partitions: [
    //         { partition: 0, offset: '163530' }
    //     ]
    // })

    // console.log(await admin.fetchOffsets({
    //     groupId: 'test-group2',
    //     topic: 'test'
    // }))

    await admin.disconnect()
}



run().catch(console.error)