/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
import { useState } from 'react';

import { Calender } from '@components/Calendar';
import { api } from '@lib/axios';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import * as S from './styles';

interface Availability {
  possibleTimes: number[];
  availableTimes: number[];
}

interface CalenderStepProps {
  onSelectedDateTime: (date: Date) => void;
}

export const CalenderStep = ({ onSelectedDateTime }: CalenderStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const isDataSelected = !!selectedDate;

  const router = useRouter();
  const username = router.query.username as string;

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null;
  const describedDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null;

  const selectedDateFormatted = selectedDate
    ? dayjs(selectedDate).format('YYYY-MM-DD')
    : null;

  const { data: availability } = useQuery<Availability>(
    ['availability', selectedDateFormatted],
    async () => {
      const response = await api.get(`/users/${username}/availability`, {
        params: {
          date: selectedDateFormatted,
        },
      });

      return response.data;
    },
    {
      enabled: !!selectedDate,
    },
  );

  const handleSelectTime = (hour: number) => {
    const dateWithTime = dayjs(selectedDate)
      .set('hour', hour)
      .startOf('hour')
      .toDate();

    onSelectedDateTime(dateWithTime);
  };

  return (
    <S.Container isTimePickerOpen={isDataSelected}>
      <Calender selectedDate={selectedDate} onSelectedDate={setSelectedDate} />
      {isDataSelected && (
        <S.TimePicker>
          <S.TimerPickerHeader>
            {weekDay} <span>{describedDate}</span>
          </S.TimerPickerHeader>
          <S.TimePickerList>
            {availability?.possibleTimes.map((hour) => (
              <S.TimePickerItem
                key={hour}
                disabled={!availability.availableTimes.includes(hour)}
                onClick={() => handleSelectTime(hour)}
              >
                {String(hour).padStart(2, '0')}:00h
              </S.TimePickerItem>
            ))}
          </S.TimePickerList>
        </S.TimePicker>
      )}
    </S.Container>
  );
};
