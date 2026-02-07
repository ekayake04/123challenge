import React, {useEffect, useState} from 'react';
import {apiGet, apiPost} from './api';

export default function Notes({user}:{user:{id:number,email:string}|null}){
    const [notes, setNotes] = useState<any[]>([]);
    const [q, setQ] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [msg, setMsg] = useState<string|null>(null);

    async function fetchNotes(){
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        if (category) params.set('category', category);
        const r = await apiGet('/api/notes?'+params.toString());
        if (r.status===200) setNotes(r.body || []);
    }

    useEffect(()=>{ fetchNotes(); }, []);

    async function createNote(e:any){
        e.preventDefault();
        if (!user) { setMsg('login required'); return; }
        const r = await apiPost('/api/notes', { title, content, category, status:'new', user_id: user.id });
        if (r.status===201) {
            setMsg('note created');
            setTitle(''); setContent('');
            fetchNotes();
        } else setMsg('error: '+JSON.stringify(r.body));
    }

    return (
        <div>
            <h2 style={{marginTop:0}}>Notes</h2>

            <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
                <input placeholder="search text" value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,padding:10,borderRadius:8,border:'1px solid #e6eefb'}} />
                <select value={status} onChange={e=>setStatus(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid #e6eefb'}}>
                    <option value="">Any status</option>
                    <option value="new">new</option>
                    <option value="todo">todo</option>
                    <option value="done">done</option>
                </select>
                <input placeholder="category" value={category} onChange={e=>setCategory(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid #e6eefb'}} />
                <button onClick={fetchNotes} style={{padding:'10px 12px',borderRadius:8,background:'#2b7cff',color:'#fff',border:'none'}}>Filter</button>
            </div>

            <form onSubmit={createNote} style={{marginBottom:12,background:'#fbfdff',padding:12,borderRadius:8,border:'1px solid rgba(36,50,64,0.04)'}}>
                <h3 style={{marginTop:0}}>Create note</h3>
                <div style={{marginBottom:8}}>
                    <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e6eefb'}} />
                </div>
                <div style={{marginBottom:8}}>
                    <textarea placeholder="content" value={content} onChange={e=>setContent(e.target.value)} style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e6eefb'}} />
                </div>
                <div style={{marginBottom:8}}>
                    <input placeholder="category" value={category} onChange={e=>setCategory(e.target.value)} style={{width:'50%',padding:10,borderRadius:8,border:'1px solid #e6eefb'}} />
                </div>
                <div style={{marginTop:8}}>
                    <button style={{padding:'10px 14px',borderRadius:8,background:'#2b7cff',color:'#fff',border:'none'}}>Create</button>
                </div>
            </form>

            {msg && <div style={{marginBottom:8}}>{msg}</div>}

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:12}}>
                {notes.map(n=> (
                    <div key={n.id} style={{padding:12,borderRadius:10,background:'#fff',boxShadow:'0 8px 20px rgba(36,50,64,0.04)',border:'1px solid rgba(36,50,64,0.03)'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
                            <strong style={{fontSize:16}}>{n.title}</strong>
                            <small style={{color:'#6b7b8a'}}>{n.created_at.split('T')[0]}</small>
                        </div>
                        <div style={{marginTop:8,color:'#334'}}>{n.content}</div>
                        <div style={{marginTop:10,fontSize:13,color:'#5b6b7a',display:'flex',justifyContent:'space-between'}}>
                            <span>Category: <strong>{n.category||'—'}</strong></span>
                            <span>Status: <strong>{n.status}</strong></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
