const adminAuth = (req, res, next) => {
  const adminPassword = req.headers["x-admin"];

  if (!adminPassword) {
    return res.status(401).json({
      message: "Admin password required",
    });
  }

  if (adminPassword !== process.env.ADMIN_KEY) {
    return res.status(401).json({
      message: "Invalid admin password",
      pass: adminPassword,
    });
  }

  next();
};

export default adminAuth;
