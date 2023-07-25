import { useState } from "react";
import {
  Flex,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Select,
  Button,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import Loading from "components/Loading";

const Pagination = ({ table }) => {
  return (
    <Flex mt={4} justifyContent="space-between">
      <Flex alignItems="center">
        <Text>Tampilkan</Text>
        <Select
          mx={2}
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          size="sm"
          variant="outline"
        >
          {[10, 25, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </Select>
        <Text>Data</Text>
      </Flex>
      <ButtonGroup size="sm" variant="outline">
        <Button
          px={6}
          onClick={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          {"Awal"}
        </Button>

        <IconButton
          aria-label="Halaman sebelumnya"
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
          icon={<ChevronLeftIcon />}
        />

        <Flex alignItems="center">
          <Text>
            Halaman{" "}
            <Text as="strong">{table.getState().pagination.pageIndex + 1}</Text>
            {" dari "}
            <Text as="strong">
              {table.getPageCount() ? table.getPageCount() : 1}
            </Text>
          </Text>
        </Flex>

        <IconButton
          aria-label="Halaman berikutnya"
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
          icon={<ChevronRightIcon />}
        />

        <Button
          px={6}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
        >
          {"Akhir"}
        </Button>
      </ButtonGroup>
    </Flex>
  );
};

const DataTable = ({ columns, data, paginate }) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginate ? getPaginationRowModel() : null,
  });

  return (
    <>
      <TableContainer maxW="90vw">
        <Table size="lg" variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;

                  return (
                    <Th key={header.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </Th>
                  );
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {data ? (
              data.length ? (
                table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta;

                      return (
                        <Td key={cell.id} isNumeric={meta?.isNumeric}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center">
                    <Text>Data tidak ditemukan.</Text>
                  </Td>
                </Tr>
              )
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  <Loading text="Mengambil data..." />
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {paginate && data && <Pagination table={table} />}
    </>
  );
};

export default DataTable;
