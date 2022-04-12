/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
} from '@mui/material';
import React from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import WS_STATE from '../../redux/reducers/graph/ws/enums/WS_STATE';

interface IMessage {
    name: string;
    fields: {
        [fieldName: string]: {
            type: string;
            content: any;
        };
    };
}

/**
 * A component that manages the settings of an edge.
 * All components related to edge settings should be children of this component.
 *
 * @returns {JSX.Element}
 */
const Edge: React.FC = (): JSX.Element => {
    const { selectedEdge } = useSelector((state: RootState) => state.config);
    const { connection, graph: realtimeGraph } = useSelector(
        (state: RootState) => state.ws
    );
    const { mockGraph } = useSelector((state: RootState) => state.mock);

    const graph = connection === WS_STATE.CONNECTED ? realtimeGraph : mockGraph;

    const messages: IMessage[] =
        graph && selectedEdge.target
            ? graph['nodes'][selectedEdge.target]['upstreams'][
                  selectedEdge.source
              ]
            : [];

    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen(!open);
    };
    return (
        <React.Fragment>
            <Box data-testid="edge-settings">
                {messages.map((message: IMessage, index) => {
                    return (
                        <TableContainer key={index} component={Paper}>
                            <Table
                                sx={{ width: '100%' }}
                                aria-label="simple table"
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{message.name}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* ZMQMessage Edge */}
                                    {Object.entries(message['fields']).map(
                                        (field, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {field[0]}
                                                    </TableCell>
                                                    <TableCell>
                                                        {field[1].type}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        }
                                    )}
                                    <Button onClick={handleToggle}>
                                        {open ? 'Show less' : 'Show more'}
                                    </Button>

                                    {Object.entries(message['fields']).map(
                                        (field, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    {open && (
                                                        <TableCell>
                                                            {field[0]}
                                                        </TableCell>
                                                    )}

                                                    {!open ? null : connection ===
                                                      WS_STATE.CONNECTED ? (
                                                        <TableCell
                                                            style={{
                                                                whiteSpace:
                                                                    'normal',
                                                                wordBreak:
                                                                    'break-word',
                                                            }}
                                                        >
                                                            {field[1].content}
                                                        </TableCell>
                                                    ) : (
                                                        <TableCell
                                                            style={{
                                                                whiteSpace:
                                                                    'normal',
                                                                wordBreak:
                                                                    'break-word',
                                                            }}
                                                        >
                                                            Hello
                                                            {/* {mockData.join(' ')} */}
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            );
                                        }
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    );
                })}

                {!messages.length && (
                    <Typography style={{ fontSize: '.8rem', fontWeight: 400 }}>
                        Click on an edge to see the message information
                    </Typography>
                )}
            </Box>
        </React.Fragment>
    );
};

export default Edge;
