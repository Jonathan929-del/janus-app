// Imports
import {useColorScheme} from 'react-native';
import {lightTheme, darkTheme} from './themes';
import {createContext, useEffect, useState, useContext} from 'react';


// Theme context
export const ThemeContext = createContext({
    dark:false,
    theme:lightTheme,
    setScheme:() => {}
});


// Theme provider
export const ThemeProvider = props => {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme == 'dark');
    const defaultTheme = {
        dark:isDarkMode,
        theme:isDarkMode ? darkTheme : lightTheme,
        setScheme:scheme => setIsDarkMode(scheme == 'dark')
    };
    useEffect(() => {
        setIsDarkMode(colorScheme == 'dark');
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={defaultTheme}>
            {props.children}
        </ThemeContext.Provider>
    );
};


// Custom hook
export const useTheme = () => useContext(ThemeContext);