'use client'

import { useState } from "react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { MdPlayDisabled } from "react-icons/md";
import { trackData } from "@/lib/types/spotify"

interface SearchBarProps {
    input: string;
    setInput: (input: string) => void;
    setOnSearch: (onSearch: boolean) => void;
    setSelectedTrack: (id: string | null) => void;
    loading: boolean;
    tracks: trackData[];
}

const SearchBar: React.FC<SearchBarProps> = ({
    input,
    setInput,
    setOnSearch,
    setSelectedTrack,
    loading,
    tracks,
}) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <div 
            className="w-80 max-h-96 overflow-y-scroll fixed bg-orange-200 shadow-lg transform transition-transform duration-200 ease-in-out rounded-lg ml-2 mt-2 z-10"
        >
            <div className="flex flex-col p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <Button 
                        className="w-10 h-10 bg-white text-black text-lg rounded-md hover:bg-gray-300 transition-colors duration-200 ease-in-out mr-3"
                        onClick={() => setOpen(!open)}
                    >    
                        {open ? <IoIosArrowDown /> : <IoIosArrowUp />}
                    </Button>
                    <Input 
                        className="" 
                        placeholder="Search..." 
                        type="search"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <Button
                    className="h-8 w-full bg-white text-black hover:bg-gray-300"
                    onClick={() => setOnSearch(true)}
                    disabled={loading}
                >
                    Search
                </Button>
                {open && (
                    <div className="flex flex-col flex-nowrap space-y-2">
                        {loading && <p>Loading...</p>}
                        {tracks && tracks.map((item) => {
                            return(
                                <div 
                                    className="flex bg-white items-center space-x-4 rounded-md border p-4 hover:bg-orange-100"
                                    onClick={() => setSelectedTrack(item.id)}
                                    key={item.id}
                                >
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.artist}
                                        </p>
                                    </div>
                                    <Button
                                        className="bg-white text-black hover:bg-gray-300"
                                        asChild
                                    >
                                        {item.preview_url ? (
                                            <Link href={item.preview_url} target="_blank">
                                                <FaPlay />
                                            </Link>
                                        ) : (
                                            <MdPlayDisabled />
                                        )}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
      </div>
    )
};

export default SearchBar;