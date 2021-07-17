const express = require('express');
const bodyParser = require('body-parser');
const usersRepo = require('./repositories/users');
const cookieSession = require('cookie-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ['sdf984nmdsos8o3420ankdf']
}));

app.get('/', (req, res) => {
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

app.post('/', async (req, res) => {
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
})

app.listen(9000, () => {
    console.log('LIstening on port 9000');
});

