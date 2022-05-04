const { initDatabase } = require('../loaders/database-loader');

const expect =  require('chai').expect;
const User = require('../models/User').User;
const DeviceInfo = require('../models/DeviceInfo').DeviceInfo;
const deviceFirebaseUrl = 'https://access-manager-2e513-default-rtdb.europe-west1.firebasedatabase.app/devices/-N0lTHauGlac4V6w0NWc.json';
describe('DEVICE INFO TESTING',()=>{
    let user = new User();
    let deviceInfo = new DeviceInfo();
    before(async()=>{
        user = new User({
            uid: 'abcdefg',
            phoneNumber: '+346060189830'
        });
        const data = await fetch(deviceFirebaseUrl,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json'
            }
        })
        const info = await  data.json()
        const {androidId, brand,device,manufacturer,model,version,isPhysicalDevice} =info;
        deviceInfo = new DeviceInfo({
            androidId: androidId,
            brand: brand,
            device:device,
            manufacturer:manufacturer,
            model:model,
            version:version.sdkInt,
            isPhysicalDevice:isPhysicalDevice,
            user:user._id

        })
        // console.log(deviceInfo)

    })
    after(()=>{
        // deviceInfo.delete();
        // user.delete();
    })
    it('Device is saved into MONGODB',(done)=>{
        deviceInfo.save().then((res)=>{
            expect(res).to.have.property('__v');
            expect(res).to.have.property('user');
            done();
        })
    })
    // it('User creation passed',  async function(){
    //     // const newUser = new User({
    //     //     uid: 'abcdefg',
    //     //     phoneNumber: '+346060189830'
    //     // });
    //     await initDatabase();
    
    //     const saved = await user.save()
    //     console.log(saved);
    //     expect(saved).to.have.property('__v');
    //     expect(saved).to.have.property('uid').equal('abcdefg')
        
    // });

})