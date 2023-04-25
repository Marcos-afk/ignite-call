import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { ClaimUsernameFormProps, ClaimUsernameFormSchema } from './validate';

export const ClaimUsernameForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClaimUsernameFormProps>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(ClaimUsernameFormSchema),
  });

  const handlePreRegister = async ({ username }: ClaimUsernameFormProps) => {
    await router.push({ pathname: '/register', query: { username } });
  };

  return (
    <>
      <S.Form as="form" onSubmit={handleSubmit(handlePreRegister)}>
        <TextInput
          size="sm"
          prefix="ignite.com/"
          placeholder="seu-usuário"
          {...register('username')}
          autoComplete="off"
        />
        <Button size="sm" type="submit" disabled={isSubmitting}>
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
