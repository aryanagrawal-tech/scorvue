const express = require("express");

const router = express.Router();

router.post("/submit", async (req, res) => {
    try {
        const { category, questions, answers } = req.body;

        if (!category || !questions || !answers) {
            return res.status(400).json({
                message: "Category, questions and answers are required"
            });
        }

        if (questions.length !== 5 || answers.length !== 5) {
            return res.status(400).json({
                message: "Interview must contain 5 questions and 5 answers"
            });
        }

        // Basic answer checking
        const answeredQuestions = answers.filter(
            (answer) => answer.trim() !== ""
        ).length;

        const score = Math.round(
            (answeredQuestions / 5) * 100
        );

        let feedback = "";

        if (score === 100) {
            feedback =
                "Excellent! You answered all the interview questions.";
        } else if (score >= 60) {
            feedback =
                "Good attempt! Try to give more detailed answers.";
        } else {
            feedback =
                "You need more practice. Try answering all questions clearly.";
        }

        res.status(200).json({
            message: "Interview evaluated successfully",
            category,
            score,
            feedback
        });

    } catch (error) {
        console.error("Interview error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;