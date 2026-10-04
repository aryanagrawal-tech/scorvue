const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");

const router = express.Router();

// =========================
// OTP STORAGE
// =========================

const otpStorage = {};
const loginOtpStorage = {};
const forgotPasswordOtpStorage = {};

// =========================
// GMAIL TRANSPORTER
// =========================

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_APP_PASSWORD
//     }
// });

// =========================
// GENERATE OTP
// =========================

const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// =========================
// SEND OTP EMAIL
// =========================

const sendOTP = async (email, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "SCORVUE OTP Verification",

        text: `
Your SCORVUE OTP is: ${otp}

This OTP is valid for 5 minutes.

If you did not request this OTP, please ignore this email.
        `
    };

    await transporter.sendMail(mailOptions);

    console.log(
        "OTP email sent successfully!"
    );
};

// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password,
            confirmPassword
        } = req.body;

        // Required fields

        if (
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Gmail validation

        const gmailRegex =
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(email)) {

            return res.status(400).json({
                message: "Please use a valid Gmail address"
            });

        }

        // Password match

        if (password !== confirmPassword) {

            return res.status(400).json({
                message: "Passwords do not match"
            });

        }

        // Check existing username

        const existingUsername =
            await User.findOne({
                username
            });

        if (existingUsername) {

            return res.status(400).json({
                message: "Username already exists"
            });

        }

        // Check existing email

        const existingEmail =
            await User.findOne({
                email
            });

        if (existingEmail) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        // Generate OTP

        const otp = generateOTP();

        // Store temporary registration data

        otpStorage[email] = {

            username,

            email,

            password,

            otp,

            expiresAt:
                Date.now() +
                5 * 60 * 1000
        };

        console.log(
            "Registration OTP:",
            otp
        );

        console.log(
            "Trying to send OTP to:",
            email
        );

        // Send OTP

        await sendOTP(
            email,
            otp
        );

        console.log(
            "Registration OTP sent successfully"
        );

        return res.status(200).json({
            message:
                "OTP sent successfully"
        });

    } catch (error) {

        console.error(
            "Register error:",
            error
        );

        return res.status(500).json({
            message:
                "Unable to send registration OTP"
        });
    }
});

// ======================================================
// VERIFY REGISTER OTP
// ======================================================

router.post(
    "/verify-register-otp",
    async (req, res) => {

        try {

            const {
                email,
                otp
            } = req.body;

            console.log(
                "VERIFY REGISTER OTP API CALLED"
            );

            console.log(
                "Request:",
                req.body
            );

            const storedData =
                otpStorage[email];

            if (!storedData) {

                return res.status(400).json({
                    message:
                        "OTP expired or not found"
                });

            }

            // Check expiry

            if (
                Date.now() >
                storedData.expiresAt
            ) {

                delete otpStorage[email];

                return res.status(400).json({
                    message:
                        "OTP expired"
                });

            }

            // Check OTP

            if (
                storedData.otp !== otp
            ) {

                return res.status(400).json({
                    message:
                        "Invalid OTP"
                });

            }

            // Hash password

            const hashedPassword =
                await bcrypt.hash(
                    storedData.password,
                    10
                );

            // Create user

            const newUser =
                await User.create({

                    username:
                        storedData.username,

                    email:
                        storedData.email,

                    password:
                        hashedPassword,

                    isEmailVerified:
                        true

                });

            console.log(
                "User registered successfully:",
                newUser.email
            );

            // Delete OTP storage

            delete otpStorage[email];

            return res.status(201).json({
                message:
                    "Registration successful"
            });

        } catch (error) {

            console.error(
                "Verify registration OTP error:",
                error
            );

            return res.status(500).json({
                message:
                    "Registration failed"
            });
        }
    }
);

// ======================================================
// LOGIN
// ======================================================

router.post(
    "/login",
    async (req, res) => {

        try {

            const {
                username,
                password
            } = req.body;

            if (
                !username ||
                !password
            ) {

                return res.status(400).json({
                    message:
                        "Username and password are required"
                });

            }

            // Find user

            const user =
                await User.findOne({
                    username
                });

            if (!user) {

                return res.status(404).json({
                    message:
                        "Username not found"
                });

            }

            // Check password

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({
                    message:
                        "Invalid password"
                });

            }

            // Generate login OTP

            const otp =
                generateOTP();

            loginOtpStorage[username] = {

                otp,

                email:
                    user.email,

                expiresAt:
                    Date.now() +
                    5 * 60 * 1000

            };

            console.log(
                "Login OTP:",
                otp
            );

            console.log(
                "Login OTP will be sent to:",
                user.email
            );

            // Send OTP

            await sendOTP(
                user.email,
                otp
            );

            return res.status(200).json({
                message:
                    "Login OTP sent successfully"
            });

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to process login"
            });
        }
    }
);

// ======================================================
// VERIFY LOGIN OTP
// ======================================================

