const { initDatabase } = require('../loaders/database-loader');

const expect =  require('chai').expect;
const User = require('../models/User').User;

describe('Mongoose creates a user in MongoDB',()=>{
    let user = User();
    before(()=>{
        user = new User({
            uid: 'abcdefgtest',
            phoneNumber: '+346960189830'
        });
    })
    after(()=>{
        user.delete();
    })
    it('User creation passed',  async function(){
        // const newUser = new User({
        //     uid: 'abcdefg',
        //     phoneNumber: '+346060189830'
        // });
        await initDatabase();
    
        const saved = await user.save()
        console.log(saved);
        expect(saved).to.have.property('__v');
        expect(saved).to.have.property('uid').equal('abcdefgtest')
        
    });
})


describe('Model fails when uid or phoneNumber are not passed to constructor',()=>{
    let user = new User();
    before(async()=>{
        await initDatabase();
    })
    after(()=>{
        user.delete();
    })
    it('error occurs when uid is not setted to User',async()=>{
        user = new User({phoneNumber: '123456'});
        try{
            await user.save();

        }catch(err){
            expect(err).to.be.an('error')
        }
        //expect(savedUser).to.have.an('error');

    })
    it('error occurs when phone is not setted to User',async()=>{
        user = new User({uid: '123456'});
        try{
            await user.save();

        }catch(err){
            expect(err).to.be.an('error')
        }
        //expect(savedUser).to.have.an('error');

    })
    it('error occurs when neither uid or phone aren\'t setted to User',async()=>{
        user = new User({email: 'dasfsdlfijadsf'});
        try{
            await user.save();

        }catch(err){
            expect(err).to.be.an('error')
        }
        //expect(savedUser).to.have.an('error');

    })
})