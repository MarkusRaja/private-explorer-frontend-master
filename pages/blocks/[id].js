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
  List,
  ListItem,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

import Loading from "components/Loading";
import SearchBox from "components/SearchBox";

import { useBlockDetails, useBlockTransactions } from "hooks/block";

import { weiToEther } from "helpers/web3";

export default function BlockDetails() {
  const router = useRouter();
  const { id } = router.query;

  const block = useBlockDetails(id);
  const blockTransactions = useBlockTransactions(id);

  if (block.error || blockTransactions.error) {
    console.error(block?.error ?? blockTransactions?.error);
    return <Text>Kesalahan mengambil data</Text>;
  }

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche - Detil Blok</title>
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
        <Heading p={4}>Detil Blok</Heading>

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
                  {block.isLoading || blockTransactions.isLoading ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <Loading text="Mengambil data..." />
                      </Td>
                    </Tr>
                  ) : (
                    <>
                      <Tr>
                        <Th>Nomor Blok</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.number}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Waktu</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.timestamp}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Kumpulan Transaksi</Th>
                        <Td>
                          {blockTransactions.response.data.length ? (
                            <List spacing={3}>
                              {blockTransactions.response.data.map(
                                (transaction) => (
                                  <ListItem key={transaction.hash}>
                                    <Text fontSize="md">
                                      <NextLink
                                        href={`/tx/${transaction.hash}`}
                                        passHref
                                      >
                                        <Link color="blue.500">
                                          {transaction.hash}
                                        </Link>
                                      </NextLink>
                                    </Text>
                                  </ListItem>
                                )
                              )}
                            </List>
                          ) : (
                            <Text>Transaksi tidak ditemukan</Text>
                          )}
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Kesulitan</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.difficulty}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Jumlah Kesulitan</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.totalDifficulty}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Ukuran</Th>
                        <Td>
                          <Text fontSize="md">{block.response.data.size}</Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Gas Terpakai</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.gasUsed} (
                            {weiToEther(block.response.data.gasUsed)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY})
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Batasan Gas</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.gasLimit} (
                            {weiToEther(block.response.data.gasLimit)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY})
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Biaya Dasar Per Gas</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.baseFeePerGas} (
                            {weiToEther(block.response.data.baseFeePerGas)}{" "}
                            {process.env.NEXT_PUBLIC_TOKEN_CURRENCY})
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Hash</Th>
                        <Td>
                          <Text fontSize="md">{block.response.data.hash}</Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Hash Induk</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.parentHash}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Sha3Uncles</Th>
                        <Td>
                          <Text fontSize="md">
                            {block.response.data.sha3Uncles}
                          </Text>
                        </Td>
                      </Tr>
                      <Tr>
                        <Th>Nonce</Th>
                        <Td>
                          <Text fontSize="md">{block.response.data.nonce}</Text>
                        </Td>
                      </Tr>
                    </>
                  )}
                </Tbody>
              </Table>
            </TableContainer>

            <Stack direction="row" spacing={4}>
              <NextLink href="/blocks" passHref>
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
