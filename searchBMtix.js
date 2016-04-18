// Change the configuration below - works only with Gmail

var myEmail = "";
var myEmailPassword = "";
var craigslistCity = "sfo"; // sfo = san francisco, losangeles = los angeles, etc... look on craigslist for other cities 

// Do not change below

var i = 0;  // dots counter
setInterval(function() {
  process.stdout.clearLine();  // clear current text
  process.stdout.cursorTo(0);  // move cursor to beginning of line
  i = (i + 1) % 15;
  var dots = new Array(i + 1).join(".");
  process.stdout.write("Watching for new Burning Man tickets" + dots);  // write text
}, 500);


var nodemailer = require('nodemailer');
var craigslist = require('node-craigslist');

var CronJob = require('cron').CronJob;
new CronJob('0 * * * * *', function() {


client = craigslist({
    city : craigslistCity
  }),
  options = {
    //category : 'tix',
  },



client.search('burning man tickets', function (err, listings) {
  // play with listings here...

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: myEmail, // Your email id
        pass: myEmailPassword // Your password
    }
  });
  var text = 'Tickets for BM:';
  var mailOptions = {
    from: myEmail, // sender address
    to: myEmail, // list of receivers
    subject: 'Burning Man Tickets', // Subject line
    text: text //, // plaintext body
  };
  var countTickets = 0;
  if(typeof listings !== "undefined") {
    listings.forEach(function (listing) {
      var start = new Date();
      var newDateObj = new Date();
      newDateObj.setTime(start.getTime() - (10 * 60 * 1000));
      var listingDate = new Date(listing.date);
      if( listingDate >= newDateObj){
        countTickets++;
        console.log(listing);
        mailOptions.text = mailOptions.text + '\n\n' +
        listing.title +' - (' +listing.date+')' + '\n' + listing.price + '\n' + listing.url ;
      }
    });
  }
  if(countTickets > 0){
    mailOptions.subject = mailOptions.subject + " ("+countTickets+")";
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
      }else{
          process.stdout.cursorTo(0);
          process.stdout.clearLine();
          console.log('Message sent: ' + info.response);
      };
    });
  } else {

    var curTime = new Date();
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
    console.log(curTime, " - no new ticket");
  }
});
}, null, true, 'America/Los_Angeles');
