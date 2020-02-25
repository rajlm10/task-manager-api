const sgMail=require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'rajbsangani@gmail.com',
        subject:'Thanks for signing up!',
        text:`Welcome to the app ${name}. Let me know how the app is working for you`
    }).catch((err)=>{
        console.log(err)
        
    })
}

const sendCancellationEmail=(email,name)=>{
    sgMail.send({
        to:email,
        from:'rajbsangani@gmail.com',
        subject:'Are you sure you want to cancel?',
        text:`We are really sorry if we have caused any trouble while serving you. Please let us know what caused you to cancel our service.
        Thank you.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancellationEmail
}