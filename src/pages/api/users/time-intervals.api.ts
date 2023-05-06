import { prisma } from '@lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { buildNextAuthOptions } from '../auth/[...nextauth].api';

interface TimeIntervals {
  weekDay: number;
  startTimeInMinutes: number;
  endTimeInMinutes: number;
}

const createTimeInterval = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
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

  const intervals = req.body.intervals as TimeIntervals[];

  await Promise.all(
    intervals.map(async (interval) => {
      await prisma.userTimeIntervals.create({
        data: {
          week_day: interval.weekDay,
          start_time_in_minutes: interval.startTimeInMinutes,
          end_time_in_minutes: interval.endTimeInMinutes,
          user_id: session.user.id,
        },
      });
    }),
  );

  return res.status(201).end();
};

export default createTimeInterval;
