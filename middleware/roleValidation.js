export const isUser = async (req, res, next) => {
  const roleUser = req.user.role;
  if (roleUser == "User") {
    next();
  } else {
    res.status(406).json({
      Succes: false,
      Authorize: false,
      Information: "You Are Not User!",
    });
  }
};
export const isAdmin = async (req, res, next) => {
  const roleUser = req.user.role;
  if (roleUser == "Admin") {
    next();
  } else {
    res.status(406).json({
      Succes: false,
      Authorize: false,
      Information: "You Are Not Admin!",
    });
  }
};
