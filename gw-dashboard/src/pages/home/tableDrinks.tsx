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

const TableDrinks: React.FunctionComponent<any> = ({
  data,
  drink_price,
  cb,
  drink_name,
}) => {
  const [convertedArray, setConvertedArray] = React.useState<any>(null);

  const convertData = () => {
    const newArray: any[] = [];
    if (!cb) {
      for (let drink in data) {
        const mappedItems = data[drink].history.map((item: any) => ({
          ...item,
          drink: drink,
        }));

        newArray.push(...mappedItems);
      }
    }
    if (cb) newArray.push(...data);
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
  const fetchDrink = () => {
    console.log("first");
  };
  const fontSize = { base: "8px", md: "10px", lg: "12px" };
  const padding = { base: "5px", md: "10px", lg: "20px" };
  return convertedArray ? (
    <TableContainer w="100%">
      <Table variant="simple">
        <TableCaption fontSize={fontSize}>von XX.XX bis XX.XX</TableCaption>
        <Thead>
          <Tr>
            <Th padding={padding} fontSize={fontSize}>
              Getränk
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              Menge
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              Preis
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              Datum
            </Th>
            <Th padding={padding} fontSize={fontSize}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {convertedArray && convertedArray.length > 0 ? (
            convertedArray.map((item: any, index: any) => {
              let { drink, ammount, date } = item;
              if (!cb) drink = drink.charAt(0).toUpperCase() + drink.slice(1);

              if (ammount !== 0) {
                return (
                  <Tr key={index}>
                    <Td padding={padding} fontSize={fontSize}>
                      {drink && drink === "A_frei" ? "A. Frei" : drink}

                      {drink_name && drink_name === "A_frei"
                        ? "A. Frei"
                        : drink_name}
                    </Td>
                    <Td padding={padding} fontSize={fontSize}>
                      {ammount}
                    </Td>
                    <Td padding={padding} fontSize={fontSize}>
                      {parseFloat(drink_price) * parseFloat(ammount)}
                    </Td>
                    <Td padding={padding} fontSize={fontSize}>
                      {date}
                    </Td>
                    {!cb && (
                      <Td padding={padding} fontSize={fontSize}>
                        {" "}
                        <Button
                          transform={{ base: "scale(0.8)", md: "scale(1)" }}
                          _hover={{ bg: COLORS.red, color: COLORS.white }}
                          color={COLORS.red}
                          padding={1}
                          // onClick={onOpen}
                        >
                          <CFaTrash w={3} color="white.700" />
                        </Button>
                      </Td>
                    )}
                  </Tr>
                );
              }
              return null;
            })
          ) : (
            <Tr>
              <Td padding={padding} fontSize={fontSize}>
                Kein Data zu Zeigen
              </Td>
            </Tr>
          )}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th padding={padding} fontSize={fontSize}>
              Gesamte Kosten
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              {" "}
              SUMME
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              {" "}
              Über {calculateDaysDifference()} {""}
              Tagen
            </Th>
            <Th padding={padding} fontSize={fontSize}>
              {" "}
            </Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
};

export default TableDrinks;
