import React from "react";
import AuthContext, { AuthContextType } from "../../../contexts/AuthContext";
import {
  Button,
  ButtonGroup,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Card, CardBody, CardFooter } from "@chakra-ui/react";

const HomeCB = () => {
  const authContext = React.useContext<AuthContextType | undefined>(
    AuthContext
  );
  console.log(authContext?.dataCB);
  const [username, setUsername] = React.useState<string>("");

  React.useEffect(() => {
    setUsername(Object.keys(authContext?.dataCB)[0]);
  }, []);

  return (
    <>
      {authContext?.dataCB ? (
        <Flex
          w="100%"
          paddingTop="40px"
          paddingBottom="80px"
          alignItems="center"
          flexWrap="wrap"
          flexDirection="column"
          justifyContent="center"
          gap="20px"
        >
          <Heading textTransform="capitalize" as="h1">
            Hallo {username}
          </Heading>
          <Flex
            justifyContent="center"
            alignItems="center"
            w="100%"
            flexWrap="wrap"
            gap="20px"
          >
            {Object.entries(authContext?.dataCB[username]?.drinks).map(
              ([key, value], index) => {
                console.log(key, "key");
                console.log(value, "value");
                return (
                  <Flex
                    key={index}
                    minW={{ base: "90%", md: "250px", lg: "350px" }}
                  >
                    <CardComponent key={key} value={value} />
                  </Flex>
                );
              }
            )}
          </Flex>
        </Flex>
      ) : (
        <Spinner
          position="absolute"
          top="50%"
          w="100px"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </>
  );
};

export default HomeCB;

interface ICardComponent {
  value: any;
  key: string;
}

export const CardComponent: React.FunctionComponent<ICardComponent> = ({
  value,
  key,
}) => {
  return (
    <Card maxW="sm">
      <CardHeader textTransform="capitalize"> {key} </CardHeader>
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">Living room Sofa</Heading>
          <Text>
            This sofa is perfect for modern tropical spaces, baroque inspired
            spaces, earthy toned spaces and for people who love a chic design
            with a sprinkle of vintage design.
          </Text>
          <Text color="blue.600" fontSize="2xl">
            $450
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button variant="solid" colorScheme="blue">
            Buy now
          </Button>
          <Button variant="ghost" colorScheme="blue">
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
