require('dotenv').config();
const { faker } = require('@faker-js/faker');
const readlineSync = require('readline-sync')
const mongoose = require('../database/connection');
const userResolvers = require('../database/schema/User/resolvers');

mongoose.connect();

const start = async() => {
    faker.locale = 'id_ID';
    let counter = 0;

    let generateTotal = readlineSync.question("How many randoms users will be generated?");
    const numberValidator = /^\d+$/.test(generateTotal)

    if (!numberValidator) {
        console.log("Wrong input format!!");
        process.exit();
    }

    console.log(`Generating ${generateTotal} users`);

    while (counter < generateTotal) {
        const name = faker.name.findName();
        const addUser = {
            username: faker.internet.userName(name),
            fullname: name,
            email: faker.internet.email(),
            phoneNumber: faker.phone.phoneNumber(),
            gender: faker.random.arrayElement(["Male", "Female"]),
            address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`,
            password: '1234',
        }
        await userResolvers.register(addUser)
        console.log(addUser)
        counter++;
    }
    process.exit()
}

start()