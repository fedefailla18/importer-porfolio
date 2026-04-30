import { toast } from 'react-toastify';

import { useAppDispatch } from '../../redux/hooks';
import {
  uploadTransactions,
  fetchAllPortfolios,
  createPortfolio,
} from '../../redux/slices/portfolioSlice';
import { ExchangeName } from '../../redux/types/types';

const usePortfolioComponent = () => {
  const dispatch = useAppDispatch();

  const handleSubmitPortfolioActions = async (
    portfolioName: string,
    file?: File,
    exchangeName?: ExchangeName
  ) => {
    try {
      if (file) {
        await dispatch(
          uploadTransactions({
            file,
            portfolioName,
          })
        ).unwrap();
        toast.success('Transactions uploaded successfully!');
      } else {
        await dispatch(createPortfolio({ portfolioName, exchangeName })).unwrap();
        toast.success('Portfolio created successfully!');
      }
      dispatch(fetchAllPortfolios());
    } catch (error: any) {
      toast.error(error.message || 'Failed to create portfolio');
      throw error;
    }
  };

  return {
    handleSubmitPortfolioActions,
  };
};

export default usePortfolioComponent;
