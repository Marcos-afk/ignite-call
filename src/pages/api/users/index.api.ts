import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'nookies';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { name, username } = req.body;

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userAlreadyExists) {
    return res.status(400).json({ message: 'Username inválido' });
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  setCookie({ res }, '@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return res.status(201).json(user);
};

export default createUser;
