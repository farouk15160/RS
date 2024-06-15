import {
  Button,
  chakra,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { COLORS } from "../../components/color";

const CFaTrash = chakra(FaTrash);

const TableDrinks: React.FunctionComponent<any> = ({ data }) => {
  const [convertedArray, setConvertedArray] = React.useState<any>(null);
  const convertData = () => {
    const newArray: any[] = [];
    for (let drink in data) {
      const mappedItems = data[drink].history.map((item: any) => ({
        ...item,
        drink: drink,
      }));

      newArray.push(...mappedItems);
    }
    newArray.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const filteredArray = newArray.filter((item) => item.ammount !== 0);
    setConvertedArray(filteredArray);
  };
  React.useEffect(() => {
    convertData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const calculateDaysDifference = () => {
    if (convertedArray.length > 0) {
      const firstDate = new Date(convertedArray[0]?.date);
      const lastNumber: number = convertedArray.length - 1;
      const lastDate = new Date(convertedArray[lastNumber]?.date);

      // console.log(firstDate, "F");
      // console.log(convertedArray[lastNumber]?.date);
      // console.log(convertedArray.length - 1);

      const differenceInTime = lastDate.getTime() - firstDate.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days

      return differenceInDays.toFixed(2); // Adjust the precision as needed
    }
    return "N/A";
  };

  return convertedArray ? (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>von XX.XX bis XX.XX</TableCaption>
        <Thead>
          <Tr>
            <Th>Getränk</Th>
            <Th>Menge</Th>
            <Th>Datum</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {convertedArray && convertedArray.length > 1 ? (
            convertedArray.map((item: any, index: any) => {
              let { drink, ammount, date } = item;
              drink = drink.charAt(0).toUpperCase() + drink.slice(1);

              if (ammount !== 0) {
                return (
                  <Tr key={index}>
                    <Td>{drink === "A_frei" ? "A. Frei" : drink}</Td>
                    <Td>{ammount}</Td>
                    <Td>{date}</Td>
                    <Td>
                      {" "}
                      <Button
                        _hover={{ bg: COLORS.red, color: COLORS.white }}
                        color={COLORS.red}
                        padding={1}
                        // onClick={onOpen}
                      >
                        <CFaTrash w={3} color="white.700" />
                      </Button>
                    </Td>
                  </Tr>
                );
              }
              return null;
            })
          ) : (
            <Tr>
              <Td>Kein Data zu Zeigen</Td>
            </Tr>
          )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Gesamte Kosten</Th>
            <Th> SUMME</Th>
            <Th>
              {" "}
              Über {calculateDaysDifference()} {""}
              Tagen
            </Th>
            <Th> </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
};

export default TableDrinks;