router.post(
    "/verify-login-otp",
    async (req, res) => {

        try {

            const {
                username,
                otp
            } = req.body;

            const storedData =
                loginOtpStorage[username];

            if (!storedData) {

                return res.status(400).json({
                    message:
                        "OTP expired or not found"
                });

            }

            // Check expiry

            if (
                Date.now() >
                storedData.expiresAt
            ) {

                delete loginOtpStorage[
                    username
                ];

                return res.status(400).json({
                    message:
                        "OTP expired"
                });

            }

            // Check OTP

            if (
                storedData.otp !== otp
            ) {

                return res.status(400).json({
                    message:
                        "Invalid OTP"
                });

            }

            // Delete OTP

            delete loginOtpStorage[
                username
            ];

            return res.status(200).json({
                message:
                    "Login successful"
            });

        } catch (error) {

            console.error(
                "Login OTP verification error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to verify login OTP"
            });
        }
    }
);

// ======================================================
// FORGOT PASSWORD
// USER ENTERS USERNAME ONLY
// ======================================================

router.post(
    "/forgot-password",
    async (req, res) => {

        try {

            const {
                username
            } = req.body;

            // Username required

            if (!username) {

                return res.status(400).json({
                    message:
                        "Please enter your username first"
                });

            }

            // Find user

            const user =
                await User.findOne({
                    username
                });

            if (!user) {

                return res.status(404).json({
                    message:
                        "Username not found"
                });

            }

            // Generate OTP

            const otp =
                generateOTP();

            // Store OTP using registered email

            forgotPasswordOtpStorage[
                user.email
            ] = {

                otp,

                expiresAt:
                    Date.now() +
                    5 * 60 * 1000

            };

            console.log(
                "Forgot Password OTP:",
                otp
            );

            console.log(
                "OTP will be sent to:",
                user.email
            );

            // Send OTP automatically
            // to registered Gmail

            await sendOTP(
                user.email,
                otp
            );

            return res.status(200).json({

                message:
                    "OTP successfully sent to your registered Gmail",

                // Used internally by frontend
                // for the next API calls

                email:
                    user.email

            });

        } catch (error) {

            console.error(
                "Forgot password error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to send OTP"
            });
        }
    }
);

// ======================================================
// VERIFY FORGOT PASSWORD OTP
// ======================================================

router.post(
    "/verify-forgot-password-otp",
    async (req, res) => {

        try {

            const {
                email,
                otp
            } = req.body;

            if (
                !email ||
                !otp
            ) {

                return res.status(400).json({
                    message:
                        "Email and OTP are required"
                });

            }

            const storedData =
                forgotPasswordOtpStorage[
                    email
                ];

            if (!storedData) {

                return res.status(400).json({
                    message:
                        "OTP expired or not found"
                });

            }

            // Check expiry

            if (
                Date.now() >
                storedData.expiresAt
            ) {

                delete forgotPasswordOtpStorage[
                    email
                ];

                return res.status(400).json({
                    message:
                        "OTP expired"
                });

            }

            // Check OTP

            if (
                storedData.otp !== otp
            ) {

                return res.status(400).json({
                    message:
                        "Invalid OTP"
                });

            }

            return res.status(200).json({
                message:
                    "OTP verified successfully"
            });

        } catch (error) {

            console.error(
                "Forgot password OTP error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to verify OTP"
            });
        }
    }
);

// ======================================================
// RESET PASSWORD
// ======================================================

router.post(
    "/reset-password",
    async (req, res) => {

        try {

            const {
                email,
                otp,
                newPassword,
                confirmPassword
            } = req.body;

            // Required fields

            if (
                !email ||
                !otp ||
                !newPassword ||
                !confirmPassword
            ) {

                return res.status(400).json({
                    message:
                        "All fields are required"
                });

            }

            // Check password match

            if (
                newPassword !==
                confirmPassword
            ) {

                return res.status(400).json({
                    message:
                        "Passwords do not match"
                });

            }

            // Password length

            if (
                newPassword.length < 6
            ) {

                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });

            }

            // Get stored OTP

            const storedData =
                forgotPasswordOtpStorage[
                    email
                ];

            if (!storedData) {

                return res.status(400).json({
                    message:
                        "OTP expired or not found"
                });

            }

            // Check expiry

            if (
                Date.now() >
                storedData.expiresAt
            ) {

                delete forgotPasswordOtpStorage[
                    email
                ];

                return res.status(400).json({
                    message:
                        "OTP expired"
                });

            }

            // Check OTP

            if (
                storedData.otp !== otp
            ) {

                return res.status(400).json({
                    message:
                        "Invalid OTP"
                });

            }

            // Find user

            const user =
                await User.findOne({
                    email
                });

            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found"
                });

            }

            // Hash new password

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    10
                );

            // Update password

            user.password =
                hashedPassword;

            await user.save();

            // Delete OTP

            delete forgotPasswordOtpStorage[
                email
            ];

            console.log(
                "Password reset successfully:",
                email
            );

            return res.status(200).json({
                message:
                    "Password reset successfully"
            });

        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );

            return res.status(500).json({
                message:
                    "Unable to reset password"
            });
        }
    }
);

// =========================
// EXPORT ROUTER
// =========================

module.exports = router;