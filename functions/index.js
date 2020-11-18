const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vifiteam2020@gmail.com',
        pass: '9952198138'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        const body = req.query.body;
        const mailOptions = {
            from: 'ViFi DirectTeam <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Story update from Producers', // email subject
            html: `<p style="font-size: 16px;">`+body+`</p>
                <br />
                
                Please login to our app for more updates..
                <b><br /><br />
                Thanks
                ViFi Direct Team
                </b><br />
                <img src="https://firebasestorage.googleapis.com/v0/b/app-direct-a02bf.appspot.com/o/logo-14.png?alt=media&token=90bfc23d-3804-469c-b579-6eb0ce51df7d" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});