const mongoose= require('mongoose'); 
// const document_schema = require('./document')
const user_schema = new mongoose.Schema({
    email: {
        type: String,
        required: true 
    },
    Docs:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref:'DOCUMENT',
        default:[]
    },
    logged_in:{
        type: Boolean,
        default:false
    },
    pass_hash:{
        type: String,
        default:null
    }
}) 
module.exports = mongoose.model('USER',user_schema); 