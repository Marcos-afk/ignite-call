import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react';
import { api } from '@lib/axios';
import { getWeekDays } from '@utils/get-week-days';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { ArrowRight } from 'phosphor-react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

import * as S from './styles';
import {
  TimerIntervalFormInputProps,
  TimerIntervalFormOutputProps,
  TimerIntervalFormSchema,
} from './validate';

export const TimeInterval = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TimerIntervalFormInputProps>({
    defaultValues: {
      intervals: [
        {
          weekDay: 0,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 1,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 2,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 3,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 4,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 5,
          enabled: true,
          startTime: '08:00',
          endTime: '18:00',
        },
        {
          weekDay: 6,
          enabled: false,
          startTime: '08:00',
          endTime: '18:00',
        },
      ],
    },
    resolver: zodResolver(TimerIntervalFormSchema),
  });

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  });

  const weekDays = getWeekDays();

  const intervalFields = watch('intervals');

  const handleSetTimeIntervals = async (data: any) => {
    const { intervals } = data as TimerIntervalFormOutputProps;

    await api.post('/users/time-intervals', { intervals });
    await router.push('/register/update-profile');
  };

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />
      <S.Container>
        <S.Header>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>
          <MultiStep size={4} currentStep={3} />
        </S.Header>

        <S.IntervalBox
          as="form"
          onSubmit={handleSubmit(handleSetTimeIntervals)}
        >
          <S.IntervalsContainer>
            {fields.map((field, index) => (
              <S.IntervalItem key={field.id}>
                <S.IntervalDay>
                  <Controller
                    name={`intervals.${index}.enabled`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        checked={field.value}
                      />
                    )}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </S.IntervalDay>
                <S.IntervalInputs>
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.startTime`)}
                    disabled={!intervalFields[index].enabled}
                  />
                  <TextInput
                    size="sm"
                    type="time"
                    step={60}
                    {...register(`intervals.${index}.endTime`)}
                    disabled={!intervalFields[index].enabled}
                  />
                </S.IntervalInputs>
              </S.IntervalItem>
            ))}
          </S.IntervalsContainer>

          {errors.intervals && (
            <S.FormError>{errors.intervals.message}</S.FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </S.IntervalBox>
      </S.Container>
    </>
  );
};

export default TimeInterval;
