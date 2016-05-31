import React from 'react';
import { Grid, Cell } from 'radium-grid';
import Radium from 'radium';

class Test extends React.Component {
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Grid
            xlargeCellWidth="1/4"
            largeCellWidth="1/4"
            mediumCellWidth="1/3"
            smallCellWidth="1"
            cellHorizontalAlign="middle">
                <Cell>
                    <p>Lorem</p>
                </Cell>
                <Cell>
                    <p>ipsum</p>
                </Cell>
                <Cell>
                    <p>dolor</p>
                </Cell>
                <Cell>
                    <p>sit</p>
                </Cell>
            </Grid>
        );
    }
}

export default  Radium(Test);
