const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['sdf984nmdsos8o3420ankdf']
}));

app.get('/signup', (req, res) => {
    res.send(`
        <div>
            Your ID is: ${req.session.userID}
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <input name="passwordConfirmation" placeholder="password confimation"/>
                <button>Sing Up</button>
            </form>
        </div>
    `);
});

app.post('/signup', async (req, res) => {
    const {email, password, passwordConfirmation} = req.body;
    const existingUser = await usersRepo.getOneBy({email: email});
    if(existingUser) {
        return res.send(`User with an email ${email} already exists`)
    }
    if(password !== passwordConfirmation) {
        return res.send('Passwords do not match')
    }
    const user = await usersRepo.create({email, password});
    req.session.userID = user.id;

    res.send('Account Created!');
});

app.get('/signout', (req, res) => {
    req.session = null;
    res.redirect('/signup');
});

app.get('/signin', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email"/>
                <input name="password" placeholder="password"/>
                <button>Sing In</button>
            </form>
        </div>
    `);
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await usersRepo.getOneBy({email});
    if(!user) {
        return res.send('No such user exists');
    }
    if(user.password !== password) {
        return res.send('Invalid password'); 
    }

    req.session.userID = user.id;
    res.send('You are singed in now!')
});


app.listen(9000, () => {
    console.log('LIstening on port 9000');
});

