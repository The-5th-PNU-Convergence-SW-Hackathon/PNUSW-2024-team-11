const mysql = require('mysql');
const dbconfig = require('../../config/database.js');

const crypto = require('../crypto');

const pool = mysql.createPool(dbconfig);

const connection = mysql.createConnection(dbconfig);
connection.connect();

let get_roommate = async (req, res) => {
    try {
        // Extract filter values from query parameters
        const dorm = req.query.dorm;
        const smokings = req.query.smokings ? req.query.smokings.split(',') : [];
        const drinkingFrequencies = req.query.drinking_frequencies ? req.query.drinking_frequencies.split(',') : [];
        const sleepPatterns = req.query.sleep_patterns ? req.query.sleep_patterns.split(',') : [];
        const sleepHabits = req.query.sleep_habits ? req.query.sleep_habits.split(',') : [];
        const guestVisits = req.query.guest_visits ? req.query.guest_visits.split(',') : [];

        // Base query with a join to fetch CLASS and STU_NUM from USER table
        let query = `
            SELECT 
                RC.USER_ID, RC.GENDER, RC.DORM, RC.SMOKING, RC.DRINKING_FREQUENCY, RC.SLEEP_PATTERN, 
                RC.SLEEP_HABIT, RC.GUEST_VISIT, RC.COMMENT, 
                U.CLASS, U.STU_NUM
            FROM 
                ROOMMATE_CHECKLIST RC
            JOIN 
                USER U ON RC.USER_ID = U.USER_ID
            WHERE 
                1=1
        `;

        // Append condition for dorm if provided
        if (dorm) {
            query += ` AND RC.DORM = ${mysql.escape(dorm)}`;
        }

        // Append conditions for each filter if provided
        if (smokings.length > 0) {
            query += ` AND RC.SMOKING IN (${smokings.map(s => mysql.escape(s)).join(',')})`;
        }
        if (drinkingFrequencies.length > 0) {
            query += ` AND RC.DRINKING_FREQUENCY IN (${drinkingFrequencies.map(df => mysql.escape(df)).join(',')})`;
        }
        if (sleepPatterns.length > 0) {
            query += ` AND RC.SLEEP_PATTERN IN (${sleepPatterns.map(sp => mysql.escape(sp)).join(',')})`;
        }
        if (sleepHabits.length > 0) {
            query += ` AND RC.SLEEP_HABIT IN (${sleepHabits.map(sh => mysql.escape(sh)).join(',')})`;
        }
        if (guestVisits.length > 0) {
            query += ` AND RC.GUEST_VISIT IN (${guestVisits.map(gv => mysql.escape(gv)).join(',')})`;
        }

        console.log('Executing query:', query); // For debugging

        // Execute the query
        connection.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching data:', err);
                res.status(500).send("Error occurred while fetching data.");
                return;
            }

            // Successfully fetched data
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error in get_roommate function:", error);
        res.status(500).send("Error occurred in get_roommate function.");
    }
};

module.exports = { get_roommate };