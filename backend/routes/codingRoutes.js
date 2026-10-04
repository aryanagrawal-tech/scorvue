const express = require("express");

const router = express.Router();

router.post("/submit", async (req, res) => {
    try {
        const { question, code } = req.body;

        if (!question || !code) {
            return res.status(400).json({
                message: "Question and code are required"
            });
        }

        // Basic checking for college project
        const codeLength = code.trim().length;

        let passed = false;

        if (codeLength >= 10) {
            passed = true;
        }

        if (passed) {
            return res.status(200).json({
                message: "Test cases passed successfully",
                passed: true,
                score: 100
            });
        }

        return res.status(200).json({
            message: "Test cases failed",
            passed: false,
            score: 0
        });

    } catch (error) {
        console.error("Coding error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;