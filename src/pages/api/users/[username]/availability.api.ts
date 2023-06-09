import { prisma } from '@lib/prisma';
import dayjs from 'dayjs';
import { NextApiRequest, NextApiResponse } from 'next';

const availability = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const username = req.query.username as string;
  const date = req.query.date as string;

  if (!date) {
    return res.status(400).json({
      message: 'Data não foi providenciada.',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(404).json({
      message: 'Usuário não encontrado.',
    });
  }

  const referenceDate = dayjs(date);
  const isPastDate = referenceDate.endOf('day').isBefore(new Date());

  if (isPastDate) {
    return res.status(200).json({
      possibleTimes: [],
      availableTimes: [],
    });
  }

  const userAvailability = await prisma.userTimeIntervals.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  });

  if (!userAvailability) {
    return res.status(200).json({
      possibleTimes: [],
      availableTimes: [],
    });
  }

  const { start_time_in_minutes, end_time_in_minutes } = userAvailability;

  const startHour = start_time_in_minutes / 60;
  const endHour = end_time_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index;
    },
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time,
    );

    const isTimeInThePast = referenceDate
      .set('hour', time)
      .isBefore(new Date());

    return isTimeBlocked && !isTimeInThePast;
  });

  return res.status(200).json({ possibleTimes, availableTimes });
};

export default availability;
