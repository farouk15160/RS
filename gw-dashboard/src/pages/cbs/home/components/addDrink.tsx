import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Box,
  useToast,
  SimpleGrid,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import TEXT from "../../../../texts/de.json";

const AddDrink: React.FunctionComponent<any> = ({
  onClose,
  user_name,
  user_data_number,
  drink_name,
}) => {
  const [number, setNumber] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleButtonClick = (num: number) => {
    setNumber(num);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (number === null) {
      toast({
        title: TEXT.toasts.noDrinkSelectedTitle,
        description: TEXT.toasts.noDrinkSelectedDescription,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    const date = new Date().getTime();
    const readableDate = new Date(date).toLocaleString();

    try {
      const response = await axios.post(
        "https://192.168.178.66:1868/drinks/user",
        {
          ammount: number,
          date: readableDate,
          number: user_data_number,
          user_name: user_name,
          drink: drink_name,
        }
      );
      if (response.data.successful) {
        toast({
          title: TEXT.toasts.drinkAddedTitle,
          description: TEXT.toasts.drinkAddedDescription,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setNumber(null); // Clear the selection after successful submission
        onClose(); // Close the dialog after submission
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast({
          title: TEXT.toasts.errorTitle,
          description: response.data.message || TEXT.toasts.errorDescription,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      toast({
        title: TEXT.toasts.errorTitle,
        description:
          error.response?.data?.message || TEXT.toasts.errorDescription,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(
        "Fehler bei der POST-Anfrage:",
        error.response?.data || error
      );
    }
  };

  return (
    <>
      <Box
        w="100%"
        maxW="400px"
        mx="auto"
        mt="40px"
        p="20px"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Text mb="4" fontSize="lg" fontWeight="bold">
          {TEXT.addDrink.selectDrinkNumber}
        </Text>
        <SimpleGrid columns={3} spacing={4} mb={4}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => handleButtonClick(num)}
              colorScheme={number === num ? "blue" : "gray"}
            >
              {num}
            </Button>
          ))}
        </SimpleGrid>
        <Button mt="4" colorScheme="blue" onClick={() => setIsOpen(true)}>
          {TEXT.addDrink.addDrink}
        </Button>
        <Button
          marginLeft="15px"
          onClick={onClose}
          mt="4"
          colorScheme="blue"
          variant="outline"
        >
          {TEXT.general.cancel}
        </Button>
      </Box>

      {/* Confirm Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpen(false)}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {TEXT.addDrink.confirmTitle}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{TEXT.addDrink.confirmDescription}</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
              {TEXT.general.cancel}
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit} ml={3}>
              {TEXT.addDrink.confirmButton}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddDrink;
