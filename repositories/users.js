const fs = require('fs');

class UserRepository {
    constructor(filename) {
        if(!filename) {
            throw new Error('Creating a repo requiers a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename); //checking if file already exists
            console.log('already exists')
        } catch (error) {
            fs.writeFileSync(this.filename, '[{"name": "Vaasily"}]'); //creating a file
        }
    }
    async getAll() {
        const contents = fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        });
        console.log(contents);
    }
}

const test = async () => { //!!!! Promise doent resolves
    console.log('testing!')
    const repo = new UserRepository('users.json');
    await repo.getAll();
}
test();