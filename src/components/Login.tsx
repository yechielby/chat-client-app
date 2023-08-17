import { FC, useState } from 'react';

export interface ILoginProps {
    handleOnClickLogin: (name: string) => void
}

const LoginComponent: FC<ILoginProps> = (props) => {
    const [nickname, setNicename] = useState('');

    return (
        <div className="login">
            <input type="text" id="nickname" name="nickname" placeholder="nickname"
             onChange={(e) => { setNicename(e.target.value); }} style={{padding:'5px'}}/>
            <button disabled={!nickname.length} onClick={() => { props.handleOnClickLogin(nickname); }} style={{padding:'5px'}}>Login</button>
        </div>
    );
}

export default LoginComponent;