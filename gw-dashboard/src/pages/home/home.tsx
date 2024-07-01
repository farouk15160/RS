import React from "react";
import axios from "axios";
import {
  Button,
  chakra,
  Flex,
  FormControl,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import TextJs from "../../texts/de.json";
import { API, COLORS } from "../../components/color";
import { FaLock, FaUserAlt, FaPlus } from "react-icons/fa";
import { RenderCards } from "./cards";

interface UserData {
  number: number;
  password: number;
  drinks?: any;
}

interface UsersData {
  [key: string]: UserData;
}

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const CFaPlus = chakra(FaPlus);

const Home: React.FunctionComponent = () => {
  const [data, setData] = React.useState<any>();
  // const [drink, setDrink] = React.useState<any>();

  const [load, setLoad] = React.useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/users`);

      setData(response.data.allUsersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  // console.log(drink);
  const [userName_, setUserName] = React.useState<string>(""); // Initialize state variables
  const [number_, setNumber] = React.useState<number>(); // Assuming number_ is a string
  const [userPassword_, setUserPassword] = React.useState<number>();
  const addNewUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoad(true);

    if (!number_ || number_.toString().length !== 4) {
      alert(TextJs.error.error_4);
      setLoad(false);
      onClose();
      return;
    }

    if (!userPassword_ || userPassword_.toString().length !== 4) {
      alert(TextJs.error.error_4);
      setLoad(false);
      onClose();

      return;
    }

    const newDataSend = {
      [userName_]: {
        number: number_,
        password: userPassword_,
      },
    };

    try {
      await axios.post(`${API}/users`, newDataSend);
      console.log("POST request successful");
      fetchData();
      onClose();
    } catch (error: any) {
      alert(error.response.data.message);

      console.error("Error making POST request:", error.response.data.message);
    } finally {
      setLoad(false);
      // onClose();
    }
    // onClose();
  };

  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "id") {
      setUserName(value.toLowerCase());
    }
    if (name === "number") {
      setNumber(parseInt(value));
    }
    if (name === "password") {
      setUserPassword(parseInt(value));
    }
  };
  return (
    <Flex
      w="100%"
      paddingTop="40px"
      paddingBottom="80px"
      alignItems="center"
      flexWrap="wrap"
      justifyContent="center"
      gap="20px"
    >
      {/* {drink && <Image w={400} src={drink} />} */}
      {data ? (
        <RenderCards data={data} fetchData={fetchData} setData={setData} />
      ) : (
        <h1>Kein Zugang zum Server</h1>
      )}
      <Flex alignItems="center" justifyContent="center" padding="40px" w="100%">
        {" "}
        {load && (
          <Spinner
            position="absolute"
            top="50%"
            w="100px"
            left="50%"
            transform="translate( -50% , -50%)"
          />
        )}
        <Flex
          alignItems="center"
          justifyContent="center"
          padding="10px"
          borderRadius="50%"
          onClick={onOpen}
          className="hover-button"
          h="50px"
          bg={COLORS.white}
        >
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Neuer Benutzer</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={addNewUser}>
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
                          name="id"
                          id="id"
                          placeholder={TextJs.login.username}
                          onChange={handleChangeUser}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CFaUserAlt color="gray.300" />
                        </InputLeftElement>

                        <Input
                          type="number"
                          name="number"
                          id="number"
                          placeholder="id"
                          onChange={handleChangeUser}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <CFaLock color="gray.300" />
                        </InputLeftElement>
                        <Input
                          type="number"
                          id="password"
                          name="password"
                          placeholder={TextJs.login.Password}
                          onChange={handleChangeUser}
                        />
                      </InputGroup>
                    </FormControl>
                  </Stack>
                </form>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  {TextJs.general.close}
                </Button>
                <Button onClick={addNewUser} variant="ghost">
                  {" "}
                  {TextJs.general.add}{" "}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <CFaPlus w="40px" />{" "}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
export interface RenderCardsProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  fetchData: any;
}
