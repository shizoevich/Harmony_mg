function checkRole(role) {
    return (req, res, next) => {
        console.log('checkRole req.user:', req.user);  
        if (req.user.role.includes(role)) {
            return next();
        }

        res.status(403).json({ error: 'Forbidden' });
    };
}
module.exports = { checkRole };
