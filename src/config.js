const COOKIE_NAME = process.env.COOKIE_NAME || 'secret';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'Admin_secret';

module.exports = { COOKIE_NAME, ADMIN_SECRET};