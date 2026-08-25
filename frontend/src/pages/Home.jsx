import Header from "../components/Header"
import Main from "../components/Main"
import { useState } from "react"

export default function Home(){
    const [query, setQuery] = useState({
            "name": "",
            "minPrice":"",
            "maxPrice": ""
    })
    const [products,setProducts]=useState([])
    return(
        <>
        <Header query={query} setQuery={setQuery} setProducts={setProducts}/>
        <Main query={query} products={products} setProducts={setProducts} setQuery={setQuery}/>
        </>
    )
}