import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { Contract, getContracts } from '@/services/contractService';
import { ProductList as Product, getProductList } from '@/services/productService';
import { Claim, getClaims } from '@/services/claimService';
import { useAuth } from './AuthContext';

interface MerchantContextType {
    contracts: Contract[];
    products: Product[];
    claims: Claim[];
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const MerchantContext = createContext<MerchantContextType | undefined>(
    undefined
);

interface MerchantProviderProps {
    children: ReactNode;
}

export const MerchantProvider: React.FC<MerchantProviderProps> = ({
    children,
}) => {
    const { isAuthenticated, user } = useAuth();

    // single loading/error
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // data states
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);


    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const contractsPromise = getContracts();
            const productsPromise = getProductList();

            let claimsPromise: Promise<Claim[]> = Promise.resolve([]);
            if (user?.id) {
                claimsPromise = getClaims(user.id);
            } else {
                console.warn('No user.id available; skipping claims fetch');
            }

            const [contractsData, productsData, claimsData] = await Promise.all([
                contractsPromise,
                productsPromise,
                claimsPromise,
            ]);

            setContracts(contractsData);
            setProducts(productsData);
            setClaims(claimsData);
        } catch (err: any) {
            console.error('MerchantContext fetch error:', err);
            setError(err.message || 'Unknown error fetching merchant data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        } else {
            setContracts([]);
            setProducts([]);
            setClaims([]);
        }
    }, [isAuthenticated]);

    return (
        <MerchantContext.Provider
            value={{ contracts, products, claims, isLoading, error, refreshData: fetchData }}
        >
            {children}
        </MerchantContext.Provider>
    );
};

export const useMerchantContext = (): MerchantContextType => {
    const context = useContext(MerchantContext);
    if (!context) {
        throw new Error(
            'useMerchantContext must be used within a MerchantProvider'
        );
    }
    return context;
};
