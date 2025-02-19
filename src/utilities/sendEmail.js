const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = ({ email, registration }) => {
	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		const rsvp = {
			email,
			registration,
		};

		function formatNames(namesArray) {
			if (namesArray.length === 0) {
				return "";
			}
			if (namesArray.length === 1) {
				return namesArray[0].name;
			}

			// Extract names and join them with commas and "and" before the last name
			let nameStrings = namesArray.map((item) => item.name);
			let combinedString =
				nameStrings.slice(0, -1).join(", ") +
				", and " +
				nameStrings[nameStrings.length - 1] +
				",";

			return combinedString;
		}

		const html = `<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>RSVP Confirmation for Leonard & Janel's Wedding</title>
				<style>
			  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;700&display=swap'); 
		
					body {
						font-family: "Fraunces", serif;
						color: rgb(82, 82, 82);
						background-color: #ffffff;
						margin: 0;
						padding: 0;
						text-align: center;
					}
					.container {
						width: 100%;
						max-width: 600px;
						margin: auto;
						background-color: #fffaef;
						padding: 20px;
						border: 1px solid #ddd;
						border-radius: 10px;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					}
					.header {
						margin-bottom: 20px;
					}
					.header h1 {
						font-family: "Fraunces", serif;
						font-size: 40px;
						color: rgb(82, 82, 82);
					}
					.details,
					.rsvp,
					.additional-info {
						margin-bottom: 20px;
					}
					.details h2,
					.rsvp h2,
					.additional-info h2 {
						font-family: "Fraunces", serif;
						font-size: 24px;
						color: rgb(82, 82, 82);
					}
					.details p,
					.rsvp p,
					.additional-info p {
						font-family: "Fraunces", serif;
						font-size: 16px;
						line-height: 1.6;
						color: rgb(82, 82, 82);
					}
					.map-link {
						display: block;
						margin-top: 10px;
						color: rgb(82, 82, 82);
						text-decoration: none;
					}
					.qr-code-container {
						display: flex;
						justify-content: center;
						gap: 20px;
						margin-top: 10px;
					}
					.qr-code {
						width: 200px;
						height: 200px;
					}
					.footer {
						font-family: "Fraunces", serif;
						font-size: 12px;
						color: #777;
					}
					@media only screen and (max-width: 600px) {
						.header h1 {
							font-size: 30px;
						}
						.details h2,
						.rsvp h2,
						.additional-info h2 {
							font-size: 20px;
						}
						.details p,
						.rsvp p,
						.additional-info p {
							font-size: 14px;
						}
					}
					@media only screen and (max-width: 480px) {
						.container {
							padding: 15px;
						}
						.header h1 {
							font-size: 28px;
						}
						.details h2,
						.rsvp h2,
						.additional-info h2 {
							font-size: 18px;
						}
						.details p,
						.rsvp p,
						.additional-info p {
							font-size: 12px;
						}
						.qr-code-container {
							flex-direction: column;
							align-items: center;
						}
						.qr-code {
							margin-bottom: 10px;
						}
					}
					.iframe-container {
						/* width: 200px;  */
						height: 300px; /* Matching the QR code size */
						margin: 0 auto; /* Center the iframe */
					}
					.iframe-container iframe {
						width: 100%;
						height: 100%;
						border: 0;
					}
				</style>
			</head>
			<body style="font-family: 'Fraunces', serif; color: rgb(82, 82, 82); background-color: #ffffff; margin: 0; padding: 0; text-align: center;">
				<div class="container">
					<div class="header">
			  
						<img
							src="https://api.leonardandjanel2025.rsvp/images/logo.png"
							alt="Leonard and Janel Logo"
							style="width: 100px; height: 100px; border-radius: 10px"
						/>
						<h1 style="margin-top: 0px; margin-bottom: 0px">Leonard & Janel</h1>
					</div>
					<div class="rsvp">
						<h2>RSVP Confirmation</h2>
						<p>Dear ${formatNames(rsvp.registration)}</p>
						<p>Thank you for confirming your attendance at our wedding!</p>
						<p>We are thrilled to celebrate this special day with you.</p>
					</div>
					<div class="details">
						<h2>Event Details</h2>
						<p><strong>Date:</strong> Tuesday, April 22nd, 2025</p>
						<p><strong>Ceremony:</strong> Saint Pio of Pietrelcina Parish</p>
						<p>
							<strong>Address:</strong> 106 Sumulong Highway, Antipolo, 1870 Rizal
						</p>
						<p><strong>Time:</strong> 1:00 PM</p>
		
						<div class="" style="text-align: center;">
							<div style="display: inline-block; margin: 0 10px;">
								<a
									href="https://ul.waze.com/ul?place=ChIJRaB9aN24lzMRjwMEWx9WmJQ&ll=14.61843580%2C121.14874980&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
									target="_blank"
									class="map-link"
									>View on Waze</a
								>
								<img
									src="https://api.leonardandjanel2025.rsvp/images/church.png"
									alt="Waze QR Code"
									class="qr-code"
								/>
							</div>
							<div style="display: inline-block; margin: 0 10px;">
								<a
									href="https://maps.app.goo.gl/yHUjJ6Fj36bURm918"
									target="_blank"
									class="map-link"
									>View on Google</a
								>
								<img
									src="https://api.leonardandjanel2025.rsvp/images/google_-_church-removebg-preview.png"
									alt="Waze QR Code"
									class="qr-code"
								/>
							</div>
						</div>
		
						<p><strong>Reception:</strong> Delle Sorelle</p>
						<p>
							<strong>Address:</strong> East Riviera Subdivision, Highway 2000,
							Taytay, Rizal
						</p>
						<p><strong>Time:</strong> 6:00 PM</p>
		
						<div class="" style="text-align: center;">
							<div style="display: inline-block; margin: 0 10px;">
								<a
									href="https://ul.waze.com/ul?place=ChIJN4XJ6lvHlzMRPTpidSUWcXA&ll=14.55888710%2C121.12516190&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
									target="_blank"
									class="map-link"
									>View on Waze</a
								>
		
								<img
									src="https://api.leonardandjanel2025.rsvp/images/reception.png"
									alt="Waze QR Code"
									class="qr-code"
								/>
							</div>
							<div style="display: inline-block; margin: 0 10px;">
								<a
									href="https://maps.app.goo.gl/Gfo3AGVwUJnBxAeV7"
									target="_blank"
									class="map-link"
									>View on Google</a
								>
								<img
									src="https://api.leonardandjanel2025.rsvp/images/google_-_reception-removebg-preview.png"
									alt="Google QR Code"
									class="qr-code"
								/>
								</div>
							</div>
						</div>
					</div>
					<!-- <div class="additional-info">
						<h2>Additional Information</h2>
						<p><strong>Dress Code:</strong> Formal Attire</p>
						<p>
							<strong>Accommodation:</strong> Here are some nearby hotels: [List of
							hotels]
						</p>
						<p>
							<strong>Transportation:</strong> Details about transportation and
							parking.
						</p>
						<p>
							<strong>Contact:</strong> For any questions or special requests,
							please contact us at [Contact Information].
						</p>
						<p><strong>Wedding Website:</strong> [Link to the wedding website]</p>
					</div> -->
					<div class="footer">
						<h2>Thank you, and we look forward to celebrating with you!</h2>
					</div>
				</div>
			</body>
		</html>
		`;

		const mailOptions = {
			from: "no-reply@leonardandjanel2025.rsvp",
			to: rsvp.email,
			subject: "Your RSVP is confirmed! Thank you!",
			html,
		};

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log("Email sent: " + info.response);
		});
	} catch (error) {
		console.log("error", error);
	}
};

module.exports = { sendEmail };
