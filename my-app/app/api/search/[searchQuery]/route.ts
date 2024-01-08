import { NextResponse } from 'next/server';

interface contextType {
    params: {
        searchQuery: string;
    }
}

export async function GET(request: Request, context: contextType) {
    // http://127.0.0.1:8000
    const { searchQuery } = context.params;
    const res = await fetch(`http://127.0.0.1:8000/playlists/${searchQuery}`);
    if (!res.ok) {
        return NextResponse.error();
    }
    const data = await res.json();
    return NextResponse.json(data); 
}