export async function apiPost(path: string, body: any) {
    const res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const text = await res.text();
    try { return { status: res.status, body: JSON.parse(text) }; } catch(e){ return { status: res.status, body: text }; }
}

export async function apiGet(path: string) {
    const res = await fetch(path, { credentials: 'same-origin' });
    const text = await res.text();
    try { return { status: res.status, body: JSON.parse(text) }; } catch(e){ return { status: res.status, body: text }; }
}
