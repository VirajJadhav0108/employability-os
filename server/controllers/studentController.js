const getStudents = (req, res) => {
    res.json({
        success: true,
        message: "Fetched students successfully"
    });
};

module.exports = {
    getStudents
};
