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
        user: 'shajathi.trichy43@gmail.com',
        pass: '9976614985'
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest;
        const body = req.query.body;
        const mailOptions = {
            from: 'Quick DirectTeam <yourgmailaccount@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'Story update from Producers', // email subject
            html: `<p style="font-size: 16px;">`+body+`</p>
                <br />
                
                Please login to our app for more updates..
                <b><br /><br />
                Thanks
                Quick Direct Team
                </b><br />
                <img src="https://firebasestorage.googleapis.com/v0/b/app-direct-a02bf.appspot.com/o/storyThumnails%2F1593012419810_3044754987_5e345c08-61cd-470f-9e1d-d894a4889e25.png?alt=media&token=38e113d9-fa5a-4991-8358-20a1b6eaa98f" />
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