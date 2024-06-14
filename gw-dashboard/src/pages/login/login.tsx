import React from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement,
  Image,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import Text from "../../texts/de.json";
import { COLORS } from "../../components/color";
import Zirkel from "../../images/montania-logo.svg";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface IUserData {
  username: string;
  password: string;
}
const CREDENTIALS = {
  username: "Getränkenwart",
  password: "CM!1868",
};
const CFaUserAlt: any = chakra(FaUserAlt);
const CFaLock: any = chakra(FaLock);

const Login: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [userData, setUserData] = React.useState<IUserData>({
    username: "",
    password: "",
  });
  const authContext = React.useContext(AuthContext);
  if (!authContext) {
    return null; // or some fallback UI
  }
  const { login } = authContext;

  const handleShowClick: () => void = () => setShowPassword(!showPassword);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    const { username, password } = userData;
    if (
      username === CREDENTIALS.username &&
      password === CREDENTIALS.password
    ) {
      login();
      navigate("/home");
    } else {
      alert("Falsche Eingabe");
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100vh"
      // backgroundColor={COLORS.white}
      backgroundColor="gray.100"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Image maxW="100px" src={Zirkel} />
        <Heading color={COLORS.red}>{Text.login.welcome}</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleLogin}>
            <Stack
              borderRadius="10px"
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.800"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    name="username"
                    placeholder={Text.login.username}
                    value={userData.username}
                    onChange={handleChange}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300">
                    <CFaLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={Text.login.Password}
                    value={userData.password}
                    onChange={handleChange}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? Text.login.hide : Text.login.show}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                {Text.login.login}
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box
        fontSize={{ base: "10px", md: "11px", lg: "14px" }}
        textAlign="center"
      >
        {Text.help.text}
      </Box>
    </Flex>
  );
};

export default Login;
