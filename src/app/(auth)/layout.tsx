import AnimatedBackground from '@page-components/(auth)/auth-components/AnimatedBackground';
import { Container } from '@ui/Container';

const AuthLayout = ({ children }) => {
  return (
    <Container
      as='main'
      className='relative size-full overflow-auto bg-[#1A1A1F]'
      variantsUi={{ flow: 'col', items: 'centered' }}
    >
      <AnimatedBackground />
      {children}
    </Container>
  );
};

export default AuthLayout;
