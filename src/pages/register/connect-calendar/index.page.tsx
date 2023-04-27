import { Button, Heading, MultiStep, Text } from '@ignite-ui/react';
import { signIn } from 'next-auth/react';
import { ArrowRight } from 'phosphor-react';

import * as S from './styles';

const ConnectCalendar = () => {
  return (
    <S.Container>
      <S.Header>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>
        <MultiStep size={4} currentStep={2} />
      </S.Header>
      <S.ConnectBox>
        <S.ConnectItem>
          <Text>Google Agenda</Text>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              signIn('google');
            }}
          >
            Conectar
            <ArrowRight />
          </Button>
        </S.ConnectItem>
        <Button type="submit">
          Próximo passo <ArrowRight />
        </Button>
      </S.ConnectBox>
    </S.Container>
  );
};

export default ConnectCalendar;
