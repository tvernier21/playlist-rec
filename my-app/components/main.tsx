'use client'

import { useState } from "react"

import SearchBar from "@/components/search"
import GraphPage from "@/components/graph"
import { SpotifyTrack } from "@/lib/types/spotify"

const MainPage: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [songs, setSongs] = useState<string[]>([]);

    return (
        <section className="w-full h-screen flex overflow-hidden relative">
            <GraphPage />
            <SearchBar 
                input={input}
                setInput={setInput}
            />
        </section>
    )
};  

export default MainPage;