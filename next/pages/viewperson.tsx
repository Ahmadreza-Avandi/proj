import React, { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';

interface Person {
  id: number;
  face: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  studentId: string;
}

const NewPersonTable: React.FC = () => {
  const [newPeople, setNewPeople] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Person[]>('/api/new-person');
        setNewPeople(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columnHelper = createColumnHelper<Person>();

  const columns = useMemo(() => [
    columnHelper.accessor('face', {
      header: 'چهره',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('firstName', {
      header: 'نام',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'نام خانوادگی',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('nationalCode', {
      header: 'کد ملی',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('studentId', {
      header: 'شماره دانش‌آموزی',
      cell: info => info.getValue(),
    }),
  ], []);

  const table = useReactTable({
    data: newPeople,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {newPeople.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body1" color="textSecondary">
                  داده‌ای موجود نیست
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default NewPersonTable;
