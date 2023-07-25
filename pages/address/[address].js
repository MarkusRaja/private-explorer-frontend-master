import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Box, Stack, Heading, Text, Link, VStack } from "@chakra-ui/react";
import { createColumnHelper } from "@tanstack/react-table";

import Loading from "components/Loading";
import SearchBox from "components/SearchBox";
import DataTable from "components/DataTable";

import { useAddressDetails, useAddressTransactions } from "hooks/address";

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
        <p>
          <Text as="strong">Kontrak </Text>
          <NextLink
            href={`/address/${props.row.original.contractAddress}`}
            passHref
          >
            <Link color="blue.500">{props.row.original.contractAddress}</Link>
          </NextLink>
        </p>
      ),
    header: "Tujuan",
  }),
  columnHelper.accessor("value", {
    cell: (props) => <Text>{weiToEther(props.getValue())} AVAX</Text>,
    header: "Nilai",
  }),
];

export default function AddressDetails() {
  const router = useRouter();
  const { address } = router.query;

  const addressDetails = useAddressDetails(address);
  const addressTransactions = useAddressTransactions(address);

  if (addressDetails.error || addressTransactions.error) {
    console.error(addressDetails?.error ?? addressTransactions?.error);
    return <Text>Kesalahan mengambil data</Text>;
  }

  return (
    <>
      <Head>
        <title>Penjelajah Private Avalanche - Detil Alamat</title>
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
        <Heading p={4}>Detil Alamat</Heading>

        <Heading size="lg" p={4}>
          RANGKUMAN
        </Heading>

        <VStack mb={8}>
          <Box
            p={5}
            shadow="md"
            borderWidth="1px"
            flex="1"
            flexDirection="row"
            bg="white"
            borderRadius="10px"
          >
            {addressDetails.isLoading ? (
              <Loading text="Mengambil data..." />
            ) : (
              <>
                <Heading size="sm">Alamat:</Heading>
                <Text>{addressDetails.response.data.address}</Text>

                <Heading size="sm">Saldo:</Heading>
                <Text>
                  {weiToEther(addressDetails.response.data.balance, "ether")}{" "}
                  AVAX
                </Text>
              </>
            )}
          </Box>
        </VStack>

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
              data={addressTransactions?.response?.data}
              paginate
            />
          </Box>
        </Stack>
      </Box>
    </>
  );
}
