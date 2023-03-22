import React from 'react';
import {DataGrid} from "@mui/x-data-grid";
import {Box, Button, Modal} from "@mui/material";
import {getDate} from "../utils/getDate";


const columns = (setData) => [
    {
        field: 'movie',
        headerName: 'Movie',
        sortable: false,
        valueGetter: (params =>params.row.movie.Title),
        minWidth: 150,
        flex: 2,
    },
    {
        field: 'date',
        headerName: 'Date',
        sortable: false,
        valueGetter: (params =>`${new Date(params.row.date).toLocaleDateString()}  ${params.row.time}`),
        minWidth: 150,
        flex: 0.5,
    },
    {
        field: 'theater',
        headerName: 'Movie theater',
        sortable: false,
        valueGetter: (params =>params.row.movieTheater.name),
        minWidth: 150,
        flex: 1,
    },
    {
        field: 'seats',
        headerName: 'Seating Positions',
        sortable: false,
        valueGetter: (params =>params.row.seats.map(s=> `(${String.fromCharCode(65 + s.row)}${s.column + 1})`).join(', ')),
        minWidth: 150,
        flex: 1,
    },
    {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        renderCell: (params) => (
            <strong>
                <Button
                    variant="contained"
                    size="small"
                    style={{ marginLeft: 16 }}
                    disabled={new Date(params.row.date) < getDate(new Date())}
                    onClick={() => setData(params.row)}
                >
                    Print
                </Button>
            </strong>
        ),
        width: 150,
    },

];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20vw',
    height: '20vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

const MyTickets = ({tickets}) => {
    const [open, setOpen] = React.useState({});
    return (
        <div>
            <Box sx={{ width: '90%', margin: '0 auto' }}>
                <DataGrid
                    getRowId={(row) => row._id}
                    rows={tickets}
                    columns={columns(setOpen)}
                    autoHeight
                    disableRowSelectionOnClick
                />
            </Box>
            <Modal
                open={Object.keys(open).length !== 0}
                onClose={() => setOpen({})}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {JSON.stringify(open)}
                </Box>
            </Modal>
        </div>
    );
};

export default MyTickets;