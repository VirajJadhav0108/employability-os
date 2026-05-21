const Student = require("../models/Student");

const getStudents = async (req, res) => {
    try {
        const students = await Student.find();

        res.json({
            success: true,
            students
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStudents
};
