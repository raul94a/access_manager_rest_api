const AccessManagerDevice = require('../models/AccessManagerDevice').AccessManagerDevice;
const { User } = require('../models/User');
const { initDatabase } = require('../loaders/database-loader');
const expect = require('chai').expect;

async function createADM(registrationCode) {
    
    const accessManager = new AccessManagerDevice({ registrationCode: registrationCode });
    await accessManager.save();
    return accessManager;
}
describe('CREATION OF ADM WITH JWT AUTH', () => {

    let user = new User();
    let ADM = new AccessManagerDevice();
    before(async () => {
        await initDatabase();

        user = new User({
            uid: 'testinguid',
            phoneNumber: '+346460189830'
        });
        await user.save()

     

    })
    after(() => {
        user.delete();
        // ADM.delete();
    })

    it('create a ADM',async()=>{
        ADM = await createADM('alfa8');
        expect(ADM).to.have.property('registrationCode');
    })

})