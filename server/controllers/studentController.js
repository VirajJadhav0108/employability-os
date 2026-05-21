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

const createStudent = async (req, res) => {
    try {

        const student = await Student.create(req.body);

        res.status(201).json({
            success: true,
            student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStudents,
    createStudent
};
