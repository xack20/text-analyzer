export default function handler(req, res) {
    // Extract token from query parameters
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    // Redirect to dashboard with token in query params
    res.redirect(`/dashboard?token=${token}`);
}
