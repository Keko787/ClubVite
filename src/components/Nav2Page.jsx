import { useNavigate } from 'react-router-dom';

const useNavigateToPage = (route) => {
  const navigate = useNavigate();
  return () => {
    navigate(route, { replace: true });
  };
}

export default useNavigateToPage;