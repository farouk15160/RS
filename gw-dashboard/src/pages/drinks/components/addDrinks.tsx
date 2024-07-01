import React from "react";
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

const AddDrinks: React.FunctionComponent<any> = ({ onClose, fetchDrinks }) => {
  // Define state variables for form fields
  const [name, setName] = React.useState("");
  const [src, setSrc] = React.useState("");
  const [price, setPrice] = React.useState(0); // Include price field
  const [error, setError] = React.useState("");

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !src || price < 0) {
      setError("Please provide valid name, src, and price");
      return;
    }

    try {
      // Send POST request to add a new drink
      await axios.post(`${API}/drinks`, {
        name: name,
        img: src,
        price: price,
      });

      fetchDrinks();
      // Clear the form and error state after successful submission
      setName("");
      setSrc("");
      setPrice(0);
      setError("");
      alert("Drink added successfully!");
    } catch (err) {
      console.error("Error adding drink:", err);
      setError("Failed to add drink");
    }
  };

  return (
    <Box maxW="md" mx="auto" p={4}>
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
            Getränk hinzufügen
          </Button>
          <Button onClick={onClose} colorScheme="blue" width="full">
            Abbrechen
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default AddDrinks;
