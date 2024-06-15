import {
  chakra,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { FaLock, FaUserAlt } from "react-icons/fa";
import TextJs from "../../texts/de.json";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const EditWindow: React.FunctionComponent<any> = ({
  handleData,
  user,
  handleChange,
}) => {
  return (
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
              id={user[0]}
              placeholder={TextJs.login.username}
              value={user[1].number}
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
              id={user[0]}
              name="password"
              placeholder={TextJs.login.Password}
              value={user[1].password}
              onChange={handleChange}
            />
          </InputGroup>
        </FormControl>
      </Stack>
    </form>
  );
};
