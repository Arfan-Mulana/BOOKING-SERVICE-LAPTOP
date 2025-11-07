import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addStruk = async (req, res) => {
  const {
    user_id,
    pengajuan_id,
    penanggung_jawab_service,
    kebutuhan,
    total_biaya,
  } = req.body;
  try {
    const add = await prisma.struk.create({
      data: {
        user: { connect: { id: Number(user_id) } },
        pengajuan: { connect: { id: Number(pengajuan_id) } },
        penanggung_jawab_service,
        kebutuhan,
        total_biaya,
      },
      include: {
        pengajuan: true,
        user: true,
      },
    });

    if (!add) {
      return res.status(404).json({
        Message: "Error ketika menambahkan struk!",
        Information: [],
      });
    }

    const userSafe = { ...add };
    delete userSafe.user.password;

    const reStructuring = {
      Struk: {
        id: add.id,
        userID: add.user_id,
        PengajuanID: add.pengajuan_id,
        PJ_Service: add.penanggung_jawab_service,
        Kebutuhan: add.kebutuhan,
        Total_Biaya: total_biaya,
        Pengajuan: add.pengajuan,
        User: userSafe.user,
      },
    };

    res.status(201).json({
      Message: "Berhasil",
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

export const updateStruk = async (req, res) => {
  const { penanggung_jawab_service, kebutuhan, total_biaya } = req.body;
  try {
    const update = await prisma.struk.updateMany({
      where: { id: Number(req.params.id) },
      data: {
        penanggung_jawab_service,
        kebutuhan,
        total_biaya,
      },
    });
    if (!update) {
      return res.status(404).json({
        Message: "Gagal melakukan update struk!",
        Information: [],
      });
    }
    const find = await prisma.struk.findMany({
      where: { id: Number(req.params.id) },
      include: {
        user: true,
        pengajuan: true,
      },
    });

    const reStructuring = find.map((item) => {
      const user = { ...item };
      delete user.user.password;
      const result = {
        Struk: {
          id: item.id,
          userID: item.user_id,
          PengajuanID: item.pengajuan_id,
          PJ_Service: item.penanggung_jawab_service,
          Kebutuhan: item.kebutuhan,
          Total_Biaya: total_biaya,
          Pengajuan: item.pengajuan,
          User: user.user,
        },
      };

      return result;
    });

    res.status(200).json({
      Message: "Berhasil melakukan update pada struk!",
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

export const findStruk = async (req, res) => {
  const id = req.query.id || req.body.id;
  const user_id = req.query.user_id || req.body.user_id;
  const pengajuan_id = req.query.pengajuan_id || req.body.pengajuan_id;
  const penanggung_jawab_service =
    req.query.penanggung_jawab_service || req.body.penanggung_jawab_service;

  try {
    let where = {};

    if (id) where.id = Number(id);
    if (user_id) where.user_id = Number(user_id);
    if (pengajuan_id) where.pengajuan_id = Number(pengajuan_id);
    if (penanggung_jawab_service)
      where.penanggung_jawab_service = penanggung_jawab_service;

    if (Object.keys(where).length === 0) {
      return res.status(404).json({
        Message: "Data tidak ada!?, atau input tidak benar!",
        Information: [],
      });
    }

    const find = await prisma.struk.findMany({
      where,
      include: {
        user: true,
        pengajuan: true,
      },
    });

    if (!find) {
      return res.status(404).json({
        Message: "Data tidak ditemukan!?",
        Information: [],
      });
    }

    const reStructuring = find.map((item) => {
      const user = { ...item };
      delete user.user.password;
      const result = {
        Struk: {
          id: item.id,
          userID: item.user_id,
          PengajuanID: item.pengajuan_id,
          PJ_Service: item.penanggung_jawab_service,
          Kebutuhan: item.kebutuhan,
          Total_Biaya: item.total_biaya,
          Pengajuan: item.pengajuan,
          User: user.user,
        },
      };

      return result;
    });

    res.status(200).json({
      Message: "Berhasil ditemukan!",
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
