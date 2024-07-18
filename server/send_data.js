const fs = require("fs");
const xlsx = require("xlsx");
const nodemailer = require("nodemailer");
const { exec } = require('child_process');
// Read the data from the JSON files
const userData = JSON.parse(fs.readFileSync("users_data.json", "utf8"));
const pricesData = JSON.parse(fs.readFileSync("users.json", "utf8"));


 exec('sh /home/senior/backup_users_data.sh', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error executing backup.sh: ${err}`);
      return;
    }
    console.log(`backup.sh executed successfully:\n${stdout}`);
  });

// Function to extract history data for a single user and calculate total cost
function extractHistoryForUser(drinks, prices) {
  const historyData = [];
  let totalCost = 0;

  for (const drink in drinks) {
    drinks[drink].history.forEach((record) => {
      const price = prices[drink]?.price || 0;
      const cost = record.ammount * price;
      historyData.push([drink, record.ammount, record.date, price, cost]);
      totalCost += cost;
    });
  }
  return { historyData, totalCost };
}

// Function to create an Excel file from the history data
function createExcelForUser(user, data, filename) {
  const worksheetData = [["Drink", "Amount", "Date", "Price", "Cost"]];
  worksheetData.push(...data.historyData);
  worksheetData.push(["", "", "", "Total Cost", data.totalCost]);

  const worksheet = xlsx.utils.aoa_to_sheet(worksheetData);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Drinks Data");

  xlsx.writeFile(workbook, filename);
}

// Function to clear the history data for all users
function clearHistory(data) {
  for (const user in data) {
    if (data.hasOwnProperty(user)) {
      for (const drink in data[user].drinks) {
        if (data[user].drinks.hasOwnProperty(drink)) {
          data[user].drinks[drink].history = [];
        }
      }
    }
  }
}

// Iterate through each user and create separate Excel files
const generatedFiles = [];
for (const user in userData) {
  if (userData.hasOwnProperty(user)) {
    const userHistory = extractHistoryForUser(
      userData[user].drinks,
      pricesData.drinks
    );
    if (userHistory.historyData.length > 0) {
      const date = new Date().getMonth() + 1;
      // Create a file only if there is history data
      const filename = `./excel/${user}_drinks_data_${date}.xlsx`;
      createExcelForUser(user, userHistory, filename);
      console.log(`Excel file created for ${user}: ${filename}`);
      generatedFiles.push(filename);
    } else {
      console.log(`No drink history for ${user}, skipping file creation.`);
    }
  }
}

// Clear the history data
clearHistory(userData);

// Write the updated data back to the JSON file
fs.writeFileSync("users_data.json", JSON.stringify(userData, null, 2), "utf8");
console.log("User history has been cleared and updated in users_data.json");

// Create a transporter object using SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Brevo SMTP host
  port: 587, // Brevo SMTP port
  secure: false, // true for 465, false for 587
  auth: {
    user: "78dba8001@smtp-brevo.com", // Your Brevo SMTP username
    pass: "GHjZtPDsLB2N1SFy", // Your Brevo SMTP key
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

// Prepare attachments array
let attachments = generatedFiles.map((file) => {
  return { path: file };
});

// Set up email data with unicode symbols
let mailOptions = {
  from: '"Corps Montnia System" <corpsmontaniasystem@gmail.com>', // sender address
   to:"farouk15160@gmail.com",
  subject: `TEST Getränke Rechnungen des Monats ${new Date().getMonth() + 1}`, // Subject line
  text: `TEST Lieber Corpsbrüder, Anbei findet ihr die Getränkerechnungen aller Corpsbrüder vom Monat ${
    new Date().getMonth() + 1
  }. Mit corpsbrüderlichen Grüßen, Farouk Jamali Z!`, // plain text body
  html: `Lieber Corpsbrüder, Anbei findet ihr die Getränkerechnungen aller Corpsbrüder vom Monat ${
    new Date().getMonth() + 1
  }. Mit corpsbrüderlichen Grüßen, Farouk Jamali Z!`, // html body
  attachments: attachments, // add all excel files here
};


transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
     return console.log(error);
   }
   console.log("Message sent: %s", info.messageId);
 });
