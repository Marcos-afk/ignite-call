import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { RegisterFormProps, RegisterFormSchema } from './validate';

const Register = () => {
  const router = useRouter();
  const { username } = router.query as { username: string };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormProps>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(RegisterFormSchema),
  });

  useEffect(() => {
    if (username) {
      setValue('username', username);
    } else {
      setValue('username', '');
    }
  }, [username, setValue]);

  const handleRegister = (data: RegisterFormProps) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>
        <MultiStep size={4} currentStep={1} />
      </S.Header>
      <S.Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuário</Text>
          <TextInput
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register('username')}
            autoComplete="off"
          />
          {errors.username && (
            <S.FormError size="sm">{errors.username.message}</S.FormError>
          )}
        </label>
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

        <Button type="submit" disabled={isSubmitting}>
          Próximo passo <ArrowRight />
        </Button>
      </S.Form>
    </S.Container>
  );
};

export default Register;