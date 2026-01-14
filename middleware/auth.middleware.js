const jwt = require("jsonwebtoken");
const { AuthData } = require("../data/auth.data");

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const isAtBlacklist = await AuthData.getlacklistToken({ token });
    console.log(isAtBlacklist);

    if (isAtBlacklist.length > 0) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.tokenData = {
      userId: decoded.idUser,
      userEmail: decoded.emailUser,
      typeUser: decoded.typeUser,
    };

    req.userId = decoded.idUser;
    req.userEmail = decoded.emailUser;
    req.typeUser = decoded.typeUser;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
