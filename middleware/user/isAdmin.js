function isAdmin (req, res, next) {
    if (!req.payload.isAdmin)
        return res.sendStatus(401);
    next();
}

module.exports = isAdmin;