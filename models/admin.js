const mongoose = require('mongoose');
let CITIZEN= require('../models/citizen');

const adminSchema=CITIZEN.schema;
adminSchema.add({
    Anid:{
        type: String,
        required: false
      }
});


const admin = module.exports = mongoose.model('admin', adminSchema);
//const ServiceProvider = module.exports = CITIZEN.discriminator('ServiceProvider',ServiceProviderSchema);
