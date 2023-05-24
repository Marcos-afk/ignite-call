import { Button, Heading, MultiStep, Text } from '@ignite-ui/react';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { ArrowRight, Check } from 'phosphor-react';

import * as S from './styles';

const ConnectCalendar = () => {
  const session = useSession();
  const router = useRouter();

  const hashAuthError = !!router.query.error;
  const isSignedId = session.status === 'authenticated';

  const handleConnectCalendar = async () => {
    await signIn('google', { callbackUrl: '/register/connect-calendar' });
  };

  const handleNavigateToNextStep = async () => {
    await router.push('/register/time-interval');
  };

  return (
    <>
      <NextSeo title="Conecte sua agenda do Google | Ignite Call" noindex />
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
            {isSignedId ? (
              <Button size="sm" disabled>
                Conectado
                <Check />
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleConnectCalendar}
              >
                Conectar
                <ArrowRight />
              </Button>
            )}
          </S.ConnectItem>
          {hashAuthError && (
            <S.AuthError size="sm">
              Falha ao se conectar ao Google, verifique se você habilitou as
              permissões de acesso ao Google Calendar
            </S.AuthError>
          )}
          <Button
            type="submit"
            disabled={!isSignedId}
            onClick={handleNavigateToNextStep}
          >
            Próximo passo <ArrowRight />
          </Button>
        </S.ConnectBox>
      </S.Container>
    </>
  );
};

export default ConnectCalendar;
