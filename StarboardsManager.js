const db = require('quick.db');

if (db.get('starboards') === null) db.set('starboards', []);

const StarboardsManager = require('../discord-starboards');
const StarboardsManagerCustomDb = class extends StarboardsManager {
    // This function is called when the manager needs to get all the starboards stored in the database.
    async getAllStarboards() {
        // Get all the starboards in the database
        return db.get('starboards');
    }

    // This function is called when a starboard needs to be saved in the database (when a starboard is created).
    async saveStarboard(data) {
        // Add the new one
        db.push('starboards', data);
        // Don't forget to return something!
        return true;
    }


    // This function is called when a starboard needs to be deleted from the database.
    async deleteStarboard(channelID, emoji) {
        // Remove the starboard from the array
        let newStarboardsArray = db.get('starboards')
        newStarboardsArray = newStarboardsArray.filter((starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji));
        // Save the updated array
        db.set('starboards', newStarboardsArray);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a starboard needs to be edited in the database
    async editStarboard(channelID, emoji, data) {

        // Gets all the current starboards
        const starboards = db.get('starboards');
        // Remove the old starboard from the db
        const newStarboardsArray = starboards.filter((starboard) => !(starboard.channelID === channelID && starboard.options.emoji === emoji));
        // Push the new starboard to the array
        newStarboardsArray.push(data);

        // Save the updated array
        db.set('starboards', newStarboardsArray);
        // Don't forget to return something!
        return true;
    }
};

module.exports = StarboardsManagerCustomDb;