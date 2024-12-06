const fs = require('fs');
const path = require('path');

// Đường dẫn file log
const logDir = path.join(__dirname, '../../logs');
const logFilePath = path.join(logDir, 'system.log');

// Đảm bảo thư mục logs tồn tại
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

exports.logSuccessfulLogin = (username) => {
    const message = `User ${username} logged in successfully.`;
    console.log(message);
    fs.appendFileSync(logFilePath, message + '\n');
};

exports.logFailedLogin = (username) => {
    const message = `Failed login attempt for ${username}.`;
    console.log(message);
    fs.appendFileSync(logFilePath, message + '\n');
};

exports.logAccountLocked = (username) => {
    const message = `User ${username} account locked after 3 failed attempts.`;
    console.log(message);
    fs.appendFileSync(logFilePath, message + '\n');
};
