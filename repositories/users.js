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
            fs.writeFileSync(this.filename, '[{"name": "Vasily"}]'); //creating a file
        }
    }
    async getAll() {
        const data = JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
        console.log('Content parsed ----',data);
        return data;
    }
}

const test = async () => { 
    console.log('testing!')
    const repo = new UserRepository('users.json');
    await repo.getAll();
}
test();