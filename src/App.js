import SearchPage from "./searchPage";
import styles from "./app.module.css";
function App() {
  return (
    <div className="main">
      <h1 className={`display-2 ${styles.other}`}>Search Pagination</h1>
      <SearchPage />
    </div>
  );
}

export default App;
