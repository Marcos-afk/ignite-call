import { Avatar, Heading, Text } from '@ignite-ui/react';
import { prisma } from '@lib/prisma';
import { GetStaticPaths, GetStaticProps } from 'next';

import { ScheduleForm } from '../components/ScheduleForm';
import * as S from './styles';

interface ScheduleProps {
  user: {
    name: string;
    bio: string;
    avatar_url: string;
  };
}

const Schedule = ({ user }: ScheduleProps) => {
  return (
    <S.Container>
      <S.UserHeader>
        <Avatar src={user.avatar_url} alt={user.name} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </S.UserHeader>

      <ScheduleForm />
    </S.Container>
  );
};

export default Schedule;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      },
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
