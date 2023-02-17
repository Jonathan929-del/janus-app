// Imports
import {useFonts} from 'expo-font';
import Layer from './components/Layer';
import {ThemeProvider} from './src/theme/themeProvider';


// Main Function
const App = () => {


    // Font
    const [fontsLoaded] = useFonts({
      'OpenSans': require('./assets/fonts/OpenSans-SemiBold.ttf'),
    });


  return (
    <ThemeProvider>
      <Layer />
    </ThemeProvider>
  );
};


// Export
export default App;