import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import { api } from '@lib/axios';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { CalendarBlank, Clock } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { ConfirmStepFormProps, ConfirmStepFormSchema } from './validate';

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export const ConfirmStep = ({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmStepFormProps>({
    resolver: zodResolver(ConfirmStepFormSchema),
  });

  const router = useRouter();
  const username = router.query.username as string;

  const handleConfirmScheduling = async ({
    name,
    email,
    observations,
  }: ConfirmStepFormProps) => {
    try {
      await api.post(`/users/${username}/schedule`, {
        name,
        email,
        observations,
        date: schedulingDate,
      });

      onCancelConfirmation();
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message
          : 'Erro ao criar agendamento, tente novamente mais tarde';
      alert(`Erro ao criar agendamento, ${message}`);
    }
  };

  const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY');
  const describedTime = dayjs(schedulingDate).format('HH:mm[h]');

  return (
    <S.Container as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.Header>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </S.Header>

      <label>
        <Text size="sm">Nome Completo</Text>
        <TextInput
          placeholder="Seu nome"
          {...register('name')}
          autoComplete="off"
        />
        {errors.name && (
          <S.FormError size="sm">{errors.name.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Endereço de email</Text>
        <TextInput
          type="email"
          placeholder="joe@example.com"
          {...register('email')}
          autoComplete="off"
        />
        {errors.email && (
          <S.FormError size="sm">{errors.email.message}</S.FormError>
        )}
      </label>

      <label>
        <Text size="sm">Observações</Text>
        <TextArea {...register('observations')} />
      </label>

      <S.Actions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.Actions>
    </S.Container>
  );
};
