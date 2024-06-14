import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const FallbackUI: React.FunctionComponent = () => {
  return (
    <Flex
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize="xl" color="red.500">
        Oops! Something went wrong. Please try refreshing the page.
      </Text>
    </Flex>
  );
};

export default FallbackUI;
