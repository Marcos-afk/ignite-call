import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import { CalendarBlank, Clock } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { ConfirmStepFormProps, ConfirmStepFormSchema } from './validate';

export const ConfirmStep = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ConfirmStepFormProps>({
    resolver: zodResolver(ConfirmStepFormSchema),
  });

  const handleConfirmScheduling = async (data: ConfirmStepFormProps) => {
    await Promise.resolve(
      setTimeout(() => {
        // eslint-disable-next-line no-console
        console.log(data);
      }, 2000),
    );
  };

  return (
    <S.Container as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <S.Header>
        <Text>
          <CalendarBlank />
          10 de Maio de 2023
        </Text>
        <Text>
          <Clock />
          08:00h
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
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirmar
        </Button>
      </S.Actions>
    </S.Container>
  );
};
