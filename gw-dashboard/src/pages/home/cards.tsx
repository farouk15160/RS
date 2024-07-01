import React from "react";
import * as XLSX from "xlsx"; // Import xlsx

import TextJs from "../../texts/de.json";
import { API, COLORS } from "../../components/color";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  chakra,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { RenderCardsProps } from "./home";
import axios from "axios";
import { EditWindow } from "./editWindow";
import TableDrinks from "./tableDrinks";
import { motion } from "framer-motion";

interface CardComponentProps {
  index: number;
  user: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleData: (event: React.FormEvent) => void | any;
  edit_: boolean;
  fetchData: any;
  TABLE?: any;
}

const CFaTrash = chakra(FaTrash);
const CFEdit = chakra(FaEdit);

export const RenderCards: React.FunctionComponent<RenderCardsProps> = ({
  data,
  setData,
  fetchData,
}) => {
  const [dataSend, setDataSend] = React.useState<any>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id } = e.target;
    const updatedData: Record<string, any> = { ...data };

    if (name in updatedData[id as keyof typeof updatedData]) {
      updatedData[id as keyof typeof updatedData][name] = value;
    }

    setDataSend({
      [id]: {
        number: name === "number" ? value : updatedData[id].number,
        password: name === "password" ? value : updatedData[id].password,
      },
    });
    setData(updatedData);
  };

  const [load, setLoad] = React.useState<boolean>(false);
  var edit_ = true;
  const handleData = async (event: React.FormEvent) => {
    event.preventDefault();

    for (const user in data) {
      if (!data[user].number || data[user].number.toString().length !== 4) {
        alert(TextJs.error.error_4);
        edit_ = true;
        return;
      }

      if (!data[user].password || data[user].password.toString().length !== 4) {
        alert(TextJs.error.error_4);
        edit_ = true;
        return;
      }
    }

    try {
      await axios.put(`${API}/users`, dataSend);
      console.log("POST request successful");
      fetchData();
      edit_ = false;
    } catch (error: any) {
      alert(error.response.data.message);
      edit_ = true;
      console.error("Error making POST request:", error.response.data.message);
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      {load && (
        <Spinner
          position="absolute"
          top="50%"
          w="100px"
          left="50%"
          transform="translate( -50% , -50%)"
        />
      )}
      {Object.entries(data || {}).map((user, index) => (
        <Flex key={index} minW={{ base: "90%", md: "250px", lg: "350px" }}>
          <CardComponent
            edit_={edit_}
            fetchData={fetchData}
            index={index}
            user={user}
            handleChange={handleChange}
            handleData={handleData}
          />
        </Flex>
      ))}
    </>
  );
};

export const CardComponent: React.FunctionComponent<CardComponentProps> = ({
  index,
  user,
  handleChange,
  handleData,
  fetchData,
  edit_,
}) => {
  const [edit, setEdit] = React.useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const TABLE = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const onDelete = async () => {
    onClose();
    let dataSend: any = {
      [user[0]]: {
        number: user[1].number,
        password: user[1].password,
      },
    };

    dataSend = JSON.stringify(dataSend);

    try {
      const response = await axios.delete(`${API}/users`, {
        data: {
          [user[0]]: {
            number: user[1].number,
            password: user[1].password,
          },
        },
      });
      fetchData();
      console.log("DELTE request successful", response);
    } catch (error: any) {
      alert(error.response.data.message);

      console.error(
        "Error making DELETE request:",
        error.response.data.message
      );
    }
  };
  const convertData = () => {
    const newArray: any[] = [];

    for (let drink in user[1].drinks) {
      const mappedItems = user[1].drinks[drink].history.map((item: any) => ({
        ...item,
        drink: drink,
      }));

      newArray.push(...mappedItems);
    }

    newArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    // newArray.map((item) => {
    //   if(item.)
    // } );
    const filteredArray = newArray.filter((item) => item.ammount !== 0);
    setConvertedArray(filteredArray);
  };
  const [convertedArray, setConvertedArray] = React.useState<any>(null);

  const handleDownload = () => {
    // console.log(user[0]);
    convertData();
    if (!convertedArray) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(convertedArray, {
      header: ["drink", "ammount", "date"], // Column headers
    });

    XLSX.utils.book_append_sheet(wb, ws, "Drinks Data");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${user[0]}_drinks_data.xlsx`;
    link.click();
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -1000,
        width: "100%",
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // alignItems: "center",
      }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 1000 }}
      transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
    >
      <Card
        boxShadow="0px 0px 7px 2px #787475"
        minW={{ base: "90%", md: "250px", lg: "350px" }}
      >
        <CardHeader>
          <Heading textTransform="capitalize" size="lg">
            {user[0]}
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
                  : {user[1].number}
                </Text>
                <Text pt="2" fontSize="md">
                  <span style={{ fontWeight: "bold" }}>
                    {TextJs.general.password}
                  </span>
                  : {user[1].password}
                </Text>
              </Box>
            ) : (
              <EditWindow
                handleData={handleData}
                handleChange={handleChange}
                user={user}
              />
            )}
            <Flex gap="20px">
              {!edit ? (
                <Button
                  _hover={{ bg: COLORS.blue, color: COLORS.white }}
                  color={COLORS.blue}
                  onClick={() => setEdit(true)}
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
                    setEdit(edit_);
                  }}
                  type="submit"
                >
                  {TextJs.general.save}
                </Button>
              )}
              <Button
                _hover={{ bg: COLORS.red, color: COLORS.white }}
                color={COLORS.red}
                onClick={onOpen}
              >
                <CFaTrash color="white.700" />
              </Button>
              <Button
                _hover={{ bg: COLORS.blue, color: COLORS.white }}
                color={COLORS.blue}
                fontSize={{ base: "9px", md: "11px", lg: "12px" }}
                onClick={TABLE.onOpen}
              >
                {" "}
                {TextJs.general.drinks}
              </Button>
              {
                <AlertDialog
                  leastDestructiveRef={cancelRef}
                  isOpen={isOpen}
                  isCentered
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {user[0]} {TextJs.general.delete}
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Bist du sicher? Diese Aktion kann nicht rückgängig
                        gemacht werden.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          {TextJs.general.cancel}
                        </Button>
                        <Button colorScheme="red" onClick={onDelete} ml={3}>
                          {TextJs.general.delete}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              }
              {
                <Modal
                  closeOnOverlayClick={false}
                  size={"full"}
                  isOpen={TABLE.isOpen}
                  onClose={TABLE.onClose}
                >
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{user[0]} Alkohol Könsum </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <TableDrinks cb={false} data={user[1].drinks} />
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={TABLE.onClose}>
                        {TextJs.general.close}
                      </Button>
                      <Button onClick={handleDownload} variant="ghost">
                        {TextJs.general.download}
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              }
            </Flex>
          </Stack>
        </CardBody>
      </Card>
    </motion.div>
  );
};
