const express = require('express');
const {signup,verify_otp} = require('../controllers/signup');
const login = require('../controllers/login');
const authenticateToken = require('../middleware/jwtAuth');
const {logout} = require('../controllers/logout');
const {createDocument,removeSharedUser, renameDocument,getDocument,deleteDocument, getUserDocs, shareDocument, updateSharedAccessType} = require('../controllers/document');
const router= express.Router();


//routes 
router.route('/signup').post(signup);
router.route('/signup/verify').post(verify_otp);
router.route('/login').post(login);
router.route('/createDocument').get(authenticateToken,createDocument);
router.route('/document').get(authenticateToken,getDocument);
router.route('/renameDocument').post(authenticateToken,renameDocument);
router.route('/shareDocument').post(authenticateToken,shareDocument);
router.route('/updateSharedAccessType').post(authenticateToken,updateSharedAccessType)
router.route('/removeSharedUser').post(authenticateToken,removeSharedUser);
router.route('/getUserDocs').get(authenticateToken,getUserDocs);
router.route('/deleteDocument').post(authenticateToken,deleteDocument);
router.route('/logout').get(authenticateToken,logout);  


module.exports= router; 