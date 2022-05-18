# Nestjs-kafkajs-integration

Demonstration of how to integrate kafkajs with nestjs and create a priority messaging queue.

[![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) [![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) [![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) [![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) [![Apache Kafka](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)](https://img.shields.io/badge/Apache_Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white)

## Architecture

Fololowing is the architecture of the application.
[![Architecure Diagram](https://raw.githubusercontent.com/faizvasaya/nestjs-kafkajs-integration/main/KafkaPriorityQueue.jpg)](https://raw.githubusercontent.com/faizvasaya/nestjs-kafkajs-integration/main/KafkaPriorityQueue.jpg)

- A topic with 10 partitions is created by the `kafka-admin.service.ts` file.
- The `producer.service.ts` has the logic to push messages as per their priority in their respective partitions.
- The `app.service.ts` produces messages with the correct key when `localhost:3000` is queried.
- The `test.consumer.ts` file creates 10 consumers.
- The `consumer.service.ts` file maps the consumers to the respective partitions.

## Environment setup

- Install JDK8
- Install and run the following
  - zookeeper - It keeps a track of kafka clusters and brokers within it.
  - kakfa - The message streaming service from apache.
- How to install kafka: https://kafka.apache.org/quickstart

## Environment variables

- Copy the contents of .env.example file in .env file

## Installation

Nestjs-kafkajs-integration requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd nestjs-kafkajs-integration
npm i
npm run start:dev
```

## Author

Faizal Vasaya

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/faizalvasaya/) [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/FaizalVasaya)

## License

MIT

**Free Software, Hell Yeah!**
