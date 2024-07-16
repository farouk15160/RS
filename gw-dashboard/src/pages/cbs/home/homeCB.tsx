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
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import * as XLSX from "xlsx"; // Import xlsx
import { Card, CardBody, CardFooter } from "@chakra-ui/react";
import axios from "axios";
import TEXT from "../../../texts/de.json";
import TableDrinks from "../../home/tableDrinks";
import AddDrink from "./components/addDrink";
import { API } from "../../../components/color";
// import Drinks from "../../drinks/drinks";

const HomeCB = () => {
  const authContext = React.useContext<AuthContextType | undefined>(
    AuthContext
  );

  const [username, setUsername] = React.useState<string>("");
  const [data, setData] = React.useState<any>(null);
  const [drinks, setDrinks] = React.useState<any>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = async () => {
    if (!authContext?.dataCB) {
      console.error("No dataCB found in authContext");
      return;
    }

    try {
      const res = await axios.post(`${API}/users/id`, authContext.dataCB);

      if (res.data.successful) {
        console.log("Fetch successful");
        setData(res.data.data);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
      console.error(
        "Error making POST request:",
        error.response?.data?.message || error
      );
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchDrinks = async () => {
    try {
      const res = await axios.get(`${API}/drinks`);
      // console.log(res);
      if (res.data.successful) {
        console.log("Fetch successful");
        // console.log(res.data);
        setDrinks(res.data.drinks_);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "An error occurred");
      console.error(
        "Error making POST request:",
        error.response?.data?.message || error
      );
    }
  };
  React.useEffect(() => {
    if (!drinks) {
      fetchDrinks();
    }
  }, [drinks, fetchDrinks]);
  console.log(drinks);
  React.useEffect(() => {
    if (!data) {
      fetchData();
    }
  }, [data, fetchData]);
  React.useEffect(() => {
    if (data) {
      const firstKey = Object.keys(data)[0];
      setUsername(firstKey);
    }
  }, [data]);

  return (
    <>
      {data && drinks ? (
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
          <Heading paddingBottom="40px" textTransform="capitalize" as="h1">
            Hallo {username}
          </Heading>
          <Flex
            padding="0 20px"
            justifyContent="center"
            alignItems="center"
            w="100%"
            flexWrap="wrap"
            gap="30px"
          >
            {data[username]?.drinks &&
              Object.entries(data[username].drinks).map(
                ([drinkKey, value], index) => (
                  <Flex
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                    minW={{ base: "90%", md: "250px", lg: "350px" }}
                  >
                    <CardComponent
                      drinks={drinks}
                      drinkKey={drinkKey}
                      value={value}
                      username={username}
                      fetchDrinks={fetchDrinks}
                      fetchData={fetchData}
                      data={data[username]}
                    />
                  </Flex>
                )
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
  drinkKey: string;
  drinks: any;
  data: any;
  username: any;
  fetchData: any;
  fetchDrinks: any;
}

export const CardComponent: React.FunctionComponent<ICardComponent> = ({
  value,
  drinkKey,
  drinks,
  data,
  username,
  fetchData,
  fetchDrinks,
}) => {
  const [convertedArray, setConvertedArray] = React.useState<any>(null);

  const convertData = () => {
    const newArray: any[] = [];

    console.log(data.drinks[drinkKey].history);
    newArray.push(...data.drinks[drinkKey].history);
    newArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    newArray.map((item) => {
      item.drink = drinkKey;
      item.price = drinks[drinkKey].price;
      item.totalPrice = item.price * item.ammount;
    });
    const filteredArray = newArray.filter((item) => item.ammount !== 0);
    setConvertedArray(filteredArray);
  };

  const handleDownload = () => {
    convertData();
    if (!convertedArray) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(convertedArray, {
      header: ["drink", "ammount", "price", "totalPrice", "date"], // Column headers
    });

    XLSX.utils.book_append_sheet(wb, ws, "Drinks Data");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${drinkKey || "drinks"}_data.xlsx`;
    link.click();
  };
  // Ensure drinks and drinkKey are defined before accessing
  const TABLE = useDisclosure();
  const ADD = useDisclosure();
  if (!drinks || !drinks[drinkKey]) {
    return (
      <Card maxW="sm" border="1px" borderColor="red.500">
        <CardHeader textTransform="capitalize"> Error: {drinkKey} </CardHeader>
        <CardBody>
          <Text>Failed to load drink details.</Text>
        </CardBody>
      </Card>
    );
  }
  const { img, number, price } = drinks[drinkKey];

  return (
    <>
      <Card
        // h={{ base: "300px", md: "350px", lg: "450px" }}
        // maxW="sm"
        w={{ base: "90%", md: "100%", lg: "350px" }}
        maxW={{ base: "400px", md: "unset" }}
        boxShadow="0px 0px 5px 0px #4e4848"
      >
        <CardHeader
          fontWeight="bold"
          fontSize={{ base: "15px", md: "18px", lg: "22px" }}
          textTransform="capitalize"
        >
          {" "}
          {drinkKey !== "a_frei" ? drinkKey : "Alkahol Frei"}{" "}
        </CardHeader>
        <CardBody
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="flex-start"
        >
          <Image
            src={img}
            alt={`Image of ${drinkKey}`}
            borderRadius="lg"
            objectFit="contain"
            h={{ base: "150px", md: "200px", lg: "250px" }}
            w="100%"
          />
          <Stack
            fontWeight="600"
            fontSize={{ base: "12px", md: "15px", lg: "18px" }}
            mt="6"
            spacing="3"
            flex="1"
          >
            <Text> Nummer: {number}</Text>
            <Text> Price: {price}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              fontSize={{ base: "12px", md: "15px", lg: "18px" }}
              variant="solid"
              onClick={ADD.onOpen}
              colorScheme="blue"
            >
              {TEXT.general.add}
            </Button>

            <Button
              fontSize={{ base: "12px", md: "15px", lg: "18px" }}
              onClick={TABLE.onOpen}
              variant="ghost"
              colorScheme="blue"
            >
              {TEXT.general.consume}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
      <Modal
        closeOnOverlayClick={false}
        size={"full"}
        isOpen={TABLE.isOpen}
        onClose={TABLE.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{drinkKey} Alkohol Könsum </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <TableDrinks
              drink_name={drinkKey}
              drink_price={drinks[drinkKey].price}
              cb={true}
              data={data.drinks[drinkKey].history}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={TABLE.onClose}>
              {TEXT.general.close}
            </Button>
            <Button onClick={handleDownload} variant="ghost">
              {TEXT.general.download}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        closeOnOverlayClick={false}
        // size={"full"}
        isOpen={ADD.isOpen}
        onClose={ADD.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{drinkKey} Menge Hinzufügen </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddDrink
              onClose={ADD.onClose}
              user_data_number={data.number}
              user_name={username}
              drink_name={drinkKey}
              fetchDrinks={fetchDrinks}
              fetchData={fetchData}
              // data={data.drinks[drinkKey].history}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
