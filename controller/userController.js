const User = require('../models/User').User;


exports.updateProfileData = async (req, res, next) => {
    console.log('REQUESTED');
    const body = req.body;
    console.log(body);

    const { firstName, lastName, email, mainAddress,
        secondaryAddress, birthDate, _id
    } = body;

    let searchedUser = await User.findOne({ _id: _id });

    searchedUser['firstName'] = firstName;
    searchedUser['lastName'] = lastName;
    searchedUser['email'] = email;
    searchedUser['mainAddress'] = mainAddress;
    searchedUser['secondaryAddress'] = secondaryAddress;
    searchedUser['birthDate'] = birthDate;
    await searchedUser.save().catch(err => res.status(500).json({ message: 'Something was wrong!', error: true }))
    return res.status(200).json({ message: 'The user has been updated successfuly' })
    //     return res.json(searchedUser);
}

exports.updateProfilePicture = async (req, res, next) => {


    const body = req.body;
    
    const file = req.file;
    console.log(body, file);
    const {_id} = body
    let searchedUser = await User.findOne({_id: _id});
    console.log('FILE', file)
    let imageUrl = 'http://192.168.1.113:8080/static/pictures/' + file['filename'];
   console.log(imageUrl)
   searchedUser.imageUrl = imageUrl;
   await searchedUser.save();
    return res.status(200).json({imageUrl:imageUrl});


}