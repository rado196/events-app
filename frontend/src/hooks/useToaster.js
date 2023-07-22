import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

function useToaster() {
  const toast = useToast();

  const alertMessage = useCallback((params, status) => {
    return toast({
      duration: typeof params === 'string' ? 3000 : params.duration || 3000,
      title: typeof params === 'string' ? '' : params.title,
      description: typeof params === 'string' ? params : params.message,
      status: status,
    });
  }, []);

  const info = useCallback((params) => {
    return alertMessage(params, 'info');
  }, []);

  const success = useCallback((params) => {
    return alertMessage(params, 'success');
  }, []);

  const warning = useCallback((params) => {
    return alertMessage(params, 'warning');
  }, []);

  const error = useCallback((params) => {
    return alertMessage(params, 'error');
  }, []);

  return {
    info,
    success,
    warning,
    error,
  };
}

export default useToaster;
