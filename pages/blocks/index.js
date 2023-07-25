import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Heading, Button, Text, Link, Stack } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { createColumnHelper } from "@tanstack/react-table";

import SearchBox from "components/SearchBox";
import DataTable from "components/DataTable";

import { useBlocks } from "hooks/block";

import { weiToEther } from "helpers/web3";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("number", {
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
  columnHelper.accessor("timestamp", {
    cell: (props) => <Text align="center">{props.getValue()}</Text>,
    header: "Umur / Waktu",
  }),
  columnHelper.accessor("transactionsCount", {
    cell: (props) => <Text align="center">{props.getValue()}</Text>,
    header: "Jumlah Transaksi",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("hash", {
    cell: (props) => (
      <Text>
        <NextLink href={`/blocks/${props.getValue()}`} passHref>
          <Link color="blue.500">{props.getValue()}</Link>
        </NextLink>
      </Text>
    ),
    header: "Hash",
  }),
  columnHelper.accessor("gasUsed", {
    cell: (props) => (
      <Text>
        {weiToEther(props.getValue())} {process.env.NEXT_PUBLIC_TOKEN_CURRENCY}
      </Text>
    ),
    header: "Gas Terpakai",
    meta: {
      isNumeric: true,
    },
  }),
  columnHelper.accessor("gasLimit", {
    cell: (props) => (
      <Text>
        {weiToEther(props.getValue())} {process.env.NEXT_PUBLIC_TOKEN_CURRENCY}
      </Text>
    ),
    header: "Batasan Gas",
    meta: {
      isNumeric: true,
    },
  }),
];

export default function BlockList() {
  const router = useRouter();

  const fields = ["number", "timestamp", "hash", "gasUsed", "gasLimit"];
  const blocks = useBlocks(fields);

  if (blocks.error) {
    console.error(blocks.error);
    return <Text>Kesalahan mengambil data</Text>;
  }

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche - Kumpulan Blok</title>
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
        <Heading p={4}>Kumpulan Blok</Heading>

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
              data={blocks?.response?.data}
              paginate
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
