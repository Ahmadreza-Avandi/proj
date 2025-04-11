import { useEffect, useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from '@tanstack/react-table';

interface ImageData {
  nationalCode: string;
  faceImage: string;
  firstName: string;
  lastName: string;
}

const DisplayImages = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // دریافت داده‌ها از API Flask
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('http://localhost:5000/get_all_images'); // آدرس API Flask
        const data: ImageData[] = await res.json(); // تایپ داده‌ها
        setImages(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images:', error);
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // استفاده از useMemo برای جلوگیری از تغییرات غیرمنتظره
  const columnHelper = createColumnHelper<ImageData>();

  const columns = useMemo(() => [
    columnHelper.accessor('nationalCode', {
      header: 'کد ملی',
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
    columnHelper.accessor('faceImage', {
      header: 'عکس',
      cell: info => (
        <img
          src={`data:image/jpeg;base64,${info.getValue()}`}
          alt={`Face for ${info.row.original.nationalCode}`}
          style={{ width: '100px', height: '100px', borderRadius: '8px' }}
        />
      ),
    }),
  ], []);

  const table = useReactTable({
    data: images,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <TableContainer component={Paper} style={{ maxWidth: '100%', margin: '0' }}> {/* فاصله از بالا حذف شد */}
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
          {images.length > 0 ? (
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
              <TableCell colSpan={4} align="center">
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

export default DisplayImages;
