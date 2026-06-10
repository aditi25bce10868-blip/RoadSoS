const sendNotification = async (userId, message) => {
  console.log(`Notification to ${userId}: ${message}`);
};

module.exports = { sendNotification };