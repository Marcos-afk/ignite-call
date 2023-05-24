import { zodResolver } from '@hookform/resolvers/zod';
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from '@ignite-ui/react';
import { api } from '@lib/axios';
import { buildNextAuthOptions } from '@pages/api/auth/[...nextauth].api';
import { AxiosError } from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { ArrowRight } from 'phosphor-react';
import { useForm } from 'react-hook-form';

import * as S from './styles';
import { UpdateProfileProps, UpdateProfileSchema } from './validate';

const UpdateProfile = () => {
  const session = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileProps>({
    defaultValues: {},
    resolver: zodResolver(UpdateProfileSchema),
  });

  const handleUpdateProfile = async ({ bio }: UpdateProfileProps) => {
    try {
      await api.put('/users/update-profile', {
        bio,
      });
      await router.push(`/schedule/${session.data?.user.username}`);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? error.response?.data.message
          : 'Erro ao atualizar perfil, tente novamente mais tarde';
      alert(`Erro ao atualizar perfil, ${message}`);
    }
  };

  return (
    <>
      <NextSeo title="Atualize seu perfil | Ignite Call" noindex />
      <S.Container>
        <S.Header>
          <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
          <Text>
            Precisamos de algumas informações para criar seu perfil! Ah, você
            pode editar essas informações depois.
          </Text>
          <MultiStep size={4} currentStep={4} />
        </S.Header>
        <S.ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <label>
            <Text size="sm">Foto de perfil</Text>
            <Avatar
              src={session.data?.user.avatar_url}
              alt={session.data?.user.name}
            />
          </label>
          <label>
            <Text size="sm">Sobre você</Text>
            <TextArea {...register('bio')} autoComplete="off" />
            <S.FormAnnotation size="sm">
              Fale um pouco sobre você. Isto será exibido no seu perfil.
            </S.FormAnnotation>
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Finalizar <ArrowRight />
          </Button>
        </S.ProfileBox>
      </S.Container>
    </>
  );
};

export default UpdateProfile;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(
    req,
    res,
    buildNextAuthOptions(req, res),
  );

  if (!session) {
    return {
      redirect: {
        destination: '/register',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
