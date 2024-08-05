import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export default function Tutorial() {
    return (
        <>
            <Container 
                id="introduction-container"
            >
                {/* Main Body */}
                <Box sx={{ textAlign: 'center' }} border="dashed 1px">
                    <p>Page Content</p>
                </Box>
            </Container>
        </>
    )
}