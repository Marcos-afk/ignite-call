import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, username } = req.body;

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userAlreadyExists) {
    return;
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  return res.status(201).json(user);
};

export default createUser;
