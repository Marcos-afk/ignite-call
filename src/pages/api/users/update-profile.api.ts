import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { buildNextAuthOptions } from '../auth/[...nextauth].api';

const UpdateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }

  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  );

  if (!session) {
    return res.status(401).end();
  }

  const bio = req.body.bio as string;

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  });

  return res.status(204).end();
};

export default UpdateProfile;
