import { FC } from "react";
import { useLocation } from 'react-router-dom';
import React, { useState} from 'react';
import axios from 'axios';



export const PasswordReset: FC = (props) => {

    //パスワードリセットURLのGETクエリーパラメータよりトークンとメールアドレスを抽出し変数に保存
    const queryParameters = new URLSearchParams(window.location.search)
    const email:string | null = queryParameters.get("email");
    const token:string | null = queryParameters.get("token");

    interface Reset {
        email : any;
        token : string | null;
        password : string;
        password_confirmation : string;
    }

    const [resetPass, setResetPass] = useState<Reset>({
        email : email,
        token : token,
        password : '',
        password_confirmation : '',
    });

    interface Response{
        error_email : string;
        error_password : string;
        error_password_confirmation : string|any;
    }

    const [responseData, setResponse] = useState<Response>({
        error_email : '',
        error_password : '',
        error_password_confirmation : ''
    });


    const handleInput = (e:React.ChangeEvent<HTMLInputElement>) => {

        //イベントハンドラが実行された後にオブジェクトのプロパティにアクセスする必要がある場合は、e.persist() を呼ぶ必要がある
        e.persist();

        setResetPass({...resetPass, [e.target.name]: e.target.value });
    }

    const ResetSubmit = (e:any) => {

        //フォームデータ送信時に画面を再更新しないようにする処理
        e.preventDefault();

        //イベントハンドラが実行された後にオブジェクトのプロパティにアクセスする必要がある場合は、e.persist() を呼ぶ必要がある
        e.persist();

        const params = {
            email : resetPass.email,
            password : resetPass.password,
            password_confirmation : resetPass.password_confirmation,
            token : resetPass.token,
        }

        axios.post('/api/password/reset', params).then(function (response) {
            // 送信成功時の処理
            alert('パスワードが変更されました');
            window.location.href = '/login';
            
        })
        .catch(function (error) {
            // 送信失敗時の処理
            alert('パスワード変更に失敗しました');

            setResponse({
                error_email : error.response.data.errors.email,
                error_password : error.response.data.errors.password,
                error_password_confirmation : error.response.data.errors.password,
            });


        });

    }

    return(
        <div className="w-96 ml-auto mr-auto">

            <h1 className="w-full border-b-2 text-center text-2xl mt-10 mb-10 font-bold">パスワード再設定</h1>

            <form onSubmit={ResetSubmit}>

                <div>
                    <p>メールアドレス</p>
                    <p>{responseData.error_email}</p>
                    <input type="email" name="email" value={resetPass.email}  
                        onChange={handleInput} 
                        className="block w-full h-10 border border-gray-600 rounded pl-2"
                    />
                </div>

                <div>
                    <p>新パスワード</p>
                    <p>{responseData.error_password}</p>
                    <input type="password" name="password" value={resetPass.password}  
                        onChange={handleInput} 
                        className="block w-full h-10 border border-gray-600 rounded pl-2"
                    />
                </div>

                <div>
                    <p>新パスワード(確認でもう一度入力)</p>
                    <input type="password" name="password_confirmation" value={resetPass.password_confirmation}  
                        onChange={handleInput} 
                        className="block w-full h-10 border border-gray-600 rounded pl-2"
                    />
                </div>


                <button type="submit" className="block mt-10 bg-gray-800 w-full h-10 text-white ml-auto mr-auto rounded-lg shadow-lg font-medium text-1xl">
                    パスワード再設定
                </button>
            </form>
        </div>
    );




}


