import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Stack, Heading, Text, Link, Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { createColumnHelper } from "@tanstack/react-table";

import SearchBox from "components/SearchBox";
import DataTable from "components/DataTable";

import { useTransactions } from "hooks/transaction";

import { weiToEther } from "helpers/web3";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("hash", {
    cell: (props) => (
      <Text align="center">
        <NextLink href={`/tx/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Hash Transaksi",
  }),
  columnHelper.accessor("blockNumber", {
    cell: (props) => (
      <Text align="center">
        <NextLink href={`/blocks/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Blok",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("from", {
    cell: (props) => (
      <Text>
        <NextLink href={`/address/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Asal",
  }),
  columnHelper.accessor("to", {
    cell: (props) =>
      props.getValue() ? (
        <Text>
          <NextLink href={`/address/${props.getValue()}`} passHref>
            <Link color="blue.500">{props.getValue()}</Link>
          </NextLink>
        </Text>
      ) : (
        <>
          <Text as="strong">Kontrak </Text>
          <NextLink
            href={`/address/${props.row.original.contractAddress}`}
            passHref
          >
            <Link color="blue.500">{props.row.original.contractAddress}</Link>
          </NextLink>
        </>
      ),
    header: "Tujuan",
  }),
  columnHelper.accessor("value", {
    cell: (props) => (
      <Text>
        {weiToEther(props.getValue())} {process.env.NEXT_PUBLIC_TOKEN_CURRENCY}
      </Text>
    ),
    header: "Nilai",
  }),
];

export default function TransactionList() {
  const router = useRouter();

  const fields = [
    "hash",
    "blockNumber",
    "from",
    "to",
    "value",
    "contractAddress",
  ];
  const transactions = useTransactions(fields);

  if (transactions.error) {
    console.error(transactions.error);
    return <Text>Kesalahan mengambil data</Text>;
  }

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche - Kumpulan Transaksi</title>
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
        <Heading p={4}>Kumpulan Transaksi</Heading>

        <Stack direction="row" spacing={4} mb={4} mt="5">
          <NextLink href="/" passHref>
            <Button
              as="a"
              leftIcon={<ArrowBackIcon />}
              size="sm"
              bg="white"
              colorScheme="blue"
              variant="outline"
            >
              Kembali
            </Button>
          </NextLink>
        </Stack>

        <Stack direction="column" spacing={8}>
          <SearchBox />

          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="white"
            borderRadius="10px"
          >
            <DataTable
              columns={columns}
              data={transactions?.response?.data}
              paginate
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
