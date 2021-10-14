import bcrypt from 'bcryptjs'
const users = [
    {
        userName: 'Admin',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/1.jpg',
        isAdmin: true,

    },
    {
        userName: 'John Doe',
        email:'john@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/2.jpg',

    },
    {
        userName: 'Jane Doe',
        email:'jane@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/3.jpg',
    },
    {
        userName: 'peter Doe',
        email:'peter@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/4.jpg',
    },
    {
        userName: 'Janet Doe',
        email:'janet@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/5.jpg',
    },
    {
        userName: 'sam Doe',
        email:'sam@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/6.jpg',
    },
    {
        userName: 'paul Doe',
        email:'paul@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/7.jpg',
    },
    {
        userName: 'julia Doe',
        email:'julia@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/8.jpg',
    },
    {
        userName: 'emma Doe',
        email:'emma@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/9.jpg',
    },
    {
        userName: 'bridget Doe',
        email:'bridget@example.com',
        password: bcrypt.hashSync('123456', 10),
        profilePicture:'/images/person/10.jpg',
    },
    
]
export default users