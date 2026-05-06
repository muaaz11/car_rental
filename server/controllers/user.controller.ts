import { prisma } from "../database/database.ts";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateAccessToken } from "../utils/Token.ts";

const register = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password)
      return res.status(400).json({ message: "Name and email are required" });

    const findUser = await prisma.user.findUnique({ where: { email } });
    if (findUser)
      return res.status(409).json({ message: "User already exist" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: { name, email, role, password: hashedPassword },
    });

    return res.status(201).json({ message: "User created", data: createUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email and password are required" });

    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) return res.status(401).json({ message: "email not exists" });

    const user = findUser;

    const valid = bcrypt.compare(password, findUser.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const refreshToken = generateRefreshToken(findUser?.id);
    const accessToken = generateAccessToken(findUser?.id);

    if (!refreshToken && !accessToken) {
      return res.status(409).json({ message: "Failed to generate tokens" });
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 100,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15*60*1000,
    });

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: findUser.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({ user: findUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { register, login };
