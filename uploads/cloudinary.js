const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:'imag',
    api_key:'355356541952741',
    api_secret:'JQYTAGfl6-8qtWe2J9izTCJ1kKM'
})

exports.uploads =  (file,folder)=>{
    return new Promise(resolve => {
        cloudinary.uploader.upload(file).then( result => {
            resolve({
                url: result['url'],
                id: result['public_id']
            })
        })
    })
}