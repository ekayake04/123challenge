import React, {useState} from "react";
import styled, {createGlobalStyle} from "styled-components";
import { Register, Login, Notes } from '../../components';

const Global = createGlobalStyle`
  body { background: #f4f7fb; font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#243240; }
  input, textarea, button, select { font-family: inherit; }
`;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
`

const Card = styled.div`
  width: 100%;
  max-width: 980px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(36,50,64,0.08);
  border: 1px solid rgba(36,50,64,0.04);
`

const Nav = styled.div`
  display:flex;
  gap:8px;
  margin-bottom:18px;
  align-items:center;
`

const Button = styled.button`
  padding:8px 14px;
  border-radius:8px;
  border: none;
  background: #2b7cff;
  color: white;
  cursor:pointer;
  box-shadow: 0 6px 18px rgba(43,124,255,0.16);
  font-weight:600;
  transition:transform .12s ease, box-shadow .12s ease;
  &:hover{ transform:translateY(-2px); }
  &:disabled{ opacity:.6; cursor:not-allowed }
`

const Secondary = styled(Button)`
  background: transparent; color:#2b7cff; box-shadow:none; border:1px solid rgba(43,124,255,0.14); font-weight:500;
`

const IndexPage: React.FC = () => {
    const [view, setView] = useState<'register'|'login'|'notes'>('register');
    const [user, setUser] = useState<{id:number,email:string}|null>(() => {
        try { return JSON.parse(localStorage.getItem('vtc_user')||'null'); } catch(e){return null}
    });

    function handleLogin(u:{id:number,email:string}){
        setUser(u);
        localStorage.setItem('vtc_user', JSON.stringify(u));
        setView('notes');
    }

    function handleLogout(){
        setUser(null);
        localStorage.removeItem('vtc_user');
        setView('login');
    }

    return (
        <Wrapper>
            <Card>
                <Nav>
                    <Button onClick={()=>setView('register')}>Register</Button>
                    <Button onClick={()=>setView('login')}>Login</Button>
                    <Button onClick={()=>setView('notes')}>Notes</Button>
                    {user && <Button onClick={handleLogout}>Logout {user.email}</Button>}
                </Nav>

                {view==='register' && <Register />}
                {view==='login' && <Login onLogin={handleLogin} />}
                {view==='notes' && <Notes user={user} />}
            </Card>
        </Wrapper>
    )
}

export {IndexPage};

export default IndexPage;
