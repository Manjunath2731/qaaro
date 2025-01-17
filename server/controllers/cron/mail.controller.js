const imaps = require('imap-simple');
const _ = require('lodash');
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const { LamiAccountModel } = require('./../../models/LamiAccount.model');
// const processMail = require('./mailcom');
const processMail = require('./mailcontroller')

// Configure AWS credentials and region
/**
 * API to process mail
 * This endpoint verifies the JWT, fetches Lami accounts for the user, and processes their mail
 */
exports.getMailJs = async (req, res) => {
    const authHeader = req.headers.authorization;

    // Check for the authorization header
    if (!authHeader) {
        return res.status(404).json({ error: "Header is not available" });
    }

    const token = authHeader.split(" ")[1];

    // Check for the token in the authorization header
    if (!token) {
        return res.status(404).json({ error: "You are not authorized" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(404).json({ error: "You are not authorized" });
        } else {
            try {
                // Fetch Lami accounts for the authenticated user
                const lamiAccount = await LamiAccountModel.find({ lamiId: user.id });

                // Process the mail for the fetched Lami accounts
                const result = await processMail(lamiAccount);
                console.log("✅ All Lami accounts processed successfully:", result);

                return res.status(200).json({ message: "Ticket creation successful", data: "", success: true });
            } catch (error) {
                console.error("❌ Error processing Lami accounts:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        }
    });
};

/**
 * API to check IMAP server connection
 * This endpoint verifies the JWT and attempts to connect to the IMAP server with provided credentials
 */
exports.checkConnectionJs = async (req, res) => {
    const authHeader = req.headers.authorization;
    const { user, password, host, port } = req.body;

    // IMAP configuration
    const config2 = {
        imap: {
            user: user,
            password: password,
            host: host,
            port: port,
            tls: true,
            tlsOptions: { rejectUnauthorized: false },
            authTimeout: 10000
        }
    };

    // Check for the authorization header
    if (!authHeader) {
        return res.status(404).json({ error: "Header is not available" });
    }

    const token = authHeader.split(" ")[1];

    // Check for the token in the authorization header
    if (!token) {
        return res.status(404).json({ error: "You are not authorized" });
    }

    // Verify the JWT token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(404).json({ error: "You are not authorized" });
        } else {
            if (user?.role === "Plugo_Admin" || user?.role === "LaMi_Admin") {
                try {
                    // Attempt to connect to the IMAP server
                    const connection = await imaps.connect(config2);
                    console.log('✅ Connection successful');
                    connection.end();

                    return res.status(200).json({ success: "Connection successful", connection: true });
                } catch (error) {
                    console.error('❌ Error connecting to the IMAP server:', error);
                    return res.status(200).json({ success: "Connection failed", connection: false });
                }
            } else {
                return res.status(403).json({ success: "Connection failed", connection: false });
            }
        }
    });
};
