import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput } from '@ignite-ui/react';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { ClaimUsernameFormProps, ClaimUsernameFormSchema } from './validate';

export const ClaimUsernameForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimUsernameFormProps>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(ClaimUsernameFormSchema),
  });

  const handlePreRegister = (data: ClaimUsernameFormProps) => {
    // eslint-disable-next-line no-console
    console.log(data);
    reset();
  };

  return (
    <>
      <S.Form as="form" onSubmit={handleSubmit(handlePreRegister)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </S.Form>
      <S.FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o username do usuário desejado'}
        </Text>
      </S.FormAnnotation>
    </>
  );
};
