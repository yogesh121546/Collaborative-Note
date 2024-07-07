const mongoose= require('mongoose');


const document_schema = new mongoose.Schema({
    title:{
        type: String,
        default: `untitled : ${Date.now()}`
    },
    img_url:{
        type:String,
        default:null
    },
    data: {
        type: String,
        default: null
    },
    shared:{
        type:Boolean,
        default:false
    },
    shared_users:{
        type:[{user:String,accessType:String}],
        default:null
    },
    owner:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    },
    last_modified:{
        type:Date,
        default:Date.now
    },
    data_history:[{
        Date:{
            type:Date,
            default:Date.now
        },
        user: {
            type:[String],
            default:null
        },
        data: {
            type: String,
            default: null
        }
    }]
}) 
module.exports = mongoose.model('DOCUMENT',document_schema); 