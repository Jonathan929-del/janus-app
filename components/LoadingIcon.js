// Imports
import {View} from 'react-native';
import {ActivityIndicator} from 'react-native';


// Main Function
const LoadingIcon = ({ isIconAnimating }) => <ActivityIndicator size="large" color="#0000ff" animating={isIconAnimating} />;


// Export
export default LoadingIcon;