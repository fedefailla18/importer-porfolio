import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { uploadTransactions, fetchAllPortfolios, createPortfolio } from "../../redux/slices/portfolioSlice";


const usePortfolioComponent = () => {
  const dispatch = useAppDispatch();
  
  const handleSubmitPortfolioActions = async (portfolioName: string, file?: File) => {
    try {
      if (file) {
        await dispatch(uploadTransactions({ 
          file, 
          portfolioName 
        })).unwrap();
        toast.success("Transactions uploaded successfully!");
      } else {
        await dispatch(createPortfolio(portfolioName)).unwrap();
        toast.success("Portfolio created successfully!");
      }
      dispatch(fetchAllPortfolios());
    } catch (error: any) {
      toast.error(error.message || "Failed to create portfolio");
      throw error;
    }
  };

  return {
    handleSubmitPortfolioActions,
  };
};

export default usePortfolioComponent;