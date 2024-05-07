import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom'; // Assuming you're using react-router-dom
import {AbilityContext} from '~/lib/helpers/Can';

export function useConditionalRender(permission: string) {
    const navigate = useNavigate();
    const [shouldRender, setShouldRender] = useState(false);
  
    const ability = useContext(AbilityContext);
    const authPermission = ability.can('view', permission);
  
    useEffect(() => {
      // Allow rendering only if the condition is met
      if (authPermission) {
        setShouldRender(true);
      } else {
        // Set timeout only if authPermission is not true
        const timeout = setTimeout(() => {
          navigate(-1); // Or any other action you want to take when permission is not granted
        }, 100);
  
        // Cleanup function to clear the timeout if component unmounts or authPermission changes
        return () => clearTimeout(timeout);
      }
    }, [authPermission]);
  
    return shouldRender;
}