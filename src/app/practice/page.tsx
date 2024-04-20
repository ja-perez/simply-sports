import TopBarNav from "@/components/top-bar-nav";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SideNav from "@/components/side-nav";

export default function Practice() {
    return (
        <Container 
            id="learn-container"
        >
                    {/* Main Body */}
                        <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                            <p>Page Content</p>
                        </Box>
        </Container>
    );
}