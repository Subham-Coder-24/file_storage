import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { EmployeeID: user.EmployeeID },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
let options = {
  // maxAge: 20 * 60 * 1000, // would expire in 20minutes
  httpOnly: true, // The cookie is only accessible by the web server
  secure: true,
  sameSite: "None",
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const user = await prisma.employee.findUnique({
    where: { EmployeeID: req.user.EmployeeID },
  });

  if (user) {
    res.json(user);
  } else {
    res.status(204).json({ message: "User not found" });
  }
};
export { registerUser, loginUser, getUserProfile };
