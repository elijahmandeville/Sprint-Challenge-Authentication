const router = require("express").Router();
const Jokes = require("../jokes/jokes-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  try {
    const userInfo = req.body;
    const user = await Jokes.findBy(userInfo.username).first();

    const hash = bcrypt.hashSync(userInfo.password, 8);

    userInfo.password = hash;

    if (user) {
      return res.status(409).json({
        message: "username is taken",
      });
    }

    res.status(201).json(await Jokes.add(req.body));
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await Jokes.findBy(req.body.username).first();
    if (!user) {
      return res.status(401).json({
        message: "login details invalid",
      });
    }

    const passwordCheck = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordCheck) {
      res.status(401).json({
        message: "invalid credentials",
      });
    }

    const tokenPayload = {
      userId: user.id,
    };

    res.cookie("token", jwt.sign(tokenPayload, process.env.JWT_SECRET));
    res.status(200).json({
      welcome: `Welcome, ${user.username}!`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
