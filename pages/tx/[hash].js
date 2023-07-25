import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Heading,
  Button,
  Text,
  Link,
  Textarea,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import Loading from "components/Loading";
import SearchBox from "components/SearchBox";

import { useTransactionDetails } from "hooks/transaction";

import { weiToEther } from "helpers/web3";

export default function TransactionDetails() {
  const router = useRouter();
  const { hash } = router.query;

  const transaction = useTransactionDetails(hash);

  if (transaction.error) {
    console.error(transaction.error);
    return <Text>Kesalahan mengambil data</Text>;
  }

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche - Detil Transaksi</title>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Private Avalanche Explorer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        as="main"
        bgColor={"#EEEEEE"}
        bgSize="100%"
        backgroundSize={{ base: "cover", lg: "100%" }}
        bgRepeat="no-repeat"
        minH="100vh"
        p="10"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Heading p={4}>Detil Transaksi</Heading>

        <Stack direction="column" spacing={8} mt="10">
          <SearchBox />

          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="white"
            borderRadius="10px"
          >
            <TableContainer p={4}>
              <Table size="lg" variant="simple">
                <Tbody>
                  {transaction.isLoading ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <Loading text="Mengambil data..." />
                      </Td>
                    </Tr>
                  ) : (
                    <>
                      <Tr>
                        <Th>Hash Transaksi</Th>
                        <Td>
                          <Text fontSize="md">
                            {transaction.response.data.hash}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Nomor Blok</Th>
                        <Td>
                          <Text fontSize="md">
                            <NextLink
                              href={`/blocks/${transaction.response.data.blockNumber}`}
                              passHref
                            >
                              <Link color="blue.500">
                                {transaction.response.data.blockNumber}
                              </Link>
                            </NextLink>
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Asal</Th>
                        <Td>
                          <Text fontSize="md">
                            {transaction.response.data.from}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Tujuan</Th>
                        <Td>
                          <Text fontSize="md">
                            {transaction.response.data.to ?? (
                              <Text as="span">
                                <strong>Kontrak</strong>{" "}
                                {transaction.response.data.contractAddress}
                              </Text>
                            )}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Nilai</Th>
                        <Td>
                          <Text fontSize="md">
                            {weiToEther(transaction.response.data.value)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY} (
                            {transaction.response.data.value} wei)
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Gas</Th>
                        <Td>
                          <Text fontSize="md">
                            {weiToEther(transaction.response.data.gas)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY} (
                            {transaction.response.data.gas} wei)
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Harga Gas</Th>
                        <Td>
                          <Text fontSize="md">
                            {weiToEther(transaction.response.data.gasPrice)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY} (
                            {transaction.response.data.gasPrice} wei)
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Nonce</Th>
                        <Td>
                          <Text fontSize="md">
                            {transaction.response.data.nonce}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Input</Th>
                        <Td>
                          <Textarea
                            value={transaction.response.data.input}
                            isDisabled
                            size="lg"
                            variant="filled"
                            h="25vh"
                          />
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Terjemahan Input</Th>
                        <Td>
                          <Textarea
                            value={JSON.stringify(
                              transaction.response.data.decodedInput
                            )}
                            isDisabled
                            size="lg"
                            variant="filled"
                            h="25vh"
                          />
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={4}>
              <NextLink href="/tx" passHref>
                <Button
                  as="a"
                  leftIcon={<ArrowBackIcon />}
                  w="100%"
                  colorScheme="blue"
                  variant="outline"
                >
                  Kembali
                </Button>
              </NextLink>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
