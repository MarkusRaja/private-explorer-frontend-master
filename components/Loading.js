import {
  Text,
} from '@chakra-ui/react';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <Text>{text}</Text>
  );
};

export default Loading;
