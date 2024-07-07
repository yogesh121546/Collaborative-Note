const { StatusCodes } = require("http-status-codes");
const customError = require("../errors/custom-error");
const async_wrapper = require("../middleware/async_wrapper");
const Document = require('../models/document');
const USER = require('../models/user');
  
const createDocument= async_wrapper(async(req,res)=>{
    const {email} = req.user;
    // const docCreated = await DOCUMENT.create({owner:email,updated_at:{user:[email]}});
    const newDocument = new Document({
        owner: email,  
        last_modified: Date.now(),
        data_history: [
            {
                user: [`${email}`]
            }
        ]
    });
    const savedDocument = await newDocument.save();
    //console.log(docCreated);
    const updtateUserDocList = await USER.findOneAndUpdate({email:email},{"$push":{Docs:[savedDocument._id]}});
    //console.log(updtateUserDocList);
    const user= await USER.where("email").equals(email).populate("Docs").exec();
    //console.log(user[0].Docs);
    res.json({msg:"doc created successfully",document_id:savedDocument._id});
});

const getDocument = async_wrapper(async(req,res)=>{
    const {docId}= req.query;
    const {email}= req.user;
   
    const savedDocument = await Document.findOne(
        {
            $and:[
                {  _id : docId},
                {   $or:[
                        {shared_users: 
                            {
                                $elemMatch: {
                                    user: email
                                }  
                            } 
                        },
                        {owner:email},
                    ]
                },
            ] 
        });
    if(!savedDocument){
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }
    res.json(savedDocument);
})

const getUserDocs = async_wrapper(async(req,res)=>{
    const {email}= req.user;
    // const user= await USER.where("email").equals(email).populate("Docs").exec();
    // res.json(user[0].Docs);
    const userDocs = await Document.find(
        {
            $or:[
                {
                    shared_users: {
                        $elemMatch: {
                            user: email
                        }
                    }
                },
                {owner:email},
            ]                
        
        }
    ).sort({ last_modified: -1 }).lean();
    console.log(userDocs);
    res.json(userDocs);
})
     
const renameDocument = async_wrapper(async(req,res)=>{
    const {docId,title}= req.body;
    const {email}= req.user;
   //let email = "hell";
    console.log(docId,email);
    const isValidUpdate = await Document.findOneAndUpdate(
        {
            $and:[
                {  _id : docId},
                {owner:email}
            ] 
        },
        {
            $set:{title:title}
        }
    )
    if(!isValidUpdate){
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }
    res.json({msg:"doc renamed successfully"});
    // res.render('document.ejs');  
})
     
    
const updateDocumentData = async_wrapper(async(req,res)=>{
  
    const {docId,data}= req.body;
    const {email}= req.user;
        const isValidUpdate = await Document.findOneAndUpdate(
            {
                $and:[
                    {  _id : docId},
                    {
                        $or:[
                            {
                                shared_users: {
                                    $elemMatch: {
                                        user: email,
                                        accessType: "editor"
                                    }
                                }
                            },
                            {owner:email},
                        ]
                    }
                ] 
            },
            {
                $set:{data:data},
                $set:{last_modified:Date.now()}
                
            }
        )

        if(!isValidUpdate){
            throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
        }
        res.json({msg:"doc data updated successfully"});

    
})

const updateDocumentHistoryData = async_wrapper(async(req,res)=>{

    const {docId,data,users}= req.body;
    const {email}= req.user;
        const isValidUpdate = await Document.findOneAndUpdate(
            {
                $and:[
                    {  _id : docId},
                    {
                        $or:[
                            {
                                shared_users: {
                                    $elemMatch: {
                                        user: email,
                                        accessType: "editor"
                                    }
                                }
                            },
                            {owner:email},
                        ]
                    }
                ] 
            },
            {
                $set:{data:data},
                $push:{
                    data_history:{
                        user:users,
                        Date:Date.now(),
                        data:data
                    }
                }
            }
        )

        if(!isValidUpdate){
            throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
        }
        res.json({msg:"doc history updated successfully"});
 
})


const deleteDocument = async_wrapper(async(req,res)=>{

    const {docId}= req.body;
    const {email}= req.user;
    const isValidDelete = await Document.findOneAndDelete(
        {
            owner:email,
            _id:docId
        }
    )
    if(!isValidDelete){
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }
    res.json({msg:"doc deleted successfully"});
})

const shareDocument = async_wrapper(async(req,res)=>{

    const {docId,username,accessType}= req.body;
    const {email}= req.user;
    if(username === ''){
        throw new customError("username cannot be empty",StatusCodes.BAD_REQUEST);
    }

    const isValidUpdate = await Document.findOneAndUpdate(
        {
            $and:[
                {  _id : docId},
                {   
                    $or:[
                        {
                            shared_users: {
                                $elemMatch: {
                                    user: email,
                                    accessType: "editor"
                                }
                            }
                        },
                        {owner:email}
                    ]
                },
                {
                    'shared_users.user': { $ne: username }
                }
            ]   
        },
        {   
            $addToSet:{
                shared_users:{   
                    user:username,
                    accessType:accessType
                }
            }
        },
        {
            new: true 
        }
    )   
    if(!isValidUpdate){                 
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }else{
        const updtateUserDocList = await USER.findOneAndUpdate({email:username},{"$push":{Docs:[docId]}});
    }
    res.json({msg:"doc shared successfully"});  
})

const updateSharedAccessType = async_wrapper(async(req,res)=>{

    const {docId,username,accessType}= req.body;
    const {email}= req.user;

    const isValidUpdate = await Document.findOneAndUpdate(
        {
            $and:[
                {  _id : docId},
                {   
                    $or:[
                        {
                            shared_users: {
                                $elemMatch: {
                                    user: email,
                                    accessType: "editor"
                                }
                            }
                        },
                        {owner:email}
                    ]
                },
                {
                    'shared_users.user':username
                }
            ]   
        },
        {   
            $set: {
                'shared_users.$.accessType': accessType,
              }
        },
        {
            new: true 
        }
    )   
    if(!isValidUpdate){                 
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }
    res.json({msg:"shared accessType updated successfully"});  
})

const removeSharedUser = async_wrapper(async(req,res)=>{    
    const {docId,username}= req.body;
    const {email}= req.user;    
    const isValidUpdate = await Document.findOneAndUpdate(
        {   
            $and:[
                {  _id : docId},
                {
                   owner:email
                }   
            ] 
        },
        {
            $pull:{
                shared_users:{
                    user:username
                }
            }
        }
    )
    if(!isValidUpdate){
        throw new customError("unauthorised",StatusCodes.UNAUTHORIZED);
    }
    const docAfterDeletion = await Document.findOne({_id:docId});
    res.json({msg:"removed user successfully",peopleAccess:docAfterDeletion.shared_users});
})



module.exports={createDocument,getDocument,
    shareDocument,updateDocumentData,renameDocument,
    deleteDocument,updateDocumentHistoryData,getUserDocs,removeSharedUser,updateSharedAccessType};