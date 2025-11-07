import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const saltRounds = 12;
const secretKey = "ServiceCepaDiArpanCell";

export const SignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const findEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (findEmail) {
      return res.status(404).json({
        Message: "E - Mail sudah digunkan, gunakan E - Mail lain!",
        Information: [],
      });
    }

    const hashed = await bcrypt.hash(password, saltRounds);
    const add = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    if (!add) {
      return res.status(404).json({
        Message: "Error ketika menambahkan user!",
        Information: [],
      });
    }

    const userSafe = { ...add };
    delete userSafe.password;

    res.status(200).json({
      Message: "Berhasil menambahkan user!",
      Information: userSafe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const LogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const find = await prisma.user.findUnique({
      where: { email },
    });
    if (!find) {
      return res.status(404).json({
        Message: "User dengan E - Mail tersebut tidak ada",
        Information: [],
      });
    }
    const match = await bcrypt.compare(password, find.password);
    if (!match) {
      return res.status(404).json({
        Message: "Password salah",
        Information: [],
      });
    }

    const userSafe = { ...find };
    delete userSafe.password;
    const token = jwt.sign(userSafe, secretKey, { expiresIn: "10S" });

    res.status(200).json({
      Message: "Berhasil Log In!",
      status: true,
      token: token,
      Information: userSafe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const deltAcc = async (req, res) => {
  try {
    const delt = await prisma.user.delete({
      where: { id: Number(req.params.id) },
    });
    if (!delt) {
      res.status(404).json({
        Message: "User tidak tersedia!?",
        Information: [],
      });
    }

    const userSafe = { ...delt };
    delete userSafe.password;

    res.status(200).json({
      Message: "Akun berhasil dihapus!",
      Information: delt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const updateAcc = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    const update = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        name,
        email,
        password: hashed,
      },
    });
    if (!update) {
      res.status(404).json({
        Message: "Tidak bisa menemukan akun tersebut!?",
        Information: [],
      });
    }

    const find = await prisma.user.findMany({
      where: { id: Number(req.params.id) },
    });

    if (!find) {
      res.status(404).json({
        Message: "Tidak bisa menemukan akun tersebut!",
        Information: [],
      });
    }
    const userSafe = find.map((item) => {
      const safe = {
        id: item.id,
        name: item.name,
        email: item.email,
        role: item.role,
      };
      return safe;
    });

    res.status(200).json({
      Message: "Berhasil mengupdate akun!",
      Information: userSafe,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const finAcc = async (req, res) => {
  try {
    const id = req.query.id || req.body.id;
    const name = req.query.name || req.body.name;
    const email = req.query.email || req.body.email;

    let where = {};

    if (id) where.id = Number(id);
    if (name) where.name = name;
    if (email) where.email = email;
    if (Object.keys(where).length === 0) {
      res.status(404).json({
        Message: "Data kosong!",
        Information: where,
      });
    }

    const find = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!find || find.length === 0) {
      res.status(404).json({
        Message: "Akun tidak ditemukan!",
        Information: [],
      });
    }

    res.status(200).json({
      Message: "Akun ditemukan!",
      Information: find,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const Authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verifiedUser = jwt.verify(token, secretKey);

      if (!verifiedUser) {
        res.json({
          succes: false,
          auth: false,
          message: "cannot permission to acces",
        });
      } else {
        const user = Array.isArray(verifiedUser)
          ? verifiedUser[0]
          : verifiedUser;
        req.user = user;
        next();
      }
    } else {
      res.json({
        succes: false,
        message: "can't permission access",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
