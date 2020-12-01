const express = require('express');
const path = require('path');
const port = 8000;
const db = require('./config/mongoose');
const Contact = require('./models/contact');
const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));//making it dynamic and joining the path of of views and current directory

app.use(express.urlencoded());//this is a parser it is always declared in middleware btw . it reads forms data not params
// parser take the data from the user and it passes it to the server in the backend,making the web dynamic
app.use(express.static('assets'));

var contactList=[ 
 { name : "sarthak",
 phone : "8448535307"
},
{
 name : "piyush",
 phone:"9582773374"
}
];
app.get('/',function(req,res){
    
//res.send('<h1> cool we are here</h1>') //just like we used switch case in the previous case ie in http
//we use get request and response here
Contact.find({
    // in this we can pass query by finding it by name phone or id
},function(err,contacts){
    if(err){
        console.log('error in fetching contacts from mongodb');
        return;
    }
    return res.render('home',{title: "My_contact_list",
contact_list: contacts 
});

// return res.render('home',{title: "My_contact_list",
// contact_list:contactList //giving another another key in the context of the contact list
});//here we just have to give the file name and it will automatically render it 
// rether than readind it byte by byte(like we did earlier)

});
app.get('/practice',function(req,res){
    return res.render('practice',{ title:"let us play with ejs"})
});

app.post('/create-contact',function(req,res){// after filling the form and submitting it . we go through the action route
   // return res.redirect('/practice');//and after that we finally get redirected to the '/practice' page 


   // now we are appending the array into the ContactList we have made so that it can be displayed on
   //the page where we are redirecting it .
//    contactList.push({
//        name:req.body.name,
//        phone:req.body.phone
//    });

// In the above function the conatact list was working on the RAM

// now as we have created out data-base therefore we are using this Contact.create


Contact.create({
    name:req.body.name,
    phone:req.body.phone
    
},function(err,newContact){
    if(err){
        console.log('error in creating a conatact');
        return;
    }
    console.log('*******',newContact);
    return res.redirect('back');
});
   //return res.redirect('/');

});

//to delete a contact 

app.get('/delete-contact/',function(req,res){ //this is cotroler route function controler is the function route is the /delete-contact/
    // getting query from the url
   
     //let phone=req.query.phone;
// getting id from url now as we have connected to DB now .
let id=req.query.id;
// erlier we were itrating over the contact list to delete a specific conatct

// let contactIndex=contactList.findIndex(contact => contact.phone==phone);
// if(contactIndex != -1){
//     contactList.splice(contactList,1);
// }
 // now we are finding the conatact in the database and deleting it 

 Contact.findByIdAndDelete(id,function(err){
     if(err){
         console.log('error in deletong an object from the database');
     }
     return res.redirect('back');
 });
//return res.redirect('back');
});
app.listen(port,function(err){

if (err) {
    console.log('error in running the sever',err);
}
console.log('server is running fine',port);
});