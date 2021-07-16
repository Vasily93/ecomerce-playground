const fs = require('fs');
const crypto = require('crypto');

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
    async getAll() { //returning all userers data
        const data = JSON.parse(await fs.promises.readFile(this.filename, {
            encoding: 'utf8'
        }));
        return data;
    }
    async create(attrs) { //creating and adding new user to db
        attrs.id = this.randomID();
        const records = await this.getAll();
        records.push(attrs);
        await this.writeAll(records);
    }
    async writeAll(records) { // func to save all records to a file
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 2));
    }
    randomID () {
        return crypto.randomBytes(4).toString('hex');
    }
    async getOne(id) {
        const records = await this.getAll();
        const user = records.find(record => record.id === id);
        return user;
    }
    async delete(id) {
        let records = await this.getAll();
        records = records.filter(user => user.id !== id);
        await this.writeAll(records);
    }
    async getOneBy(filters) {
        const records = await this.getAll();
        for(let record of records) {
            let found = true;
            for(let key in filters) {
                if(record[key] !== filters[key]) {
                    found = false;
                }
            }
            if(found) {
                return record;
            }
        }
    }
    async update(id, attrs) {
        const records = await this. getAll();
        const record = records.find(record => record.id === id);
        if(!record) {
            throw new Error('Sorry, user was not found!');
        }
        Object.assign(record, attrs);
        await this.writeAll(records);
    }
}

const test = async () => { 
    console.log('testing!')
    const repo = new UserRepository('users.json');
    await repo.getOneBy({id: 'e059e7cd'});
}
test(); 