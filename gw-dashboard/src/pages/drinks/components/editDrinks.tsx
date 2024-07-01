import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Input,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import { API } from "../../../components/color";

interface IEditDrinksProps {
  onClose: () => void;
  fetchDrinks: () => void;
  drinkKey: string;
  data_to_edit: {
    img: string;
    price: number;
    number: number; // Add `number` for identifying the drink
  };
}

const EditDrinks: React.FunctionComponent<IEditDrinksProps> = ({
  onClose,
  fetchDrinks,
  data_to_edit,
  drinkKey,
}) => {
  // Define state variables for form fields
  const [name, setName] = useState(drinkKey || "");
  const [src, setSrc] = useState(data_to_edit.img || "");
  const [price, setPrice] = useState(data_to_edit.price || 0);
  const [error, setError] = useState("");

  // Use `data_to_edit` to set initial state and validate
  useEffect(() => {
    if (data_to_edit) {
      setName(drinkKey);
      setSrc(data_to_edit.img);
      setPrice(data_to_edit.price);
    }
  }, [data_to_edit, drinkKey]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !src || price < 0) {
      setError("Please provide valid name, src, and price");
      return;
    }

    try {
      // Send PUT request to update the drink
      await axios.put(`${API}/${data_to_edit.number}`, {
        name,
        img: src,
        price,
      });

      fetchDrinks(); // Fetch updated drink list
      onClose(); // Close the modal or form
      setName(""); // Clear the form
      setSrc("");
      setPrice(0);
      setError("");
      alert("Drink updated successfully!");
    } catch (err) {
      console.error("Error updating drink:", err);
      setError("Failed to update drink");
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="flex-start">
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter drink name"
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel htmlFor="src">Bild URL</FormLabel>
            <Input
              id="src"
              type="text"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              placeholder="Enter drink image URL"
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!error}>
            <FormLabel htmlFor="price">Preis</FormLabel>
            <Input
              id="price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Enter drink price"
            />
          </FormControl>
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
          <Button type="submit" colorScheme="blue" width="full">
            Getränk aktualisieren
          </Button>
          <Button onClick={onClose} colorScheme="red" width="full">
            Abbrechen
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditDrinks;
