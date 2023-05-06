import { convertTimeStringToMinutes } from '@utils/convert-time-string-to-minutes';
import { z } from 'zod';

export const TimerIntervalFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => {
      return intervals.filter((interval) => interval.enabled);
    })
    .refine(
      (intervals) => {
        return intervals.length > 0;
      },
      {
        message: 'Você deve selecionar pelo menos um dia da semana.',
      },
    )
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        };
      });
    })
    .refine(
      (intervals) => {
        return intervals.every((interval) => {
          const diff = interval.endTimeInMinutes - interval.startTimeInMinutes;
          return diff >= 60;
        });
      },
      {
        message: 'O intervalo mínimo é de 1 hora.',
      },
    ),
});

export type TimerIntervalFormOutputProps = z.output<
  typeof TimerIntervalFormSchema
>;
export type TimerIntervalFormInputProps = z.input<
  typeof TimerIntervalFormSchema
>;
