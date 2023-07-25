import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import {
  Box,
  Table,
  Thead,
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
  Input,
  Flex,
} from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

import SearchBox from "components/SearchBox";
import DataTable from "components/DataTable";

import styles from "styles/Home.module.css";

const columnHelper = createColumnHelper();

const transactionColumns = [
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
  columnHelper.accessor("", {
    cell: (props) => (
      <Flex direction="column">
        <Box>
          <Text as="strong">Asal </Text>
          <NextLink href={`/address/${props.row.original.from}`} passHref>
            <Link color="blue.500">{props.row.original.from}</Link>
          </NextLink>
        </Box>

        {props.row.original.to ? (
          <Box>
            <Text as="strong">Tujuan </Text>
            <NextLink href={`/address/${props.row.original.to}`} passHref>
              <Link color="blue.500">{props.row.original.to}</Link>
            </NextLink>
          </Box>
        ) : (
          <Box>
            <Text as="strong">Kontrak Tujuan </Text>
            <NextLink
              href={`/address/${props.row.original.contractAddress}`}
              passHref
            >
              <Link color="blue.500">{props.row.original.contractAddress}</Link>
            </NextLink>
          </Box>
        )}
      </Flex>
    ),
    header: "Alamat",
  }),
];

const blockColumns = [
  columnHelper.accessor("number", {
    cell: (props) => (
      <Text>
        <NextLink href={`/blocks/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Nomor Blok",
  }),
  columnHelper.accessor("hash", {
    cell: (props) => (
      <Text>
        <NextLink href={`/blocks/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Hash Blok",
  }),
];

export async function getServerSideProps() {
  try {
    const blockAmount = 5;
    const blockFields = ["number", "hash"];
    const transactionAmount = 5;
    const transactionFields = ["hash", "from", "to", "contractAddress"];

    const {
      data: { data: blocks },
    } = await axios.get(
      `http://103.31.38.93/api/explorer/blocks?amount=${blockAmount}&fields=${blockFields.join(",")}`
    );
    const {
      data: { data: transactions },
    } = await axios.get(
      `http://103.31.38.93/api/explorer/transactions?amount=${transactionAmount}&fields[transactions]=${transactionFields.join(
        ","
      )}`
    );

    return { props: { blocks, transactions } };
  } catch (error) {
    console.error(error);
  }

  return { props: {} };
}

export default function Home({ blocks, transactions }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche</title>
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
        <Heading p={4}>Penjelajah Private Avalanche</Heading>

        <Stack direction="column" spacing={8} mt="10">
          <SearchBox />
          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="white"
            borderRadius="10px"
          >
            <Heading size="sm" mb="5">
              Blok Terakhir
            </Heading>

            <DataTable columns={blockColumns} data={blocks} />

            <NextLink href="/blocks" passHref>
              <Button
                as="a"
                size="sm"
                w="100%"
                colorScheme="blue"
                variant="outline"
              >
                Lihat semua blok
              </Button>
            </NextLink>
          </Box>

          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            bg="white"
            borderRadius="10px"
          >
            <Heading size="sm" mb="5">
              Transaksi Terakhir
            </Heading>

            <DataTable columns={transactionColumns} data={transactions} />

            <NextLink href="/tx" passHref>
              <Button
                as="a"
                size="sm"
                w="100%"
                colorScheme="blue"
                variant="outline"
              >
                Lihat semua transaksi
              </Button>
            </NextLink>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
