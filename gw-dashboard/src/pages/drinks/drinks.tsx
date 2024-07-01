import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  chakra,
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import TEXT from "../../texts/de.json";
import { FaPlus } from "react-icons/fa";
import { API, COLORS } from "../../components/color";
import AddDrinks from "./components/addDrinks";
import EditDrinks from "./components/editDrinks";

const CFaPlus = chakra(FaPlus);

const Drinks = () => {
  const [drinks, setDrinks] = React.useState<any>(0);
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
  const ADD = useDisclosure();

  console.log(drinks);
  return (
    <>
      <Flex
        w="100%"
        paddingTop="40px"
        paddingBottom="80px"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center"
        gap="20px"
      >
        {drinks ? (
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
              Alle Getränke und anderen Sachen
            </Heading>
            <Flex
              padding="0 20px"
              justifyContent="center"
              alignItems="center"
              w="100%"
              flexWrap="wrap"
              gap="30px"
            >
              {drinks &&
                Object.entries(drinks).map(([drinkKey, value], index) => (
                  <Flex
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                    minW={{ base: "90%", md: "250px", lg: "350px" }}
                  >
                    <CardComponent
                      fetchDrinks={fetchDrinks}
                      drinkKey={drinkKey}
                      value={value}
                    />
                  </Flex>
                ))}
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
        <Flex
          alignItems="center"
          justifyContent="center"
          padding="10px"
          borderRadius="50%"
          onClick={ADD.onOpen}
          className="hover-button"
          h="50px"
          w="50px"
          bg={COLORS.white}
        >
          <Modal
            closeOnOverlayClick={false}
            isOpen={ADD.isOpen}
            onClose={ADD.onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Neues Item hinzufügen </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <AddDrinks fetchDrinks={fetchDrinks} onClose={ADD.onClose} />
              </ModalBody>
            </ModalContent>
          </Modal>
          <CFaPlus w="40px" />{" "}
        </Flex>
      </Flex>
    </>
  );
};

export default Drinks;
interface ICardComponent {
  value: any;
  drinkKey: string;
  fetchDrinks: any;
}

export const CardComponent: React.FunctionComponent<ICardComponent> = ({
  value,
  drinkKey,
  fetchDrinks,
}) => {
  // Ensure drinks and drinkKey are defined before accessing

  const { img, number, price } = value;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const EDIT = useDisclosure();
  const [isConfirming, setIsConfirming] = React.useState(false);
  const toast = useToast();
  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/drinks`, {
        data: { number: number },
      });
      fetchDrinks();
      toast({
        title: "Erfolgreich",
        description: "Getränk wurde gelöscht.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally refresh or update the list of drinks here
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Das getränk könnte nicht gelöscht werden ",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  return (
    <>
      <Card
        w={{ base: "90%", md: "100%", lg: "350px" }}
        maxW={{ base: "400px", md: "unset" }}
        boxShadow="0px 0px 5px 0px #4e4848"
      >
        <CardHeader
          fontWeight="bold"
          fontSize={{ base: "15px", md: "18px", lg: "22px" }}
          textTransform="capitalize"
        >
          {drinkKey !== "a_frei" ? drinkKey : "Alkoholfrei"}
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
            <Text>Nummer: {number}</Text>
            <Text>Price: {price}</Text>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              fontSize={{ base: "12px", md: "15px", lg: "18px" }}
              variant="solid"
              colorScheme="blue"
              onClick={EDIT.onOpen}
            >
              {TEXT.general.edit}
            </Button>
            <Button
              fontSize={{ base: "12px", md: "15px", lg: "18px" }}
              variant="solid"
              colorScheme="red"
              onClick={() => {
                setIsConfirming(true);
                onOpen();
              }}
            >
              {TEXT.general.delete}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Löschen Bestätigen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning">
              <AlertIcon />
              <AlertTitle>Sicher?</AlertTitle>
              <AlertDescription>
                Diese Aktion kann nicht rückgängig gemacht werden
              </AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleDelete}>
              Ja , Löschen
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Abbrechen
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={EDIT.isOpen} onClose={EDIT.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader> Bearbeiten von {drinkKey} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <EditDrinks
              onClose={EDIT.onClose}
              fetchDrinks={fetchDrinks}
              data_to_edit={value}
              drinkKey={drinkKey}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
