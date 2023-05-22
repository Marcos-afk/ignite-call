/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react';

import { api } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import { getWeekDays } from '@utils/get-week-days';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { CaretLeft, CaretRight } from 'phosphor-react';

import * as S from './styles';

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface CalendarProps {
  selectedDate?: Date | null;
  onSelectedDate: (date: Date) => void;
}

interface BlockedDates {
  blockedWeekDays: number[];
  blockedDates: number[];
}

export const Calender = ({ selectedDate, onSelectedDate }: CalendarProps) => {
  const router = useRouter();
  const username = router.query.username as string;

  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set('date', 1);
  });

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', currentDate.get('year'), currentDate.get('month')],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get('year'),
          month: currentDate.format('MM'),
        },
      });

      return response.data;
    },
  );

  const shortWeekDays = getWeekDays({ short: true });

  const currentMonth = currentDate.format('MMMM');
  const currentYear = currentDate.format('YYYY');

  const handlePreviousMonth = () => {
    setCurrentDate((prevState) => prevState.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevState) => prevState.add(1, 'month'));
  };

  const calendarWeeks = useMemo(() => {
    if (!blockedDates) {
      return [];
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return currentDate.set('date', index + 1);
    });

    const firstWeekDay = currentDate.get('day');

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, index) => {
        return currentDate.subtract(index + 1, 'day');
      })
      .reverse();

    const lastDayInCurrentMonth = currentDate.set(
      'date',
      currentDate.daysInMonth(),
    );

    const lastWeekDay = lastDayInCurrentMonth.get('day');

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return lastDayInCurrentMonth.add(index + 1, 'day');
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates?.blockedWeekDays.includes(date.get('day')) ||
            blockedDates?.blockedDates.includes(date.get('date')),
        };
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true };
      }),
    ];

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, index, original) => {
        const isNewWeek = index % 7 === 0;
        if (isNewWeek) {
          weeks.push({
            week: index / 7 + 1,
            days: original.slice(index, index + 7),
          });
        }

        return weeks;
      },
      [],
    );

    return calendarWeeks;
  }, [currentDate, blockedDates]);

  return (
    <S.Container>
      <S.Header>
        <S.Title>
          {currentMonth} <span>{currentYear}</span>
        </S.Title>

        <S.Actions>
          <button>
            <CaretLeft onClick={handlePreviousMonth} />
          </button>
          <button>
            <CaretRight onClick={handleNextMonth} />
          </button>
        </S.Actions>
      </S.Header>

      <S.Body>
        <thead>
          <tr>
            {shortWeekDays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <S.Day
                    disabled={disabled}
                    onClick={() => onSelectedDate(date.toDate())}
                  >
                    {date.get('date')}
                  </S.Day>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </S.Body>
    </S.Container>
  );
};
