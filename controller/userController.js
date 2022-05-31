const User = require('../models/User').User;
const env = require('../config/env.json');
const userLogger = require('../utils/logger').userLogger;


exports.updateProfileData = async (req, res, next) => {
    console.log('REQUESTED');
    const body = req.body;
    console.log(body);

    const { firstName, lastName, email, mainAddress,
        secondaryAddress, birthDate, _id
    } = body;
    if (Object.values(body).length == 0) {
        userLogger.warn(`Status code 403; request not allowed; url ${req.url}; from ip ${req.ip}`)
        return res.status(403).json({ message: 'not allowed' })
    }

    let searchedUser = await User.findOne({ _id: _id });

    searchedUser['firstName'] = firstName;
    searchedUser['lastName'] = lastName;
    searchedUser['email'] = email;
    searchedUser['mainAddress'] = mainAddress;
    searchedUser['secondaryAddress'] = secondaryAddress;
    searchedUser['birthDate'] = birthDate;
    await searchedUser.save().catch(err => {
        userLogger.error(`Status code 500; User profile could not be updated; url ${req.url}; from ${req.ip}; more info: ${err.toString()}`)
        return res.status(500).json({ message: 'Something was wrong!', error: true })
    })
    return res.status(200).json({ message: 'The user has been updated successfuly' })
    //     return res.json(searchedUser);
}

exports.updateProfilePicture = async (req, res, next) => {


    const body = req.body;

    const file = req.file;
    console.log(body, file);
    const { _id } = body
    let searchedUser = await User.findOne({ _id: _id });
    console.log('FILE', file)
    let imageUrl = env['profile-picture-path'] + file['filename'];
    console.log(imageUrl)
    searchedUser.imageUrl = imageUrl;
    await searchedUser.save();
    return res.status(200).json({ imageUrl: imageUrl });


}


exports.updateContactsList = async (req, res, next) => {
    const body = req.body;

    const { contacts, userId: _id } = body;
    const searchedUser = await User.findOne({ _id: _id })
        .catch(err => res.status(500)
            .json({ error: 'Server error' }))

    if (searchedUser) {
        searchedUser['contacts'] = contacts
        await searchedUser.save();
        console.log('contacts updated');
        return res.status(200).json({ message: 'contacts list has been updated' })
    }
    userLogger.warn(`Status code 404; User not found with id ${_id}; url ${req.url}; from ${req.ip}`)

    return res.status(404).json({ error: 'User not found' })

}

exports.toggleUserFromBlacklist = async (req, res, next) => {
    const body = req.body;
    const { user, userId: _id } = body;
    console.log(body)
    const searchedUser = await User.findOne({ _id: _id.toString() });
    console.log(searchedUser);

    if (!searchedUser) {
        userLogger.warn(`Status code 404; User not found with id ${_id}; url ${req.url}; from ${req.ip}`)

        return res.status(404).json({ error: 'User not found' });
    }
    let blacklist = searchedUser['blacklist'] || [];
    if (blacklist.includes(user)) {
        blacklist = blacklist.filter(element => element.toString() !== user.toString());
        console.log(`Se ha eliminado el usuario ${user} de blacklist: ${blacklist}`)
    } else {
        blacklist.push(user);
    }
    searchedUser['blacklist'] = blacklist;
    await searchedUser.save();
    return res.status(200).json({ message: 'User toggle successfully' })
}

exports.changeShowAMDLocationStatus = async (req, res, next) => {
    const body = req.body;
    const { userId: _id, changeTo: showTo } = body;
    console.log(body);
    const searchedUser = await User.findOne({ _id: _id });
    if (!searchedUser) {
        userLogger.warn(`Status code 404; User not found with id ${_id}; url ${req.url}; from ${req.ip}`)

        return res.status(404).json({ error: 'User not found' });
    }
    searchedUser['showAMDLocation'] = showTo;
    await searchedUser.save();
    return res.status(200).json({ message: 'AMD location permission changed successfully' });
}

exports.changePictureVisibilityStatus = async (req, res, next) => {
    const body = req.body;
    const { userId: _id, changeTo: showTo } = body;
    const searchedUser = await User.findOne({ _id: _id });
    if (!searchedUser) {
        userLogger.warn(`Status code 404; User not found with id ${_id}; url ${req.url}; from ${req.ip}`)

        return res.status(404).json({ error: 'User not found' });
    }
    searchedUser['pictureVisibleBy'] = showTo;
    await searchedUser.save();
    return res.status(200).json({ message: 'Picture visibility permission changed successfully' });
}

