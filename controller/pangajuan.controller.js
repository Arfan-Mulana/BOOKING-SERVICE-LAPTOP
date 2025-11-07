import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addPengajuan = async (req, res) => {
  const { id, merk_laptop, seri_laptop, kota, penjelasan } = req.body;
  try {
    const add = await prisma.pengajuan.create({
      data: {
        user: { connect: { id } },
        merk_laptop,
        seri_laptop,
        kota,
        penjelasan,
      },
      include: {
        user: true,
      },
    });

    const userSafe = { ...add };
    delete userSafe.user.password;
    const reStructuring = {
      Pengguna: userSafe.user,
      Booking: {
        userID: add.user_id,
        Kota: add.kota,
        Merek_Laptop: add.merk_laptop,
        Seri_Laptop: add.seri_laptop,
        Penjelasan_Kerusakan: add.penjelasan,
        Di_Ajukan_Pada: add.createdat,
      },
    };

    if (!add) {
      res.status(404).json({
        Message: "Error ketika mengajukan booking service!",
        Information: [],
      });
    }

    res.status(200).json({
      Message:
        "Berhasil mengajukan booking ke toko, tunggu sampai proses di setujui!",
      Information: reStructuring,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};

export const updatePengajuan = async (req, res) => {
  const { userID, merk_laptop, seri_laptop, kota, penjelasan } = req.body;
  try {
    const update = await prisma.pengajuan.updateMany({
      where: { id: Number(req.params.id) },
      data: {
        user: { connect: { userID } },
        merk_laptop,
        seri_laptop,
        kota,
        penjelasan,
      },
    });
    if (!update) {
      res.status(404).json({
        Message: "Gagal melakukan update akun!",
        Information: [],
      });
    }
    const find = await prisma.pengajuan.findMany({
      where: { user_id: Number(req.params.userId) },
      include: { user: true },
    });

    const userSafe = find.map((item) => {
      const user = { ...item };
      delete user.user.password;

      const reStructuring = {
        Pengguna: user.user,
        Booking: {
          userID: item.user_id,
          Kota: item.kota,
          Merek_Laptop: item.merk_laptop,
          Seri_Laptop: item.seri_laptop,
          Penjelasan_Kerusakan: item.penjelasan,
          Di_Ajukan_Pada: item.createdat,
        },
      };

      return reStructuring;
    });

    res.status(200).json({
      Message: "Berhasil melakukan update pada pengajuan",
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
