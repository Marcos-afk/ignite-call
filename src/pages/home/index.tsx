import AppPreviewImg from '@assets/app-preview.png';
import { Heading, Text } from '@ignite-ui/react';
import Image from 'next/image';

import * as S from './styles';

const Home = () => {
  return (
    <S.Container>
      <S.Hero>
        <Heading size="4xl">Agendamento descomplicado</Heading>
        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>
      </S.Hero>
      <S.Preview>
        <Image
          src={AppPreviewImg}
          alt="calendar symbolizing application under development"
          quality={100}
          height={400}
          priority
        />
      </S.Preview>
    </S.Container>
  );
};

export default Home;
