'use client'

import { useState } from "react"

import SearchBar from "@/components/search"
import GraphPage from "@/components/graph"
import { tracksDataMap } from "@/lib/types/spotify"

const MainPage: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [tracks, setTracks] = useState<tracksDataMap>();

    const [loading, setLoading] = useState<boolean>(false);

    const onSearch = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/search/${input}`);
            if (res) {
                const data = await res.json();
                setTracks(data.track_data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full h-screen flex overflow-hidden relative">
            <GraphPage />
            <SearchBar 
                input={input}
                setInput={setInput}
                onSearchFn={onSearch}
                loading={loading}
                tracks={tracks}
            />
        </section>
    )
};  

export default MainPage;