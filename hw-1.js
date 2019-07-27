use dfilippenko;

// Cleanup previous changes
db.customers.drop();

// Data arrays for filling
const customerFirstNames = [
    'Peter',
    'Danil',
    'Vasyl',
    'Alex',
    'Dennis',
    'John',
    'Max',
];

const customerLastNames = [
    'Popandopulo',
    'Ivanov',
    'Johnson',
    'Vasechkin',
    'Brown',
    'Petrov',
    'Sidorov',
];

const pwdChars = '0123456789abcdefgh'.split('');

// Useful functions
const getRandomInteger = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayItem = a => a[getRandomInteger(0, a.length - 1)];

const getRandomPassword = () => {
    let pwd = '';
    for (let i = 0; i < getRandomInteger(8, 12); i++) {
        pwd += getRandomArrayItem(pwdChars);
    }
    return pwd;
};

// Customers filling loop
const customers = [];

for (let i = 0; i < 3000; i++) {
    // Genarating one random customer
    const first = getRandomArrayItem(customerFirstNames);
    const last = getRandomArrayItem(customerLastNames);
    let nickname = first[0].toLowerCase() + last.toLowerCase();
    const email = nickname + '@email.com';
    nickname += '_star';

    customers.push({
        insertOne: {
            document: {
                name: {
                    first,
                    last,
                },
                nickname,
                email,
                password: getRandomPassword(),
                created: new Date(),
            },
        },
    });
}

// Creating and optimising customers collection
db.customers.bulkWrite(customers);
db.customers.createIndex({ email: 1, created: -1 });
db.customers.createIndex({ 'name.first': 1, 'name.last': 1 });

// 1. Поиск пользователя по email
db.customers.find({
        email: /jbrown@email.com/gi,
    }).explain();

// 2. Поиск пользователя по имени и фамилии (направление ASC)
db.customers.find({
        'name.first': /d/gi,
        'name.last': /brown/gi,
    }).sort({
        'name.first': 1,
        'name.last': 1,
    }).explain();

// 3. Поиск пользователя по email и дате регистрации (email — ASC, created — DESC)
const date = new Date();
db.customers.find({
        email: /jbrown@email.com/gi,
        created: { $lt: date },
    }).sort({
        email: 1,
        created: -1,
    }).explain();
