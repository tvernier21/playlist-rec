'use client'

import SearchBar from "@/components/search"
import GraphPage from "@/components/graph"

const MainPage: React.FC = () => {
    return (
        <section className="w-full h-screen flex overflow-hidden relative">
            <GraphPage />
            <SearchBar />
        </section>
    )
};  

export default MainPage;