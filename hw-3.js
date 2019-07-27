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
    nickname += i.toString();

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
db.customers.createIndex({
    'name.first': 'text',
    'name.last' : 'text',
    nickname    : 'text',
    email       : 'text',
});

db.customers.find(
    { $text: { $search: 'Peter -Petrov', $caseSensitive: false } },
    { score: { $meta: 'textScore' }, _id: false }
);

// db.customers.find(
//     { $text: { $search: 'WOLFTOWN Alisa', $caseSensitive: true } },
//     { score: { $meta: 'textScore' }, _id: false }
