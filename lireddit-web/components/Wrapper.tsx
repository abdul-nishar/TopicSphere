import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Box maxW="80%" w="100%" mt={8} mx="auto">
      {children}
    </Box>
  );
};
