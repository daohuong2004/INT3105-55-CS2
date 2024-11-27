import './App.css';
import { Container, InputLabel, Stack } from '@mui/material';
import { DEV_ENDPOINT } from './endpoints';


function App() {
  return (
    <div className="App">
      <Container 
      maxWidth="lg" 
      sx={{
        backgroundColor: 'FBFBFB', 
        padding: 5,
        height: '100vh',
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        }}>
          <Stack 
          sx={{
            backgroundColor: 'FBFBFB',
            boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
            width: '80%',
            height: '50%',
            alignSelf: 'center',
            justifySelf: 'center',
            alignItems: 'center'
          }}
          >
            <form 
            action={DEV_ENDPOINT}
            enctype="multipart/form-data" method="POST"
            >
              <Stack direction={'row'}>
                <InputLabel
                  sx={{
                    padding: 2,
                    fontSize: 25,
                    marginTop: 10
                  }}
                  >
                    Select files:
                  </InputLabel>

                  <input 
                  className='input-btn'
                  style={{
                    fontSize: 22,
                    padding: 2,
                    marginTop: 85
                  }} 
                  type="file" name="files" 
                  multiple></input>
              </Stack>

              <input
              className='submit-btn'
              style={{
                fontSize: 22,
                padding: 2,
                marginTop: '10%'
              }} 
              type="submit" 
              value="Upload"/>
            </form>
          </Stack>
      </Container>
    </div>
  );
}

export default App;
