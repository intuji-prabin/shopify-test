import React from 'react';

interface DemoProps {
  message: string;
}

const Demo: React.FC<DemoProps> = ({message}) => {
  return <div>{message}</div>;
};

export default Demo;
