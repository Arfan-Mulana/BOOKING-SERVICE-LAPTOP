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
        user_id,
        pengajuan_id,
        penanggung_jawab_service,
        kebutuhan,
        total_biaya,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Message: "Error ->",
      Information: error.message,
    });
  }
};
