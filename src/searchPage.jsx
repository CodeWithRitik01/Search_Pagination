import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import styles from "./searchPage.module.css";

function SearchPage (){
    const [ inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [ error, setIsError ] = useState(null);
    const [results, setResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [cachedData, setCachedData] = useState({});
    const dataPerPage = 5;

    const handleSearch = useCallback(debounce(async (searchQuery) =>{
        if(searchQuery.length < 3) return;

        if(cachedData[searchQuery]){
            setResults(cachedData[searchQuery]);
            setIsLoading(false);
            return;
        }

        try{
            setIsLoading(true);
            setIsError(null);

        const res = await new Promise((resolve) =>
           setTimeout(() => resolve({data: Array.from({length: 20}, (da, i) => 
            `Result ${i+1}  ${searchQuery}`
        )}), 1000)
        )

        setCachedData((prev) => ({ ...prev, [searchQuery]: res.data}));
        setResults(res.data);
        setIsLoading(false);
        }catch(err){
            setIsError("Error Occured"); 
            setIsLoading(false);
        }
    }, 500), [cachedData])

    useEffect(() => {
        handleSearch(inputValue);
    }, [inputValue, handleSearch]);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setCurrentPage(1);
    }

    const handleLoad = () =>{
        setIsLoading(true);
        setCurrentPage((prev) => prev + 1)
        setIsLoading(false);
    }

    const showLess = () =>{
        setCurrentPage((prev) => prev - 1)

    }

    const displayResult = results.slice(0, currentPage*dataPerPage);
    return (
        <div className={styles.formOut}>
            <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Search ...  "/>
            {isLoading &&
            <div className={styles.adjustLoading}>
                <div className="spinner-border bg-light" role="status">
                </div>
                <span className={styles.loading}>Loading...</span>
            </div>}
            {error && <p>{error}</p>}
            <ul>
                {displayResult.map((result, key) => (
                    <li className={styles.card} key={key}><h4>{result}</h4></li>
                ))}
            </ul>
            {displayResult.length < results.length && (
                <button className={styles.loadButton} onClick={handleLoad}>Load More</button>
                
            )}

            {displayResult.length > 5 && (
                <button className={styles.showLessButton} onClick={showLess}>Show less</button>
                
            )}
        </div>
    )
}

export default SearchPage;