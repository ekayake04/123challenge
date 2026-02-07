import React, {useState} from 'react';
import {apiPost} from './api';

export default function Register(){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [msg,setMsg]=useState<string|null>(null);

    async function submit(e:any){
        e.preventDefault();
        setMsg('registering...');
        const r = await apiPost('/api/register', { email, password });
        if (r.status===201) setMsg('Registration successful — check var/emails for confirmation link');
        else setMsg('Error: ' + JSON.stringify(r.body));
    }

    return (
        <div>
            <h2 style={{marginTop:0}}>Create account</h2>
            <form onSubmit={submit}>
                <div style={{marginBottom:8}}>
                    <label style={{display:'block',fontSize:13,color:'#556'}} >Email</label>
                    <input style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e6eefb'}} value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                <div style={{marginBottom:8}}>
                    <label style={{display:'block',fontSize:13,color:'#556'}}>Password</label>
                    <input style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #e6eefb'}} type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                </div>
                <div style={{marginTop:8}}>
                    <button style={{padding:'10px 14px',borderRadius:8,background:'#2b7cff',color:'#fff',border:'none'}}>Register</button>
                </div>
            </form>
            {msg && <div style={{marginTop:12,color:'#334'}}>{msg}</div>}
        </div>
    )
}
