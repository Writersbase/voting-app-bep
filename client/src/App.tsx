
function App() {


  return (
    <div className={'custom-bg-1 h-screen w-screen flex flex-row d-flex items-center justify-center'}>
        <div className={'h-[50%] w-[50%] shadow-sm rounded-2xl overflow-hidden flex flex-row d-flex  bg-white'} >
            {/*login container*/}
            <div className={'flex-1 flex d-flex flex-row justify-center items-center p-4 px-[10%]'}>
                <div>
                    <p className={'text-[1.5vw] text-center text-gray-800 font-semibold'}>Login to Admin Portal.</p>
                    <p className={'text-[1vw] font-light text-gray-800 text-center'}>Generate credentials below to be able to login</p>

                    {/*    input section*/}
                    <br/>
                    <br/>

                    <input placeholder={'Enter Login Token'} type="text" className={'h-10 rounded-lg font-medium text-xs px-4 outline-none border border-gray-400 bg-gray-100  w-full'}/>
                    <button className={'h-10 w-full outline-none bg-blue-500 hover:bg-blue-700 text-white text-[0.8vw] mt-4 rounded-lg'}>Login</button>
                    <button className={'h-10 w-full outline-none hover:bg-[#F8E4E5] bg-[#E8DFF5] text-gray-800 text-[0.8vw] mt-2 rounded-lg'}>Generate Login Token</button>
                    <p className={'text-[0.7vw] underline text-center mt-2'}> <a  href="#">Request for a token with longer expiration</a></p>
                </div>
            </div>
            {/*tips container*/}
            <div className={'w-[40%] flex flex-row d-flex items-center justify-center p-4 px-[5%] h-full bg-[#E8F2FC]'}>
                <div className={'w-full'}>
                    <p className={'text-center text-[1vw]'}>"Generated token or credentials have a lifespan of 3days before expiry... you have to wait until the blacklist period of 1day is completed"</p>
                    <br/>
                    <div className={'w-full'}>
                        <div className={'flex d-flex flex-row justify-center'}>
                            <div className={'h-[7vh] border border-gray-800 w-[7vh] rounded-full'} style={{background:`url(https://avatars.githubusercontent.com/u/51275950?s=400&u=c4801df3177459d2a0ad01560cbaecbd5d4c94c4&v=4)`,backgroundSize:'cover'}}/>
                        </div>
                        <p className={'text-[1vw] text-center mt-4 font-semibold text-gray-800'}><a href="https://github.com/backendpapa1" target='_blank'>Akeju Paul</a></p>
                        <p className={'text-[0.8vw] text-center  font-medium text-gray-400'}>Open Source Engineer</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
