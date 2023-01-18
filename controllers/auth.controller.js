const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  const passwordIsValid = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s",
  });

  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  await user.update({ token: refreshToken });

  res.cookie("token", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({
    message: "Login successful",
    data: user,
    token: "Bearer " + accessToken,
  });
};

exports.refresh = async (req, res) => {
  const refreshToken = req.cookies.token;
  if (!refreshToken) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const user = await User.findOne({ where: { token: refreshToken } });
  if (!user) {
    return res.status(403).send({ message: "Forbidden12" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden" });
    }

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "20s",
    });

    return res.json({
      message: "Token refreshed",
      token: "Bearer " + accessToken,
    });
  });
};
