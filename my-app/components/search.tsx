'use client'

import { useState } from "react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

interface SearchBarProps {
    input: string;
    setInput: (input: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    input,
    setInput
}) => {
    const [open, setOpen] = useState<boolean>(true);

    return (
        <div className="w-64 h-256 fixed bg-orange-200 shadow-lg transform transition-transform duration-200 ease-in-out rounded-lg ml-2 mt-2 z-10">
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
                <Button className="h-8 w-full bg-white text-black hover:bg-gray-300">
                    Search
                </Button>
                {open && (
                    <div className="flex flex-col flex-nowrap space-y-2 overflow-y-hidden">
                        <Link className="block py-2 px-3 rounded-md hover:bg-gray-100" href="#">
                        Result 1
                        </Link>
                        <Link className="block py-2 px-3 rounded-md hover:bg-gray-100" href="#">
                        Result 2
                        </Link>
                        <Link className="block py-2 px-3 rounded-md hover:bg-gray-100" href="#">
                        Result 3
                        </Link>
                        <Link className="block py-2 px-3 rounded-md hover:bg-gray-100" href="#">
                        Result 4
                        </Link>
                        <Link className="block py-2 px-3 rounded-md hover:bg-gray-100" href="#">
                        Result 5
                        </Link>
                    </div>
                )}
            </div>
      </div>
    )
};

export default SearchBar;