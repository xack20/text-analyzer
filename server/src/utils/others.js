// JavaScript solution
function generateRandomId(length = 24) {
    return Array.from(
        { length },
        () => Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

module.exports = generateRandomId;
