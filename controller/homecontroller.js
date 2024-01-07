const Habits = require('../models/habit_list')
const moment = require('moment');
// function for redirecting to main home page
module.exports.home = async function (req, res) {
    try {
        const habits = await Habits.find({});
        console.log(habits);  // Log habits to console
        return res.render('home', { habits });
    } catch (err) {
        console.error("Error fetching habits:", err);
        return res.status(500).send("Internal Server Error");
    }
};
//function for adding habit
module.exports.add = async function (req, res) {
    const existingHabit = await Habits.findOne({ value: req.body.value });

    if (existingHabit) {
        req.flash('error','Habit already added')
        return res.redirect('back')
    }
    req.flash('success','Habit added successfully')

    // Initialize weekly status for each day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const initialWeeklyStatus = daysOfWeek.map(day => ({ day }));

    try {
        const newHabit = await Habits.create({
            value: req.body.value,
            weeklyStatus: initialWeeklyStatus
        });

        console.log(newHabit);
        return res.redirect('/');
    } catch (err) {
        console.log("error in creating habit:", err);
        return res.status(500).send("Internal Server Error");
    }
};
// function for updatng status of an habit
module.exports.updateStatus = async function (req, res) {
    try {
        const { habitId, newStatus } = req.params;

        // Find the habit by ID
        const habit = await Habits.findById(habitId);

        // Update the status for today
        const currentDay = new Date().getDay();
        habit.weeklyStatus[currentDay].status = newStatus;

        // Save the updated habit to the database
        await habit.save();

        return res.json({ success: true, message: 'Status updated successfully.' });
    } catch (err) {
        console.error('Error updating status:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error.' });
    }
};
// function for updating status in database from view-details page
module.exports.updatestatusin = async function (req, res) {
    try {
        const habitId = req.params.habitId;
        const newStatus = req.params.newStatus;
        const day = req.params.day.toLowerCase(); // Convert day to lowercase for consistency

        // Check if the provided day is today or a previous day
        const currentDayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const providedDayIndex = daysOfWeek.indexOf(day);

        if (providedDayIndex > currentDayIndex) {
            return res.status(403).json({ success: false, error: 'Cannot update status for future days' });
        }

        // Logic to update status in the database
        const updatedHabit = await Habits.findByIdAndUpdate(habitId, { $set: { [`weeklyStatus.${providedDayIndex}.status`]: newStatus } });

        return res.json({ success: true, habit: updatedHabit });
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// function for deleting an habit
module.exports.deleteHabit = async function (req, res) {
    try {
        const habitId = req.params.id;
        const deletedHabit = await Habits.findOneAndDelete({ _id: habitId });
        req.flash('error','Habit removed successfully')  
        if (!deletedHabit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        return res.redirect('back');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
// function for rendering view-details page
module.exports.viewDetails = async function (req, res) {
    try {
        // Fetch all habits from the database
        const habits = await Habits.find();

        // Pass the current date to the view
        const currentDate = moment().format('YYYY-MM-DD');

        // Render the view details page with the habits data and current date
        return res.render('viewDetails', { habits, currentDate });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
