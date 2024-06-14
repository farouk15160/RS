import React from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  chakra,
  Flex,
  FormControl,
  Heading,
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
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import TextJs from "../../texts/de.json";
import { FaTrash, FaLock, FaUserAlt, FaPlus, FaEdit } from "react-icons/fa";
import { COLORS } from "../../components/color";

interface UserData {
  number: number;
  password: number;
}

interface UsersData {
  [key: string]: UserData;
}

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaTrash = chakra(FaTrash);
const CFaPlus = chakra(FaPlus);
const CFEdit = chakra(FaEdit);

const Home: React.FunctionComponent = () => {
  const [data, setData] = React.useState<UsersData[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://192.168.178.66:4443");
        setData(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const addNewUser = () => {};

  const handleChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id } = e.target;

    console.log(id);
    console.log(name);
    console.log(value);
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
      {data.length > 0 ? (
        <RenderCards data={data} setData={setData} />
      ) : (
        <h1>Kein Zugang zum Server</h1>
      )}
      <Flex alignItems="center" justifyContent="center" padding="40px" w="100%">
        {" "}
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
interface RenderCardsProps {
  data: UsersData[];
  setData: React.Dispatch<React.SetStateAction<UsersData[]>>;
}

export const RenderCards: React.FunctionComponent<RenderCardsProps> = ({
  data,
  setData,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id } = e.target;
    const updatedData = [...data];

    const userIndex = updatedData.findIndex((user) => user[id]);
    if (userIndex !== -1) {
      updatedData[userIndex] = {
        ...updatedData[userIndex],
        [id]: {
          ...updatedData[userIndex][id],
          [name]: value,
        },
      };
    }

    setData(updatedData);
  };

  const handleData = (event: React.FormEvent) => {
    event.preventDefault();
    for (const user of Object.values(data[0])) {
      if (!user.number || user.number.toString().length !== 4) {
        alert(TextJs.error.error_4);
        return false;
      }

      if (!user.password || user.password.toString().length !== 4) {
        alert(TextJs.error.error_4);
        return false;
      }
    }

    // Proceed with saving or further processing if validation passes
    console.log("Data is valid", data);
    return true;
  };

  return (
    <>
      {Object.entries(data[0] || {}).map(([name, userInfo], index) => (
        <CardComponent
          key={index}
          index={index}
          name={name}
          userInfo={userInfo}
          handleChange={handleChange}
          handleData={handleData}
        />
      ))}
    </>
  );
};
interface CardComponentProps {
  index: number;
  name: string;
  userInfo: UserData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleData: (event: React.FormEvent) => boolean;
}

export const CardComponent: React.FunctionComponent<CardComponentProps> = ({
  index,
  name,
  userInfo,
  handleChange,
  handleData,
}) => {
  const [edit, setEdit] = React.useState<boolean>(false);
  const onDelete = () => {
    console.log("first");
  };

  return (
    <Card
      boxShadow="0px 0px 7px 2px #787475"
      minW={{ base: "90%", md: "250px", lg: "350px" }}
      key={index}
    >
      <CardHeader>
        <Heading textTransform="capitalize" size="lg">
          {name}
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {!edit ? (
            <Box>
              <Text pt="2" fontSize="md">
                <span style={{ fontWeight: "bold" }}>
                  {TextJs.general.number}
                </span>
                : {userInfo.number}
              </Text>
              <Text pt="2" fontSize="md">
                <span style={{ fontWeight: "bold" }}>
                  {TextJs.general.password}
                </span>
                : {userInfo.password}
              </Text>
            </Box>
          ) : (
            <form onSubmit={handleData}>
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
                      type="number"
                      name="number"
                      id={name}
                      placeholder={TextJs.login.username}
                      value={userInfo.number}
                      onChange={handleChange}
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
                      id={name}
                      name="password"
                      placeholder={TextJs.login.Password}
                      value={userInfo.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
            </form>
          )}
          <Flex gap="20px">
            {!edit ? (
              <Button
                _hover={{ bg: COLORS.blue, color: COLORS.white }}
                color={COLORS.blue}
                onClick={() => setEdit(true)}
                // fontSize={{ base: "10px", md: "12px", lg: "13px" }}
                padding="10px"
              >
                <CFEdit />
              </Button>
            ) : (
              <Button
                _hover={{ bg: COLORS.blue, color: COLORS.white }}
                color={COLORS.blue}
                fontSize={{ base: "9px", md: "11px", lg: "12px" }}
                padding="10px"
                onClick={(event) => {
                  handleData(event);
                  setEdit(!handleData(event));
                }}
                type="submit"
              >
                {TextJs.general.save}
              </Button>
            )}
            <Button
              _hover={{ bg: COLORS.red, color: COLORS.white }}
              color={COLORS.red}
              onClick={onDelete}
              //   bg={COLORS.red}
            >
              <CFaTrash color="white.700" />
            </Button>
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};
